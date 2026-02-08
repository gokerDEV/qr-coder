import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";

const { version, name, description } = packageJson;

// Convert from Semver (e.g., 0.1.0-beta.6) to Chrome Extension Manifest format (e.g., 0.1.0.6)
const [major, minor, patch, label = "0"] = version
	.replace(/[^\d.-]+/g, "")
	.split(/[.-]/);

export default defineManifest(async (env) => ({
	manifest_version: 3,
	name: env.mode === "staging" ? `[INTERNAL] ${name}` : "QR Coder",
	description: description || "Modern QR Code Generator",
	version: `${major}.${minor}.${patch}.${label}`,
	version_name: version,
	action: {
		default_popup: "popup.html",
		default_icon: {
			"16": "icons/icon-16.png",
			"32": "icons/icon-32.png",
			"48": "icons/icon-48.png",
			"128": "icons/icon-128.png",
		},
	},
	icons: {
		"16": "icons/icon-16.png",
		"32": "icons/icon-32.png",
		"48": "icons/icon-48.png",
		"128": "icons/icon-128.png",
	},
	background: {
		service_worker: "src/background/index.ts",
		type: "module",
	},
	permissions: [
		"activeTab",
		"storage",
		"downloads",
	],
	web_accessible_resources: [
		{
			resources: ["app.html"],
			matches: ["<all_urls>"],
		},
	],
}));
