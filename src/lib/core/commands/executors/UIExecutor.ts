/**
 * UI Command Executors
 * UI 상태 변경을 위한 커맨드 실행자들
 */

import type { CommandExecutor } from "../types"
import type {
  AppState,
  Command,
  ToggleSidebarCommand,
  SetDevicePreviewCommand,
  StartEditingCommand,
  StopEditingCommand,
  ToggleTemplateSelectorCommand,
  ToggleDebugPanelCommand,
  SetActiveTabCommand,
  SetSelectedSectionIndexCommand,
} from "../types"
import {
  isToggleSidebarCommand,
  isSetDevicePreviewCommand,
  isStartEditingCommand,
  isStopEditingCommand,
  isToggleTemplateSelectorCommand,
  isToggleDebugPanelCommand,
  isSetActiveTabCommand,
  isSetSelectedSectionIndexCommand,
} from "../../../entities/command/type-guards"

/**
 * 사이드바 토글 실행자
 */
export class ToggleSidebarExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: Command): AppState {
    if (!isToggleSidebarCommand(command)) {
      throw new Error(`Invalid command type for ToggleSidebarExecutor: ${command.type}`)
    }
    const { side, open } = command.payload

    const newState = { ...state }
    newState.ui = { ...state.ui }

    if (side === "left") {
      newState.ui.leftSidebarOpen = open !== undefined ? open : !state.ui.leftSidebarOpen
    } else if (side === "right") {
      newState.ui.rightPanelOpen = open !== undefined ? open : !state.ui.rightPanelOpen
    }

    return newState
  }

  undo(state: AppState, command: Command): AppState {
    if (!isToggleSidebarCommand(command)) {
      throw new Error(`Invalid command type for ToggleSidebarExecutor: ${command.type}`)
    }
    const { side, open } = command.payload

    const newState = { ...state }
    newState.ui = { ...state.ui }

    if (side === "left") {
      newState.ui.leftSidebarOpen = open !== undefined ? !open : !state.ui.leftSidebarOpen
    } else if (side === "right") {
      newState.ui.rightPanelOpen = open !== undefined ? !open : !state.ui.rightPanelOpen
    }

    return newState
  }

  redo(state: AppState, command: Command): AppState {
    return this.execute(state, command)
  }
}

/**
 * 디바이스 프리뷰 변경 실행자
 */
export class SetDevicePreviewExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: Command): AppState {
    if (!isSetDevicePreviewCommand(command)) {
      throw new Error(`Invalid command type for SetDevicePreviewExecutor: ${command.type}`)
    }
    const { device } = command.payload

    const newState = { ...state }
    newState.ui = { ...state.ui, devicePreview: device }

    return newState
  }

  undo(state: AppState, command: Command): AppState {
    // Device preview 변경은 일반적으로 undo하지 않음
    return state
  }

  redo(state: AppState, command: Command): AppState {
    return this.execute(state, command)
  }
}

/**
 * 편집 시작 실행자
 */
export class StartEditingExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: Command): AppState {
    if (!isStartEditingCommand(command)) {
      throw new Error(`Invalid command type for StartEditingExecutor: ${command.type}`)
    }
    const { elementId } = command.payload

    const newState = { ...state }
    newState.ui = { ...state.ui, isEditing: true, editingElementId: elementId }

    return newState
  }

  undo(state: AppState, command: Command): AppState {
    const newState = { ...state }
    newState.ui = { ...state.ui, isEditing: false, editingElementId: null }

    return newState
  }

  redo(state: AppState, command: Command): AppState {
    return this.execute(state, command)
  }
}

/**
 * 편집 종료 실행자
 */
export class StopEditingExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: Command): AppState {
    const newState = { ...state }
    newState.ui = { ...state.ui, isEditing: false, editingElementId: null }

    return newState
  }

  undo(state: AppState, command: Command): AppState {
    // Stop editing의 undo는 이전 편집 상태로 복원
    // 실제로는 이전 START_EDITING 커맨드의 정보가 필요하지만
    // 간단하게 편집 모드만 활성화
    const newState = { ...state }
    newState.ui = { ...state.ui, isEditing: true }

    return newState
  }

  redo(state: AppState, command: Command): AppState {
    return this.execute(state, command)
  }
}

/**
 * 템플릿 선택기 토글 실행자
 */
export class ToggleTemplateSelectorExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: Command): AppState {
    if (!isToggleTemplateSelectorCommand(command)) {
      throw new Error(`Invalid command type for ToggleTemplateSelectorExecutor: ${command.type}`)
    }
    const { open } = command.payload

    const newState = { ...state }
    newState.ui = { 
      ...state.ui, 
      templateSelectorOpen: open !== undefined ? open : !state.ui.templateSelectorOpen 
    }

    return newState
  }

  undo(state: AppState, command: Command): AppState {
    if (!isToggleTemplateSelectorCommand(command)) {
      throw new Error(`Invalid command type for ToggleTemplateSelectorExecutor: ${command.type}`)
    }
    const { open } = command.payload

    const newState = { ...state }
    newState.ui = { 
      ...state.ui, 
      templateSelectorOpen: open !== undefined ? !open : !state.ui.templateSelectorOpen 
    }

    return newState
  }

  redo(state: AppState, command: Command): AppState {
    return this.execute(state, command)
  }
}

/**
 * 디버그 패널 토글 실행자
 */
export class ToggleDebugPanelExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: Command): AppState {
    if (!isToggleDebugPanelCommand(command)) {
      throw new Error(`Invalid command type for ToggleDebugPanelExecutor: ${command.type}`)
    }
    const { open } = command.payload

    const newState = { ...state }
    newState.ui = { 
      ...state.ui, 
      debugPanelOpen: open !== undefined ? open : !state.ui.debugPanelOpen 
    }

    return newState
  }

  undo(state: AppState, command: Command): AppState {
    if (!isToggleDebugPanelCommand(command)) {
      throw new Error(`Invalid command type for ToggleDebugPanelExecutor: ${command.type}`)
    }
    const { open } = command.payload

    const newState = { ...state }
    newState.ui = { 
      ...state.ui, 
      debugPanelOpen: open !== undefined ? !open : !state.ui.debugPanelOpen 
    }

    return newState
  }

  redo(state: AppState, command: Command): AppState {
    return this.execute(state, command)
  }
}

/**
 * 활성 탭 설정 실행자
 */
export class SetActiveTabExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: Command): AppState {
    if (!isSetActiveTabCommand(command)) {
      throw new Error(`Invalid command type for SetActiveTabExecutor: ${command.type}`)
    }
    const { tab } = command.payload

    const newState = { ...state }
    newState.ui = { ...state.ui, activeTab: tab }

    return newState
  }

  undo(state: AppState, command: Command): AppState {
    // 탭 변경은 일반적으로 undo하지 않지만, 
    // 필요하다면 이전 탭 정보를 추가로 저장해야 함
    return state
  }

  redo(state: AppState, command: Command): AppState {
    return this.execute(state, command)
  }
}

/**
 * 선택된 섹션 인덱스 설정 실행자
 */
export class SetSelectedSectionIndexExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: Command): AppState {
    if (!isSetSelectedSectionIndexCommand(command)) {
      throw new Error(`Invalid command type for SetSelectedSectionIndexExecutor: ${command.type}`)
    }
    const { index } = command.payload

    const newState = { ...state }
    newState.ui = { ...state.ui, selectedSectionIndex: index }

    return newState
  }

  undo(state: AppState, command: Command): AppState {
    // 섹션 선택은 일반적으로 undo하지 않음
    return state
  }

  redo(state: AppState, command: Command): AppState {
    return this.execute(state, command)
  }
}