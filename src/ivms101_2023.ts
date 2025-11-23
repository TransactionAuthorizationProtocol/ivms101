/**
 * IVMS101.2023 - interVASP Messaging Standard (2023 version)
 * This file contains type definitions for the IVMS101.2023 standard,
 * reusing shared types from core.ts where possible.
 */

import type {
	Address,
	AddressTypeCode,
	LegalEntityNationalIdentifierTypeCode,
	LegalPersonNameId,
	LegalPersonNameTypeCode,
	LocalLegalPersonNameId,
	LocalNaturalPersonNameId,
	NationalIdentification,
	NationalIdentifierTypeCode,
	NaturalPersonNameTypeCode,
	NaturalPersonNationalIdentifierTypeCode,
	TransliterationMethodCode,
} from "./core";
import type { CountryCode } from "./countries";

// Re-export shared types for convenience
export type {
	NaturalPersonNameTypeCode,
	LegalPersonNameTypeCode,
	AddressTypeCode,
	NationalIdentifierTypeCode,
	LegalEntityNationalIdentifierTypeCode,
	NaturalPersonNationalIdentifierTypeCode,
	TransliterationMethodCode,
	CountryCode,
	LocalNaturalPersonNameId,
	LocalLegalPersonNameId,
	LegalPersonNameId,
	Address,
	NationalIdentification,
};

/** Codes identifying the version of IVMS 101 to which the payload complies */
export enum PayloadVersionCode {
	V2020 = "101",
	V2023 = "101.2023",
}

/** Represents a natural person's name identifier */
export interface NaturalPersonNameId {
	/** This may be the family name, maiden name, or married name */
	primaryIdentifier: string;
	/** These may be forenames, given names, initials, or other secondary names */
	secondaryIdentifier?: string;
	/** The nature of the name specified */
	naturalPersonNameIdentifierType: NaturalPersonNameTypeCode;
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
	customerIdentification?: string;
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
	customerIdentification?: string;
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
 * - `originatorPerson`: min 1, max 10 (covers joint accounts + margin)
 */
export interface Originator {
	/**
	 * The account holder who allows the VA transfer
	 * @minItems 1
	 * @maxItems 10
	 */
	originatorPerson: Person[];
}

/**
 * Represents the beneficiary of a transfer
 *
 * **Array Bounds:**
 * - `beneficiaryPerson`: min 1, max 10 (same as originator)
 */
export interface Beneficiary {
	/**
	 * The person identified as the receiver of the requested VA transfer
	 * @minItems 1
	 * @maxItems 10
	 */
	beneficiaryPerson: Person[];
}

/**
 * Represents the complete IVMS101.2023 data structure
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
		payloadVersion: PayloadVersionCode;
	};
}
