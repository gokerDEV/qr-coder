export type InputType = "text" | "url" | "wifi" | "vcard";

export type QRErrorCorrectionLevel = "L" | "M" | "Q" | "H";
export type QRMode = "auto" | "byte" | "alphanumeric" | "numeric";
export type QRCharset = "utf-8" | "iso-8859-1";
export type QRModuleShape = "square" | "circle";
export type QRGrouping = "row" | "col" | "dot" | "blob" | "45" | "-45";

export interface QROptions {
	// Core
	ecc: QRErrorCorrectionLevel;
	mode: QRMode;
	version: number; // 0 for auto/1-40
	mask: number; // -1 for auto/0-7
	charset: QRCharset;
	quietZone: number;
	strict: boolean;

	// Render
	moduleSize: number;
	margin: number;
	foregroundColor: string; // darkColor
	backgroundColor: string; // lightColor
	moduleShape: QRModuleShape;
	grouping: QRGrouping;
	rotateDeg: number;
	moduleRotationDeg: number;
	cornerRadius: number;
	crispEdges: boolean;

	// Logo
	logoEnabled: boolean;
	logoSize: number; // Percentage
	logoRadius: number;
	logoContent?: string; // Raw SVG string
}

export interface WiFiPayload {
	ssid: string;
	password?: string;
	encryption: "WPA" | "WEP" | "nopass";
	hidden?: boolean;
}

export interface VCardPayload {
	firstName: string;
	lastName?: string;
	phone?: string;
	email?: string;
	organization?: string;
	url?: string;
}

export interface QRHistoryItem {
	id: string; // UUID
	timestamp: number; // Unix ms
	type: InputType;
	content: string | WiFiPayload | VCardPayload; // Raw content or structured payload
	payloadHash: string; // To detect duplicates
	options: QROptions;
	svgSnapshot?: string; // Optional, might be base64 or raw SVG string
}

export interface AppSettings {
	defaultOptions: QROptions;
	historyEnabled: boolean;
}

export const DEFAULT_QR_OPTIONS: QROptions = {
	ecc: "M",
	mode: "auto",
	version: -1, // representing auto/default mechanism if supported or simple default
	mask: -1, // representing auto
	charset: "utf-8",
	quietZone: 4,
	strict: false,
	moduleSize: 10,
	margin: 4,
	foregroundColor: "#000000",
	backgroundColor: "#ffffff",
	moduleShape: "square",
	grouping: "col",
	rotateDeg: 0,
	moduleRotationDeg: 0,
	cornerRadius: 0,
	crispEdges: true,
	logoEnabled: false,
	logoSize: 20,
	logoRadius: 0,
};

export const DEFAULT_SETTINGS: AppSettings = {
	defaultOptions: DEFAULT_QR_OPTIONS,
	historyEnabled: true,
};
