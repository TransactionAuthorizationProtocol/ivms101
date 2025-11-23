import { ensureVersion, ivms101_version } from "./converter";
import * as IVMS101_2020 from "./ivms101_2020";
import * as IVMS101_2023 from "./ivms101_2023";
export type IVMS101 = IVMS101_2020.IVMS101 | IVMS101_2023.IVMS101;
export { ensureVersion, ivms101_version, IVMS101_2020, IVMS101_2023 };

// Export fast-check arbitraries for property-based testing
export * as arbitraries from "./arbitraries";

// Export shared core types for direct access
export * as Core from "./core";
export { PayloadVersionCode } from "./ivms101_2023";
export {
	IVMS101_2020Schema,
	type IVMS101_2020Type,
	IVMS101_2023Schema,
	type IVMS101_2023Type,
	IVMS101Schema,
	type IVMS101Type,
	isValidIVMS101,
	isValidIVMS101_2020,
	isValidIVMS101_2023,
	validateIVMS101,
} from "./validator";
