import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Tri Nguyen: Unit tests run in plain Node. The "@" alias mirrors tsconfig so imports match the app code.
export default defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	test: {
		environment: "node",
		include: ["src/**/*.test.ts"],
	},
});
