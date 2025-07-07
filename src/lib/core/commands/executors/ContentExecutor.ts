/**
 * Content Command Executors
 *
 * 이미지, 아이콘, 링크 등 컨텐츠 편집 관련 명령어들을 처리하는 Executor들
 */

import type { CommandExecutor, AppState, UpdateImageCommand, UpdateIconCommand, UpdateLinkCommand } from "../types"
import { logger } from "../logger"

/**
 * UPDATE_IMAGE Executor
 *
 * 이미지 소스 및 alt 텍스트를 업데이트하는 명령어 처리
 */
export class UpdateImageExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: UpdateImageCommand): AppState {
    const { elementId, newSrc, newAlt } = command.payload

    // Get the element from state
    const element = state.elements.get(elementId)
    if (!element || element.type !== "image") {
      logger.warn(`Image element not found: ${elementId}`, { elementId, command })
      return state
    }

    // Clone the elements map
    const newElements = new Map(state.elements)

    // Update the element
    if ("src" in element) {
      newElements.set(elementId, {
        ...element,
        src: newSrc,
        alt: newAlt || element.alt,
      })

      // Note: DOM updates should be handled reactively by the view layer
    }

    return {
      ...state,
      elements: newElements,
      history: {
        ...state.history,
        lastCommand: command,
      },
    }
  }

  undo(state: AppState, command: UpdateImageCommand): AppState {
    const { elementId, oldSrc, oldAlt } = command.payload

    // Get the element from state
    const element = state.elements.get(elementId)
    if (!element || element.type !== "image") {
      logger.warn(`Image element not found: ${elementId}`, { elementId, command })
      return state
    }

    // Clone the elements map
    const newElements = new Map(state.elements)

    // Restore old values
    if ("src" in element) {
      newElements.set(elementId, {
        ...element,
        src: oldSrc,
        alt: oldAlt || element.alt,
      })

      // Note: DOM updates should be handled reactively by the view layer
    }

    return {
      ...state,
      elements: newElements,
      history: {
        ...state.history,
        lastCommand: null,
      },
    }
  }

  redo(state: AppState, command: UpdateImageCommand): AppState {
    return this.execute(state, command)
  }
}

/**
 * UPDATE_ICON Executor
 *
 * 아이콘 SVG 경로 데이터를 업데이트하는 명령어 처리
 */
export class UpdateIconExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: UpdateIconCommand): AppState {
    const { elementId, newPathData } = command.payload

    // Get the element from state
    const element = state.elements.get(elementId)
    if (!element || element.type !== "icon") {
      logger.warn(`Icon element not found: ${elementId}`, { elementId, command })
      return state
    }

    // Clone the elements map
    const newElements = new Map(state.elements)

    // Update the element
    if ("svgData" in element) {
      newElements.set(elementId, {
        ...element,
        svgData: newPathData,
      })

      // Note: DOM updates should be handled reactively by the view layer
    }

    return {
      ...state,
      elements: newElements,
      history: {
        ...state.history,
        lastCommand: command,
      },
    }
  }

  undo(state: AppState, command: UpdateIconCommand): AppState {
    const { elementId, oldPathData } = command.payload

    // Get the element from state
    const element = state.elements.get(elementId)
    if (!element || element.type !== "icon") {
      logger.warn(`Icon element not found: ${elementId}`, { elementId, command })
      return state
    }

    // Clone the elements map
    const newElements = new Map(state.elements)

    // Restore old path data
    if ("svgData" in element) {
      newElements.set(elementId, {
        ...element,
        svgData: oldPathData,
      })

      // Note: DOM updates should be handled reactively by the view layer
    }

    return {
      ...state,
      elements: newElements,
      history: {
        ...state.history,
        lastCommand: null,
      },
    }
  }

  redo(state: AppState, command: UpdateIconCommand): AppState {
    return this.execute(state, command)
  }
}

/**
 * UPDATE_LINK Executor
 *
 * 링크 URL 및 텍스트를 업데이트하는 명령어 처리
 */
export class UpdateLinkExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: UpdateLinkCommand): AppState {
    const { elementId, newHref, newText } = command.payload

    // Get the element from state
    const element = state.elements.get(elementId)
    if (!element || element.type !== "link") {
      logger.warn(`Link element not found: ${elementId}`, { elementId, command })
      return state
    }

    // Clone the elements map
    const newElements = new Map(state.elements)

    // Update the element
    if ("href" in element) {
      const updatedElement: typeof element = {
        ...element,
        href: newHref,
      }

      if (newText !== undefined && "content" in element) {
        updatedElement.content = newText
      }

      newElements.set(elementId, updatedElement)

      // Note: DOM updates should be handled reactively by the view layer
    }

    return {
      ...state,
      elements: newElements,
      history: {
        ...state.history,
        lastCommand: command,
      },
    }
  }

  undo(state: AppState, command: UpdateLinkCommand): AppState {
    const { elementId, oldHref, oldText } = command.payload

    // Get the element from state
    const element = state.elements.get(elementId)
    if (!element || element.type !== "link") {
      logger.warn(`Link element not found: ${elementId}`, { elementId, command })
      return state
    }

    // Clone the elements map
    const newElements = new Map(state.elements)

    // Restore old values
    if ("href" in element) {
      const updatedElement: typeof element = {
        ...element,
        href: oldHref,
      }

      if (oldText !== undefined && "content" in element) {
        updatedElement.content = oldText
      }

      newElements.set(elementId, updatedElement)

      // Note: DOM updates should be handled reactively by the view layer
    }

    return {
      ...state,
      elements: newElements,
      history: {
        ...state.history,
        lastCommand: null,
      },
    }
  }

  redo(state: AppState, command: UpdateLinkCommand): AppState {
    return this.execute(state, command)
  }
}
