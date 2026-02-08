# qr-coder

![Version](https://img.shields.io/badge/version-3.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Chrome Web Store](https://img.shields.io/chrome-web-store/v/fgggldjlbpajaffefpkkhkfdiihinebf)


**qr-coder** is a professional QR generation toolkit designed for speed and precision. Instantly turn your current tab's URL into a QR code or head to the QR Studio for advanced customization. Supporting SVG/PNG exports, logo integration, and deep styling (module groups, radius, and corners), it’s the ultimate deterministic workflow for modern QR needs. Crafted with a built-in history and default settings for instant, repeatable results.

Powered by **qr-core** and **@goker/qr-code**, it bridges the gap between a quick popup tool and a professional design studio.

---

## 🚀 Key Features

*   **Fresh v3 architecture** on `main` (legacy preserved separately on `master`)
*   **Deterministic generation** for consistent output with identical input/options
*   **Multiple input types**
    *   Plain text
    *   URL
    *   Wi-Fi payload
    *   vCard payload
*   **Advanced Style Customization**
    *   **Colors**: Custom Foreground & Background
    *   **Shapes**: Modules (Square, Circle, Dot, etc.), Markers
    *   **Rotation**: Custom rotation for patterns
    *   **Logo Overlay**: Upload custom logos, adjust size and radius
*   **Export options**
    *   SVG (primary, lossless)
    *   PNG
*   **QR configuration controls**
    *   Error correction level (L / M / Q / H)
    *   Margin (quiet zone)
    *   Size
*   **Chrome Extension (MV3) first**
    *   Auto-captures current tab URL on popup open
    *   Generates QR instantly with default settings
    *   One-click download
*   **QR Studio dashboard**
    *   Advanced generation
    *   Global defaults
    *   History view for previously generated items
*   **Minimal-permission extension model**

## 🛠️ Tech Stack (v3)

*   **Runtime / Tooling**
    *   **Bun** (Package Manager & Runtime)
    *   **TypeScript** (Strict Mode)
    *   **Vite** (Build Tool)
    *   **React 19**
*   **Core Logic**
    *   `qr-core`
    *   `@goker/qr-code`
    *   `react-hook-form` (Form Management)
*   **UI & UX**
    *   **Tailwind CSS v4** (Styling)
    *   **Shadcn UI** (Component Library)
    *   **Framer Motion** (Animations)
    *   **Lucide React** (Icons)
*   **Quality & Standards**
    *   **Biome** (Linter & Formatter)
*   **Extension**
    *   `@crxjs/vite-plugin`
    *   MV3 Manifest

## 📂 Project Structure

```
src/
├── app/                # Feature modules (QR, History, Settings)
├── components/         # Shared UI components (Shadcn, Common)
├── lib/                # Core utilities and engines
├── services/           # External integrations (Chrome API, Storage)
├── assets/             # Static assets
└── popup/              # Extension popup entry
```

## 📦 Installation & Development

### Prerequisites

*   [Bun](https://bun.sh/) (v1.0+)
*   Node.js (v20+)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/gokerDEV/qr-coder
    cd qr-coder
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Start Development Server:**
    ```bash
    bun dev
    ```
    This compiles the extension and app in watch mode.

4.  **Load into Chrome:**
    *   Open `chrome://extensions`
    *   Enable **Developer mode** (top right)
    *   Click **Load unpacked**
    *   Select the `dist/` folder generated in your project root

## 🏃 Usage

### Extension Quick Flow
1.  Click the extension icon.
2.  Popup opens and reads the active tab URL automatically.
3.  QR is generated immediately using your saved default settings.
4.  Download as SVG or PNG.
5.  Open **QR Studio** from popup footer for advanced controls.

### QR Studio Flow
1.  Open **QR Studio** (`app/dashboard`).
2.  Choose input type (Text, URL, Wi-Fi, vCard).
3.  Adjust ECC, size, margin, colors, and style options.
4.  Preview live output.
5.  Export in desired format and review generation history.

## 🤝 Contributing

Contributions are welcome! Please read the [SPEC.md](./SPEC.md) for architectural details before submitting pull requests.

1.  Fork the repository
2.  Create your branch (`git checkout -b feature/amazing-feature`)
3.  Commit changes (`git commit -m 'feat: add amazing feature'`)
4.  Push branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

### Contribution Rules
*   Follow **Conventional Commits**
*   Keep adapter boundaries clean (`qr-core` / `@goker/qr-code` integration layer)
*   Avoid `any` types (Strict TypeScript)
*   Keep comments in English
*   Run lint/format/build before PR (`bun lint`, `bun format`)

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.