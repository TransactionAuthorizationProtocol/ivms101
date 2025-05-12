import * as IVMS101_2020 from "./ivms101_2020";
import * as IVMS101_2023 from "./ivms101_2023";
import { ensureVersion, ivms101_version } from "./converter";
export type IVMS101 = IVMS101_2020.IVMS101 | IVMS101_2023.IVMS101;
export { ensureVersion, ivms101_version, IVMS101_2020, IVMS101_2023 };
export { PayloadVersionCode } from "./ivms101_2023";
