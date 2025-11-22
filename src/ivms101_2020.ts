/**
 * IVMS101 - interVASP Messaging Standard (Original 2020 version)
 * This file contains type definitions for the IVMS101 standard.
 */

import { CountryCode } from "./countries";

export type { CountryCode } from "./countries";

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

/**
 * Codes identifying the type of national identification
 *
 * - **ARNU**: Alien registration number - Number assigned by a government agency to identify foreign nationals
 * - **CCPT**: Passport number - Number assigned by a passport authority
 * - **RAID**: Registration authority identifier - Identifier of a legal entity as maintained by a registration authority
 * - **DRLC**: Driver license number - Number assigned to a driver's license
 * - **FIIN**: Foreign investment identity number - Number assigned to a foreign investor (other than the alien number)
 * - **TXID**: Tax identification number - Number assigned by a tax authority to an entity
 * - **SOCS**: Social security number - Number assigned by a social security agency
 * - **IDCD**: Identity card number - Number assigned by a national authority to an identity card
 * - **LEIX**: Legal Entity Identifier - Legal Entity Identifier (LEI) assigned in accordance with ISO 17442
 * - **MISC**: Miscellaneous - Other types of national identification not covered by the above codes
 */
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

export type LegalEntityNationalIdentifierTypeCode = Omit<
  NationalIdentifierTypeCode,
  "ARNU" | "CCPT" | "DRLC" | "SOCS" | "IDCD"
>;

export type NaturalPersonNationalIdentifierTypeCode = Omit<
  NationalIdentifierTypeCode,
  "LEIX" | "RAID"
>;

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

/** Represents a local natural person's name identifier (using local characters) */
export interface LocalNaturalPersonNameId {
  /** This may be the family name, maiden name, or married name using local characters */
  primaryIdentifier: string;
  /** These may be forenames, given names, initials, or other secondary names using local characters */
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

/** Represents a local legal person's name identifier (using local characters) */
export interface LocalLegalPersonNameId {
  /** Name by which the legal person is known using local characters */
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
  country: CountryCode;
}

/** Represents a national identification */
export interface NationalIdentification<C> {
  /** An identifier issued by an appropriate issuing authority */
  nationalIdentifier: string;
  /** Specifies the type of identifier */
  nationalIdentifierType: C;
  /** Country of the issuing authority */
  countryOfIssue?: CountryCode;
  /** A code specifying the registration authority */
  registrationAuthority?: string;
}

/**
 * Represents a natural person
 *
 * **Array Bounds:**
 * - `name.nameIdentifier`: min 1, max 5 (covers multiple name variants: legal, short, aliases)
 * - `name.localNameIdentifier`: max 5 (same as nameIdentifier, for local script)
 * - `name.phoneticNameIdentifier`: max 5 (same as nameIdentifier, for phonetic representation)
 * - `geographicAddress`: max 5 (covers home + business + historical addresses)
 */
export interface NaturalPerson {
  /**
   * The distinct words used as identification for an individual
   * @minItems nameIdentifier 1
   * @maxItems nameIdentifier 5
   * @maxItems localNameIdentifier 5
   * @maxItems phoneticNameIdentifier 5
   */
  name: {
    nameIdentifier: NaturalPersonNameId[];
    localNameIdentifier?: LocalNaturalPersonNameId[];
    phoneticNameIdentifier?: LocalNaturalPersonNameId[];
  };
  /**
   * The particulars of a location at which a person may be communicated with
   * @maxItems 5
   */
  geographicAddress?: Address[];
  /** A distinct identifier used by governments to uniquely identify a person */
  nationalIdentification?: NationalIdentification<NaturalPersonNationalIdentifierTypeCode>;
  /** A distinct identifier that uniquely identifies the person to the institution */
  customerNumber?: string;
  /** Date and place of birth of a person */
  dateAndPlaceOfBirth?: {
    dateOfBirth: string;
    placeOfBirth: string;
  };
  /** Country in which a person resides */
  countryOfResidence?: CountryCode;
}

/**
 * Represents a legal person
 *
 * **Array Bounds:**
 * - `name.nameIdentifier`: min 1, max 3 (aligns with LegalPersonNameTypeCode: LEGL, SHRT, TRAD)
 * - `name.localNameIdentifier`: max 3 (same as nameIdentifier, for local script)
 * - `name.phoneticNameIdentifier`: max 3 (same as nameIdentifier, for phonetic representation)
 * - `geographicAddress`: max 5 (covers registered + principal + branch addresses)
 */
export interface LegalPerson {
  /**
   * The name of the legal person
   * @minItems nameIdentifier 1
   * @maxItems nameIdentifier 3
   * @maxItems localNameIdentifier 3
   * @maxItems phoneticNameIdentifier 3
   */
  name: {
    nameIdentifier: LegalPersonNameId[];
    localNameIdentifier?: LocalLegalPersonNameId[];
    phoneticNameIdentifier?: LocalLegalPersonNameId[];
  };
  /**
   * The address of the legal person
   * @maxItems 5
   */
  geographicAddress?: Address[];
  /** A distinct identifier that uniquely identifies the person to the institution */
  customerNumber?: string;
  /** A distinct identifier used by governments to uniquely identify a person */
  nationalIdentification?: NationalIdentification<LegalEntityNationalIdentifierTypeCode>;
  /** The country in which the legal person is registered */
  countryOfRegistration?: CountryCode;
}

/**
 * Represents either a natural person or a legal person
 *
 * **Array Bounds:**
 * - `accountNumber`: max 20 (multiple wallets/accounts per person)
 */
export interface Person {
  naturalPerson?: NaturalPerson;
  legalPerson?: LegalPerson;
  /**
   * Identifier of an account that is used to process the transaction
   * @maxItems 20
   */
  accountNumber?: string[];
}

/**
 * Represents the originator of a transfer
 *
 * **Array Bounds:**
 * - `originatorPersons`: min 1, max 10 (covers joint accounts + margin)
 */
export interface Originator {
  /**
   * The account holder who allows the VA transfer
   * @minItems 1
   * @maxItems 10
   */
  originatorPersons: Person[];
}

/**
 * Represents the beneficiary of a transfer
 *
 * **Array Bounds:**
 * - `beneficiaryPersons`: min 1, max 10 (same as originator)
 */
export interface Beneficiary {
  /**
   * The person identified as the receiver of the requested VA transfer
   * @minItems 1
   * @maxItems 10
   */
  beneficiaryPersons: Person[];
}

/**
 * Represents the complete IVMS101 data structure
 *
 * **Array Bounds:**
 * - `transferPath.transferPath`: max 5 (intermediary VASP chain limit)
 * - `payloadMetadata.transliterationMethod`: max 5 (multiple character set conversions)
 */
export interface IVMS101 {
  originator: Originator;
  beneficiary: Beneficiary;
  originatingVASP?: Person;
  beneficiaryVASP?: Person;
  /**
   * Transfer path through intermediary VASPs
   * @maxItems transferPath 5
   */
  transferPath?: {
    transferPath: {
      intermediaryVASP: Person;
      sequence: number;
    }[];
  };
  /**
   * Payload metadata
   * @maxItems transliterationMethod 5
   */
  payloadMetadata?: {
    transliterationMethod?: TransliterationMethodCode[];
  };
}
