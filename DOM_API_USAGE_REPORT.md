# DOM API Usage Report

## Overview

This report documents all direct DOM API usage in the visual-cms-editor codebase, identifying patterns that could be refactored to more Svelte-native approaches.

## Summary of Findings

### Files with Heavy DOM Manipulation

1. **src/lib/core/selection/index.ts** - Class-based selection system with extensive DOM manipulation
2. **src/lib/core/selection/ReactiveSelectionManager.ts** - Mixed approach with Svelte stores + DOM queries
3. **src/lib/core/actions/handlers/TextActionHandler.ts** - Direct DOM manipulation for text editing
4. **src/lib/components/Portal.svelte** - DOM manipulation for portal functionality
5. **src/lib/core/parsers/TemplateParser.ts** - DOM parsing for template conversion

### DOM API Usage Patterns Found

#### 1. Document/Element Querying

- `document.querySelector()` / `document.querySelectorAll()`
- `element.querySelector()` / `element.querySelectorAll()`
- `element.closest()`
- `document.getElementById()` (not found in current codebase)
- `document.getElementsBy*()` (not found in current codebase)

#### 2. Element Creation/Manipulation

- `document.createElement()`
- `document.createTextNode()` (used in TextActionHandler)
- `element.appendChild()`
- `element.removeChild()`
- `element.innerHTML` (direct assignment)
- `element.textContent` (direct assignment)

#### 3. Class/Style Manipulation

- `element.classList.add()`
- `element.classList.remove()`
- `element.style.setProperty()`
- `element.setAttribute()`
- `element.removeAttribute()`

#### 4. Event Handling

- `document.addEventListener()`
- `element.addEventListener()`
- `document.removeEventListener()`
- `element.removeEventListener()`

#### 5. Layout/Positioning

- `element.getBoundingClientRect()`
- `window.getComputedStyle()` (found in SelectionOverlay)

## Detailed Analysis by File

### 1. src/lib/core/selection/index.ts

**Purpose**: Original class-based selection system
**DOM APIs Used**:

- Heavy use of `document.addEventListener()` for global event handling
- `document.createElement()` to create overlay UI
- `element.classList.add/remove()` for selection state
- `element.style.setProperty()` for positioning
- `document.querySelectorAll()` for finding editable elements
- `element.getBoundingClientRect()` for positioning calculations
- Direct `innerHTML` assignment for overlay buttons
- `document.body.appendChild()` for adding overlay to DOM

**Recommendation**: This entire file represents the old approach and should be deprecated in favor of the Svelte-native implementation.

### 2. src/lib/core/selection/ReactiveSelectionManager.ts

**Purpose**: Bridge between Svelte stores and DOM manipulation
**DOM APIs Used**:

- `document.querySelector()` to find elements by data-element-id
- `document.querySelectorAll()` for navigation between editable elements
- `element.focus()` / `element.blur()` for edit mode
- `element.textContent` assignment for paste/delete operations
- `element.getBoundingClientRect()` for overlay positioning
- `document.addEventListener()` for global keyboard/click handlers

**Recommendation**: Refactor to use Svelte's bind:this and reactive statements instead of querySelector. Use Svelte actions for event handling.

### 3. src/lib/core/actions/handlers/TextActionHandler.ts

**Purpose**: Handle text copy/cut/paste operations
**DOM APIs Used**:

- `document.createElement('textarea')` for clipboard fallback
- `document.body.appendChild/removeChild()` for temporary textarea
- `document.execCommand('copy')` as fallback
- `element.textContent` / `element.innerText` reading and assignment
- `element.dispatchEvent()` to trigger input events
- `element.animate()` for visual feedback
- `DOMParser` for HTML to text conversion

**Recommendation**: Move clipboard operations to a Svelte store. Use Svelte animations instead of Web Animations API.

### 4. src/lib/components/Portal.svelte

**Purpose**: Render content in a different DOM location
**DOM APIs Used**:

- `document.querySelector()` to find target
- `targetElement.appendChild()` to move portal content
- `portalElement.parentNode.removeChild()` for cleanup

**Recommendation**: This is acceptable use of DOM APIs for portal functionality, though could potentially use Svelte's teleport-like features when available.

### 5. src/lib/core/parsers/TemplateParser.ts

**Purpose**: Parse HTML strings into template models
**DOM APIs Used**:

- `DOMParser` for HTML parsing
- `doc.querySelectorAll()` to find elements by selector
- `element.setAttribute()` to add data attributes
- `element.getAttribute()` to read attributes
- Various DOM traversal APIs

**Recommendation**: This is appropriate use of DOM APIs for parsing. Consider using a virtual DOM approach for better testability.

### 6. src/lib/actions/hotkeys.ts

**Purpose**: Svelte action for keyboard shortcuts
**DOM APIs Used**:

- `node.addEventListener('keydown')`
- `window.addEventListener('keydown')`
- Corresponding `removeEventListener` calls

**Recommendation**: This is the correct Svelte pattern - DOM manipulation is encapsulated in a Svelte action.

### 7. src/lib/components/SelectionOverlay.svelte

**Purpose**: Floating UI overlay for selected elements
**DOM APIs Used**:

- `window.addEventListener('resize'/'scroll')` for position updates
- `@floating-ui/dom` library handles positioning calculations

**Recommendation**: Good use of Svelte patterns with bind:this. The window event listeners are appropriately managed in onMount.

## Recommendations for Refactoring

### High Priority

1. **Deprecate src/lib/core/selection/index.ts** - Replace with fully reactive Svelte implementation
2. **Refactor ReactiveSelectionManager.ts** to eliminate querySelector usage:
   - Use a Map/WeakMap to track element references
   - Pass element references through props/context
   - Use Svelte actions for element-specific behavior

### Medium Priority

3. **Create Svelte stores for clipboard operations** instead of class-based handlers
4. **Use Svelte's animation directives** instead of Web Animations API
5. **Replace direct textContent manipulation** with bound variables

### Low Priority

6. **Consider virtual DOM for template parsing** to improve testability
7. **Evaluate need for Portal.svelte** when Svelte adds native teleport support

### Best Practices Going Forward

1. **Use bind:this** to get element references instead of querySelector
2. **Use Svelte actions** for reusable DOM behavior
3. **Use reactive statements ($:)** instead of manual DOM updates
4. **Use Svelte stores** for shared state instead of DOM as state storage
5. **Encapsulate DOM manipulation** in actions or component lifecycle hooks
6. **Prefer declarative approaches** over imperative DOM manipulation

## Migration Strategy

1. Start by refactoring the selection system to be fully reactive
2. Create a element reference registry to replace querySelector usage
3. Move clipboard and action handlers to Svelte stores
4. Gradually replace imperative updates with reactive patterns
5. Maintain backwards compatibility during transition
