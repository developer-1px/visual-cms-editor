/**
 * Command Pattern Entity Types
 * 
 * 명령 패턴과 상태 관리 관련 모든 타입 정의
 */

import type { SelectionType, SelectionContext, SelectionState } from "../selection/types"
import type { Template } from "../template/types"
import type { EditableModel, FrameModel } from "../template/models"

// Base Command Interface
export interface Command<TPayload = unknown> {
  id: string // 고유 ID (UUID)
  type: string // 커맨드 타입
  payload: TPayload // 커맨드 데이터
  timestamp: number // 실행 시간
  userId?: string // 실행한 사용자 (협업용)
  meta?: {
    canUndo?: boolean
    description?: string
    merge?: boolean
  }
}

// Command Executor Interface
export interface CommandExecutor<TState> {
  execute(state: TState, command: Command): TState
  undo(state: TState, command: Command): TState
  redo(state: TState, command: Command): TState
}

// State Store Interface
export interface StateStore<TState> {
  getState(): TState
  dispatch(command: Command): void
  subscribe(listener: (state: TState) => void): () => void
  undo(): void
  redo(): void
  canUndo(): boolean
  canRedo(): boolean
  getHistory(): Command[]
  serialize(): string
  hydrate(serialized: string): void
  applyRemoteCommand(command: Command): void
}

// Application State
export interface AppState {
  elements: Map<string, EditableModel | FrameModel>
  selection: SelectionState
  templates: Template[]
  ui: UIState
  history: HistoryState
}

export interface UIState {
  leftSidebarOpen: boolean
  rightPanelOpen: boolean
  devicePreview: "mobile" | "tablet" | "desktop" | "full"
  isEditing: boolean
  editingElementId: string | null
  templateSelectorOpen: boolean
  debugPanelOpen: boolean
  activeTab: "templates" | "inspector" | "history" | "debug"
  selectedSectionIndex: number | null
}

export interface HistoryState {
  canUndo: boolean
  canRedo: boolean
  lastCommand: Command | null
}

// Command Action Types
export type CommandType = "copy" | "cut" | "paste" | "delete"

export interface CommandHandler {
  canHandle(element: HTMLElement, selectionType: string): boolean
  copy(element: HTMLElement): Promise<void>
  cut(element: HTMLElement): Promise<void>
  paste(element: HTMLElement): Promise<void>
  delete(element: HTMLElement): Promise<void>
  readonly type: string
}

export interface SelectionCommandManager {
  registerHandler(handler: CommandHandler): void
  unregisterHandler(type: string): void
  executeCommand(command: CommandType, element: HTMLElement, selectionType: string): Promise<void>
  hasHandler(selectionType: string): boolean
  getRegisteredTypes(): string[]
}

export interface CommandResult {
  success: boolean
  message?: string
  data?: unknown
}

export interface CommandContext {
  element: HTMLElement
  selectionType: string
  metadata?: Record<string, unknown>
}

// Specific Command Payload Types
export interface SelectElementCommand extends Command {
  type: "SELECT_ELEMENT"
  payload: {
    elementId: string
    element: HTMLElement | number
    selectionType: SelectionType
    context: SelectionContext
    multi: boolean
    data?: unknown
  }
}

export interface DeselectElementCommand extends Command {
  type: "DESELECT_ELEMENT"
  payload: {
    elementId: string
  }
}

export interface ClearSelectionCommand extends Command {
  type: "CLEAR_SELECTION"
  payload: {}
}

export interface UpdateTextCommand extends Command {
  type: "UPDATE_TEXT"
  payload: {
    elementId: string
    oldText: string
    newText: string
  }
}

export interface UpdateImageCommand extends Command {
  type: "UPDATE_IMAGE"
  payload: {
    elementId: string
    oldSrc: string
    newSrc: string
    oldAlt?: string
    newAlt?: string
  }
}

export interface UpdateIconCommand extends Command {
  type: "UPDATE_ICON"
  payload: {
    elementId: string
    oldPathData: string
    newPathData: string
  }
}

export interface UpdateLinkCommand extends Command {
  type: "UPDATE_LINK"
  payload: {
    elementId: string
    oldHref: string
    newHref: string
    oldText?: string
    newText?: string
  }
}

export interface ToggleSidebarCommand extends Command {
  type: "TOGGLE_SIDEBAR"
  payload: {
    side: "left" | "right"
    open?: boolean
  }
}

export interface SetDevicePreviewCommand extends Command {
  type: "SET_DEVICE_PREVIEW"
  payload: {
    device: "mobile" | "tablet" | "desktop" | "full"
  }
}

export interface StartEditingCommand extends Command {
  type: "START_EDITING"
  payload: {
    elementId: string
  }
}

export interface StopEditingCommand extends Command {
  type: "STOP_EDITING"
  payload: {}
}

export interface ToggleTemplateSelectorCommand extends Command {
  type: "TOGGLE_TEMPLATE_SELECTOR"
  payload: {
    open?: boolean
  }
}

export interface ToggleDebugPanelCommand extends Command {
  type: "TOGGLE_DEBUG_PANEL"
  payload: {
    open?: boolean
  }
}

export interface SetActiveTabCommand extends Command {
  type: "SET_ACTIVE_TAB"
  payload: {
    tab: "templates" | "inspector" | "history" | "debug"
  }
}

export interface SetSelectedSectionIndexCommand extends Command {
  type: "SET_SELECTED_SECTION_INDEX"
  payload: {
    index: number | null
  }
}

export type AnyCommand = 
  | SelectElementCommand
  | DeselectElementCommand
  | ClearSelectionCommand
  | UpdateTextCommand
  | UpdateImageCommand
  | UpdateIconCommand
  | UpdateLinkCommand
  | ToggleSidebarCommand
  | SetDevicePreviewCommand
  | StartEditingCommand
  | StopEditingCommand
  | ToggleTemplateSelectorCommand
  | ToggleDebugPanelCommand
  | SetActiveTabCommand
  | SetSelectedSectionIndexCommand