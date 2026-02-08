import { createContext, useContext, useEffect, useState } from "react";
import { generateQR, getPayloadString } from "@/lib/qr-engine";
import { historyService, settingsService } from "@/lib/storage";
import {
	DEFAULT_QR_OPTIONS,
	type InputType,
	type QROptions,
	type VCardPayload,
	type WiFiPayload,
} from "@/lib/types";

interface QRContextType {
	inputType: InputType;
	setInputType: (t: InputType) => void;
	textInput: string;
	setTextInput: (t: string) => void;
	wifiInput: WiFiPayload;
	setWifiInput: (w: WiFiPayload) => void;
	vCardInput: VCardPayload;
	setVCardInput: (v: VCardPayload) => void;
	options: QROptions;
	setOptions: (o: QROptions | ((prev: QROptions) => QROptions)) => void;
	svgContent: string;
	pngData: string;
	addToHistory: () => void;
	handleDownload: (format: "svg" | "png") => void;
}

const QRContext = createContext<QRContextType | undefined>(undefined);

export function QRProvider({ children }: { children: React.ReactNode }) {
	const [inputType, setInputType] = useState<InputType>("text");
	const [textInput, setTextInput] = useState("https://goker.me/?qr-code");
	const [wifiInput, setWifiInput] = useState<WiFiPayload>({
		ssid: "",
		encryption: "WPA",
		hidden: false,
	});
	const [vCardInput, setVCardInput] = useState<VCardPayload>({ firstName: "" });

	// Initialize with defaults
	const [options, setOptions] = useState<QROptions>(DEFAULT_QR_OPTIONS);
	const [svgContent, setSvgContent] = useState<string>("");
	const [pngData, setPngData] = useState<string>("");

	// Load defaults on mount
	useEffect(() => {
		settingsService.getSettings().then((s) => {
			setOptions({ ...DEFAULT_QR_OPTIONS, ...s.defaultOptions });
		});
	}, []);

	// Generate QR when inputs change
	useEffect(() => {
		const generate = async () => {
			try {
				let payload = "";
				if (inputType === "text" || inputType === "url") {
					if (!textInput) return;
					payload = getPayloadString(inputType, textInput);
				} else if (inputType === "wifi") {
					if (!wifiInput.ssid) return;
					payload = getPayloadString("wifi", wifiInput);
				} else if (inputType === "vcard") {
					if (!vCardInput.firstName) return;
					payload = getPayloadString("vcard", vCardInput);
				}

				const result = await generateQR(payload, options);
				setSvgContent(result.svg);
				setPngData(result.pngDataUrl);
			} catch (e) {
				console.error("Generation failed", e);
			}
		};
		// Debounce generation
		const timeout = setTimeout(generate, 500);
		return () => clearTimeout(timeout);
	}, [inputType, textInput, wifiInput, vCardInput, options]);

	const addToHistory = async () => {
		let content: string | WiFiPayload | VCardPayload = "";
		if (inputType === "text" || inputType === "url") content = textInput;
		else if (inputType === "wifi") content = wifiInput;
		else if (inputType === "vcard") content = vCardInput;

		let payload = "";
		try {
			payload = getPayloadString(inputType, content);
		} catch {
			return; // Invalid content
		}

		await historyService.addHistory({
			id: crypto.randomUUID(),
			timestamp: Date.now(),
			type: inputType,
			content,
			payloadHash: payload,
			options,
		});
	};

	const handleDownload = (format: "svg" | "png") => {
		const data =
			format === "svg"
				? `data:image/svg+xml;base64,${btoa(svgContent)}`
				: pngData;
		const filename = `qr-${inputType}-${Date.now()}.${format}`;

		chrome.downloads.download({ url: data, filename, saveAs: true });
		addToHistory();
	};

	return (
		<QRContext.Provider
			value={{
				inputType,
				setInputType,
				textInput,
				setTextInput,
				wifiInput,
				setWifiInput,
				vCardInput,
				setVCardInput,
				options,
				setOptions,
				svgContent,
				pngData,
				addToHistory,
				handleDownload,
			}}
		>
			{children}
		</QRContext.Provider>
	);
}

export function useQR() {
	const context = useContext(QRContext);
	if (context === undefined) {
		throw new Error("useQR must be used within a QRProvider");
	}
	return context;
}
