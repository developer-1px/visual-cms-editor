import { writable, derived, get } from "svelte/store"
import type { Writable, Readable } from "svelte/store"

export interface SelectionState {
  selectedElements: Set<string> // Using element IDs instead of direct references
  editingElement: string | null
  selectionType: Map<string, string> // elementId -> type
  overlayPosition: { top: number; left: number; visible: boolean } | null
}

export interface ElementState {
  id: string
  selected: boolean
  editing: boolean
  type: string
  attributes: Record<string, string>
  styles: Record<string, string>
  content?: string
}

// Main selection state
export const selectionState: Writable<SelectionState> = writable({
  selectedElements: new Set(),
  editingElement: null,
  selectionType: new Map(),
  overlayPosition: null,
})

// Element states registry
export const elementStates: Writable<Map<string, ElementState>> = writable(new Map())

// Derived stores for easier access
export const selectedElements: Readable<string[]> = derived(selectionState, ($state) =>
  Array.from($state.selectedElements),
)

export const isAnySelected: Readable<boolean> = derived(selectionState, ($state) => $state.selectedElements.size > 0)

export const editingElement: Readable<string | null> = derived(selectionState, ($state) => $state.editingElement)

// Helper functions
export function selectElement(elementId: string, type: string = "text"): void {
  selectionState.update((state) => {
    state.selectedElements.add(elementId)
    state.selectionType.set(elementId, type)
    return state
  })

  updateElementState(elementId, { selected: true, type })
}

export function deselectElement(elementId: string): void {
  selectionState.update((state) => {
    state.selectedElements.delete(elementId)
    state.selectionType.delete(elementId)
    if (state.editingElement === elementId) {
      state.editingElement = null
    }
    return state
  })

  updateElementState(elementId, { selected: false, editing: false })
}

export function deselectAll(): void {
  const state = get(selectionState)
  const selectedIds = Array.from(state.selectedElements)

  selectionState.set({
    selectedElements: new Set(),
    editingElement: null,
    selectionType: new Map(),
    overlayPosition: null,
  })

  // Update all element states
  selectedIds.forEach((id) => {
    updateElementState(id, { selected: false, editing: false })
  })
}

export function startEditing(elementId: string): void {
  selectionState.update((state) => {
    state.editingElement = elementId
    return state
  })

  updateElementState(elementId, { editing: true })
}

export function stopEditing(elementId: string): void {
  selectionState.update((state) => {
    if (state.editingElement === elementId) {
      state.editingElement = null
    }
    return state
  })

  updateElementState(elementId, { editing: false })
}

export function updateOverlayPosition(position: { top: number; left: number; visible: boolean } | null): void {
  selectionState.update((state) => {
    state.overlayPosition = position
    return state
  })
}

// Element state management
export function registerElement(elementId: string, initialState: Partial<ElementState>): void {
  elementStates.update((states) => {
    states.set(elementId, {
      id: elementId,
      selected: false,
      editing: false,
      type: "text",
      attributes: {},
      styles: {},
      ...initialState,
    })
    return states
  })
}

export function unregisterElement(elementId: string): void {
  elementStates.update((states) => {
    states.delete(elementId)
    return states
  })

  deselectElement(elementId)
}

export function updateElementState(elementId: string, updates: Partial<ElementState>): void {
  elementStates.update((states) => {
    const current = states.get(elementId)
    if (current) {
      states.set(elementId, { ...current, ...updates })
    }
    return states
  })
}

export function updateElementContent(elementId: string, content: string): void {
  updateElementState(elementId, { content })
}

export function updateElementAttributes(elementId: string, attributes: Record<string, string>): void {
  elementStates.update((states) => {
    const current = states.get(elementId)
    if (current) {
      states.set(elementId, {
        ...current,
        attributes: { ...current.attributes, ...attributes },
      })
    }
    return states
  })
}

export function updateElementStyles(elementId: string, styles: Record<string, string>): void {
  elementStates.update((states) => {
    const current = states.get(elementId)
    if (current) {
      states.set(elementId, {
        ...current,
        styles: { ...current.styles, ...styles },
      })
    }
    return states
  })
}

// Get element state by ID
export function getElementState(elementId: string): ElementState | undefined {
  return get(elementStates).get(elementId)
}

// Check if element is selected
export function isElementSelected(elementId: string): boolean {
  return get(selectionState).selectedElements.has(elementId)
}

// Check if element is being edited
export function isElementEditing(elementId: string): boolean {
  return get(selectionState).editingElement === elementId
}
