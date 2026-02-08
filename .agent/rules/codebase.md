---
trigger: always_on
---

# Project Rules & Tech Stack

## 🛠 Tech Stack
- **Core**: React 19 + TypeScript + Bun
- **Build**: Vite + Crxjs
- **Styling**: Tailwind CSS v4
- **UI Library**: Shadcn UI (Radix Primitives)
- **Routing**: React Router
- **Form**: React Hook Form 
- **Linter/Formatter**: Biome (Replaces ESLint/Prettier)

---
Follow `SPEC.md` for architectural reference.
---

## 📏 Development Rules

### 1. Type Safety & Linting
- **Strict Typing**: No `any`. Use `unknown` with type guards if necessary.
- **Validation**: Run `bun run lint` (Biome) before every commit.
- **HTML Extension**: UI components must extend their base HTML element attributes.


### 2. Directory Responsibility
- **@/components/ui**: **STRICTLY READ-ONLY**. Mirror of Shadcn registry. No custom modifications.
- **@/components/common & forms**: All shared, stateless components and atomic form elements.
- **@/app/{module}**: Domain-driven modules. Components and hooks here are private to the module.
- **@/services**: Pure logic layer for external communication (Chrome API, Backend).
- **Encapsulation**: Components used in a single module must stay in `@/app/{module}/components`.
- **Promotion**: Move a component to `@/components/common` ONLY if it is required by 2+ independent modules.
- **Composition**: Use React 19 patterns. Prefer composition over complex prop-drilling.
- **View Logic**: Business logic stays in `@/app/{module}/hooks`.
- **Utility Logic**: Generic, non-domain logic stays in `@/hooks`.


### 3. SOLID & Clean Code
- **SRP**: One component, one responsibility.
- **Interface Segregation**: Don't pass full objects if < 60% of properties are used.
- **Open/Closed**: Components must be open for extension via `className` and `...props`.
- **Declarative**: Write code describing *what* it does, not *how* it does it.

### 4. Naming Conventions
- **Event Handlers**: `handle` prefix (e.g., `handleSubmit`)
- **Filenames**: Lowercase with dot notation (e.g., `profile.card.tsx`, `auth.hook.ts`).

### 5. Extension & Performance
- **Messaging**: Use a strictly typed bridge for `background`, `content`, and `app` communication.
- **No Magic Numbers**: Centralize timeouts, retry counts, and intervals in constants.
- **Cleanup**: Always clear `PerformanceObserver`, `setInterval`, and `setTimeout` on unmount.
- **State Integrity**: Respect "OFF" states; no side effects should run when the runner is inactive.
- **Sync**: Keep `manifest.config.ts` and `README.md` updated.


## Directory Tree

```
src/
├── assets/             # Static assets (Logos, SVGs, global images)
├── backgrounds/        # Chrome Extension Service Worker (background.ts)
├── popup/              # Popup entry point (index.html & main.tsx)
├── components/         
│   ├── ui/             # SHADCN (STRICTLY READ-ONLY - Original registry components)
│   ├── forms/          # Generalized & atomic form elements (Custom inputs, toggles)
│   └── common/         # Shared stateless components (ProviderOverlay, Layouts, Brands)
├── app/                # Main application logic managed via React Router
│   ├── [MODULE_NAME]/  
│   │   ├── components/ # UI components private to the module
│   │   ├── hooks/      # Domain-specific business logic for the module
│   │   └── pages/      # Sub-views and route segments for the module (e.g., Step1, Step2)
│   ├── [MODULE_NAME]/  # Another module following the same internal structure
│   └── settings/       # Settings module following the same internal structure
├── hooks/              # Global utility hooks (useStorage, useAuth, useTheme)
├── lib/                # Shared utilities, constants, and global TypeScript types
└── services/           # Logic layer for External APIs and Chrome Messaging Bridge
```