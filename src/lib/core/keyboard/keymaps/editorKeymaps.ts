// 에디터 키맵 정의 (tinykeys 버전)
import type { ConditionalKeymap } from "../HotkeyManager"
import { historyManager } from "$lib/core/history"
import { selectionManager, selectedElements } from "$lib/core/selection"
import { pluginStore } from "$lib/core/plugins/models/PluginStore.svelte"
import { modelBasedPluginManager } from "$lib/core/plugins"
import { selectionCommandManager } from "$lib/core/commands"
import { get } from "svelte/store"

// Helper function to determine element type
const getElementType = (element: HTMLElement): string => {
  if (element.hasAttribute("data-repeatable")) {
    return "repeatable"
  } else if (element.hasAttribute("data-editable")) {
    return element.getAttribute("data-editable") || "text"
  }
  return "text" // Default to text
}

// Helper function to execute command on selected element
const executeCommandOnSelected = async (command: string) => {
  const selected = get(selectedElements)
  if (selected.size > 0) {
    const element = Array.from(selected)[0]
    const type = getElementType(element)
    await selectionCommandManager.executeCommand(command as any, element, type)
  }
}

// Helper function to create command handler
const createCommandHandler = (command: string) => async (e: KeyboardEvent) => {
  e.preventDefault()
  // [Hotkey] ${command}
  await executeCommandOnSelected(command)
}

// Helper function to check if element allows default behavior
const allowsDefaultBehavior = (element: HTMLElement): boolean => {
  return element.hasAttribute("contenteditable") || 
         element.tagName === "INPUT" || 
         element.tagName === "TEXTAREA"
}

// 기본 편집 키맵 (항상 활성)
export const globalKeymap: ConditionalKeymap = {
  condition: () => true,
  priority: 0,
  bindings: {
    "$mod+z": (e) => {
      e.preventDefault()
      // [Hotkey] Undo
      historyManager.undo()
    },
    "$mod+Shift+z": (e) => {
      e.preventDefault()
      // [Hotkey] Redo
      historyManager.redo()
    },
    "$mod+y": (e) => {
      e.preventDefault()
      // [Hotkey] Redo (Ctrl+Y)
      historyManager.redo()
    },
    "Escape": (e) => {
      e.preventDefault()
      // [Hotkey] Escape

      // 편집 중이면 편집 종료, 아니면 선택 해제
      const editingModel = pluginStore.getEditingModel()
      if (editingModel) {
        editingModel.stopEdit()
      } else {
        selectionManager.clear()
      }
    },
  },
}

// 선택 모드 키맵 (선택된 요소가 있고 편집 중이 아닐 때)
export const selectionKeymap: ConditionalKeymap = {
  condition: (ctx) => ctx.hasSelection && !ctx.isEditing,
  priority: 10,
  bindings: {
    "Enter": (e) => {
      e.preventDefault()
      // [Hotkey] Enter - Start Edit

      const selected = get(selectedElements)
      if (selected.size === 1) {
        const element = Array.from(selected)[0]
        const type = getElementType(element)
        // Model 기반 플러그인으로 편집 시작
        const model = modelBasedPluginManager.getOrCreateModel(element, type)
        if (model) {
          model.startEdit()
        }
      }
    },
    "Delete": createCommandHandler("delete"),
    "Backspace": createCommandHandler("delete"),
    "$mod+c": createCommandHandler("copy"),
    "$mod+x": createCommandHandler("cut"),
    "$mod+v": createCommandHandler("paste"),
    "$mod+d": async (e) => {
      e.preventDefault()
      // [Hotkey] Duplicate
      // Copy then paste
      await executeCommandOnSelected("copy")
      await executeCommandOnSelected("paste")
    },
  },
}

// 텍스트 편집 모드 키맵
export const textEditingKeymap: ConditionalKeymap = {
  condition: (ctx) => ctx.isEditing && ctx.selectedType === "text",
  priority: 20, // 선택 모드보다 높은 우선순위
  bindings: {
    "Escape": (e) => {
      e.preventDefault()
      // [Hotkey] Stop Text Editing
      pluginStore.stopAllEditing()
    },
    // 텍스트 편집 중 Enter는 기본 동작(줄바꿈) 허용
    "Enter": (e) => {
      // 이벤트 전파를 중단하여 다른 키맵이 실행되지 않도록 함
      e.stopPropagation()
    },
    // 텍스트 편집 중 스페이스는 기본 동작 허용
    " ": (e) => {
      // 스페이스는 contenteditable에서 기본 동작 사용
      // 이벤트 버블링 중지하여 section keymap으로 전파 방지
      e.stopPropagation()
    },
    // 텍스트 편집 중에는 대부분의 키를 기본 동작으로
    "$mod+b": (e) => {
      e.preventDefault()
      // [Hotkey] Bold (not implemented)
    },
    "$mod+i": (e) => {
      e.preventDefault()
      // [Hotkey] Italic (not implemented)
    },
  },
}

// Helper function to create navigation handler
const createNavigationHandler = (direction: string) => (e: KeyboardEvent) => {
  const target = e.target as HTMLElement
  if (allowsDefaultBehavior(target)) return
  
  e.preventDefault()
  // [Hotkey] Navigate ${direction}
  // TODO: Navigate ${direction}
}

// 네비게이션 키맵 (편집 중이 아닐 때)
export const navigationKeymap: ConditionalKeymap = {
  condition: (ctx) => !ctx.isEditing,
  priority: 5,
  bindings: {
    "Tab": createNavigationHandler("Next Element"),
    "Shift+Tab": createNavigationHandler("Previous Element"),
    "ArrowUp": createNavigationHandler("Up"),
    "ArrowDown": createNavigationHandler("Down"),
    "ArrowLeft": createNavigationHandler("Left"),
    "ArrowRight": createNavigationHandler("Right"),
  },
}

// Helper function to handle section selection
const handleSectionSelection = (keyName: string) => (e: KeyboardEvent) => {
  const target = e.target as HTMLElement
  
  // For space key, check for default behavior first
  if (keyName === "Space" && allowsDefaultBehavior(target)) {
    return
  }
  
  // template-section에 포커스가 있을 때만
  if (target.classList.contains("template-section")) {
    // For space key, additional checks
    if (keyName === "Space" && 
        (target.querySelector('[contenteditable="true"]') ||
         target.querySelector('[contenteditable="plaintext-only"]'))) {
      return
    }
    
    e.preventDefault()
    // [Hotkey] Select Section via ${keyName}
    target.click()
  }
}

// 섹션 키맵 (포커스된 섹션에서 작동)
export const sectionKeymap: ConditionalKeymap = {
  condition: (ctx) => {
    // 편집 중이 아니고, contenteditable 요소가 포커스되지 않았을 때만 활성화
    const activeElement = document.activeElement as HTMLElement
    const isContentEditable = activeElement?.hasAttribute("contenteditable") || 
                             activeElement?.getAttribute("contenteditable") === "plaintext-only"
    return !ctx.isEditing && !isContentEditable
  },
  priority: 8,
  bindings: {
    "Enter": handleSectionSelection("Enter"),
    " ": handleSectionSelection("Space"),
  },
}

// 개발자 도구 키맵
export const developerKeymap: ConditionalKeymap = {
  condition: () => true,
  priority: -10, // 가장 낮은 우선순위
  bindings: {
    "$mod+Shift+d": async (e) => {
      e.preventDefault()
      // [Hotkey] Debug Info

      // 선택된 요소 정보
      const selected = get(selectedElements)
      // Selected Elements: Array.from(selected)

      // 편집 중인 모델
      const editingModel = pluginStore.getEditingModel()
      // Editing Model: editingModel

      // 키맵 디버그
      const { hotkeyManager } = await import("../HotkeyManager")
      hotkeyManager.debug()
    },
    "$mod+Shift+k": (e) => {
      e.preventDefault()
      // [Hotkey] Show Keyboard Shortcuts
      // TODO: 키보드 단축키 목록 표시
    },
  },
}

// 모든 키맵 내보내기 (우선순위 순서대로)
export const allKeymaps = [
  textEditingKeymap, // 편집 모드가 가장 높은 우선순위
  selectionKeymap, // 선택 모드
  sectionKeymap, // 섹션 선택
  navigationKeymap, // 네비게이션
  globalKeymap, // 전역 키맵
  developerKeymap, // 개발자 도구
]
