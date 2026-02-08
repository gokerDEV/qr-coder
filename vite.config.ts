import path from "node:path";
import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import manifest from "./manifest.config";

// https://vite.dev/config/
export default defineConfig({
	plugins: [tailwindcss(), react(), crx({ manifest })],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 5173,
		strictPort: true,
		hmr: {
			port: 5173,
		},
		cors: {
			origin: [/chrome-extension:\/\//],
		},
	},
	build: {
		rollupOptions: {
			input: {
				app: "app.html",
			},
		},
	},
});
