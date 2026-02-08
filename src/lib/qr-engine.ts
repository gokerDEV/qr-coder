import { toSvgString } from "@goker/qr-code";
import {
	DEFAULT_QR_OPTIONS,
	type InputType,
	type QROptions,
	type VCardPayload,
	type WiFiPayload,
} from "./types";

export function formatWiFiPayload(data: WiFiPayload): string {
	const hidden = data.hidden ? "true" : "false";
	const password = data.password ? `P:${data.password};` : "";
	return `WIFI:T:${data.encryption};S:${data.ssid};${password}H:${hidden};;`;
}

export function formatVCardPayload(data: VCardPayload): string {
	// Simple vCard 3.0 formatter
	const parts = ["BEGIN:VCARD", "VERSION:3.0"];
	if (data.firstName || data.lastName) {
		const fn = [data.lastName, data.firstName].filter(Boolean).join(";");
		parts.push(`N:${fn}`);
		parts.push(
			`FN:${[data.firstName, data.lastName].filter(Boolean).join(" ")}`,
		);
	}
	if (data.organization) parts.push(`ORG:${data.organization}`);
	if (data.phone) parts.push(`TEL:${data.phone}`);
	if (data.email) parts.push(`EMAIL:${data.email}`);
	if (data.url) parts.push(`URL:${data.url}`);
	parts.push("END:VCARD");
	return parts.join("\n");
}

export function getPayloadString(
	type: InputType,
	content: string | WiFiPayload | VCardPayload,
): string {
	switch (type) {
		case "wifi":
			if (typeof content !== "object") throw new Error("Invalid WiFi payload");
			return formatWiFiPayload(content as WiFiPayload);
		case "vcard":
			if (typeof content !== "object") throw new Error("Invalid vCard payload");
			return formatVCardPayload(content as VCardPayload);
		case "url":
			if (typeof content !== "string") throw new Error("Invalid URL payload");
			return content.startsWith("http") ? content : `https://${content}`;
		default:
			if (typeof content !== "string") throw new Error("Invalid text payload");
			return content;
	}
}

export async function generateQR(
	payload: string,
	options: QROptions = DEFAULT_QR_OPTIONS,
): Promise<{ svg: string; pngDataUrl: string }> {
	try {
		// 1. Generate Base SVG with 0 rotation
		const baseSvg = toSvgString(payload, {
			ecc: options.ecc,
			mode: options.mode,
			version: options.version === -1 ? undefined : options.version,
			mask:
				options.mask === -1
					? undefined
					: (options.mask as unknown as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7),
			charset: options.charset,
			quietZone: options.quietZone,
			strict: options.strict,
			render: {
				moduleSize: options.moduleSize,
				margin: options.margin,
				darkColor: options.foregroundColor,
				lightColor: options.backgroundColor,
				xmlDeclaration: false,
				viewBox: true,
				crispEdges: options.crispEdges,
				grouping: options.grouping,
				moduleShape: options.moduleShape,
				rotateDeg: 0, // Always 0, manual rotation later
				moduleRotationDeg: options.moduleRotationDeg,
				cornerRadius: options.cornerRadius,
			},
		});

		let innerContent = baseSvg;
		let width = 0;
		let height = 0;

		// Extract dimensions
		const viewBoxMatch = /viewBox="([^"]+)"/.exec(baseSvg);
		if (viewBoxMatch) {
			const parts = viewBoxMatch[1].split(" ").map(Number);
			if (parts.length === 4) {
				[, , width, height] = parts;
			}
		}

		// Fallback dimensions
		if (width === 0) {
			const wMatch = /width="(\d+)"/.exec(baseSvg);
			const hMatch = /height="(\d+)"/.exec(baseSvg);
			if (wMatch) width = Number(wMatch[1]);
			if (hMatch) height = Number(hMatch[1]);
		}

		// 2. Logo Injection (Pre-rotation)
		if (options.logoEnabled && width > 0) {
			const logoPixelSize = Math.round(width * (options.logoSize / 100));
			const x = Math.round((width - logoPixelSize) / 2);
			const y = Math.round((height - logoPixelSize) / 2);

			const rawFill = options.backgroundColor;
			const fill = !rawFill || rawFill === "transparent" ? "#ffffff" : rawFill;
			const radiusValue = (options.logoRadius / 100) * logoPixelSize;

			// Generate a unique ID for the clip path to avoid collisions if multiple QRs are on page
			const clipId = `clip-${Math.random().toString(36).substring(2, 9)}`;

			let logoGroup = `  <g class="qr-logo">
				<defs>
					<clipPath id="${clipId}">
						<rect x="${x}" y="${y}" width="${logoPixelSize}" height="${logoPixelSize}" rx="${radiusValue}" ry="${radiusValue}" />
					</clipPath>
				</defs>
				<rect x="${x}" y="${y}" width="${logoPixelSize}" height="${logoPixelSize}" fill="${fill}" rx="${radiusValue}" ry="${radiusValue}"/>\n`;

			if (options.logoContent) {
				const base64Logo = btoa(options.logoContent);
				// Apply clip-path to the image
				logoGroup += `        <image href="data:image/svg+xml;base64,${base64Logo}" x="${x}" y="${y}" width="${logoPixelSize}" height="${logoPixelSize}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${clipId})" />\n`;
			}
			logoGroup += "  </g>";

			innerContent = innerContent.replace("</svg>", `${logoGroup}</svg>`);
		}

		// 3. Post-Process: Wrap & Rotate & Adjust ViewBox
		// Calculate diagonal to ensure fit at any angle
		const diagonal = Math.sqrt(width * width + height * height);
		const cx = width / 2;
		const cy = height / 2;

		// Strip outer <svg> tags
		const bodyContent = innerContent
			.replace(/<svg[^>]*>/, "")
			.replace("</svg>", "");

		// Construct Final SVG with centered viewBox
		const minX = (width - diagonal) / 2;
		const minY = (height - diagonal) / 2;

		const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${diagonal} ${diagonal}" width="${diagonal}" height="${diagonal}">
  <g transform="rotate(${options.rotateDeg}, ${cx}, ${cy})">
    ${bodyContent}
  </g>
</svg>`;

		// 4. Corner Radius Post-Processing
		let processedSvg = finalSvg;
		if (options.cornerRadius > 0) {
			processedSvg = processedSvg.replace(
				/<rect (?![^>]*rx=)(?![^>]*class="qr-logo")/g,
				`<rect rx="${options.cornerRadius}" ry="${options.cornerRadius}" `,
			);
		}

		// 5. Convert to PNG
		const pngDataUrl = await svgToPng(processedSvg);

		return {
			svg: processedSvg,
			pngDataUrl,
		};
	} catch (e) {
		console.error("QR Generation Error:", e);
		throw e;
	}
}

// Helper to convert SVG string to PNG Data URL
function svgToPng(svgString: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const svgBlob = new Blob([svgString], {
			type: "image/svg+xml;charset=utf-8",
		});
		const url = URL.createObjectURL(svgBlob);

		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(new Error("Canvas context not available"));
				return;
			}
			ctx.drawImage(img, 0, 0);
			URL.revokeObjectURL(url);
			resolve(canvas.toDataURL("image/png"));
		};

		img.onerror = (e) => {
			URL.revokeObjectURL(url);
			reject(e);
		};

		img.src = url;
	});
}
