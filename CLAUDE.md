# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Visual CMS Editor - A next-generation headless visual CMS library that completely separates design and content, enabling safe visual editing without breaking designs.

**Tech Stack:**

- SvelteKit 2.16.0 with Svelte 5.0.0
- TypeScript 5.0.0 (strict mode with `checkJs` enabled)
- Tailwind CSS 4.0.0 with @tailwindcss/vite
- Vite 6.2.6 with WASM support
- Loro CRDT 1.5.9 for history and collaboration
- Paraglide.js 2.0.0 for i18n (Korean/English)
- lucide-svelte 0.525.0 for icons

## Development Commands

```bash
# Build and test (preferred over pnpm dev due to hang-ups)
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run all tests (unit + E2E)

# Type checking and linting
pnpm check        # Run svelte-check for type checking
pnpm check:watch  # Watch mode for type checking
pnpm lint         # ESLint + Prettier check
pnpm format       # Auto-format code with Prettier

# Testing
pnpm test:unit    # Vitest unit tests (browser + server)
pnpm test:e2e     # Playwright E2E tests

# Deployment
pnpm deploy:check # Check build, lint, and types before deploy
pnpm deploy       # Deploy to GitHub Pages using gh-pages

# Development tools
pnpm prepare      # Run svelte-kit sync
```

## Architecture

### Core Architecture Patterns

The project uses a **Command Pattern architecture** as the foundation for all state management:

1. **Command Store** (`/src/lib/core/commands/CommandStore.ts`)
   - Central hub for all state mutations
   - Every user action creates a command object
   - Commands are executed through domain-specific executors
   - Supports undo/redo through command history

2. **Model-Based Plugin System** (`/src/lib/core/plugins/`)
   - Plugins operate on data models, not DOM elements
   - Strategy Pattern for extensibility
   - Each plugin type (text, image, icon, link) has its own implementation
   - Plugin lifecycle managed by ModelBasedPluginManager

3. **Unified Selection System** (`/src/lib/core/selection/`)
   - Single SelectionManager instance manages all selection state
   - Integrates with Command Pattern for state mutations
   - Element-Model registry bridges DOM and data models

### File Structure

```
src/
├── routes/              # SvelteKit pages and layouts
│   ├── +page.svelte     # Main editor (production implementation)
│   ├── demo/            # Legacy class-based selection demo
│   ├── reactive-demo/   # Svelte stores selection demo
│   ├── rune-demo/       # Svelte 5 runes demo
│   └── components-demo/ # Component-based approach demo
├── lib/
│   ├── core/           # Core business logic
│   │   ├── commands/   # Command Pattern implementation
│   │   │   ├── CommandStore.ts      # Central command store
│   │   │   ├── executors/           # Domain-specific executors
│   │   │   ├── handlers/            # Complex operation handlers
│   │   │   └── stores.ts            # Derived state stores
│   │   ├── EditorManager.ts         # Main editor orchestrator
│   │   ├── history/                 # Loro CRDT history
│   │   ├── selection/               # Selection management
│   │   ├── plugins/                 # Model-based plugin system
│   │   ├── keyboard/                # Keyboard management
│   │   ├── parsers/                 # Template parsing
│   │   ├── entities/                # Domain models
│   │   └── templates/               # 30+ pre-built templates
│   ├── components/     # UI Components
│   │   ├── Inspector.svelte         # Properties & history panel
│   │   ├── LeftSidebar.svelte      # Section management
│   │   ├── SelectionOverlay.svelte  # Floating action UI
│   │   ├── TemplateRendererV3.svelte # Current renderer
│   │   ├── CommandLogger.svelte     # Debug: command history
│   │   ├── DebugPanel.svelte       # Debug: state inspection
│   │   └── SelectionDebugPanel.svelte # Debug: selection state
│   ├── paraglide/      # Generated i18n functions
│   └── utils/          # Utility functions
├── messages/           # I18n translations
│   ├── en.json
│   └── ko.json
├── app.css            # Global styles + CSS variables
├── app.html           # HTML template with debug styles
├── app.d.ts           # Global TypeScript types
└── hooks.server.ts    # Server hooks for i18n
```

### Key Configurations

#### Build Configuration
- **Static Adapter**: CSR-only mode with `fallback: "index.html"`
- **Base Path**: Configurable via `BASE_PATH` env for GitHub Pages
- **Optimization**: `loro-crdt` excluded from dependency optimization
- **WASM**: Enabled via `vite-plugin-wasm`

#### Code Quality Tools
- **ESLint**: TypeScript-aware with Svelte plugin
  - Allows underscore-prefixed unused variables
  - Disables `no-undef` (handled by TypeScript)
- **Prettier**: 
  ```json
  {
    "semi": false,
    "printWidth": 120,
    "singleQuote": false,
    "trailingComma": "all",
    "singleAttributePerLine": true
  }
  ```
- **Knip**: Dead code detection with custom ignore patterns
- **TypeScript**: Strict mode with `checkJs` enabled

#### Testing Configuration
- **Vitest**: Dual project setup (browser + server environments)
- **Playwright**: E2E tests on port 4173
- **Browser Testing**: Uses `@vitest/browser` with Playwright provider

### Core Features

#### Command Pattern System
- **CommandStore**: Central registry for all commands
- **Executors**: Domain-specific command execution
  - SelectionExecutor: Selection state changes
  - TextExecutor: Text content edits
  - ContentExecutor: Section/template operations
  - UIExecutor: UI state changes
- **Handlers**: Complex multi-step operations
- **History**: Command-based undo/redo

#### Selection System
- **Modes**: Select mode vs Edit mode
- **Multi-selection**: Shift/Cmd+Click support
- **Keyboard Navigation**: Tab, Shift+Tab, Arrow keys
- **Visual Feedback**: Type-specific colors and overlays
- **Integration**: Commands for all selection operations

#### Plugin System
- **Text Plugin**: ContentEditable with constraints
- **Image Plugin**: Upload, drag & drop, clipboard paste
- **Icon Plugin**: SVG picker with lucide-svelte icons
- **Link Plugin**: URL editing with validation
- **Lifecycle**: init, onClick, onDoubleClick, onKeyDown

#### Keyboard Management
- **ExclusiveKeyboardManager**: Priority-based handling
- **Context Awareness**: Mode-specific keymaps
- **Conflict Prevention**: Single active handler
- **Configurable**: Keymap definitions in `/keymaps/`

#### Template System
- **Categories**: Hero, Features, CTA, Testimonials, Stats, Pricing, Contact
- **Constraints**: max-length, required fields, min/max items
- **Drag & Drop**: Section reordering
- **Validation**: Built-in constraint checking

### Data Attributes

```html
<!-- Editable elements -->
<div data-editable="text" data-max-length="50">...</div>
<img data-editable="image" data-allowed-types="image/*" />
<svg data-editable="icon" data-icon-set="lucide" />
<a data-editable="link" data-link-type="external" />

<!-- Containers -->
<div data-repeatable="feature" data-min="1" data-max="6">...</div>
```

## Important Implementation Notes

### Performance Considerations
- **Avoid `pnpm dev`**: Known to cause hang-ups, use `pnpm build && pnpm preview`
- **Loro CRDT**: Excluded from Vite optimization for WASM compatibility
- **History Debouncing**: 500ms delay for grouping rapid edits

### State Management Rules
1. All state mutations MUST go through CommandStore
2. Never modify DOM directly - use plugin models
3. Selection state is the single source of truth
4. Commands should be immutable and serializable

### Plugin Development
1. Extend `PluginModel` base class
2. Implement required lifecycle methods
3. Register with `ModelBasedPluginManager`
4. Use commands for all state changes

### Testing Guidelines
- Unit tests use Vitest with browser/server split
- E2E tests use Playwright on production build
- Test files: `*.{test,spec}.{js,ts}`
- Run `pnpm test` before committing

### Deployment
- GitHub Actions automatically deploys to Pages on push to `main`
- Manual deploy: `pnpm deploy:check && pnpm deploy`
- Base path configured via `BASE_PATH` environment variable

## Recent Architecture Changes (2025-01-06)

### Migration from DOM-based to Model-based
- Plugins now work with data models instead of DOM manipulation
- Command Pattern replaces direct state mutations
- Unified SelectionManager replaces distributed selection state
- ExclusiveKeyboardManager prevents hotkey conflicts

### Known Issues
- Legacy DOM components in demo routes (not production code)
- Non-critical TypeScript errors in plugin type definitions
- Some E2E tests need updates for new architecture

### Planned Features
- Design Mode vs Content Mode separation
- Real-time collaboration using Loro CRDT
- Extended plugin API for third-party extensions
- Advanced template constraints and validation

## Development Philosophy

- 작은 단위로 개발하고 확인하며 진행
- 300줄 이상의 파일은 리팩토링 고려
- 삭제하기 쉬운 코드 작성 (OCP, pluggable)
- 구현 전에 화면에 연결, 조금씩 만들어가기
- 모든 기능은 `docs/features.md`에 문서화
- Simple is not easy - 가장 적은 코드로 구현