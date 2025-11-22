/**
 * Fast-check arbitraries for IVMS101 types
 * This module provides fast-check arbitraries that can generate valid IVMS101 data structures
 * for property-based testing.
 * 
 * All arbitraries are provided as functions (following fast-check conventions):
 * 
 * @example
 * import { arbitraries } from 'ivms101';
 * import * as fc from 'fast-check';
 * 
 * // Generate random IVMS101 2020 data
 * fc.sample(arbitraries.ivms101_2020(), 5);
 * 
 * // Use in property-based tests
 * fc.assert(fc.property(arbitraries.naturalPerson(), (person) => {
 *   // Your test assertions here
 * }));
 */

import * as fc from "fast-check";
import * as IVMS101_2020 from "./ivms101_2020";
import * as IVMS101_2023 from "./ivms101_2023";
import type { CountryCode } from "./countries";

// Basic type arbitraries
export const naturalPersonNameTypeCode = () => fc.constantFrom(
  "ALIA", "BIRT", "MAID", "LEGL", "MISC"
) as fc.Arbitrary<IVMS101_2020.NaturalPersonNameTypeCode>;

export const legalPersonNameTypeCode = () => fc.constantFrom(
  "LEGL", "SHRT", "TRAD"
) as fc.Arbitrary<IVMS101_2020.LegalPersonNameTypeCode>;

export const addressTypeCode = () => fc.constantFrom(
  "HOME", "BIZZ", "GEOG"
) as fc.Arbitrary<IVMS101_2020.AddressTypeCode>;

export const nationalIdentifierTypeCode = () => fc.constantFrom(
  "ARNU", "CCPT", "RAID", "DRLC", "FIIN", "TXID", "SOCS", "IDCD", "LEIX", "MISC"
) as fc.Arbitrary<IVMS101_2020.NationalIdentifierTypeCode>;

export const naturalPersonNationalIdentifierTypeCode = () => fc.constantFrom(
  "ARNU", "CCPT", "DRLC", "FIIN", "TXID", "SOCS", "IDCD", "MISC"
) as fc.Arbitrary<IVMS101_2020.NaturalPersonNationalIdentifierTypeCode>;

export const legalEntityNationalIdentifierTypeCode = () => fc.constantFrom(
  "RAID", "FIIN", "TXID", "LEIX", "MISC"
) as fc.Arbitrary<IVMS101_2020.LegalEntityNationalIdentifierTypeCode>;

export const transliterationMethodCode = () => fc.constantFrom(
  "arab", "aran", "armn", "cyrl", "deva", "geor", "grek", "hani", "hebr", "kana", "kore", "thai", "othr"
) as fc.Arbitrary<IVMS101_2020.TransliterationMethodCode>;

// Sample country codes for testing
export const countryCode = () => fc.constantFrom(
  "US", "GB", "DE", "FR", "JP", "CA", "AU", "CH", "NL", "SE", "NO", "DK", "FI", "SG", "HK", "KR"
) as fc.Arbitrary<CountryCode>;

// String arbitraries with reasonable lengths (avoid whitespace-only strings)
export const personName = () => fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0);
export const identifier = () => fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0);
export const addressComponent = () => fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);

// C2: DateInPast - Generate only past dates (use current year - 1 as max)
export const date = () => fc.integer({ min: 1950, max: new Date().getFullYear() - 1 })
  .chain(year => fc.integer({ min: 1, max: 12 })
    .chain(month => fc.integer({ min: 1, max: 28 }) // Use 28 to avoid month-specific day issues
      .map(day => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)));

// C11: Generate valid LEI (20-character alphanumeric: 18 chars + 2 check digits)
// Format: [0-9A-Z]{18}[0-9]{2}
export const leiIdentifier = () => fc.tuple(
  fc.array(
    fc.constantFrom(...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')),
    { minLength: 18, maxLength: 18 }
  ),
  fc.array(
    fc.constantFrom(...'0123456789'.split('')),
    { minLength: 2, maxLength: 2 }
  )
).map(([prefix, checkDigits]) => [...prefix, ...checkDigits].join(''));

// C10: Generate valid Registration Authority format (RA + 6 digits)
export const registrationAuthority = () => fc.integer({ min: 0, max: 999999 })
  .map(num => `RA${String(num).padStart(6, '0')}`);

// IVMS101 2020 Structure arbitraries

export const naturalPersonNameId = () => fc.record({
  primaryIdentifier: personName(),
  secondaryIdentifier: fc.option(personName(), { nil: undefined }),
  nameIdentifierType: naturalPersonNameTypeCode()
}) as fc.Arbitrary<IVMS101_2020.NaturalPersonNameId>;

export const legalPersonNameId = () => fc.record({
  legalPersonName: personName(),
  legalPersonNameIdentifierType: legalPersonNameTypeCode()
}) as fc.Arbitrary<IVMS101_2020.LegalPersonNameId>;

// C8: ValidAddress - Must have addressLine OR (streetName AND (buildingName OR buildingNumber))
// Generate constraint-compliant addresses using oneof
// This generates addresses for natural persons (HOME, BIZZ, or GEOG)
export const address = () => fc.oneof(
  // Option 1: Use addressLine (unstructured) - structured fields must be undefined
  fc.record({
    addressType: addressTypeCode(),
    department: fc.option(addressComponent(), { nil: undefined }),
    subDepartment: fc.option(addressComponent(), { nil: undefined }),
    streetName: fc.constant(undefined),
    buildingNumber: fc.constant(undefined),
    buildingName: fc.constant(undefined),
    floor: fc.option(addressComponent(), { nil: undefined }),
    postBox: fc.option(fc.string({ minLength: 1, maxLength: 16 }).filter(s => s.trim().length > 0), { nil: undefined }),
    room: fc.option(addressComponent(), { nil: undefined }),
    postcode: fc.option(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { nil: undefined }),
    townName: addressComponent(),
    townLocationName: fc.option(addressComponent(), { nil: undefined }),
    districtName: fc.option(addressComponent(), { nil: undefined }),
    countrySubDivision: fc.option(addressComponent(), { nil: undefined }),
    country: countryCode(),
    addressLine: fc.array(addressComponent(), { minLength: 1, maxLength: 7 })
  }),
  // Option 2: Use structured address (streetName + buildingNumber)
  fc.record({
    addressType: addressTypeCode(),
    department: fc.option(addressComponent(), { nil: undefined }),
    subDepartment: fc.option(addressComponent(), { nil: undefined }),
    streetName: addressComponent(),
    buildingNumber: fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0),
    buildingName: fc.option(addressComponent(), { nil: undefined }),
    floor: fc.option(addressComponent(), { nil: undefined }),
    postBox: fc.option(fc.string({ minLength: 1, maxLength: 16 }).filter(s => s.trim().length > 0), { nil: undefined }),
    room: fc.option(addressComponent(), { nil: undefined }),
    postcode: fc.option(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { nil: undefined }),
    townName: addressComponent(),
    townLocationName: fc.option(addressComponent(), { nil: undefined }),
    districtName: fc.option(addressComponent(), { nil: undefined }),
    countrySubDivision: fc.option(addressComponent(), { nil: undefined }),
    country: countryCode(),
    addressLine: fc.constant(undefined)
  }),
  // Option 3: Use structured address (streetName + buildingName)
  fc.record({
    addressType: addressTypeCode(),
    department: fc.option(addressComponent(), { nil: undefined }),
    subDepartment: fc.option(addressComponent(), { nil: undefined }),
    streetName: addressComponent(),
    buildingNumber: fc.option(fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0), { nil: undefined }),
    buildingName: addressComponent(),
    floor: fc.option(addressComponent(), { nil: undefined }),
    postBox: fc.option(fc.string({ minLength: 1, maxLength: 16 }).filter(s => s.trim().length > 0), { nil: undefined }),
    room: fc.option(addressComponent(), { nil: undefined }),
    postcode: fc.option(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { nil: undefined }),
    townName: addressComponent(),
    townLocationName: fc.option(addressComponent(), { nil: undefined }),
    districtName: fc.option(addressComponent(), { nil: undefined }),
    countrySubDivision: fc.option(addressComponent(), { nil: undefined }),
    country: countryCode(),
    addressLine: fc.constant(undefined)
  })
) as fc.Arbitrary<IVMS101_2020.Address>;

// C4: Legal persons can only have GEOG addresses
// Same structure as address() but with addressType fixed to GEOG
export const legalPersonAddress = () => fc.oneof(
  // Option 1: Use addressLine (unstructured) - structured fields must be undefined
  fc.record({
    addressType: fc.constant("GEOG" as const),
    department: fc.option(addressComponent(), { nil: undefined }),
    subDepartment: fc.option(addressComponent(), { nil: undefined }),
    streetName: fc.constant(undefined),
    buildingNumber: fc.constant(undefined),
    buildingName: fc.constant(undefined),
    floor: fc.option(addressComponent(), { nil: undefined }),
    postBox: fc.option(fc.string({ minLength: 1, maxLength: 16 }).filter(s => s.trim().length > 0), { nil: undefined }),
    room: fc.option(addressComponent(), { nil: undefined }),
    postcode: fc.option(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { nil: undefined }),
    townName: addressComponent(),
    townLocationName: fc.option(addressComponent(), { nil: undefined }),
    districtName: fc.option(addressComponent(), { nil: undefined }),
    countrySubDivision: fc.option(addressComponent(), { nil: undefined }),
    country: countryCode(),
    addressLine: fc.array(addressComponent(), { minLength: 1, maxLength: 7 })
  }),
  // Option 2: Use structured address (streetName + buildingNumber)
  fc.record({
    addressType: fc.constant("GEOG" as const),
    department: fc.option(addressComponent(), { nil: undefined }),
    subDepartment: fc.option(addressComponent(), { nil: undefined }),
    streetName: addressComponent(),
    buildingNumber: fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0),
    buildingName: fc.option(addressComponent(), { nil: undefined }),
    floor: fc.option(addressComponent(), { nil: undefined }),
    postBox: fc.option(fc.string({ minLength: 1, maxLength: 16 }).filter(s => s.trim().length > 0), { nil: undefined }),
    room: fc.option(addressComponent(), { nil: undefined }),
    postcode: fc.option(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { nil: undefined }),
    townName: addressComponent(),
    townLocationName: fc.option(addressComponent(), { nil: undefined }),
    districtName: fc.option(addressComponent(), { nil: undefined }),
    countrySubDivision: fc.option(addressComponent(), { nil: undefined }),
    country: countryCode(),
    addressLine: fc.constant(undefined)
  }),
  // Option 3: Use structured address (streetName + buildingName)
  fc.record({
    addressType: fc.constant("GEOG" as const),
    department: fc.option(addressComponent(), { nil: undefined }),
    subDepartment: fc.option(addressComponent(), { nil: undefined }),
    streetName: addressComponent(),
    buildingNumber: fc.option(fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0), { nil: undefined }),
    buildingName: addressComponent(),
    floor: fc.option(addressComponent(), { nil: undefined }),
    postBox: fc.option(fc.string({ minLength: 1, maxLength: 16 }).filter(s => s.trim().length > 0), { nil: undefined }),
    room: fc.option(addressComponent(), { nil: undefined }),
    postcode: fc.option(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { nil: undefined }),
    townName: addressComponent(),
    townLocationName: fc.option(addressComponent(), { nil: undefined }),
    districtName: fc.option(addressComponent(), { nil: undefined }),
    countrySubDivision: fc.option(addressComponent(), { nil: undefined }),
    country: countryCode(),
    addressLine: fc.constant(undefined)
  })
) as fc.Arbitrary<IVMS101_2020.Address>;

// Natural person national identification (can have countryOfIssue and optional registrationAuthority)
// C10: registrationAuthority must match RA format if present
export const naturalPersonNationalIdentification = () => fc.record({
  nationalIdentifier: identifier(),
  nationalIdentifierType: naturalPersonNationalIdentifierTypeCode(),
  countryOfIssue: fc.option(countryCode(), { nil: undefined }),
  registrationAuthority: fc.option(registrationAuthority(), { nil: undefined })
}) as fc.Arbitrary<IVMS101_2020.NationalIdentification<IVMS101_2020.NaturalPersonNationalIdentifierTypeCode>>;

// C9: CompleteNationalIdentifierLegalPerson
// - Must NOT have countryOfIssue
// - Must have registrationAuthority if type is not LEIX
// - Must NOT have registrationAuthority if type is LEIX
// C11: If type is LEIX, nationalIdentifier must be valid LEI format
export const legalEntityNationalIdentification = () => legalEntityNationalIdentifierTypeCode().chain(idType => {
  if (idType === "LEIX") {
    // LEIX: use LEI identifier, no registrationAuthority, no countryOfIssue
    return fc.record({
      nationalIdentifier: leiIdentifier(),
      nationalIdentifierType: fc.constant(idType),
      countryOfIssue: fc.constant(undefined),
      registrationAuthority: fc.constant(undefined)
    }) as fc.Arbitrary<IVMS101_2020.NationalIdentification<IVMS101_2020.LegalEntityNationalIdentifierTypeCode>>;
  } else {
    // Other types: regular identifier, must have registrationAuthority, no countryOfIssue
    return fc.record({
      nationalIdentifier: identifier(),
      nationalIdentifierType: fc.constant(idType),
      countryOfIssue: fc.constant(undefined),
      registrationAuthority: registrationAuthority()
    }) as fc.Arbitrary<IVMS101_2020.NationalIdentification<IVMS101_2020.LegalEntityNationalIdentifierTypeCode>>;
  }
});

// C6: LegalNamePresentNaturalPerson - At least one nameIdentifier must have type LEGL
// C1: Must have geographicAddress OR customerNumber OR nationalIdentification OR dateAndPlaceOfBirth
// Ensure at least one LEGL name by creating first name as LEGL, then adding optional others
export const naturalPerson = () => fc.tuple(
  // First name is always LEGL
  fc.record({
    primaryIdentifier: personName(),
    secondaryIdentifier: fc.option(personName(), { nil: undefined }),
    nameIdentifierType: fc.constant("LEGL" as const)
  }),
  // Additional optional names
  fc.array(naturalPersonNameId(), { maxLength: 4 })
).chain(([legalName, otherNames]) =>
  // Ensure C1: at least one of the required fields using oneof
  fc.oneof(
    // Option 1: geographicAddress only
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2020.NaturalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.array(address(), { minLength: 1, maxLength: 5 }),
      nationalIdentification: fc.option(naturalPersonNationalIdentification(), { nil: undefined }),
      customerNumber: fc.option(identifier(), { nil: undefined }),
      dateAndPlaceOfBirth: fc.option(fc.record({
        dateOfBirth: date(),
        placeOfBirth: addressComponent()
      }), { nil: undefined }),
      countryOfResidence: fc.option(countryCode(), { nil: undefined })
    }),
    // Option 2: customerNumber only
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2020.NaturalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.option(fc.array(address(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
      nationalIdentification: fc.option(naturalPersonNationalIdentification(), { nil: undefined }),
      customerNumber: identifier(),
      dateAndPlaceOfBirth: fc.option(fc.record({
        dateOfBirth: date(),
        placeOfBirth: addressComponent()
      }), { nil: undefined }),
      countryOfResidence: fc.option(countryCode(), { nil: undefined })
    }),
    // Option 3: nationalIdentification only
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2020.NaturalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.option(fc.array(address(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
      nationalIdentification: naturalPersonNationalIdentification(),
      customerNumber: fc.option(identifier(), { nil: undefined }),
      dateAndPlaceOfBirth: fc.option(fc.record({
        dateOfBirth: date(),
        placeOfBirth: addressComponent()
      }), { nil: undefined }),
      countryOfResidence: fc.option(countryCode(), { nil: undefined })
    }),
    // Option 4: dateAndPlaceOfBirth only
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2020.NaturalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.option(fc.array(address(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
      nationalIdentification: fc.option(naturalPersonNationalIdentification(), { nil: undefined }),
      customerNumber: fc.option(identifier(), { nil: undefined }),
      dateAndPlaceOfBirth: fc.record({
        dateOfBirth: date(),
        placeOfBirth: addressComponent()
      }),
      countryOfResidence: fc.option(countryCode(), { nil: undefined })
    })
  )
);

// C5: LegalNamePresentLegalPerson - At least one nameIdentifier must have type LEGL
// C4: Must have geographicAddress OR customerNumber OR nationalIdentification
// Ensure at least one LEGL name by creating first name as LEGL, then adding optional others
export const legalPerson = () => fc.tuple(
  // First name is always LEGL
  fc.record({
    legalPersonName: personName(),
    legalPersonNameIdentifierType: fc.constant("LEGL" as const)
  }),
  // Additional optional names (max 2 more)
  fc.array(legalPersonNameId(), { maxLength: 2 })
).chain(([legalName, otherNames]) =>
  // Ensure C4: at least one of the required fields using oneof
  fc.oneof(
    // Option 1: geographicAddress only
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2020.LegalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.array(legalPersonAddress(), { minLength: 1, maxLength: 5 }),
      customerNumber: fc.option(identifier(), { nil: undefined }),
      nationalIdentification: fc.option(legalEntityNationalIdentification(), { nil: undefined }),
      countryOfRegistration: fc.option(countryCode(), { nil: undefined })
    }),
    // Option 2: customerNumber only
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2020.LegalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.option(fc.array(legalPersonAddress(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
      customerNumber: identifier(),
      nationalIdentification: fc.option(legalEntityNationalIdentification(), { nil: undefined }),
      countryOfRegistration: fc.option(countryCode(), { nil: undefined })
    }),
    // Option 3: nationalIdentification only
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2020.LegalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.option(fc.array(legalPersonAddress(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
      customerNumber: fc.option(identifier(), { nil: undefined }),
      nationalIdentification: legalEntityNationalIdentification(),
      countryOfRegistration: fc.option(countryCode(), { nil: undefined })
    })
  )
);

export const person = () => fc.oneof(
  fc.record({
    naturalPerson: naturalPerson(),
    legalPerson: fc.constant(undefined),
    accountNumber: fc.option(fc.array(identifier(), { minLength: 1, maxLength: 20 }), { nil: undefined })
  }),
  fc.record({
    naturalPerson: fc.constant(undefined),
    legalPerson: legalPerson(),
    accountNumber: fc.option(fc.array(identifier(), { minLength: 1, maxLength: 20 }), { nil: undefined })
  })
) as fc.Arbitrary<IVMS101_2020.Person>;

export const originator = () => fc.record({
  originatorPersons: fc.array(person(), { minLength: 1, maxLength: 10 })
}) as fc.Arbitrary<IVMS101_2020.Originator>;

export const beneficiary = () => fc.record({
  beneficiaryPersons: fc.array(person(), { minLength: 1, maxLength: 10 })
}) as fc.Arbitrary<IVMS101_2020.Beneficiary>;

// C12: sequentialIntegrity - Sequences must start at 0 and be sequential with no gaps
export const transferPath = () => fc.option(
  fc.array(person(), { minLength: 1, maxLength: 5 }).map(persons => ({
    transferPath: persons.map((p, i) => ({
      intermediaryVASP: p,
      sequence: i // Start at 0, increment by 1
    }))
  })),
  { nil: undefined }
);

export const payloadMetadata = () => fc.option(fc.record({
  transliterationMethod: fc.option(fc.array(transliterationMethodCode(), { minLength: 1, maxLength: 5 }), { nil: undefined })
}), { nil: undefined });

export const ivms101_2020 = () => fc.record({
  originator: originator(),
  beneficiary: beneficiary(),
  originatingVASP: fc.option(person(), { nil: undefined }),
  beneficiaryVASP: fc.option(person(), { nil: undefined }),
  transferPath: transferPath(),
  payloadMetadata: payloadMetadata()
}) as fc.Arbitrary<IVMS101_2020.IVMS101>;

// IVMS101 2023 specific arbitraries

export const naturalPersonNameId2023 = () => fc.record({
  primaryIdentifier: personName(),
  secondaryIdentifier: fc.option(personName(), { nil: undefined }),
  naturalPersonNameIdentifierType: naturalPersonNameTypeCode()
}) as fc.Arbitrary<IVMS101_2023.NaturalPersonNameId>;

// C6: LegalNamePresentNaturalPerson - At least one nameIdentifier must have type LEGL
// C1: Must have geographicAddress OR customerIdentification OR nationalIdentification OR dateAndPlaceOfBirth
export const naturalPerson2023 = () => fc.tuple(
  // First name is always LEGL
  fc.record({
    primaryIdentifier: personName(),
    secondaryIdentifier: fc.option(personName(), { nil: undefined }),
    naturalPersonNameIdentifierType: fc.constant("LEGL" as const)
  }),
  // Additional optional names
  fc.array(naturalPersonNameId2023(), { maxLength: 4 })
).chain(([legalName, otherNames]) =>
  // Ensure C1: at least one of the required fields using oneof
  fc.oneof(
    // Option 1: geographicAddress only
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2023.NaturalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.array(address(), { minLength: 1, maxLength: 5 }),
      nationalIdentification: fc.option(naturalPersonNationalIdentification(), { nil: undefined }),
      customerIdentification: fc.option(identifier(), { nil: undefined }),
      dateAndPlaceOfBirth: fc.option(fc.record({
        dateOfBirth: date(),
        placeOfBirth: addressComponent()
      }), { nil: undefined }),
      countryOfResidence: fc.option(countryCode(), { nil: undefined })
    }),
    // Option 2: customerIdentification only
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2023.NaturalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.option(fc.array(address(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
      nationalIdentification: fc.option(naturalPersonNationalIdentification(), { nil: undefined }),
      customerIdentification: identifier(),
      dateAndPlaceOfBirth: fc.option(fc.record({
        dateOfBirth: date(),
        placeOfBirth: addressComponent()
      }), { nil: undefined }),
      countryOfResidence: fc.option(countryCode(), { nil: undefined })
    }),
    // Option 3: nationalIdentification only
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2023.NaturalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.option(fc.array(address(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
      nationalIdentification: naturalPersonNationalIdentification(),
      customerIdentification: fc.option(identifier(), { nil: undefined }),
      dateAndPlaceOfBirth: fc.option(fc.record({
        dateOfBirth: date(),
        placeOfBirth: addressComponent()
      }), { nil: undefined }),
      countryOfResidence: fc.option(countryCode(), { nil: undefined })
    }),
    // Option 4: dateAndPlaceOfBirth only
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2023.NaturalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.option(fc.array(address(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
      nationalIdentification: fc.option(naturalPersonNationalIdentification(), { nil: undefined }),
      customerIdentification: fc.option(identifier(), { nil: undefined }),
      dateAndPlaceOfBirth: fc.record({
        dateOfBirth: date(),
        placeOfBirth: addressComponent()
      }),
      countryOfResidence: fc.option(countryCode(), { nil: undefined })
    })
  )
);

// C5: LegalNamePresentLegalPerson - At least one nameIdentifier must have type LEGL
// C4: Must have geographicAddress OR customerIdentification OR nationalIdentification
export const legalPerson2023 = () => fc.tuple(
  // First name is always LEGL
  fc.record({
    legalPersonName: personName(),
    legalPersonNameIdentifierType: fc.constant("LEGL" as const)
  }),
  // Additional optional names (max 2 more)
  fc.array(legalPersonNameId(), { maxLength: 2 })
).chain(([legalName, otherNames]) =>
  // Ensure C4: at least one of the required fields using oneof
  fc.oneof(
    // Option 1: geographicAddress only (must be GEOG type for legal persons)
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2023.LegalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.array(legalPersonAddress(), { minLength: 1, maxLength: 5 }),
      customerIdentification: fc.option(identifier(), { nil: undefined }),
      nationalIdentification: fc.option(legalEntityNationalIdentification(), { nil: undefined }),
      countryOfRegistration: fc.option(countryCode(), { nil: undefined })
    }),
    // Option 2: customerIdentification only
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2023.LegalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.option(fc.array(legalPersonAddress(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
      customerIdentification: identifier(),
      nationalIdentification: fc.option(legalEntityNationalIdentification(), { nil: undefined }),
      countryOfRegistration: fc.option(countryCode(), { nil: undefined })
    }),
    // Option 3: nationalIdentification only
    fc.record({
      name: fc.record({
        nameIdentifier: fc.constant([legalName, ...otherNames] as IVMS101_2023.LegalPersonNameId[]),
        localNameIdentifier: fc.constant(undefined),
        phoneticNameIdentifier: fc.constant(undefined)
      }),
      geographicAddress: fc.option(fc.array(legalPersonAddress(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
      customerIdentification: fc.option(identifier(), { nil: undefined }),
      nationalIdentification: legalEntityNationalIdentification(),
      countryOfRegistration: fc.option(countryCode(), { nil: undefined })
    })
  )
);

// Note: 2023 Person has accountNumber field (same as 2020)
export const person2023 = () => fc.oneof(
  fc.record({
    naturalPerson: naturalPerson2023(),
    legalPerson: fc.constant(undefined),
    accountNumber: fc.option(fc.array(identifier(), { minLength: 1, maxLength: 20 }), { nil: undefined })
  }),
  fc.record({
    naturalPerson: fc.constant(undefined),
    legalPerson: legalPerson2023(),
    accountNumber: fc.option(fc.array(identifier(), { minLength: 1, maxLength: 20 }), { nil: undefined })
  })
) as fc.Arbitrary<IVMS101_2023.Person>;

export const originator2023 = () => fc.record({
  originatorPerson: fc.array(person2023(), { minLength: 1, maxLength: 10 })
}) as fc.Arbitrary<IVMS101_2023.Originator>;

export const beneficiary2023 = () => fc.record({
  beneficiaryPerson: fc.array(person2023(), { minLength: 1, maxLength: 10 })
}) as fc.Arbitrary<IVMS101_2023.Beneficiary>;

// C12: sequentialIntegrity - Sequences must start at 0 and be sequential with no gaps
export const transferPath2023 = () => fc.option(
  fc.array(person2023(), { minLength: 1, maxLength: 5 }).map(persons => ({
    transferPath: persons.map((p, i) => ({
      intermediaryVASP: p,
      sequence: i // Start at 0, increment by 1
    }))
  })),
  { nil: undefined }
);

// For 2023, we need to ensure payloadMetadata always has the correct payloadVersion when present
export const payloadMetadata2023 = () => fc.option(fc.record({
  transliterationMethod: fc.option(fc.array(transliterationMethodCode(), { minLength: 1, maxLength: 5 }), { nil: undefined }),
  payloadVersion: fc.constant(IVMS101_2023.PayloadVersionCode.V2023)
}), { nil: undefined });

export const ivms101_2023 = () => fc.record({
  originator: originator2023(),
  beneficiary: beneficiary2023(),
  originatingVASP: fc.option(person2023(), { nil: undefined }),
  beneficiaryVASP: fc.option(person2023(), { nil: undefined }),
  transferPath: transferPath2023(),
  payloadMetadata: payloadMetadata2023()
}) as fc.Arbitrary<IVMS101_2023.IVMS101>;

// For proper 2023 version detection, we should ensure payloadMetadata.payloadVersion is always set
export const ivms101_2023Valid = () => ivms101_2023().map(data => ({
  ...data,
  payloadMetadata: {
    ...data.payloadMetadata,
    payloadVersion: IVMS101_2023.PayloadVersionCode.V2023
  }
})) as fc.Arbitrary<IVMS101_2023.IVMS101>;

// Union type arbitrary that can generate either version
export const ivms101 = () => fc.oneof(
  ivms101_2020(),
  ivms101_2023Valid()
) as fc.Arbitrary<IVMS101_2020.IVMS101 | IVMS101_2023.IVMS101>;