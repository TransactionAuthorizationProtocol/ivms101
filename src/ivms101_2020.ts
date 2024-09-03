/**
 * IVMS101 - interVASP Messaging Standard (Original 2020 version)
 * This file contains type definitions for the IVMS101 standard.
 */

/** Codes representing the nature of a natural person's name */
export type NaturalPersonNameTypeCode =
  | "ALIA"
  | "BIRT"
  | "MAID"
  | "LEGL"
  | "MISC";

/** Codes representing the nature of a legal person's name */
export type LegalPersonNameTypeCode = "LEGL" | "SHRT" | "TRAD";

/** Codes identifying the nature of an address */
export type AddressTypeCode = "HOME" | "BIZZ" | "GEOG";

/** Codes identifying the type of national identification */
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

/** Codes identifying the method used to map from a national system of writing to Latin script */
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

/** Represents a natural person's name identifier */
export interface NaturalPersonNameId {
  /** This may be the family name, maiden name, or married name */
  primaryIdentifier: string;
  /** These may be forenames, given names, initials, or other secondary names */
  secondaryIdentifier?: string;
  /** The nature of the name specified */
  nameIdentifierType: NaturalPersonNameTypeCode;
}

/** Represents a legal person's name identifier */
export interface LegalPersonNameId {
  /** Name by which the legal person is known */
  legalPersonName: string;
  /** The nature of the name specified */
  legalPersonNameIdentifierType: LegalPersonNameTypeCode;
}

/** Represents an address */
export interface Address {
  /** Identifies the nature of the address */
  addressType: AddressTypeCode;
  /** Name of a street or thoroughfare */
  streetName?: string;
  /** Number that identifies the position of a building on a street */
  buildingNumber?: string;
  /** Name of the building or house */
  buildingName?: string;
  /** Identifier consisting of a group of letters and/or numbers */
  postcode?: string;
  /** Name of a built-up area, with defined boundaries, and a local government */
  townName: string;
  /** Identifies a subdivision of a country */
  countrySubDivision?: string;
  /** Nation with its own government */
  country: string;
}

/** Represents a national identification */
export interface NationalIdentification {
  /** An identifier issued by an appropriate issuing authority */
  nationalIdentifier: string;
  /** Specifies the type of identifier */
  nationalIdentifierType: NationalIdentifierTypeCode;
  /** Country of the issuing authority */
  countryOfIssue?: string;
  /** A code specifying the registration authority */
  registrationAuthority?: string;
}

/** Represents a natural person */
export interface NaturalPerson {
  /** The distinct words used as identification for an individual */
  name: NaturalPersonNameId[];
  /** The particulars of a location at which a person may be communicated with */
  geographicAddress?: Address[];
  /** A distinct identifier used by governments to uniquely identify a person */
  nationalIdentification?: NationalIdentification;
  /** A distinct identifier that uniquely identifies the person to the institution */
  customerNumber?: string;
  /** Date and place of birth of a person */
  dateAndPlaceOfBirth?: {
    dateOfBirth: string;
    placeOfBirth: string;
  };
  /** Country in which a person resides */
  countryOfResidence?: string;
}

/** Represents a legal person */
export interface LegalPerson {
  /** The name of the legal person */
  name: LegalPersonNameId[];
  /** The address of the legal person */
  geographicAddress?: Address[];
  /** A distinct identifier that uniquely identifies the person to the institution */
  customerNumber?: string;
  /** A distinct identifier used by governments to uniquely identify a person */
  nationalIdentification?: NationalIdentification;
  /** The country in which the legal person is registered */
  countryOfRegistration?: string;
}

/** Represents either a natural person or a legal person */
export interface Person {
  naturalPerson?: NaturalPerson;
  legalPerson?: LegalPerson;
}

/** Represents the originator of a transfer */
export interface Originator {
  /** The account holder who allows the VA transfer */
  originatorPersons: Person[];
  /** Identifier of an account that is used to process the transaction */
  accountNumber?: string[];
}

/** Represents the beneficiary of a transfer */
export interface Beneficiary {
  /** The person identified as the receiver of the requested VA transfer */
  beneficiaryPersons: Person[];
  /** Identifier of an account that is used to process the transaction */
  accountNumber?: string[];
}

/** Represents the complete IVMS101 data structure */
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
