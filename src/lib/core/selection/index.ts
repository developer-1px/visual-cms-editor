/**
 * Unified Selection System
 *
 * Single source of truth for all selection state
 * Simple, direct, and reactive
 */

import { writable, derived, get } from "svelte/store"
import {
  selectElement as dispatchSelectElement,
  clearSelection as dispatchClearSelection,
  deselectElement as dispatchDeselectElement,
  state as commandState,
} from "../commands/stores"

// Re-export types from entities
export * from "$lib/entities/selection/types"
import type { SelectedItem, SelectionType, SelectionContext, SelectionStyle } from "$lib/entities/selection/types"

// Stores
const selectedItemsStore = writable<Map<string, SelectedItem>>(new Map())

// Sync with Command Store - Command Store의 변경사항을 Selection Manager에 반영
if (typeof window !== 'undefined') {
  commandState.subscribe(($state) => {
    const commandSelections = $state.selection.selectedElements
    const currentSelections = get(selectedItemsStore)
    
    // Command Store와 Selection Manager 간의 동기화가 필요한 경우에만 업데이트
    const needsSync = commandSelections.size !== currentSelections.size || 
      Array.from(commandSelections.keys()).some(id => !currentSelections.has(id))
    
    if (needsSync) {
      selectedItemsStore.set(new Map(commandSelections))
    }
  })
}

// Derived stores
export const selectedElements = derived(selectedItemsStore, ($items) => {
  const elements = new Set<HTMLElement>()
  $items.forEach((item) => {
    if (item.element instanceof HTMLElement) {
      elements.add(item.element)
    }
  })
  return elements
})

export const selectedItems = selectedItemsStore

export const selectionCount = derived(selectedItemsStore, ($items) => $items.size)

export const isSelectionEmpty = derived(selectedItemsStore, ($items) => $items.size === 0)

// Selection bounds store
export interface BoundingRect {
  x: number
  y: number
  width: number
  height: number
}

export interface SelectionBounds {
  id: string
  elementId: string
  rect: BoundingRect
  type: SelectionType
  style: {
    outline: string
    overlayColor: string
  }
}

// Store for selection bounds
const selectionBoundsStore = writable<Map<string, SelectionBounds>>(new Map())

// Update bounds when selection changes
let updateTimer: ReturnType<typeof setTimeout> | null = null

function updateBounds() {
  const items = get(selectedItemsStore)
  const newBounds = new Map<string, SelectionBounds>()
  
  console.log('updateBounds called with items:', items.size)
  
  items.forEach((item: SelectedItem) => {
    console.log('Processing item:', {
      id: item.id,
      type: item.type,
      element: item.element,
      isHTMLElement: item.element instanceof HTMLElement,
      elementType: typeof item.element,
      elementConstructor: item.element?.constructor?.name
    })
    
    // Get element - with fallback lookup
    let element: HTMLElement | null = null
    
    if (item.element instanceof HTMLElement) {
      element = item.element
    } else {
      // Fallback: try to find by ID in the DOM
      const elementId = (item.element as any)?.id || item.id
      if (elementId) {
        element = document.getElementById(elementId)
        console.log('Found element by ID fallback:', elementId, element)
      }
    }
    
    if (!element) {
      console.warn('No element found for bounds calculation:', item)
      return
    }
    const rect = element.getBoundingClientRect()
    
    console.log('Element rect:', rect)
    
    // Find the editor container (main content area)
    const editorContainer = document.querySelector('.relative.flex-1.overflow-auto') as HTMLElement
    if (!editorContainer) {
      console.warn('Editor container not found')
      return
    }
    
    const editorRect = editorContainer.getBoundingClientRect()
    
    // Calculate absolute position relative to editor container
    const absoluteX = rect.left - editorRect.left + editorContainer.scrollLeft
    const absoluteY = rect.top - editorRect.top + editorContainer.scrollTop
    
    newBounds.set(item.id, {
      id: item.id,
      elementId: element.id || `element-${item.id}`,
      rect: {
        x: absoluteX,
        y: absoluteY,
        width: rect.width,
        height: rect.height
      },
      type: item.type,
      style: selectionStyles[item.type] || {
        outline: "2px solid rgb(99, 102, 241)",
        overlayColor: "rgb(79, 70, 229)"
      }
    })
  })
  
  selectionBoundsStore.set(newBounds)
}

// Subscribe to selection changes
selectedItemsStore.subscribe(() => {
  // Debounce updates
  if (updateTimer) clearTimeout(updateTimer)
  updateTimer = setTimeout(updateBounds, 10)
})

// Update bounds on scroll or resize
if (typeof window !== 'undefined') {
  let rafId: number | null = null
  
  const handleUpdate = () => {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      updateBounds()
      rafId = null
    })
  }
  
  // Global scroll listener
  window.addEventListener('scroll', handleUpdate, true)
  window.addEventListener('resize', handleUpdate)
  
  // Observe DOM changes
  const observer = new MutationObserver(() => {
    const items = get(selectedItemsStore)
    if (items.size > 0) {
      handleUpdate()
    }
  })
  
  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['style', 'class']
  })
}

// Derived store for easy access
export const selectionBounds = derived(selectionBoundsStore, $bounds => 
  Array.from($bounds.values())
)

// Selection size information
export interface SelectionSize {
  width: number
  height: number
  area: number
  x: number
  y: number
}

export const selectionSizes = derived(selectionBoundsStore, $bounds => {
  const sizes = new Map<string, SelectionSize>()
  
  $bounds.forEach((bound, id) => {
    const { width, height, x, y } = bound.rect
    sizes.set(id, {
      width: Math.round(width),
      height: Math.round(height),
      area: Math.round(width * height),
      x: Math.round(x),
      y: Math.round(y)
    })
  })
  
  return sizes
})

// Get size for currently selected elements
export const currentSelectionSize = derived(
  [selectedItemsStore, selectionSizes], 
  ([$items, $sizes]) => {
    const activeItems = Array.from($items.values())
    if (activeItems.length === 0) return null
    
    // For single selection, return the size
    if (activeItems.length === 1) {
      const firstItem = activeItems[0]
      return $sizes.get(firstItem.id) || null
    }
    
    // For multi-selection, calculate combined bounds
    const allSizes = activeItems
      .map(item => $sizes.get(item.id))
      .filter(size => size !== undefined)
    
    if (allSizes.length === 0) return null
    
    const minX = Math.min(...allSizes.map(s => s.x))
    const minY = Math.min(...allSizes.map(s => s.y))
    const maxX = Math.max(...allSizes.map(s => s.x + s.width))
    const maxY = Math.max(...allSizes.map(s => s.y + s.height))
    
    return {
      width: Math.round(maxX - minX),
      height: Math.round(maxY - minY),
      area: Math.round((maxX - minX) * (maxY - minY)),
      x: Math.round(minX),
      y: Math.round(minY)
    }
  }
)

// Manual update function
export function updateSelectionBounds() {
  updateBounds()
}

// Get bounds for specific ID
export function getBoundsById(id: string): SelectionBounds | undefined {
  return get(selectionBoundsStore).get(id)
}

// Get size for specific ID
export function getSizeById(id: string): SelectionSize | undefined {
  return get(selectionSizes).get(id)
}

// Get current selection size
export function getCurrentSize(): SelectionSize | null {
  return get(currentSelectionSize)
}

// Utility functions for size calculations
export function formatSize(size: SelectionSize | null): string {
  if (!size) return "No selection"
  return `${size.width}×${size.height}px`
}

export function formatSizeDetailed(size: SelectionSize | null): string {
  if (!size) return "No selection"
  return `W: ${size.width}px, H: ${size.height}px, Area: ${size.area}px²`
}

export function formatPosition(size: SelectionSize | null): string {
  if (!size) return "No position"
  return `X: ${size.x}px, Y: ${size.y}px`
}

// Clear all bounds
export function clearSelectionBounds() {
  selectionBoundsStore.set(new Map())
}

export const activeSelectionType = derived(selectedItemsStore, ($items) => {
  const first = Array.from($items.values())[0]
  return first?.type || null
})

export const activeSelectionContext = derived(selectedItemsStore, ($items) => {
  const first = Array.from($items.values())[0]
  return first?.context || null
})

export const selectedSectionIndex = derived(selectedItemsStore, ($items) => {
  for (const item of $items.values()) {
    if (item.type === "section" && typeof item.element === "number") {
      return item.element
    }
  }
  return null
})

// Style configuration
export const selectionStyles: Record<SelectionType, SelectionStyle> = {
  text: {
    outline: "2px solid rgb(59, 130, 246)", // blue-500
    overlayColor: "rgb(37, 99, 235)", // blue-600
  },
  image: {
    outline: "2px solid rgb(168, 85, 247)", // purple-500
    overlayColor: "rgb(147, 51, 234)", // purple-600
  },
  icon: {
    outline: "2px solid rgb(236, 72, 153)", // pink-500
    overlayColor: "rgb(219, 39, 119)", // pink-600
  },
  link: {
    outline: "2px solid rgb(14, 165, 233)", // sky-500
    overlayColor: "rgb(2, 132, 199)", // sky-600
  },
  repeatable: {
    outline: "2px solid rgb(34, 197, 94)", // green-500
    overlayColor: "rgb(22, 163, 74)", // green-600
  },
  section: {
    outline: "2px solid rgb(99, 102, 241)", // indigo-500
    overlayColor: "rgb(79, 70, 229)", // indigo-600
  },
}

export const activeSelectionStyle = derived(activeSelectionType, ($type) => {
  return $type ? selectionStyles[$type] : null
})

// Functions
function generateId(): string {
  return `sel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Define SelectionData type for better type safety
export type SelectionData = TemplateElement | undefined

export function select(
  element: HTMLElement | number,
  type: SelectionType,
  context: SelectionContext = "canvas",
  data?: SelectionData,
  options?: { multi?: boolean },
): string {
  const id = generateId()

  selectedItemsStore.update((items) => {
    // Clear existing selections unless multi-select
    if (!options?.multi) {
      items.clear()
    }

    // Add new selection
    items.set(id, { id, element, type, context, data })

    return items
  })

  // Dispatch to unified command store
  try {
    dispatchSelectElement(id, element, type, context, options?.multi || false, data)
  } catch (error) {
    console.warn("Failed to dispatch selection to command store:", error)
  }

  return id
}

export function deselect(elementOrId: HTMLElement | string): void {
  let elementId: string | null = null

  selectedItemsStore.update((items) => {
    if (typeof elementOrId === "string") {
      // Deselect by ID
      elementId = elementOrId
      items.delete(elementOrId)
    } else {
      // Deselect by element
      for (const [id, item] of items.entries()) {
        if (item.element === elementOrId) {
          elementId = id
          items.delete(id)
          break
        }
      }
    }
    return items
  })

  // Dispatch to unified command store
  if (elementId) {
    try {
      dispatchDeselectElement(elementId)
    } catch (error) {
      console.warn("Failed to dispatch deselection to command store:", error)
    }
  }
}

export function clear(): void {
  selectedItemsStore.update((items) => {
    items.clear()
    return items
  })

  // Dispatch to unified command store
  try {
    dispatchClearSelection()
  } catch (error) {
    console.warn("Failed to dispatch clear selection to command store:", error)
  }
}

export function isSelected(element: HTMLElement, type?: SelectionType, context?: SelectionContext): boolean {
  const items = get(selectedItemsStore)
  for (const item of items.values()) {
    if (item.element === element) {
      // If type and context are specified, check them too
      if (type && item.type !== type) continue
      if (context && item.context !== context) continue
      return true
    }
  }
  return false
}

export function getSelection(): SelectedItem[] {
  return Array.from(get(selectedItemsStore).values())
}

// Configuration for compatibility with old API
const defaultConfig = {
  mode: "select" as const,
  allowCrossContext: true,
  styles: selectionStyles,
}

export function getConfig() {
  return defaultConfig
}

// Import template element types
import type { TemplateElement } from "$lib/entities/template/models"

// Model Element Registry - type-safe implementation
class ModelElementRegistry {
  private modelToElement = new Map<TemplateElement, HTMLElement>()
  private elementToModel = new Map<HTMLElement, TemplateElement>()

  register(model: TemplateElement, element: HTMLElement) {
    this.modelToElement.set(model, element)
    this.elementToModel.set(element, model)
  }

  unregister(model: TemplateElement) {
    const element = this.modelToElement.get(model)
    if (element) {
      this.elementToModel.delete(element)
    }
    this.modelToElement.delete(model)
  }

  getModel(element: HTMLElement): TemplateElement | undefined {
    return this.elementToModel.get(element)
  }

  getElement(model: TemplateElement): HTMLElement | undefined {
    return this.modelToElement.get(model)
  }
}

export const modelElementRegistry = new ModelElementRegistry()

// Create a simple selection manager object for compatibility
export const selectionManager = {
  select,
  deselect,
  clear,
  isSelected,
  getSelection,
  getConfig,
}

// Selection bounds are now exported directly from this file
