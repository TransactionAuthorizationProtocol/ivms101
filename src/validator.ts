import { z } from "zod";
import * as IVMS101_2020 from "./ivms101_2020";
import * as IVMS101_2023 from "./ivms101_2023";

// Base schemas for common enum types
const NaturalPersonNameTypeCodeSchema = z.enum([
  "ALIA",
  "BIRT",
  "MAID",
  "LEGL",
  "MISC",
]);

const LegalPersonNameTypeCodeSchema = z.enum(["LEGL", "SHRT", "TRAD"]);

const AddressTypeCodeSchema = z.enum(["HOME", "BIZZ", "GEOG"]);

const NationalIdentifierTypeCodeSchema = z.enum([
  "ARNU",
  "CCPT",
  "RAID",
  "DRLC",
  "FIIN",
  "TXID",
  "SOCS",
  "IDCD",
  "LEIX",
  "MISC",
]);

const LegalEntityNationalIdentifierTypeCodeSchema = z.enum([
  "RAID",
  "FIIN",
  "TXID",
  "LEIX",
  "MISC",
]);

const NaturalPersonNationalIdentifierTypeCodeSchema = z.enum([
  "ARNU",
  "CCPT",
  "DRLC",
  "FIIN",
  "TXID",
  "SOCS",
  "IDCD",
  "MISC",
]);

const TransliterationMethodCodeSchema = z.enum([
  "arab",
  "aran",
  "armn",
  "cyrl",
  "deva",
  "geor",
  "grek",
  "hani",
  "hebr",
  "kana",
  "kore",
  "thai",
  "othr",
]);

const CountryCodeSchema = z.enum([
  "AF",
  "AL",
  "DZ",
  "AS",
  "AD",
  "AO",
  "AI",
  "AQ",
  "AG",
  "AR",
  "AM",
  "AW",
  "AU",
  "AT",
  "AZ",
  "BS",
  "BH",
  "BD",
  "BB",
  "BY",
  "BE",
  "BZ",
  "BJ",
  "BM",
  "BT",
  "BO",
  "BQ",
  "BA",
  "BW",
  "BV",
  "BR",
  "IO",
  "BN",
  "BG",
  "BF",
  "BI",
  "CV",
  "KH",
  "CM",
  "CA",
  "KY",
  "CF",
  "TD",
  "CL",
  "CN",
  "CX",
  "CC",
  "CO",
  "KM",
  "CG",
  "CD",
  "CK",
  "CR",
  "CI",
  "HR",
  "CU",
  "CW",
  "CY",
  "CZ",
  "DK",
  "DJ",
  "DM",
  "DO",
  "EC",
  "EG",
  "SV",
  "GQ",
  "ER",
  "EE",
  "SZ",
  "ET",
  "FK",
  "FO",
  "FJ",
  "FI",
  "FR",
  "GF",
  "PF",
  "TF",
  "GA",
  "GM",
  "GE",
  "DE",
  "GH",
  "GI",
  "GR",
  "GL",
  "GD",
  "GP",
  "GU",
  "GT",
  "GG",
  "GN",
  "GW",
  "GY",
  "HT",
  "HM",
  "VA",
  "HN",
  "HK",
  "HU",
  "IS",
  "IN",
  "ID",
  "IR",
  "IQ",
  "IE",
  "IM",
  "IL",
  "IT",
  "JM",
  "JP",
  "JE",
  "JO",
  "KZ",
  "KE",
  "KI",
  "KP",
  "KR",
  "KW",
  "KG",
  "LA",
  "LV",
  "LB",
  "LS",
  "LR",
  "LY",
  "LI",
  "LT",
  "LU",
  "MO",
  "MK",
  "MG",
  "MW",
  "MY",
  "MV",
  "ML",
  "MT",
  "MH",
  "MQ",
  "MR",
  "MU",
  "YT",
  "MX",
  "FM",
  "MD",
  "MC",
  "MN",
  "ME",
  "MS",
  "MA",
  "MZ",
  "MM",
  "NA",
  "NR",
  "NP",
  "NL",
  "NC",
  "NZ",
  "NI",
  "NE",
  "NG",
  "NU",
  "NF",
  "MP",
  "NO",
  "OM",
  "PK",
  "PW",
  "PS",
  "PA",
  "PG",
  "PY",
  "PE",
  "PH",
  "PN",
  "PL",
  "PT",
  "PR",
  "QA",
  "RE",
  "RO",
  "RU",
  "RW",
  "BL",
  "SH",
  "KN",
  "LC",
  "MF",
  "PM",
  "VC",
  "WS",
  "SM",
  "ST",
  "SA",
  "SN",
  "RS",
  "SC",
  "SL",
  "SG",
  "SX",
  "SK",
  "SI",
  "SB",
  "SO",
  "ZA",
  "GS",
  "SS",
  "ES",
  "LK",
  "SD",
  "SR",
  "SJ",
  "SE",
  "CH",
  "SY",
  "TW",
  "TJ",
  "TZ",
  "TH",
  "TL",
  "TG",
  "TK",
  "TO",
  "TT",
  "TN",
  "TR",
  "TM",
  "TC",
  "TV",
  "UG",
  "UA",
  "AE",
  "GB",
  "US",
  "UM",
  "UY",
  "UZ",
  "VU",
  "VE",
  "VN",
  "VG",
  "VI",
  "WF",
  "EH",
  "YE",
  "ZM",
  "ZW",
  "AX",
  "XX",
]);

const PayloadVersionCodeSchema = z.nativeEnum(IVMS101_2023.PayloadVersionCode);

// Shared schemas

// C8: ValidAddress - Must have addressLine OR (streetName AND (buildingName OR buildingNumber))
const AddressSchema = z
  .object({
    addressType: AddressTypeCodeSchema,
    department: z.string().optional(),
    subDepartment: z.string().optional(),
    streetName: z.string().optional(),
    buildingNumber: z.string().optional(),
    buildingName: z.string().optional(),
    floor: z.string().optional(),
    postBox: z.string().optional(),
    room: z.string().optional(),
    postcode: z.string().optional(),
    townName: z.string(),
    townLocationName: z.string().optional(),
    districtName: z.string().optional(),
    countrySubDivision: z.string().optional(),
    country: CountryCodeSchema,
    addressLine: z.array(z.string()).max(7).optional(),
  })
  .refine(
    (data) => {
      const hasAddressLine = data.addressLine && data.addressLine.length > 0;
      const hasStructured =
        data.streetName && (data.buildingName || data.buildingNumber);
      return hasAddressLine || hasStructured;
    },
    {
      message:
        "C8 ValidAddress: Must have addressLine or (streetName and buildingName/buildingNumber)",
    },
  );

// C10: RegistrationAuthority - Must match format RA + 6 digits
// C11: ValidLEI - LEI must be 20-character alphanumeric (18 letters/digits + 2 check digits)
const NationalIdentificationSchema = z
  .object({
    nationalIdentifier: z.string(),
    nationalIdentifierType: NationalIdentifierTypeCodeSchema,
    countryOfIssue: CountryCodeSchema.optional(),
    registrationAuthority: z.string().optional(),
  })
  .refine(
    (data) => {
      // C11: If type is LEIX, nationalIdentifier must match LEI format
      if (data.nationalIdentifierType === "LEIX") {
        return /^[0-9A-Z]{18}[0-9]{2}$/.test(data.nationalIdentifier);
      }
      return true;
    },
    {
      message: "C11 ValidLEI: LEI must be 20-character alphanumeric",
    },
  )
  .refine(
    (data) => {
      // C10: If registrationAuthority is present, must match RA format
      if (data.registrationAuthority) {
        return /^RA[0-9]{6}$/.test(data.registrationAuthority);
      }
      return true;
    },
    {
      message: "C10 RegistrationAuthority: Must match format RA######",
    },
  );

// C9: CompleteNationalIdentifierLegalPerson
// - Must NOT have countryOfIssue
// - Must have registrationAuthority if type is not LEIX
// - Must NOT have registrationAuthority if type is LEIX
// C11: ValidLEI validation
const LegalEntityNationalIdentificationSchema = z
  .object({
    nationalIdentifier: z.string(),
    nationalIdentifierType: LegalEntityNationalIdentifierTypeCodeSchema,
    countryOfIssue: CountryCodeSchema.optional(),
    registrationAuthority: z.string().optional(),
  })
  .refine(
    (data) => {
      // C11: If type is LEIX, nationalIdentifier must match LEI format
      if (data.nationalIdentifierType === "LEIX") {
        return /^[0-9A-Z]{18}[0-9]{2}$/.test(data.nationalIdentifier);
      }
      return true;
    },
    {
      message: "C11 ValidLEI: LEI must be 20-character alphanumeric",
    },
  )
  .refine(
    (data) => {
      // C9: Must NOT have countryOfIssue for legal entities
      return !data.countryOfIssue;
    },
    {
      message:
        "C9 CompleteNationalIdentifierLegalPerson: Must not have countryOfIssue",
    },
  )
  .refine(
    (data) => {
      // C9: Must have registrationAuthority if type is not LEIX
      if (data.nationalIdentifierType !== "LEIX") {
        return !!data.registrationAuthority;
      }
      return true;
    },
    {
      message:
        "C9 CompleteNationalIdentifierLegalPerson: Must have registrationAuthority for non-LEIX types",
    },
  )
  .refine(
    (data) => {
      // C9: Must NOT have registrationAuthority if type is LEIX
      if (data.nationalIdentifierType === "LEIX") {
        return !data.registrationAuthority;
      }
      return true;
    },
    {
      message:
        "C9 CompleteNationalIdentifierLegalPerson: Must not have registrationAuthority for LEIX",
    },
  )
  .refine(
    (data) => {
      // C10: If registrationAuthority is present, must match RA format
      if (data.registrationAuthority) {
        return /^RA[0-9]{6}$/.test(data.registrationAuthority);
      }
      return true;
    },
    {
      message: "C10 RegistrationAuthority: Must match format RA######",
    },
  );

const NaturalPersonNationalIdentificationSchema = z
  .object({
    nationalIdentifier: z.string(),
    nationalIdentifierType: NaturalPersonNationalIdentifierTypeCodeSchema,
    countryOfIssue: CountryCodeSchema.optional(),
    registrationAuthority: z.string().optional(),
  })
  .refine(
    (data) => {
      // C10: If registrationAuthority is present, must match RA format
      if (data.registrationAuthority) {
        return /^RA[0-9]{6}$/.test(data.registrationAuthority);
      }
      return true;
    },
    {
      message: "C10 RegistrationAuthority: Must match format RA######",
    },
  );

// IVMS101 2020 schemas
const NaturalPersonNameId2020Schema = z.object({
  primaryIdentifier: z.string(),
  secondaryIdentifier: z.string().optional(),
  nameIdentifierType: NaturalPersonNameTypeCodeSchema,
});

const LegalPersonNameIdSchema = z.object({
  legalPersonName: z.string(),
  legalPersonNameIdentifierType: LegalPersonNameTypeCodeSchema,
});

// C2: DateInPast - Birth date must be in the past
// C6: LegalNamePresentNaturalPerson - At least one nameIdentifier must have type LEGL
const NaturalPerson2020Schema = z
  .object({
    name: z.object({
      nameIdentifier: z.array(NaturalPersonNameId2020Schema).min(1).max(5),
    }),
    geographicAddress: z.array(AddressSchema).max(5).optional(),
    nationalIdentification:
      NaturalPersonNationalIdentificationSchema.optional(),
    customerNumber: z.string().optional(),
    dateAndPlaceOfBirth: z
      .object({
        dateOfBirth: z.string(),
        placeOfBirth: z.string(),
      })
      .optional(),
    countryOfResidence: CountryCodeSchema.optional(),
  })
  .refine(
    (data) => {
      // C6: At least one nameIdentifier must have type LEGL
      return data.name.nameIdentifier.some((n) => n.nameIdentifierType === "LEGL");
    },
    {
      message:
        "C6 LegalNamePresentNaturalPerson: At least one nameIdentifier must have type 'LEGL'",
    },
  )
  .refine(
    (data) => {
      // C2: If dateOfBirth is specified, it must be in the past
      if (data.dateAndPlaceOfBirth?.dateOfBirth) {
        const birthDate = new Date(data.dateAndPlaceOfBirth.dateOfBirth);
        return birthDate < new Date();
      }
      return true;
    },
    {
      message: "C2 DateInPast: dateOfBirth must be a historic date",
    },
  );

// C5: LegalNamePresentLegalPerson - At least one nameIdentifier must have type LEGL
const LegalPerson2020Schema = z
  .object({
    name: z.object({
      nameIdentifier: z.array(LegalPersonNameIdSchema).min(1).max(3),
    }),
    geographicAddress: z.array(AddressSchema).max(5).optional(),
    customerNumber: z.string().optional(),
    nationalIdentification: LegalEntityNationalIdentificationSchema.optional(),
    countryOfRegistration: CountryCodeSchema.optional(),
  })
  .refine(
    (data) => {
      // C5: At least one nameIdentifier must have type LEGL
      return data.name.nameIdentifier.some(
        (n) => n.legalPersonNameIdentifierType === "LEGL",
      );
    },
    {
      message:
        "C5 LegalNamePresentLegalPerson: At least one nameIdentifier must have type 'LEGL'",
    },
  );

// C1: OriginatorInformationNaturalPerson
// C4: OriginatorInformationLegalPerson
const Person2020Schema = z
  .object({
    naturalPerson: NaturalPerson2020Schema.optional(),
    legalPerson: LegalPerson2020Schema.optional(),
  })
  .superRefine((data, ctx) => {
    // C1: NaturalPerson must have address OR customerNumber OR nationalId OR dateOfBirth
    if (data.naturalPerson) {
      const hasGeographicAddress = data.naturalPerson.geographicAddress?.some(
        (addr) =>
          addr.addressType === "GEOG" ||
          addr.addressType === "HOME" ||
          addr.addressType === "BIZZ",
      );
      const hasCustomerNumber = !!data.naturalPerson.customerNumber;
      const hasNationalId = !!data.naturalPerson.nationalIdentification;
      const hasDOB = !!data.naturalPerson.dateAndPlaceOfBirth;

      if (
        !hasGeographicAddress &&
        !hasCustomerNumber &&
        !hasNationalId &&
        !hasDOB
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "C1 OriginatorInformationNaturalPerson: Must have geographicAddress or customerNumber or nationalIdentification or dateAndPlaceOfBirth",
          path: ["naturalPerson"],
        });
      }
    }

    // C4: LegalPerson must have address OR customerNumber OR nationalId
    if (data.legalPerson) {
      const hasGeographicAddress = data.legalPerson.geographicAddress?.some(
        (addr) => addr.addressType === "GEOG",
      );
      const hasCustomerNumber = !!data.legalPerson.customerNumber;
      const hasNationalId = !!data.legalPerson.nationalIdentification;

      if (!hasGeographicAddress && !hasCustomerNumber && !hasNationalId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "C4 OriginatorInformationLegalPerson: Must have geographicAddress or customerNumber or nationalIdentification",
          path: ["legalPerson"],
        });
      }
    }
  });

const Originator2020Schema = z.object({
  originatorPersons: z.array(Person2020Schema).min(1).max(10),
  accountNumber: z.array(z.string()).max(20).optional(),
});

const Beneficiary2020Schema = z.object({
  beneficiaryPersons: z.array(Person2020Schema).min(1).max(10),
  accountNumber: z.array(z.string()).max(20).optional(),
});

// C12: sequentialIntegrity - Sequences must start at 0 and be sequential with no gaps
const TransferPath2020Schema = z
  .object({
    transferPath: z
      .array(
        z.object({
          intermediaryVASP: Person2020Schema,
          sequence: z.number(),
        }),
      )
      .max(5),
  })
  .refine(
    (data) => {
      // C12: Sequences must start at 0 and be uninterrupted
      const sequences = data.transferPath
        .map((t) => t.sequence)
        .sort((a, b) => a - b);
      return sequences.every((seq, idx) => seq === idx);
    },
    {
      message:
        "C12 sequentialIntegrity: Transfer path sequences must start at 0 and be sequential",
    },
  );

const PayloadMetadata2020Schema = z.object({
  transliterationMethod: z.array(TransliterationMethodCodeSchema).max(5).optional(),
});

export const IVMS101_2020Schema = z.object({
  originator: Originator2020Schema,
  beneficiary: Beneficiary2020Schema,
  originatingVASP: Person2020Schema.optional(),
  beneficiaryVASP: Person2020Schema.optional(),
  transferPath: TransferPath2020Schema.optional(),
  payloadMetadata: PayloadMetadata2020Schema.optional(),
});

// IVMS101 2023 schemas
const NaturalPersonNameId2023Schema = z.object({
  primaryIdentifier: z.string(),
  secondaryIdentifier: z.string().optional(),
  naturalPersonNameIdentifierType: NaturalPersonNameTypeCodeSchema,
});

// C2: DateInPast - Birth date must be in the past
// C6: LegalNamePresentNaturalPerson - At least one nameIdentifier must have type LEGL
const NaturalPerson2023Schema = z
  .object({
    name: z.object({
      nameIdentifier: z.array(NaturalPersonNameId2023Schema).min(1).max(5),
    }),
    geographicAddress: z.array(AddressSchema).max(5).optional(),
    nationalIdentification:
      NaturalPersonNationalIdentificationSchema.optional(),
    customerIdentification: z.string().optional(),
    dateAndPlaceOfBirth: z
      .object({
        dateOfBirth: z.string(),
        placeOfBirth: z.string(),
      })
      .optional(),
    countryOfResidence: CountryCodeSchema.optional(),
  })
  .refine(
    (data) => {
      // C6: At least one nameIdentifier must have type LEGL
      return data.name.nameIdentifier.some(
        (n) => n.naturalPersonNameIdentifierType === "LEGL",
      );
    },
    {
      message:
        "C6 LegalNamePresentNaturalPerson: At least one nameIdentifier must have type 'LEGL'",
    },
  )
  .refine(
    (data) => {
      // C2: If dateOfBirth is specified, it must be in the past
      if (data.dateAndPlaceOfBirth?.dateOfBirth) {
        const birthDate = new Date(data.dateAndPlaceOfBirth.dateOfBirth);
        return birthDate < new Date();
      }
      return true;
    },
    {
      message: "C2 DateInPast: dateOfBirth must be a historic date",
    },
  );

// C5: LegalNamePresentLegalPerson - At least one nameIdentifier must have type LEGL
const LegalPerson2023Schema = z
  .object({
    name: z.object({
      nameIdentifier: z.array(LegalPersonNameIdSchema).min(1).max(3),
    }),
    geographicAddress: z.array(AddressSchema).max(5).optional(),
    customerIdentification: z.string().optional(),
    nationalIdentification: LegalEntityNationalIdentificationSchema.optional(),
    countryOfRegistration: CountryCodeSchema.optional(),
  })
  .refine(
    (data) => {
      // C5: At least one nameIdentifier must have type LEGL
      return data.name.nameIdentifier.some(
        (n) => n.legalPersonNameIdentifierType === "LEGL",
      );
    },
    {
      message:
        "C5 LegalNamePresentLegalPerson: At least one nameIdentifier must have type 'LEGL'",
    },
  );

// C1: OriginatorInformationNaturalPerson
// C4: OriginatorInformationLegalPerson
const Person2023Schema = z
  .object({
    naturalPerson: NaturalPerson2023Schema.optional(),
    legalPerson: LegalPerson2023Schema.optional(),
  })
  .superRefine((data, ctx) => {
    // C1: NaturalPerson must have address OR customerIdentification OR nationalId OR dateOfBirth
    if (data.naturalPerson) {
      const hasGeographicAddress = data.naturalPerson.geographicAddress?.some(
        (addr) =>
          addr.addressType === "GEOG" ||
          addr.addressType === "HOME" ||
          addr.addressType === "BIZZ",
      );
      const hasCustomerIdentification =
        !!data.naturalPerson.customerIdentification;
      const hasNationalId = !!data.naturalPerson.nationalIdentification;
      const hasDOB = !!data.naturalPerson.dateAndPlaceOfBirth;

      if (
        !hasGeographicAddress &&
        !hasCustomerIdentification &&
        !hasNationalId &&
        !hasDOB
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "C1 OriginatorInformationNaturalPerson: Must have geographicAddress or customerIdentification or nationalIdentification or dateAndPlaceOfBirth",
          path: ["naturalPerson"],
        });
      }
    }

    // C4: LegalPerson must have address OR customerIdentification OR nationalId
    if (data.legalPerson) {
      const hasGeographicAddress = data.legalPerson.geographicAddress?.some(
        (addr) => addr.addressType === "GEOG",
      );
      const hasCustomerIdentification =
        !!data.legalPerson.customerIdentification;
      const hasNationalId = !!data.legalPerson.nationalIdentification;

      if (
        !hasGeographicAddress &&
        !hasCustomerIdentification &&
        !hasNationalId
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "C4 OriginatorInformationLegalPerson: Must have geographicAddress or customerIdentification or nationalIdentification",
          path: ["legalPerson"],
        });
      }
    }
  });

const Originator2023Schema = z.object({
  originatorPerson: z.array(Person2023Schema).min(1).max(10),
  accountNumber: z.array(z.string()).max(20).optional(),
});

const Beneficiary2023Schema = z.object({
  beneficiaryPerson: z.array(Person2023Schema).min(1).max(10),
  accountNumber: z.array(z.string()).max(20).optional(),
});

// C12: sequentialIntegrity - Sequences must start at 0 and be sequential with no gaps
const TransferPath2023Schema = z
  .object({
    transferPath: z
      .array(
        z.object({
          intermediaryVASP: Person2023Schema,
          sequence: z.number(),
        }),
      )
      .max(5),
  })
  .refine(
    (data) => {
      // C12: Sequences must start at 0 and be uninterrupted
      const sequences = data.transferPath
        .map((t) => t.sequence)
        .sort((a, b) => a - b);
      return sequences.every((seq, idx) => seq === idx);
    },
    {
      message:
        "C12 sequentialIntegrity: Transfer path sequences must start at 0 and be sequential",
    },
  );

const PayloadMetadata2023Schema = z.object({
  transliterationMethod: z.array(TransliterationMethodCodeSchema).max(5).optional(),
  payloadVersion: PayloadVersionCodeSchema,
});

export const IVMS101_2023Schema = z.object({
  originator: Originator2023Schema,
  beneficiary: Beneficiary2023Schema,
  originatingVASP: Person2023Schema.optional(),
  beneficiaryVASP: Person2023Schema.optional(),
  transferPath: TransferPath2023Schema.optional(),
  payloadMetadata: PayloadMetadata2023Schema.optional(),
});

// Union schema for either version
export const IVMS101Schema = z.union([IVMS101_2020Schema, IVMS101_2023Schema]);

// Utility functions
export function validateIVMS101(
  data: unknown,
): IVMS101_2020.IVMS101 | IVMS101_2023.IVMS101 {
  return IVMS101Schema.parse(data);
}

export function isValidIVMS101_2020(
  data: unknown,
): data is IVMS101_2020.IVMS101 {
  return IVMS101_2020Schema.safeParse(data).success;
}

export function isValidIVMS101_2023(
  data: unknown,
): data is IVMS101_2023.IVMS101 {
  return IVMS101_2023Schema.safeParse(data).success;
}

export function isValidIVMS101(
  data: unknown,
): data is IVMS101_2020.IVMS101 | IVMS101_2023.IVMS101 {
  return IVMS101Schema.safeParse(data).success;
}

// Type inference helpers
export type IVMS101_2020Type = z.infer<typeof IVMS101_2020Schema>;
export type IVMS101_2023Type = z.infer<typeof IVMS101_2023Schema>;
export type IVMS101Type = z.infer<typeof IVMS101Schema>;
