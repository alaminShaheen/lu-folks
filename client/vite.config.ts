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
			"@/services": path.resolve(__dirname, "./src/services"),
			"@/models": path.resolve(__dirname, "./src/models"),
			"@/lib": path.resolve(__dirname, "./src/lib"),
			"@/context": path.resolve(__dirname, "./src/context"),
			"@/assets": path.resolve(__dirname, "./src/assets"),
			"@/constants": path.resolve(__dirname, "./src/constants"),
			"@/api": path.resolve(__dirname, "./src/api"),
		},
		extensions: [".js", ".ts", ".tsx", ".jsx"],
	},
});
