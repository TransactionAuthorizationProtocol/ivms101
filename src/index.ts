import * as IVMS101_2020 from "./ivms101_2020";
import * as IVMS101_2023 from "./ivms101_2023";
import { ensureVersion, ivms101_version } from "./converter";
export type IVMS101 = IVMS101_2020.IVMS101 | IVMS101_2023.IVMS101;
export { ensureVersion, ivms101_version, IVMS101_2020, IVMS101_2023 };
export { PayloadVersionCode } from "./ivms101_2023";

// Export shared core types for direct access
export * as Core from "./core";
export {
  IVMS101_2020Schema,
  IVMS101_2023Schema,
  IVMS101Schema,
  validateIVMS101,
  isValidIVMS101_2020,
  isValidIVMS101_2023,
  isValidIVMS101,
  type IVMS101_2020Type,
  type IVMS101_2023Type,
  type IVMS101Type
} from "./validator";

// Export fast-check arbitraries for property-based testing
export * as arbitraries from "./arbitraries";
