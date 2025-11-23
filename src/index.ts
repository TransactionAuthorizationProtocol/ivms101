/**
 * IVMS101 Library - Main Entry Point
 *
 * This library defaults to IVMS101.2023 standard.
 * For legacy 2020 support, import from 'ivms101/legacy'
 */

import { ensureVersion, ivms101_version } from "./converter";
import type * as IVMS101_2023 from "./ivms101_2023";

// Main IVMS101 type (defaults to 2023)
export type IVMS101 = IVMS101_2023.IVMS101;

// Export 2023 types as default
export type {
	Beneficiary,
	IVMS101 as IVMS101_2023,
	LegalPerson,
	NaturalPerson,
	NaturalPersonNameId,
	Originator,
	Person,
} from "./ivms101_2023";

// Export version code enum
export { PayloadVersionCode } from "./ivms101_2023";

// Export version utilities
export { ensureVersion, ivms101_version };

// Export fast-check arbitraries for property-based testing
export * as arbitraries from "./arbitraries";

// Export shared core types
export type {
	Address,
	AddressTypeCode,
	LegalEntityNationalIdentifierTypeCode,
	LegalPersonNameTypeCode,
	LocalLegalPersonNameId,
	LocalNaturalPersonNameId,
	NationalIdentification,
	NationalIdentifierTypeCode,
	NaturalPersonNameTypeCode,
	NaturalPersonNationalIdentifierTypeCode,
	TransliterationMethodCode,
} from "./core";

// Re-export LegalPersonNameId from ivms101_2023 (defined in core)
export type { LegalPersonNameId } from "./ivms101_2023";

// Export country codes
export type { CountryCode } from "./countries";

// Export validation with version parameter (defaults to 2023)
export {
	IVMS101_2023Schema,
	type IVMS101_2023Type,
	isValidIVMS101_2023,
	validate,
} from "./validator";
