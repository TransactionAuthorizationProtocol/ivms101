export type NaturalPersonNameTypeCode =
  | "ALIA"
  | "BIRT"
  | "MAID"
  | "LEGL"
  | "MISC";
export type LegalPersonNameTypeCode = "LEGL" | "SHRT" | "TRAD";
export type AddressTypeCode = "HOME" | "BIZZ" | "GEOG";
export type NationalIdentifierTypeCode =
  | "ARNU"
  | "CCPT"
  | "RAID"
  | "DRLC"
  | "FIIN"
  | "TXID"
  | "SOCS"
  | "IDCD"
  | "LEIX"
  | "MISC";
export type TransliterationMethodCode =
  | "arab"
  | "aran"
  | "armn"
  | "cyrl"
  | "deva"
  | "geor"
  | "grek"
  | "hani"
  | "hebr"
  | "kana"
  | "kore"
  | "thai"
  | "othr";

export interface NaturalPersonNameId {
  primaryIdentifier: string;
  secondaryIdentifier?: string;
  nameIdentifierType: NaturalPersonNameTypeCode;
}

export interface LegalPersonNameId {
  legalPersonName: string;
  legalPersonNameIdentifierType: LegalPersonNameTypeCode;
}

export interface Address {
  addressType: AddressTypeCode;
  streetName?: string;
  buildingNumber?: string;
  buildingName?: string;
  postcode?: string;
  townName: string;
  countrySubDivision?: string;
  country: string;
}

export interface NationalIdentification {
  nationalIdentifier: string;
  nationalIdentifierType: NationalIdentifierTypeCode;
  countryOfIssue?: string;
  registrationAuthority?: string;
}

export interface NaturalPerson {
  name: NaturalPersonNameId[];
  geographicAddress?: Address[];
  nationalIdentification?: NationalIdentification;
  customerNumber?: string;
  dateAndPlaceOfBirth?: {
    dateOfBirth: string;
    placeOfBirth: string;
  };
  countryOfResidence?: string;
}

export interface LegalPerson {
  name: LegalPersonNameId[];
  geographicAddress?: Address[];
  customerNumber?: string;
  nationalIdentification?: NationalIdentification;
  countryOfRegistration?: string;
}

export interface Person {
  naturalPerson?: NaturalPerson;
  legalPerson?: LegalPerson;
}

export interface Originator {
  originatorPersons: Person[];
  accountNumber?: string[];
}

export interface Beneficiary {
  beneficiaryPersons: Person[];
  accountNumber?: string[];
}

export interface IVMS101 {
  originator: Originator;
  beneficiary: Beneficiary;
  originatingVASP?: Person;
  beneficiaryVASP?: Person;
  transferPath?: {
    transferPath: {
      intermediaryVASP: Person;
      sequence: number;
    }[];
  };
  payloadMetadata?: {
    transliterationMethod?: TransliterationMethodCode[];
  };
}
