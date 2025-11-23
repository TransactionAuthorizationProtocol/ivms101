/**
 * IVMS101 Legacy (2020) Support
 *
 * This module provides access to the IVMS101 2020 version types and conversion utilities.
 * Import from 'ivms101/legacy' when working with legacy 2020 data.
 */

// Export conversion utilities
export { convertFrom2023, convertTo2023 } from "./converter";
// Export all 2020 types
export * as IVMS101_2020 from "./ivms101_2020";

// Export 2020 validation
export {
	IVMS101_2020Schema,
	type IVMS101_2020Type,
	IVMS101Schema,
	type IVMS101Type,
	isValidIVMS101,
	isValidIVMS101_2020,
	validateIVMS101,
} from "./validator";
