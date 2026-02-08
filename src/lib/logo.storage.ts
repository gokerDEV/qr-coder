import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Logo Storage Service
export interface StoredLogo {
	id: string;
	timestamp: number;
	content: string; // Raw SVG string
}

const STORAGE_KEY_LOGOS = "qr_saved_logos";

export const logoService = {
	async getLogos(): Promise<StoredLogo[]> {
		if (typeof chrome === "undefined" || !chrome.storage) return [];
		const result = await chrome.storage.local.get(STORAGE_KEY_LOGOS);
		return (result[STORAGE_KEY_LOGOS] as StoredLogo[]) || [];
	},

	async addLogo(content: string): Promise<StoredLogo[]> {
		const logos = await this.getLogos();
		const newLogo: StoredLogo = {
			id: crypto.randomUUID(),
			timestamp: Date.now(),
			content,
		};
		// Prepend new logo
		const updated = [newLogo, ...logos];
		await chrome.storage.local.set({ [STORAGE_KEY_LOGOS]: updated });
		return updated;
	},

	async deleteLogo(id: string): Promise<StoredLogo[]> {
		const logos = await this.getLogos();
		const updated = logos.filter((l) => l.id !== id);
		await chrome.storage.local.set({ [STORAGE_KEY_LOGOS]: updated });
		return updated;
	},
};
