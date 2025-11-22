/**
 * IVMS101 Core Types
 * Shared type definitions used by both IVMS101.2020 and IVMS101.2023 versions
 */

import type { CountryCode } from "./countries";

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

/**
 * Represents an address
 *
 * Per IVMS101 spec section 5.2.6.1, an address contains location information
 * that can be expressed either as:
 * - Structured fields (streetName, buildingNumber, etc.)
 * - Unstructured addressLine array (free-form text)
 *
 * Constraint C8 requires at least one of:
 * - addressLine OR
 * - (streetName AND (buildingName OR buildingNumber))
 */
export interface Address {
  /** Identifies the nature of the address */
  addressType: AddressTypeCode;
  /** Identification of a division of a large organisation or building */
  department?: string;
  /** Identification of a sub-division of a large organisation or building */
  subDepartment?: string;
  /** Name of a street or thoroughfare */
  streetName?: string;
  /** Number that identifies the position of a building on a street */
  buildingNumber?: string;
  /** Name of the building or house */
  buildingName?: string;
  /** Floor or storey within a building */
  floor?: string;
  /** Numbered box in a post office, assigned to a person or organisation, where letters are kept until called for */
  postBox?: string;
  /** Building room number */
  room?: string;
  /** Identifier consisting of a group of letters and/or numbers */
  postcode?: string;
  /** Name of a built-up area, with defined boundaries, and a local government */
  townName: string;
  /** Specific location name within the town */
  townLocationName?: string;
  /** Identifies a subdivision within a country subdivision */
  districtName?: string;
  /** Identifies a subdivision of a country */
  countrySubDivision?: string;
  /** Nation with its own government */
  country: CountryCode;
  /**
   * Information that locates and identifies a specific address, as defined by postal services,
   * presented in free format text.
   *
   * Array of 0 to 7 lines, each max 70 characters (Max70Text)
   * @maxItems 7
   */
  addressLine?: string[];
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
