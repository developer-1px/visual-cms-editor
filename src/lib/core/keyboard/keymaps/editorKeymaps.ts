// 에디터 키맵 정의 (tinykeys 버전)
import type { ConditionalKeymap } from "../HotkeyManager"
import { historyManager } from "$lib/core/history"
import { selectionManager, selectedElements } from "$lib/core/selection/SelectionManager"
import { pluginStore } from "$lib/core/plugins/models/PluginStore.svelte"
import { editablePluginManager } from "$lib/core/plugins"
import { selectionActionManager } from "$lib/core/actions"
import { get } from "svelte/store"

// 기본 편집 키맵 (항상 활성)
export const globalKeymap: ConditionalKeymap = {
  condition: () => true,
  priority: 0,
  bindings: {
    "$mod+z": (e) => {
      e.preventDefault()
      console.log("[Hotkey] Undo")
      historyManager.undo()
    },
    "$mod+Shift+z": (e) => {
      e.preventDefault()
      console.log("[Hotkey] Redo")
      historyManager.redo()
    },
    "$mod+y": (e) => {
      e.preventDefault()
      console.log("[Hotkey] Redo (Ctrl+Y)")
      historyManager.redo()
    },
    "Escape": (e) => {
      e.preventDefault()
      console.log("[Hotkey] Escape")

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
      console.log("[Hotkey] Enter - Start Edit")

      const selected = get(selectedElements)
      if (selected.size === 1) {
        const element = Array.from(selected)[0]
        // DOM API 방식의 플러그인 매니저 사용
        editablePluginManager.handleDoubleClick(element, new MouseEvent("dblclick"))
      }
    },
    "Delete": async (e) => {
      e.preventDefault()
      console.log("[Hotkey] Delete")

      const selected = get(selectedElements)
      if (selected.size > 0) {
        const element = Array.from(selected)[0]
        // Determine the type based on element attributes
        let type = "text" // Default to text
        if (element.hasAttribute("data-repeatable")) {
          type = "repeatable"
        } else if (element.hasAttribute("data-editable")) {
          type = element.getAttribute("data-editable") || "text"
        }
        console.log("[Hotkey] Delete - element type:", type)
        await selectionActionManager.executeAction("delete", element, type)
      }
    },
    "Backspace": async (e) => {
      e.preventDefault()
      console.log("[Hotkey] Backspace (Delete)")

      const selected = get(selectedElements)
      if (selected.size > 0) {
        const element = Array.from(selected)[0]
        // Determine the type based on element attributes
        let type = "text" // Default to text
        if (element.hasAttribute("data-repeatable")) {
          type = "repeatable"
        } else if (element.hasAttribute("data-editable")) {
          type = element.getAttribute("data-editable") || "text"
        }
        console.log("[Hotkey] Backspace - element type:", type)
        await selectionActionManager.executeAction("delete", element, type)
      }
    },
    "$mod+c": async (e) => {
      e.preventDefault()
      console.log("[Hotkey] Copy")

      const selected = get(selectedElements)
      if (selected.size > 0) {
        const element = Array.from(selected)[0]
        // Determine the type based on element attributes
        let type = "text" // Default to text
        if (element.hasAttribute("data-repeatable")) {
          type = "repeatable"
        } else if (element.hasAttribute("data-editable")) {
          type = element.getAttribute("data-editable") || "text"
        }
        console.log("[Hotkey] Copy - element type:", type)
        await selectionActionManager.executeAction("copy", element, type)
      }
    },
    "$mod+x": async (e) => {
      e.preventDefault()
      console.log("[Hotkey] Cut")

      const selected = get(selectedElements)
      if (selected.size > 0) {
        const element = Array.from(selected)[0]
        // Determine the type based on element attributes
        let type = "text" // Default to text
        if (element.hasAttribute("data-repeatable")) {
          type = "repeatable"
        } else if (element.hasAttribute("data-editable")) {
          type = element.getAttribute("data-editable") || "text"
        }
        console.log("[Hotkey] Cut - element type:", type)
        await selectionActionManager.executeAction("cut", element, type)
      }
    },
    "$mod+v": async (e) => {
      e.preventDefault()
      console.log("[Hotkey] Paste")

      const selected = get(selectedElements)
      if (selected.size > 0) {
        const element = Array.from(selected)[0]
        // Determine the type based on element attributes
        let type = "text" // Default to text
        if (element.hasAttribute("data-repeatable")) {
          type = "repeatable"
        } else if (element.hasAttribute("data-editable")) {
          type = element.getAttribute("data-editable") || "text"
        }
        console.log("[Hotkey] Paste - element type:", type)
        await selectionActionManager.executeAction("paste", element, type)
      }
    },
    "$mod+d": async (e) => {
      e.preventDefault()
      console.log("[Hotkey] Duplicate")

      const selected = get(selectedElements)
      if (selected.size > 0) {
        const element = Array.from(selected)[0]
        // Determine the type based on element attributes
        let type = "text" // Default to text
        if (element.hasAttribute("data-repeatable")) {
          type = "repeatable"
        } else if (element.hasAttribute("data-editable")) {
          type = element.getAttribute("data-editable") || "text"
        }
        console.log("[Hotkey] Duplicate - element type:", type)
        // Copy then paste
        await selectionActionManager.executeAction("copy", element, type)
        await selectionActionManager.executeAction("paste", element, type)
      }
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
      console.log("[Hotkey] Stop Text Editing")
      pluginStore.stopAllEditing()
    },
    // 텍스트 편집 중에는 대부분의 키를 기본 동작으로
    "$mod+b": (e) => {
      e.preventDefault()
      console.log("[Hotkey] Bold (not implemented)")
    },
    "$mod+i": (e) => {
      e.preventDefault()
      console.log("[Hotkey] Italic (not implemented)")
    },
  },
}

// 네비게이션 키맵 (편집 중이 아닐 때)
export const navigationKeymap: ConditionalKeymap = {
  condition: (ctx) => !ctx.isEditing,
  priority: 5,
  bindings: {
    "Tab": (e) => {
      // contenteditable 요소에서는 기본 동작 허용
      const target = e.target as HTMLElement
      if (target.hasAttribute("contenteditable")) {
        return
      }
      e.preventDefault()
      console.log("[Hotkey] Next Element")
      // TODO: 다음 요소로 이동
    },
    "Shift+Tab": (e) => {
      // contenteditable 요소에서는 기본 동작 허용
      const target = e.target as HTMLElement
      if (target.hasAttribute("contenteditable")) {
        return
      }
      e.preventDefault()
      console.log("[Hotkey] Previous Element")
      // TODO: 이전 요소로 이동
    },
    "ArrowUp": (e) => {
      const target = e.target as HTMLElement
      // contenteditable이나 input 요소에서는 기본 동작 허용
      if (target.hasAttribute("contenteditable") || target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return
      }
      e.preventDefault()
      console.log("[Hotkey] Move Up")
      // TODO: 위로 이동
    },
    "ArrowDown": (e) => {
      const target = e.target as HTMLElement
      // contenteditable이나 input 요소에서는 기본 동작 허용
      if (target.hasAttribute("contenteditable") || target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return
      }
      e.preventDefault()
      console.log("[Hotkey] Move Down")
      // TODO: 아래로 이동
    },
    "ArrowLeft": (e) => {
      const target = e.target as HTMLElement
      // contenteditable이나 input 요소에서는 기본 동작 허용
      if (target.hasAttribute("contenteditable") || target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return
      }
      e.preventDefault()
      console.log("[Hotkey] Move Left")
      // TODO: 왼쪽으로 이동
    },
    "ArrowRight": (e) => {
      const target = e.target as HTMLElement
      // contenteditable이나 input 요소에서는 기본 동작 허용
      if (target.hasAttribute("contenteditable") || target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return
      }
      e.preventDefault()
      console.log("[Hotkey] Move Right")
      // TODO: 오른쪽으로 이동
    },
  },
}

// 섹션 키맵 (포커스된 섹션에서 작동)
export const sectionKeymap: ConditionalKeymap = {
  condition: (ctx) => !ctx.isEditing,
  priority: 8,
  bindings: {
    "Enter": (e) => {
      const target = e.target as HTMLElement
      // template-section에 포커스가 있을 때만
      if (target.classList.contains("template-section")) {
        e.preventDefault()
        console.log("[Hotkey] Select Section via Enter")
        target.click()
      }
    },
    " ": (e) => {
      // Space key
      const target = e.target as HTMLElement
      // template-section에 포커스가 있을 때만
      if (target.classList.contains("template-section")) {
        e.preventDefault()
        console.log("[Hotkey] Select Section via Space")
        target.click()
      }
    },
  },
}

// 개발자 도구 키맵
export const developerKeymap: ConditionalKeymap = {
  condition: () => true,
  priority: -10, // 가장 낮은 우선순위
  bindings: {
    "$mod+Shift+d": async (e) => {
      e.preventDefault()
      console.log("[Hotkey] Debug Info")

      // 선택된 요소 정보
      const selected = get(selectedElements)
      console.log("Selected Elements:", Array.from(selected))

      // 편집 중인 모델
      const editingModel = pluginStore.getEditingModel()
      console.log("Editing Model:", editingModel)

      // 키맵 디버그
      const { hotkeyManager } = await import("../HotkeyManager")
      hotkeyManager.debug()
    },
    "$mod+Shift+k": (e) => {
      e.preventDefault()
      console.log("[Hotkey] Show Keyboard Shortcuts")
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
