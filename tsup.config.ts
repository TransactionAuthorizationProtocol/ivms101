import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/legacy.ts"],
	clean: true,
	format: ["cjs", "esm"],
	dts: true,
});
