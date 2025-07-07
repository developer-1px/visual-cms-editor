/**
 * Selection Command Executors
 *
 * 선택 관련 명령어들을 처리하는 Executor들
 */

import type {
  CommandExecutor,
  AppState,
  SelectElementCommand,
  DeselectElementCommand,
  ClearSelectionCommand,
  SelectionItem,
} from "../types"

/**
 * SELECT_ELEMENT Executor
 */
export class SelectElementExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: SelectElementCommand): AppState {
    const { elementId, element, selectionType, context, multi, data } = command.payload

    // Clone selection map
    const newSelectedElements = multi ? new Map(state.selection.selectedElements) : new Map<string, SelectionItem>()

    // Add new selection
    newSelectedElements.set(elementId, {
      id: elementId,
      element,
      type: selectionType,
      context,
      data,
    })

    // Note: DOM updates should be handled reactively by the view layer
    // based on the state changes, not directly in the executor

    return {
      ...state,
      selection: {
        ...state.selection,
        selectedElements: newSelectedElements,
        activeType: selectionType,
        activeContext: context,
      },
    }
  }

  undo(state: AppState, command: SelectElementCommand): AppState {
    const { elementId, element } = command.payload

    // Clone selection map
    const newSelectedElements = new Map(state.selection.selectedElements)
    newSelectedElements.delete(elementId)

    // Note: DOM updates should be handled reactively by the view layer

    // Determine new active type and context
    const remainingItems = Array.from(newSelectedElements.values())
    const activeType = remainingItems.length > 0 ? remainingItems[0].type : null
    const activeContext = remainingItems.length > 0 ? remainingItems[0].context : null

    return {
      ...state,
      selection: {
        ...state.selection,
        selectedElements: newSelectedElements,
        activeType,
        activeContext,
      },
    }
  }

  redo(state: AppState, command: SelectElementCommand): AppState {
    return this.execute(state, command)
  }
}

/**
 * DESELECT_ELEMENT Executor
 */
export class DeselectElementExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: DeselectElementCommand): AppState {
    const { elementId } = command.payload

    // Get the item to remove
    const itemToRemove = state.selection.selectedElements.get(elementId)
    if (!itemToRemove) return state

    // Clone selection map
    const newSelectedElements = new Map(state.selection.selectedElements)
    newSelectedElements.delete(elementId)

    // Note: DOM updates should be handled reactively by the view layer

    // Determine new active type and context
    const remainingItems = Array.from(newSelectedElements.values())
    const activeType = remainingItems.length > 0 ? remainingItems[0].type : null
    const activeContext = remainingItems.length > 0 ? remainingItems[0].context : null

    return {
      ...state,
      selection: {
        ...state.selection,
        selectedElements: newSelectedElements,
        activeType,
        activeContext,
      },
    }
  }

  undo(state: AppState): AppState {
    // To undo a deselect, we need to restore the selection
    // This requires storing the original selection item in the command
    // For now, we'll just return the current state
    // TODO: Implement proper undo by storing original selection data
    return state
  }

  redo(state: AppState, command: DeselectElementCommand): AppState {
    return this.execute(state, command)
  }
}

/**
 * CLEAR_SELECTION Executor
 */
export class ClearSelectionExecutor implements CommandExecutor<AppState> {
  private previousSelection: Map<string, SelectionItem> | null = null

  execute(state: AppState): AppState {
    // Store previous selection for undo
    this.previousSelection = new Map(state.selection.selectedElements)

    // Note: DOM updates should be handled reactively by the view layer

    return {
      ...state,
      selection: {
        ...state.selection,
        selectedElements: new Map(),
        activeType: null,
        activeContext: null,
      },
    }
  }

  undo(state: AppState): AppState {
    if (!this.previousSelection) return state

    // Note: DOM updates should be handled reactively by the view layer

    // Determine active type and context
    const items = Array.from(this.previousSelection.values())
    const activeType = items.length > 0 ? items[0].type : null
    const activeContext = items.length > 0 ? items[0].context : null

    return {
      ...state,
      selection: {
        ...state.selection,
        selectedElements: new Map(this.previousSelection),
        activeType,
        activeContext,
      },
    }
  }

  redo(state: AppState, command: ClearSelectionCommand): AppState {
    return this.execute(state, command)
  }
}
