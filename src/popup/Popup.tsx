import { Download, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/common/app.logo";
import { Button } from "@/components/ui/button";
import { generateQR } from "@/lib/qr-engine";
import { settingsService } from "@/lib/storage";

export function Popup() {
	// ...
	const [url, setUrl] = useState<string>("");
	const [svgContent, setSvgContent] = useState<string>("");
	const [pngDataUrl, setPngDataUrl] = useState<string>("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAndGenerate = async () => {
			try {
				let currentUrl = "";

				// Check if running as extension
				if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
					const tabs = await chrome.tabs.query({
						active: true,
						currentWindow: true,
					});
					currentUrl = tabs[0]?.url || "";
				} else {
					// Fallback for local development
					currentUrl = "https://example.com/dev-fallback";
				}

				setUrl(currentUrl);

				if (!currentUrl) {
					setLoading(false);
					return;
				}

				// Get settings
				const settings = await settingsService.getSettings();

				// Generate QR
				const result = await generateQR(currentUrl, settings.defaultOptions);

				// Modify SVG for display (responsive)
				// Ensure we only replace the root svg attributes
				const responsiveSvg = result.svg
					.replace(/width="[^"]+"/, 'width="100%"')
					.replace(/height="[^"]+"/, 'height="100%"');

				setSvgContent(responsiveSvg);
				setPngDataUrl(result.pngDataUrl);
			} catch (error) {
				console.error("Failed to initialize popup:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAndGenerate();
	}, []);

	const handleDownload = (format: "svg" | "png") => {
		const data =
			format === "svg"
				? `data:image/svg+xml;base64,${btoa(svgContent)}`
				: pngDataUrl;

		const filename = `qrcode-${Date.now()}.${format}`;

		chrome.downloads.download({
			url: data,
			filename: filename,
			saveAs: true,
		});
	};

	const openApp = () => {
		chrome.tabs.create({ url: chrome.runtime.getURL("app.html") });
	};

	if (loading) {
		return (
			<div className="flex h-48 animate-pulse items-center justify-center text-muted-foreground">
				Loading...
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<header className="border-b">
				<Button
					variant="ghost"
					className="relative h-16 w-full justify-start overflow-visible rounded-none px-2"
					onClick={openApp}
				>
					<Logo />
					<div className="absolute right-4 bottom-0 rounded-t-lg bg-border px-2 py-0.5 text-center font-medium text-[10px] text-foreground uppercase tracking-widest shadow-sm">
						Studio
					</div>
				</Button>
			</header>

			<main className="flex flex-col items-center gap-4">
				<div
					className="rounded-lg border bg-white p-2 shadow-sm"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted SVG content
					dangerouslySetInnerHTML={{ __html: svgContent }}
				/>

				<div className="flex w-full gap-2">
					<button
						type="button"
						onClick={() => handleDownload("svg")}
						className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:opacity-90"
					>
						<Download className="h-4 w-4" /> SVG
					</button>
					<button
						type="button"
						onClick={() => handleDownload("png")}
						className="flex flex-1 items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-secondary-foreground transition-colors hover:opacity-90"
					>
						<Download className="h-4 w-4" /> PNG
					</button>
				</div>

				<div
					className="w-full truncate px-2 text-center text-muted-foreground text-xs"
					title={url}
				>
					{url || "No URL detected"}
				</div>
			</main>

			<footer className="mt-auto flex justify-center border-t pt-2">
				<button
					type="button"
					onClick={openApp}
					className="flex items-center gap-1.5 text-primary text-sm hover:underline"
				>
					Open QR Studio <ExternalLink className="h-3 w-3" />
				</button>
			</footer>
		</div>
	);
}
