/**
 * Text Command Executors
 *
 * 텍스트 편집 관련 명령어들을 처리하는 Executor들
 */

import type { CommandExecutor, AppState, UpdateTextCommand } from "../types"
import { logger } from "../logger"

/**
 * UPDATE_TEXT Executor
 *
 * 텍스트 내용을 업데이트하는 명령어 처리
 * - 텍스트 변경 시 자동으로 이전 값을 저장하여 undo 가능
 * - DOM 요소와 Model 모두 업데이트
 * - merge 옵션으로 연속된 텍스트 입력을 하나의 명령으로 병합 가능
 */
export class UpdateTextExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: UpdateTextCommand): AppState {
    const { elementId, newText } = command.payload

    // Get the element from state
    const element = state.elements.get(elementId)
    if (!element) {
      logger.warn(`Element not found: ${elementId}`, { elementId, command })
      return state
    }

    // Update Model
    if (element.type === "text" && "content" in element) {
      // Clone the elements map
      const newElements = new Map(state.elements)

      // Update the element
      newElements.set(elementId, {
        ...element,
        content: newText,
      })

      // Note: DOM updates should be handled reactively by the view layer
      // The view should observe state.elements changes and update accordingly

      return {
        ...state,
        elements: newElements,
        history: {
          ...state.history,
          lastCommand: command,
        },
      }
    }

    return state
  }

  undo(state: AppState, command: UpdateTextCommand): AppState {
    const { elementId, oldText } = command.payload

    // Get the element from state
    const element = state.elements.get(elementId)
    if (!element) {
      logger.warn(`Element not found: ${elementId}`, { elementId, command })
      return state
    }

    // Update Model
    if (element.type === "text" && "content" in element) {
      // Clone the elements map
      const newElements = new Map(state.elements)

      // Restore old text
      newElements.set(elementId, {
        ...element,
        content: oldText,
      })

      // Note: DOM updates should be handled reactively by the view layer

      return {
        ...state,
        elements: newElements,
        history: {
          ...state.history,
          lastCommand: null,
        },
      }
    }

    return state
  }

  redo(state: AppState, command: UpdateTextCommand): AppState {
    return this.execute(state, command)
  }
}
