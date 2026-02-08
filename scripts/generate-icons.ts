
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SIZES = [16, 32, 48, 128];
const OUTPUT_DIR = path.resolve(process.cwd(), "public/icons");

// QrCodeIcon from lucide-react (stroke-based)
// Colors from header: bg-[rgb(255,221,0)] (#ffdd00), text-stone-900 (#1c1917)
const SVG_CONTENT = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1917" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="24" height="24" x="0" y="0" fill="#ffdd00" stroke="none" />
  
  <!-- Icon Paths (centered, maybe with padding? 24x24 icon is full size. Let's pad it slightly) -->
  <g transform="translate(4, 4) scale(0.66)">
    <!-- Original Path Data -->
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx:="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 16v.01" />
    <path d="M16 12h1" />
    <path d="M21 12v.01" />
    <path d="M12 21v-1" />
  </g>
</svg>
`;

// Wait, the scaling transform might be off.
// Let's use a cleaner SVG without fancy transforms if possible, or ensure centering.
// The icon is 24x24. The rect background is 24x24.
// If I use the icon directly on top of the background, the strokes might touch edges.
// Padding is good.
// 24 * 0.15 padding = 3.6.
// Let's perform a scale transform around center.
// Center is 12,12.
// Scale 0.7.
const ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
  <rect width="24" height="24" fill="#ffdd00" />
  <g transform="translate(3,3) scale(0.75)" fill="none" stroke="#1c1917" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 16v.01" />
    <path d="M16 12h1" />
    <path d="M21 12v.01" />
    <path d="M12 21v-1" />
  </g>
</svg>
`;

async function generate() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const svgBuffer = Buffer.from(ICON_SVG);

    // Save SVG for reference
    fs.writeFileSync(path.join(OUTPUT_DIR, "../icon.svg"), ICON_SVG);

    for (const size of SIZES) {
        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(path.join(OUTPUT_DIR, `icon-${size}.png`));

        console.log(`Generated icon-${size}.png`);
    }
}

generate().catch(console.error);
