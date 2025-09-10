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
) as fc.Arbitrary<IVMS101_2020.CountryCode>;

// String arbitraries with reasonable lengths (avoid whitespace-only strings)
export const personName = () => fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0);
export const identifier = () => fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0);
export const addressComponent = () => fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);
export const date = () => fc.integer({ min: 1950, max: 2020 })
  .chain(year => fc.integer({ min: 1, max: 12 })
    .chain(month => fc.integer({ min: 1, max: 28 }) // Use 28 to avoid month-specific day issues
      .map(day => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)));

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

export const address = () => fc.record({
  addressType: addressTypeCode(),
  streetName: fc.option(addressComponent(), { nil: undefined }),
  buildingNumber: fc.option(fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0), { nil: undefined }),
  buildingName: fc.option(addressComponent(), { nil: undefined }),
  postcode: fc.option(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { nil: undefined }),
  townName: addressComponent(),
  countrySubDivision: fc.option(addressComponent(), { nil: undefined }),
  country: countryCode()
}) as fc.Arbitrary<IVMS101_2020.Address>;

export const naturalPersonNationalIdentification = () => fc.record({
  nationalIdentifier: identifier(),
  nationalIdentifierType: naturalPersonNationalIdentifierTypeCode(),
  countryOfIssue: fc.option(countryCode(), { nil: undefined }),
  registrationAuthority: fc.option(fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), { nil: undefined })
}) as fc.Arbitrary<IVMS101_2020.NationalIdentification<IVMS101_2020.NaturalPersonNationalIdentifierTypeCode>>;

export const legalEntityNationalIdentification = () => fc.record({
  nationalIdentifier: identifier(),
  nationalIdentifierType: legalEntityNationalIdentifierTypeCode(),
  countryOfIssue: fc.option(countryCode(), { nil: undefined }),
  registrationAuthority: fc.option(fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), { nil: undefined })
}) as fc.Arbitrary<IVMS101_2020.NationalIdentification<IVMS101_2020.LegalEntityNationalIdentifierTypeCode>>;

export const naturalPerson = () => fc.record({
  name: fc.record({
    nameIdentifier: fc.array(naturalPersonNameId(), { minLength: 1, maxLength: 3 })
  }),
  geographicAddress: fc.option(fc.array(address(), { minLength: 1, maxLength: 3 }), { nil: undefined }),
  nationalIdentification: fc.option(naturalPersonNationalIdentification(), { nil: undefined }),
  customerNumber: fc.option(identifier(), { nil: undefined }),
  dateAndPlaceOfBirth: fc.option(fc.record({
    dateOfBirth: date(),
    placeOfBirth: addressComponent()
  }), { nil: undefined }),
  countryOfResidence: fc.option(countryCode(), { nil: undefined })
}) as fc.Arbitrary<IVMS101_2020.NaturalPerson>;

export const legalPerson = () => fc.record({
  name: fc.record({
    nameIdentifier: fc.array(legalPersonNameId(), { minLength: 1, maxLength: 3 })
  }),
  geographicAddress: fc.option(fc.array(address(), { minLength: 1, maxLength: 3 }), { nil: undefined }),
  customerNumber: fc.option(identifier(), { nil: undefined }),
  nationalIdentification: fc.option(legalEntityNationalIdentification(), { nil: undefined }),
  countryOfRegistration: fc.option(countryCode(), { nil: undefined })
}) as fc.Arbitrary<IVMS101_2020.LegalPerson>;

export const person = () => fc.oneof(
  fc.record({ naturalPerson: naturalPerson(), legalPerson: fc.constant(undefined) }),
  fc.record({ naturalPerson: fc.constant(undefined), legalPerson: legalPerson() })
) as fc.Arbitrary<IVMS101_2020.Person>;

export const originator = () => fc.record({
  originatorPersons: fc.array(person(), { minLength: 1, maxLength: 3 }),
  accountNumber: fc.option(fc.array(identifier(), { minLength: 1, maxLength: 3 }), { nil: undefined })
}) as fc.Arbitrary<IVMS101_2020.Originator>;

export const beneficiary = () => fc.record({
  beneficiaryPersons: fc.array(person(), { minLength: 1, maxLength: 3 }),
  accountNumber: fc.option(fc.array(identifier(), { minLength: 1, maxLength: 3 }), { nil: undefined })
}) as fc.Arbitrary<IVMS101_2020.Beneficiary>;

export const transferPath = () => fc.option(fc.record({
  transferPath: fc.array(fc.record({
    intermediaryVASP: person(),
    sequence: fc.integer({ min: 1, max: 10 })
  }), { minLength: 1, maxLength: 5 })
}), { nil: undefined });

export const payloadMetadata = () => fc.option(fc.record({
  transliterationMethod: fc.option(fc.array(transliterationMethodCode(), { minLength: 1, maxLength: 3 }), { nil: undefined })
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

export const naturalPerson2023 = () => fc.record({
  name: fc.record({
    nameIdentifier: fc.array(naturalPersonNameId2023(), { minLength: 1, maxLength: 3 })
  }),
  geographicAddress: fc.option(fc.array(address(), { minLength: 1, maxLength: 3 }), { nil: undefined }),
  nationalIdentification: fc.option(naturalPersonNationalIdentification(), { nil: undefined }),
  customerIdentification: fc.option(identifier(), { nil: undefined }),
  dateAndPlaceOfBirth: fc.option(fc.record({
    dateOfBirth: date(),
    placeOfBirth: addressComponent()
  }), { nil: undefined }),
  countryOfResidence: fc.option(countryCode(), { nil: undefined })
}) as fc.Arbitrary<IVMS101_2023.NaturalPerson>;

export const legalPerson2023 = () => fc.record({
  name: fc.record({
    nameIdentifier: fc.array(legalPersonNameId(), { minLength: 1, maxLength: 3 })
  }),
  geographicAddress: fc.option(fc.array(address(), { minLength: 1, maxLength: 3 }), { nil: undefined }),
  customerIdentification: fc.option(identifier(), { nil: undefined }),
  nationalIdentification: fc.option(legalEntityNationalIdentification(), { nil: undefined }),
  countryOfRegistration: fc.option(countryCode(), { nil: undefined })
}) as fc.Arbitrary<IVMS101_2023.LegalPerson>;

export const person2023 = () => fc.oneof(
  fc.record({ naturalPerson: naturalPerson2023(), legalPerson: fc.constant(undefined) }),
  fc.record({ naturalPerson: fc.constant(undefined), legalPerson: legalPerson2023() })
) as fc.Arbitrary<IVMS101_2023.Person>;

export const originator2023 = () => fc.record({
  originatorPerson: fc.array(person2023(), { minLength: 1, maxLength: 3 }),
  accountNumber: fc.option(fc.array(identifier(), { minLength: 1, maxLength: 3 }), { nil: undefined })
}) as fc.Arbitrary<IVMS101_2023.Originator>;

export const beneficiary2023 = () => fc.record({
  beneficiaryPerson: fc.array(person2023(), { minLength: 1, maxLength: 3 }),
  accountNumber: fc.option(fc.array(identifier(), { minLength: 1, maxLength: 3 }), { nil: undefined })
}) as fc.Arbitrary<IVMS101_2023.Beneficiary>;

export const transferPath2023 = () => fc.option(fc.record({
  transferPath: fc.array(fc.record({
    intermediaryVASP: person2023(),
    sequence: fc.integer({ min: 1, max: 10 })
  }), { minLength: 1, maxLength: 5 })
}), { nil: undefined });

// For 2023, we need to ensure payloadMetadata always has the correct payloadVersion when present
export const payloadMetadata2023 = () => fc.option(fc.record({
  transliterationMethod: fc.option(fc.array(transliterationMethodCode(), { minLength: 1, maxLength: 3 }), { nil: undefined }),
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