import * as IVMS101_2020 from "./ivms101_2020";
import * as IVMS101_2023 from "./ivms101_2023";
import { ensureVersion } from "./converter";
export type IVMS101 = IVMS101_2020.IVMS101 | IVMS101_2023.IVMS101;
export { ensureVersion };
