import { selectionStore } from "$lib/stores/selection.svelte"

export interface SelectableOptions {
  id: string
  type: string
  initialContent?: string
  onEdit?: (element: HTMLElement) => void
  onSelect?: (element: HTMLElement) => void
  onDeselect?: (element: HTMLElement) => void
}

export function selectable(node: HTMLElement, options: SelectableOptions) {
  let { id, type, initialContent, onEdit, onSelect, onDeselect } = options

  // Register element in store
  selectionStore.registerElement(id, {
    type,
    content: initialContent || node.textContent || "",
  })

  // Set initial data attributes for CSS styling
  node.setAttribute("data-element-id", id)
  node.setAttribute("data-editable", type)

  // Handle click events
  function handleClick(e: MouseEvent) {
    console.log("Click on element:", id, type)
    e.stopPropagation()

    const isShift = e.shiftKey
    const isCtrlCmd = e.ctrlKey || e.metaKey

    if (isShift || isCtrlCmd) {
      // Multi-select
      if (selectionStore.isSelected(id)) {
        selectionStore.deselectElement(id)
        onDeselect?.(node)
      } else {
        selectionStore.selectElement(id, type)
        onSelect?.(node)
      }
    } else {
      // Single select
      if (selectionStore.selectedElements.length > 0 && !selectionStore.isSelected(id)) {
        selectionStore.deselectAll()
      }
      selectionStore.selectElement(id, type)
      onSelect?.(node)
    }
  }

  // Handle double-click for editing
  function handleDoubleClick(e: MouseEvent) {
    e.stopPropagation()
    if (selectionStore.isSelected(id)) {
      selectionStore.startEditing(id)
      onEdit?.(node)
    }
  }

  // Handle content changes
  function handleInput() {
    if (node.contentEditable === "true") {
      selectionStore.updateElementContent(id, node.textContent || "")
    }
  }

  // React to state changes using $effect
  $effect(() => {
    const state = selectionStore.getElementState(id)
    console.log("$effect running for element:", id, "state:", state)
    if (!state) return

    console.log("Applying state to element:", id, state)

    // Update data attributes based on state
    node.setAttribute("data-selected", state.selected.toString())
    node.setAttribute("data-editing", state.editing.toString())
    // data-editable already contains the type information

    // Apply attributes from state
    Object.entries(state.attributes).forEach(([key, value]) => {
      node.setAttribute(key, value)
    })

    // Apply styles from state
    Object.entries(state.styles).forEach(([key, value]) => {
      node.style.setProperty(key, value)
    })

    // Update content if changed externally
    if (state.content !== undefined && node.textContent !== state.content && !state.editing) {
      node.textContent = state.content
    }

    // Handle contentEditable
    if (state.editing && type === "text") {
      node.contentEditable = "true"
      node.focus()
    } else {
      node.contentEditable = "false"
    }

    console.log("Element attributes after update:", {
      "data-selected": node.getAttribute("data-selected"),
      "data-editing": node.getAttribute("data-editing"),
      "data-selection-type": node.getAttribute("data-selection-type"),
    })
  })

  // Add event listeners
  node.addEventListener("click", handleClick)
  node.addEventListener("dblclick", handleDoubleClick)
  node.addEventListener("input", handleInput)

  return {
    update(newOptions: SelectableOptions) {
      // Update options if needed
      if (newOptions.id !== id) {
        selectionStore.unregisterElement(id)
        id = newOptions.id
        type = newOptions.type
        initialContent = newOptions.initialContent
        onEdit = newOptions.onEdit
        onSelect = newOptions.onSelect
        onDeselect = newOptions.onDeselect

        selectionStore.registerElement(id, {
          type,
          content: initialContent || node.textContent || "",
        })

        node.setAttribute("data-element-id", id)
        node.setAttribute("data-editable", type)
      }
    },

    destroy() {
      // Clean up
      node.removeEventListener("click", handleClick)
      node.removeEventListener("dblclick", handleDoubleClick)
      node.removeEventListener("input", handleInput)
      selectionStore.unregisterElement(id)
    },
  }
}
