import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@/pages": path.resolve(__dirname, "./src/pages"),
			"@/components": path.resolve(__dirname, "./src/components"),
		},
		extensions: [".js", ".ts", ".tsx", ".jsx"],
	},
});
