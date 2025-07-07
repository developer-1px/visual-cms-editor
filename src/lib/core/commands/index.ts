/**
 * Command Pattern exports
 *
 * 모든 Command 관련 타입과 함수들을 한곳에서 export
 */

// Export all types
export type {
  // Base types
  Command,
  CommandExecutor,
  StateStore,
  AppState,
  SelectionItem,

  // Command types
  AnyCommand,
  CommandByType,
  SelectElementCommand,
  DeselectElementCommand,
  ClearSelectionCommand,
  UpdateTextCommand,
  UpdateImageCommand,
  UpdateIconCommand,
  UpdateLinkCommand,
  AddElementCommand,
  RemoveElementCommand,
  MoveElementCommand,
  DuplicateElementCommand,
  AddTemplateCommand,
  RemoveTemplateCommand,
  ReorderTemplatesCommand,
  ToggleSidebarCommand,
  SetDevicePreviewCommand,
  StartEditingCommand,
  StopEditingCommand,
} from "./types"

// Export CommandStore class
export { CommandStore } from "./CommandStore"

// Export all executors
export { SelectElementExecutor, DeselectElementExecutor, ClearSelectionExecutor } from "./executors/SelectionExecutor"
export { UpdateTextExecutor } from "./executors/TextExecutor"
export { UpdateImageExecutor, UpdateIconExecutor, UpdateLinkExecutor } from "./executors/ContentExecutor"

// Export all store functions and stores
export {
  // Stores
  state,
  selectedElements,
  activeSelectionType,
  activeSelectionContext,
  canUndo,
  canRedo,
  leftSidebarOpen,
  rightPanelOpen,
  devicePreview,
  isEditing,
  editingElementId,

  // Functions
  dispatch,
  undo,
  redo,
  serialize,
  hydrate,
  getDebugInfo,
  getHistory,
  clearHistory,

  // Helper functions
  selectElement,
  deselectElement,
  clearSelection,
  updateText,
  updateImage,
  updateIcon,
  updateLink,
} from "./stores"

// Export logger
export { logger } from "./logger"
export type { LogEntry, LogLevel } from "./logger"

// Export action-based command system (legacy support)
export { 
  selectionCommandManager, 
  initializeCommandHandlers 
} from "./actions-index"
