import { z } from "zod";
import * as IVMS101_2020 from "./ivms101_2020";
import * as IVMS101_2023 from "./ivms101_2023";

// Base schemas for common enum types
const NaturalPersonNameTypeCodeSchema = z.enum([
  "ALIA",
  "BIRT", 
  "MAID",
  "LEGL",
  "MISC"
]);

const LegalPersonNameTypeCodeSchema = z.enum([
  "LEGL",
  "SHRT", 
  "TRAD"
]);

const AddressTypeCodeSchema = z.enum([
  "HOME",
  "BIZZ",
  "GEOG"
]);

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
  "MISC"
]);

const LegalEntityNationalIdentifierTypeCodeSchema = z.enum([
  "RAID",
  "FIIN", 
  "TXID",
  "LEIX",
  "MISC"
]);

const NaturalPersonNationalIdentifierTypeCodeSchema = z.enum([
  "ARNU",
  "CCPT",
  "DRLC",
  "FIIN",
  "TXID", 
  "SOCS",
  "IDCD",
  "MISC"
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
  "othr"
]);

const CountryCodeSchema = z.enum([
  "AF", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ",
  "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV",
  "BR", "IO", "BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA", "KY", "CF", "TD", "CL", "CN",
  "CX", "CC", "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ", "DK",
  "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI",
  "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU",
  "GT", "GG", "GN", "GW", "GY", "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR",
  "IQ", "IE", "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR", "KW",
  "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY",
  "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS",
  "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MP",
  "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA",
  "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA",
  "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "SS", "ES", "LK",
  "SD", "SR", "SJ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT",
  "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ", "VU", "VE",
  "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW"
]);

const PayloadVersionCodeSchema = z.enum(["101", "101.2023"]);

// Shared schemas
const AddressSchema = z.object({
  addressType: AddressTypeCodeSchema,
  streetName: z.string().optional(),
  buildingNumber: z.string().optional(),
  buildingName: z.string().optional(),
  postcode: z.string().optional(),
  townName: z.string(),
  countrySubDivision: z.string().optional(),
  country: CountryCodeSchema
});

const NationalIdentificationSchema = z.object({
  nationalIdentifier: z.string(),
  nationalIdentifierType: NationalIdentifierTypeCodeSchema,
  countryOfIssue: CountryCodeSchema.optional(),
  registrationAuthority: z.string().optional()
});

const LegalEntityNationalIdentificationSchema = z.object({
  nationalIdentifier: z.string(),
  nationalIdentifierType: LegalEntityNationalIdentifierTypeCodeSchema,
  countryOfIssue: CountryCodeSchema.optional(),
  registrationAuthority: z.string().optional()
});

const NaturalPersonNationalIdentificationSchema = z.object({
  nationalIdentifier: z.string(),
  nationalIdentifierType: NaturalPersonNationalIdentifierTypeCodeSchema,
  countryOfIssue: CountryCodeSchema.optional(),
  registrationAuthority: z.string().optional()
});

// IVMS101 2020 schemas
const NaturalPersonNameId2020Schema = z.object({
  primaryIdentifier: z.string(),
  secondaryIdentifier: z.string().optional(),
  nameIdentifierType: NaturalPersonNameTypeCodeSchema
});

const LegalPersonNameIdSchema = z.object({
  legalPersonName: z.string(),
  legalPersonNameIdentifierType: LegalPersonNameTypeCodeSchema
});

const NaturalPerson2020Schema = z.object({
  name: z.array(NaturalPersonNameId2020Schema),
  geographicAddress: z.array(AddressSchema).optional(),
  nationalIdentification: NaturalPersonNationalIdentificationSchema.optional(),
  customerNumber: z.string().optional(),
  dateAndPlaceOfBirth: z.object({
    dateOfBirth: z.string(),
    placeOfBirth: z.string()
  }).optional(),
  countryOfResidence: CountryCodeSchema.optional()
});

const LegalPerson2020Schema = z.object({
  name: z.array(LegalPersonNameIdSchema),
  geographicAddress: z.array(AddressSchema).optional(),
  customerNumber: z.string().optional(),
  nationalIdentification: LegalEntityNationalIdentificationSchema.optional(),
  countryOfRegistration: CountryCodeSchema.optional()
});

const Person2020Schema = z.object({
  naturalPerson: NaturalPerson2020Schema.optional(),
  legalPerson: LegalPerson2020Schema.optional()
});

const Originator2020Schema = z.object({
  originatorPersons: z.array(Person2020Schema).min(1),
  accountNumber: z.array(z.string()).optional()
});

const Beneficiary2020Schema = z.object({
  beneficiaryPersons: z.array(Person2020Schema).min(1),
  accountNumber: z.array(z.string()).optional()
});

const TransferPath2020Schema = z.object({
  transferPath: z.array(z.object({
    intermediaryVASP: Person2020Schema,
    sequence: z.number()
  }))
});

const PayloadMetadata2020Schema = z.object({
  transliterationMethod: z.array(TransliterationMethodCodeSchema).optional()
});

export const IVMS101_2020Schema = z.object({
  originator: Originator2020Schema,
  beneficiary: Beneficiary2020Schema,
  originatingVASP: Person2020Schema.optional(),
  beneficiaryVASP: Person2020Schema.optional(),
  transferPath: TransferPath2020Schema.optional(),
  payloadMetadata: PayloadMetadata2020Schema.optional()
});

// IVMS101 2023 schemas
const NaturalPersonNameId2023Schema = z.object({
  primaryIdentifier: z.string(),
  secondaryIdentifier: z.string().optional(),
  naturalPersonNameIdentifierType: NaturalPersonNameTypeCodeSchema
});

const NaturalPerson2023Schema = z.object({
  name: z.array(NaturalPersonNameId2023Schema),
  geographicAddress: z.array(AddressSchema).optional(),
  nationalIdentification: NaturalPersonNationalIdentificationSchema.optional(),
  customerIdentification: z.string().optional(),
  dateAndPlaceOfBirth: z.object({
    dateOfBirth: z.string(),
    placeOfBirth: z.string()
  }).optional(),
  countryOfResidence: CountryCodeSchema.optional()
});

const LegalPerson2023Schema = z.object({
  name: z.array(LegalPersonNameIdSchema),
  geographicAddress: z.array(AddressSchema).optional(),
  customerIdentification: z.string().optional(),
  nationalIdentification: LegalEntityNationalIdentificationSchema.optional(),
  countryOfRegistration: CountryCodeSchema.optional()
});

const Person2023Schema = z.object({
  naturalPerson: NaturalPerson2023Schema.optional(),
  legalPerson: LegalPerson2023Schema.optional()
});

const Originator2023Schema = z.object({
  originatorPerson: z.array(Person2023Schema).min(1),
  accountNumber: z.array(z.string()).optional()
});

const Beneficiary2023Schema = z.object({
  beneficiaryPerson: z.array(Person2023Schema).min(1),
  accountNumber: z.array(z.string()).optional()
});

const TransferPath2023Schema = z.object({
  transferPath: z.array(z.object({
    intermediaryVASP: Person2023Schema,
    sequence: z.number()
  }))
});

const PayloadMetadata2023Schema = z.object({
  transliterationMethod: z.array(TransliterationMethodCodeSchema).optional(),
  payloadVersion: PayloadVersionCodeSchema
});

export const IVMS101_2023Schema = z.object({
  originator: Originator2023Schema,
  beneficiary: Beneficiary2023Schema,
  originatingVASP: Person2023Schema.optional(),
  beneficiaryVASP: Person2023Schema.optional(),
  transferPath: TransferPath2023Schema.optional(),
  payloadMetadata: PayloadMetadata2023Schema.optional()
});

// Union schema for either version
export const IVMS101Schema = z.union([IVMS101_2020Schema, IVMS101_2023Schema]);

// Utility functions
export function validateIVMS101(data: unknown): IVMS101_2020.IVMS101 | IVMS101_2023.IVMS101 {
  return IVMS101Schema.parse(data);
}

export function isValidIVMS101_2020(data: unknown): data is IVMS101_2020.IVMS101 {
  return IVMS101_2020Schema.safeParse(data).success;
}

export function isValidIVMS101_2023(data: unknown): data is IVMS101_2023.IVMS101 {
  return IVMS101_2023Schema.safeParse(data).success;
}

export function isValidIVMS101(data: unknown): data is IVMS101_2020.IVMS101 | IVMS101_2023.IVMS101 {
  return IVMS101Schema.safeParse(data).success;
}

// Type inference helpers
export type IVMS101_2020Type = z.infer<typeof IVMS101_2020Schema>;
export type IVMS101_2023Type = z.infer<typeof IVMS101_2023Schema>;
export type IVMS101Type = z.infer<typeof IVMS101Schema>;