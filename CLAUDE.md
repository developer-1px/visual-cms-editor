# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Visual CMS Editor - A next-generation headless visual CMS library that completely separates design and content, enabling safe visual editing without breaking designs.

**Tech Stack:**

- SvelteKit 2.16.0 with Svelte 5.0.0
- TypeScript 5.0.0 (strict mode)
- Tailwind CSS 4.0.0 with Forms and Typography plugins
- Vite 6.2.6 with WASM support
- Loro CRDT for history and collaboration
- Paraglide.js for i18n (Korean/English)
- @floating-ui/dom for overlay positioning

## Development Commands

```bash
# Build and test (preferred over pnpm dev due to hang-ups)
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run all tests (unit + E2E)

# Type checking and linting
pnpm check        # Run svelte-check for type checking
pnpm lint         # ESLint + Prettier check
pnpm format       # Auto-format code

# Testing
pnpm test:unit    # Vitest unit tests (browser + server)
pnpm test:e2e     # Playwright E2E tests
```

## Architecture

### File Structure

```
src/
├── routes/          # SvelteKit pages and layouts
│   ├── +page.svelte # Main editor with Svelte-native implementation
│   └── demo/        # Demo page with class-based selection system
├── lib/            # Reusable components and utilities
│   ├── core/
│   │   ├── history/    # Loro CRDT-based history management
│   │   ├── selection/  # SelectionManager class implementation
│   │   └── plugins/    # Plugin system (planned, not yet implemented)
│   ├── components/
│   │   └── Inspector.svelte  # Property inspector panel
│   └── paraglide/      # I18n message functions
├── app.css         # Global styles (Tailwind CSS)
├── app.d.ts        # Global TypeScript types
├── hooks.server.ts # Server-side hooks
└── hooks.ts        # Client-side hooks
```

### Key Configurations

- **Static Site Generation**: Uses `@sveltejs/adapter-static` with CSR-only mode
- **Test Environments**: Separate configs for client (browser) and server (node)
- **I18n**: Messages in `/messages/{locale}.json` (en, ko) with Paraglide.js
- **Build Target**: ES2022 for modern browsers
- **WASM Support**: Enabled for Loro CRDT functionality

### Current Implementation Status

The project has **two parallel implementations**:

1. **Svelte-native Implementation** (`/` route) - Primary approach
   - Reactive stores for state management
   - Mode-based editing (select/edit modes)
   - Inspector panel for properties and history
   - Floating UI for positioning
   - Loro CRDT-based history with undo/redo
   - Keyboard shortcuts (Cmd/Ctrl+Z, Shift+Cmd/Ctrl+Z)

2. **Class-based Selection System** (`/demo` route) - Experimental
   - Object-oriented `SelectionManager` interface
   - Event delegation for performance
   - Keyboard navigation (Tab, Arrows, Enter, Escape)
   - Copy/paste support

### Core Features

#### History Management (`/src/lib/core/history/`)

- Loro CRDT for conflict-free replicated data types
- Undo/redo with keyboard shortcuts
- 500ms debouncing for edit grouping
- Per-element change tracking
- Version limit of 50 for memory management
- Future: Real-time collaboration support

#### Selection System

- Click-based selection with visual overlay
- Multi-selection with Shift/Cmd+Click
- Keyboard navigation (Tab, Shift+Tab, Arrow keys)
- Mode switching (Select → Edit with Enter/Double-click)
- Escape key for deselection

### Data Attribute Conventions

- `data-editable="text|image|icon|link"` - Defines editable element type
- `data-max-length="50"` - Content constraints
- `data-repeatable="feature"` - Marks repeatable containers
- `data-min/max` - Container constraints

### Testing Strategy

- **Unit Tests**: Vitest with separate browser/server environments
- **E2E Tests**: Playwright on port 4173
- **Test Files**: `*.{test,spec}.{js,ts}` and `*.svelte.{test,spec}.{js,ts}`
- **Current Coverage**: Basic tests only, implementation tests needed

## Development Guidelines

1. **Incremental Development**: Build and verify features one at a time
2. **Code Organization**:
   - Keep files under 300 lines
   - Apply OCP (Open/Closed Principle)
   - Design for pluggability and easy deletion
3. **React/Svelte Components**:
   - Use proven hooks for abstraction
   - Prioritize pure functions
   - Create clear abstraction layers
4. **Documentation**: Write docs in Korean in `docs/` directory
5. **Features**: Document new features in `docs/features.md`

## Important Notes

- Avoid using `pnpm dev` due to potential hang-ups - use `pnpm build` or `pnpm test` instead
- The project uses `pnpm` as package manager (not npm or yarn)
- TypeScript is configured in strict mode - ensure all code is properly typed
- Always run `pnpm lint` and `pnpm check` before committing changes
- When developing, focus on the Svelte-native implementation (`/` route)
- The plugin system architecture is defined but not yet implemented

## Dual-Mode System (Planned)

The editor will support two distinct modes:

- **Design Mode**: For developers/designers to define editable zones
- **Content Mode**: For content editors with restricted, safe editing

Currently, only the basic editing functionality is implemented. Mode separation is planned for future phases.

## Implementation Philosophy

- 앞으로 최대한 지시하는 요구사항을 구현하는 가장 단순한 방법으로 구현해서 최대한 빨리 조금씩 보여주는 방식으로 구현한다!
- 개발을 할때마다 요구사항을 문서화 하면서 개발할 것!
