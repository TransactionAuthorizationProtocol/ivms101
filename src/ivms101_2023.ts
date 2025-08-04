/**
 * IVMS101.2023 - interVASP Messaging Standard (2023 version)
 * This file contains type definitions for the IVMS101.2023 standard,
 * reusing types from IVMS101 where possible.
 */

import * as V2020 from "./ivms101_2020";

// Reuse types that are the same in both versions
export type NaturalPersonNameTypeCode = V2020.NaturalPersonNameTypeCode;
export type LegalPersonNameTypeCode = V2020.LegalPersonNameTypeCode;
export type AddressTypeCode = V2020.AddressTypeCode;
export type NationalIdentifierTypeCode = V2020.NationalIdentifierTypeCode;
export type TransliterationMethodCode = V2020.TransliterationMethodCode;
export type CountryCode = V2020.CountryCode;

/** Codes identifying the version of IVMS 101 to which the payload complies */
export enum PayloadVersionCode {
  V2020 = "101",
  V2023 = "101.2023",
}

/** Represents a natural person's name identifier */
export interface NaturalPersonNameId
  extends Omit<V2020.NaturalPersonNameId, "nameIdentifierType"> {
  /** The nature of the name specified */
  naturalPersonNameIdentifierType: NaturalPersonNameTypeCode;
}

// Reuse LegalPersonNameId as it's the same in both versions
export type LegalPersonNameId = V2020.LegalPersonNameId;

// Reuse Address as it's the same in both versions
export type Address = V2020.Address;

// Reuse NationalIdentification as it's the same in both versions
export type NationalIdentification =
  V2020.NationalIdentification<V2020.NationalIdentifierTypeCode>;

/** Represents a natural person */
export interface NaturalPerson
  extends Omit<V2020.NaturalPerson, "name" | "customerNumber"> {
  /** The distinct words used as identification for an individual */
  name: NaturalPersonNameId[];
  /** A distinct identifier that uniquely identifies the person to the institution */
  customerIdentification?: string;
}

/** Represents a legal person */
export interface LegalPerson extends Omit<V2020.LegalPerson, "customerNumber"> {
  /** A distinct identifier that uniquely identifies the person to the institution */
  customerIdentification?: string;
}

/** Represents either a natural person or a legal person */
export interface Person {
  naturalPerson?: NaturalPerson;
  legalPerson?: LegalPerson;
}

/** Represents the originator of a transfer */
export interface Originator {
  /** The account holder who allows the VA transfer */
  originatorPerson: Person[];
  /** Identifier of an account that is used to process the transaction */
  accountNumber?: string[];
}

/** Represents the beneficiary of a transfer */
export interface Beneficiary {
  /** The person identified as the receiver of the requested VA transfer */
  beneficiaryPerson: Person[];
  /** Identifier of an account that is used to process the transaction */
  accountNumber?: string[];
}

/** Represents the complete IVMS101.2023 data structure */
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
    payloadVersion: PayloadVersionCode;
  };
}
