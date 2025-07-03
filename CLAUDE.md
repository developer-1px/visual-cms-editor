# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Visual CMS Editor - A SvelteKit-based content management system with visual editing capabilities.

**Tech Stack:**
- SvelteKit 2.16.0 with Svelte 5.0.0
- TypeScript 5.0.0 (strict mode)
- Tailwind CSS 4.0.0
- Vite 6.2.6
- Paraglide.js for i18n (Korean/English)

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
│   │   ├── selection/  # SelectionManager class implementation
│   │   └── plugins/    # Plugin system (planned, not yet implemented)
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
- **Styling**: Tailwind CSS with Forms and Typography plugins
- **Positioning**: @floating-ui/dom for overlay positioning

### Current Implementation Status

The project has **two parallel implementations**:

1. **Class-based Selection System** (`/demo` route)
   - Object-oriented `SelectionManager` interface
   - Event delegation for performance
   - Keyboard navigation (Tab, Arrows, Enter, Escape)
   - Copy/paste support

2. **Svelte-native Implementation** (`/` route)
   - Reactive stores for state management
   - Mode-based editing (select/edit modes)
   - Inspector panel for properties
   - Floating UI for positioning

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
- When developing, choose between the two implementation approaches based on your needs
- The plugin system architecture is defined but not yet implemented

## Implementation Philosophy

- 앞으로 최대한 지시하는 요구사항을 구현하는 가장 단순한 방법으로 구현해서 최대한 빨리 조금씩 보여주는 방식으로 구현한다!
- 개발을 할때마다 요구사항을 문서화 하면서 개발할 것!