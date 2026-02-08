import { DEFAULT_TIER, QR_TIER_CONFIG } from "@/config/qr-options.config";
import {
	type AppSettings,
	DEFAULT_SETTINGS,
	type QRHistoryItem,
} from "./types";

const HISTORY_KEY = "qr_history";
const SETTINGS_KEY = "qr_settings";

const isExtension = typeof chrome !== "undefined" && !!chrome.storage;

// Generic storage interface
interface StorageBackend {
	get: <T>(key: string) => Promise<T | null>;
	set: <T>(key: string, value: T) => Promise<void>;
}

const storage: StorageBackend = {
	get: async <T>(key: string): Promise<T | null> => {
		if (isExtension) {
			const result = await chrome.storage.local.get(key);
			return (result[key] as T) || null;
		}
		const item = localStorage.getItem(key);
		return item ? (JSON.parse(item) as T) : null;
	},
	set: async <T>(key: string, value: T): Promise<void> => {
		if (isExtension) {
			await chrome.storage.local.set({ [key]: value });
		} else {
			localStorage.setItem(key, JSON.stringify(value));
		}
	},
};

export const historyService = {
	async getHistory(): Promise<QRHistoryItem[]> {
		const data = await storage.get<QRHistoryItem[]>(HISTORY_KEY);
		return data || [];
	},

	async addHistory(
		item: QRHistoryItem,
		tier: "free" | "premium" = DEFAULT_TIER,
	) {
		const history = await this.getHistory();
		const limit = QR_TIER_CONFIG[tier].historyLimit;

		// FIFO: Remove oldest if exceeds limit
		if (history.length >= limit) {
			// If we are significantly over limit (e.g. tier downgrade), trim down
			const overhead = history.length - limit + 1; // +1 because we are about to add one
			if (overhead > 0) {
				history.splice(history.length - overhead, overhead);
			}
		}
		// Add new item to start
		history.unshift(item);

		// Final safety trim
		if (history.length > limit) {
			history.splice(limit);
		}
		await storage.set(HISTORY_KEY, history);
	},

	async clearHistory() {
		await storage.set(HISTORY_KEY, []);
	},

	async exportHistory(): Promise<string> {
		const history = await this.getHistory();
		return JSON.stringify(history, null, 2);
	},
};

export const settingsService = {
	async getSettings(): Promise<AppSettings> {
		const data = await storage.get<AppSettings>(SETTINGS_KEY);
		return { ...DEFAULT_SETTINGS, ...data };
	},

	async updateSettings(newSettings: Partial<AppSettings>) {
		const current = await this.getSettings();
		await storage.set(SETTINGS_KEY, { ...current, ...newSettings });
	},
};
