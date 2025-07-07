/**
 * Svelte Store Integration for Command Pattern
 *
 * CommandStore를 Svelte의 reactive store와 통합하여
 * 컴포넌트에서 쉽게 사용할 수 있도록 래핑
 */

import { writable, derived, get } from "svelte/store"
import { CommandStore } from "./CommandStore"
import { generateUUID } from "../utils/uuid"
import type { AppState, Command, AnyCommand } from "./types"

// Import all executors
import { SelectElementExecutor, DeselectElementExecutor, ClearSelectionExecutor } from "./executors/SelectionExecutor"
import { UpdateTextExecutor } from "./executors/TextExecutor"
import { UpdateImageExecutor, UpdateIconExecutor, UpdateLinkExecutor } from "./executors/ContentExecutor"
import { 
  ToggleSidebarExecutor, 
  SetDevicePreviewExecutor, 
  StartEditingExecutor, 
  StopEditingExecutor,
  ToggleTemplateSelectorExecutor,
  ToggleDebugPanelExecutor,
  SetActiveTabExecutor,
  SetSelectedSectionIndexExecutor
} from "./executors/UIExecutor"

// Initial application state
const initialState: AppState = {
  elements: new Map(),
  selection: {
    selectedElements: new Map(),
    activeType: null,
    activeContext: null,
  },
  templates: [],
  ui: {
    leftSidebarOpen: true,
    rightPanelOpen: true,
    devicePreview: "full",
    isEditing: false,
    editingElementId: null,
    templateSelectorOpen: false,
    debugPanelOpen: true,
    activeTab: "debug",
    selectedSectionIndex: null,
  },
  history: {
    canUndo: false,
    canRedo: false,
    lastCommand: null,
  },
}

// Create command store instance
const commandStore = new CommandStore<AppState>(initialState)

// Register all executors
commandStore.registerExecutor("SELECT_ELEMENT", new SelectElementExecutor())
commandStore.registerExecutor("DESELECT_ELEMENT", new DeselectElementExecutor())
commandStore.registerExecutor("CLEAR_SELECTION", new ClearSelectionExecutor())
commandStore.registerExecutor("UPDATE_TEXT", new UpdateTextExecutor())
commandStore.registerExecutor("UPDATE_IMAGE", new UpdateImageExecutor())
commandStore.registerExecutor("UPDATE_ICON", new UpdateIconExecutor())
commandStore.registerExecutor("UPDATE_LINK", new UpdateLinkExecutor())
commandStore.registerExecutor("TOGGLE_SIDEBAR", new ToggleSidebarExecutor())
commandStore.registerExecutor("SET_DEVICE_PREVIEW", new SetDevicePreviewExecutor())
commandStore.registerExecutor("START_EDITING", new StartEditingExecutor())
commandStore.registerExecutor("STOP_EDITING", new StopEditingExecutor())
commandStore.registerExecutor("TOGGLE_TEMPLATE_SELECTOR", new ToggleTemplateSelectorExecutor())
commandStore.registerExecutor("TOGGLE_DEBUG_PANEL", new ToggleDebugPanelExecutor())
commandStore.registerExecutor("SET_ACTIVE_TAB", new SetActiveTabExecutor())
commandStore.registerExecutor("SET_SELECTED_SECTION_INDEX", new SetSelectedSectionIndexExecutor())

// Create Svelte store wrapper
export const state = writable<AppState>(commandStore.getState())

// Subscribe to command store changes
commandStore.subscribe((newState) => {
  state.set(newState)
})

// Derived stores for common selections
export const selectedElements = derived(state, ($state) => $state.selection.selectedElements)

export const activeSelectionType = derived(state, ($state) => $state.selection.activeType)

export const activeSelectionContext = derived(state, ($state) => $state.selection.activeContext)

export const canUndo = derived(state, ($state) => $state.history.canUndo)
export const canRedo = derived(state, ($state) => $state.history.canRedo)

export const leftSidebarOpen = derived(state, ($state) => $state.ui.leftSidebarOpen)
export const rightPanelOpen = derived(state, ($state) => $state.ui.rightPanelOpen)
export const devicePreview = derived(state, ($state) => $state.ui.devicePreview)
export const isEditing = derived(state, ($state) => $state.ui.isEditing)
export const editingElementId = derived(state, ($state) => $state.ui.editingElementId)
export const templateSelectorOpen = derived(state, ($state) => $state.ui.templateSelectorOpen)
export const debugPanelOpen = derived(state, ($state) => $state.ui.debugPanelOpen)
export const activeTab = derived(state, ($state) => $state.ui.activeTab)
export const selectedSectionIndex = derived(state, ($state) => $state.ui.selectedSectionIndex)

// Additional computed stores
export const templates = derived(state, ($state) => $state.templates)
export const elements = derived(state, ($state) => $state.elements)
export const selectionCount = derived(selectedElements, ($selectedElements) => $selectedElements.size)
export const hasSelection = derived(selectionCount, ($count) => $count > 0)

// Command dispatch function
export function dispatch(command: Omit<AnyCommand, "id" | "timestamp">): void {
  const fullCommand: Command = {
    ...command,
    id: generateUUID(),
    timestamp: Date.now(),
  } as Command

  commandStore.dispatch(fullCommand)
}

// Undo/Redo functions
export const undo = () => commandStore.undo()
export const redo = () => commandStore.redo()

// State serialization
export const serialize = () => commandStore.serialize()
export const hydrate = (data: string) => commandStore.hydrate(data)

// Debug helpers
export const getDebugInfo = () => commandStore.getDebugInfo()
export const getHistory = () => commandStore.getHistory()
export const clearHistory = () => commandStore.clearHistory()

// Helper functions for common operations

/**
 * Select an element
 */
export function selectElement(
  elementId: string,
  element: HTMLElement | number,
  selectionType: AppState["selection"]["activeType"],
  context: "canvas" | "sidebar" = "canvas",
  multi = false,
  data?: unknown,
): void {
  dispatch({
    type: "SELECT_ELEMENT",
    payload: {
      elementId,
      element,
      selectionType: selectionType!,
      context,
      multi,
      data,
    },
    meta: {
      description: `Select ${selectionType} element`,
    },
  })
}

/**
 * Deselect an element
 */
export function deselectElement(elementId: string): void {
  dispatch({
    type: "DESELECT_ELEMENT",
    payload: { elementId },
    meta: {
      description: "Deselect element",
    },
  })
}

/**
 * Clear all selections
 */
export function clearSelection(): void {
  dispatch({
    type: "CLEAR_SELECTION",
    payload: {},
    meta: {
      description: "Clear all selections",
    },
  })
}

/**
 * Update text content
 */
export function updateText(elementId: string, oldText: string, newText: string, merge = false): void {
  dispatch({
    type: "UPDATE_TEXT",
    payload: {
      elementId,
      oldText,
      newText,
    },
    meta: {
      description: `Update text`,
      merge, // Allow merging consecutive text edits
    },
  })
}

/**
 * Update image
 */
export function updateImage(elementId: string, oldSrc: string, newSrc: string, oldAlt?: string, newAlt?: string): void {
  dispatch({
    type: "UPDATE_IMAGE",
    payload: {
      elementId,
      oldSrc,
      newSrc,
      oldAlt,
      newAlt,
    },
    meta: {
      description: "Update image",
    },
  })
}

/**
 * Update icon
 */
export function updateIcon(elementId: string, oldPathData: string, newPathData: string): void {
  dispatch({
    type: "UPDATE_ICON",
    payload: {
      elementId,
      oldPathData,
      newPathData,
    },
    meta: {
      description: "Update icon",
    },
  })
}

/**
 * Update link
 */
export function updateLink(
  elementId: string,
  oldHref: string,
  newHref: string,
  oldText?: string,
  newText?: string,
): void {
  dispatch({
    type: "UPDATE_LINK",
    payload: {
      elementId,
      oldHref,
      newHref,
      oldText,
      newText,
    },
    meta: {
      description: "Update link",
    },
  })
}

/**
 * Toggle sidebar
 */
export function toggleSidebar(side: "left" | "right", open?: boolean): void {
  dispatch({
    type: "TOGGLE_SIDEBAR",
    payload: { side, open },
    meta: {
      description: `Toggle ${side} sidebar`,
    },
  })
}

/**
 * Set device preview
 */
export function setDevicePreview(device: "mobile" | "tablet" | "desktop" | "full"): void {
  dispatch({
    type: "SET_DEVICE_PREVIEW",
    payload: { device },
    meta: {
      description: `Set device preview to ${device}`,
    },
  })
}

/**
 * Start editing
 */
export function startEditing(elementId: string): void {
  dispatch({
    type: "START_EDITING",
    payload: { elementId },
    meta: {
      description: "Start editing element",
    },
  })
}

/**
 * Stop editing
 */
export function stopEditing(): void {
  dispatch({
    type: "STOP_EDITING",
    payload: {},
    meta: {
      description: "Stop editing",
    },
  })
}

/**
 * Toggle template selector
 */
export function toggleTemplateSelector(open?: boolean): void {
  dispatch({
    type: "TOGGLE_TEMPLATE_SELECTOR",
    payload: { open },
    meta: {
      description: "Toggle template selector",
    },
  })
}

/**
 * Toggle debug panel
 */
export function toggleDebugPanel(open?: boolean): void {
  dispatch({
    type: "TOGGLE_DEBUG_PANEL",
    payload: { open },
    meta: {
      description: "Toggle debug panel",
    },
  })
}

/**
 * Set active tab
 */
export function setActiveTab(tab: "templates" | "inspector" | "history" | "debug"): void {
  dispatch({
    type: "SET_ACTIVE_TAB",
    payload: { tab },
    meta: {
      description: `Set active tab to ${tab}`,
    },
  })
}

/**
 * Set selected section index
 */
export function setSelectedSectionIndex(index: number | null): void {
  dispatch({
    type: "SET_SELECTED_SECTION_INDEX",
    payload: { index },
    meta: {
      description: `Set selected section index to ${index}`,
    },
  })
}

// Note: Event listeners should be set up in the view layer (e.g., EditorManager)
// to maintain proper separation of concerns
