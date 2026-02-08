# qr-coder Specification (v2.0)

## 1. Purpose and Scope

`qr-coder` is a fresh-start codebase on `main` branch, while `master` remains a frozen legacy branch.

This repository will deliver:
1. A modern web QR generator (GitHub Pages compatible).
2. A Chrome Extension (Manifest V3).
3. A shared core integration layer using:
   - `qr-core`
   - `@goker/qr-code`

**Non-goals (v1):**
- Backend/API service
- User accounts/cloud sync
- Monorepo split
- Legacy code migration into `main`

---

## 2. Repository and Branching Model

### 2.1 Branch Policy
- `master`: legacy snapshot, read-only (no new feature development).
- `main`: active development branch (fresh start baseline already committed).

### 2.2 Release Model
- Semantic Versioning for `main` releases (`v2.0.0`, `v2.1.0`, etc.).
- Release notes must include:
  - Web app changes
  - Extension changes
  - Breaking changes (if any)

### 2.3 Commit Convention
Recommended Conventional Commits:
- `feat: ...`
- `fix: ...`
- `refactor: ...`
- `docs: ...`
- `chore: ...`
- `build: ...`
- `perf: ...`
- `test: ...`

---

## 3. Technical Stack

### 3.1 Runtime & Build
- Bun
- TypeScript
- Vite
- React

### 3.2 UI & Utilities
- Tailwind CSS v4
- Radix UI primitives
- class-variance-authority
- clsx
- tailwind-merge
- lucide-react
- tw-animate-css

### 3.3 Code Quality
- Biome (`@biomejs/biome`)

### 3.4 Extension Tooling
- `@crxjs/vite-plugin`
- `@types/chrome`

### 3.5 Core Libraries
- `@goker/qr-code`
- `qr-core`

---

## 4. Functional Requirements

### 4.1 QR Generator (Web)
Must support:

**Input types & Validation:**
- **Plain text**
- **URL**: Automatic normalization (e.g., default `https://` if protocol missing).
- **Wi-Fi**: Schema `WIFI:T:WPA;S:<ssid>;P:<pass>;H:<true|false>;;`
- **vCard**: Minimum fields: `FN`; Optional: `TEL`, `EMAIL`, `ORG`, `URL`.

**QR options:**
- Error correction level (L/M/Q/H)
- Margin/quiet zone
- Size

**Output:**
- SVG export (mandatory)
- PNG export (mandatory)

**UX & Contracts:**
- **Live preview**: Real-time rendering.
- **Deterministic Output**:
  - Same `payload` + `options` + `lib version` => **Byte-equivalent SVG**.
  - PNG: Visual equivalence (ignoring metadata/time-diffs).
- **Clear validation errors** for all formats.

### 4.2 QR Styling (v1)
- Foreground/background color
- Module shape presets
- Eye style presets
- Embedded logo

### 4.3 Chrome Extension (MV3)
The extension popup serves as the primary entry point for quick actions.

**Popup Behavior:**
- **Auto-Generate:** On open, automatically capture the **current tab's URL**.
- **Default Settings:** Immediately generate and display a QR code using stored default settings.
- **Download:** Provide a clear option to download the generated QR code (SVG/PNG).

**Popup Footer:**
- Must contain a link labeled **"QR Studio"**.
- Action: Opens the full dashboard application in a new tab.
- This serves as the bridge to advanced features.

### 4.4 QR Studio (Dashboard)
This module handles advanced usage and management.

**Core Features:**
- **Advanced Generation:** UI for creating QR codes in all supported formats (Text, WiFi, vCard, etc.).
- **Global Settings:** Configuration interface for application-wide defaults.
- **Implementation Note:** Leverage the full-function usage example from `@goker/qr-code` demo page as the baseline for this implementation.

**History & Persistence:**
- **Storage Strategy:** Local-only (Browser `localStorage` or `chrome.storage.local`).
- **Capacity:** Limit to last **100 records** (FIFO).
- **Data Model:**
  - `id`: string (UUID)
  - `timestamp`: number (Unix ms)
  - `type`: 'text' | 'url' | 'wifi' | 'vcard'
  - `payloadHash`: string (for potential dedup)
  - `options`: object (JSON of generation params)
  - `svgSnapshot`: string (optional, checks size limits)
- **Policy:** User can `Clean History` or `Export` (JSON).

### 4.5 Extension Permissions
Required permissions (Manifest V3):
- `activeTab`: To read the current page URL for auto-generation.
- `downloads`: To save generated QR codes to the disk.
- `storage`: To persist settings and history.
- **Constraint:** Do NOT request host permissions (e.g., `<all_urls>`) to ensure review safety and user trust.

---

## 5. Accessibility Specification
- WCAG 2.1 AA baseline.
- Keyboard operability for all controls.
- Visible focus states.
- Sufficient contrast in default themes.
- Form controls with associated labels and error messaging.

---

## 6. Security and Privacy
- No remote code execution paths.
- Sanitize all user-generated payload before render/export.
- No telemetry in v2 unless explicitly enabled.
- **Extension permissions:** Request only what is necessary for active-tab URL flow.