// 에디터 키맵 정의
import type { Keymap } from "../types"
import { historyManager } from "$lib/core/history"
import { selectionManager } from "$lib/core/selection/SelectionManager"
import { pluginStore } from "$lib/core/plugins/models/PluginStore.svelte"

// 기본 편집 키맵
export const baseEditingKeymap: Keymap = {
  id: "base-editing",
  name: "Base Editing",
  priority: 10,
  bindings: [
    {
      combo: "cmd+z",
      handler: () => {
        console.log("[Keymap] Undo")
        historyManager.undo()
        return true
      },
      description: "Undo",
    },
    {
      combo: "cmd+shift+z",
      handler: () => {
        console.log("[Keymap] Redo")
        historyManager.redo()
        return true
      },
      description: "Redo",
    },
    {
      combo: "cmd+a",
      handler: () => {
        console.log("[Keymap] Select All")
        // TODO: 구현
        return true
      },
      description: "Select All",
    },
    {
      combo: "escape",
      handler: () => {
        console.log("[Keymap] Escape - Clear Selection")
        selectionManager.clear()
        pluginStore.stopAllEditing()
        return true
      },
      description: "Clear Selection",
    },
  ],
}

// 선택 모드 키맵
export const selectionModeKeymap: Keymap = {
  id: "selection-mode",
  name: "Selection Mode",
  priority: 20,
  context: (ctx) => ctx.hasSelection && !ctx.isEditing,
  bindings: [
    {
      combo: "enter",
      handler: () => {
        console.log("[Keymap] Enter - Start Edit")
        const selectedElements = selectionManager.getSelectedElements()
        if (selectedElements.size === 1) {
          const element = Array.from(selectedElements)[0]
          const elementId = element.id
          const model = pluginStore.get(elementId)
          if (model) {
            model.startEdit()
          }
        }
        return true
      },
      description: "Start Edit",
    },
    {
      combo: "delete",
      handler: () => {
        console.log("[Keymap] Delete")
        // TODO: Delete 액션 실행
        return true
      },
      description: "Delete",
    },
    {
      combo: "backspace",
      handler: () => {
        console.log("[Keymap] Backspace (Delete)")
        // TODO: Delete 액션 실행
        return true
      },
      description: "Delete",
    },
    {
      combo: "cmd+c",
      handler: () => {
        console.log("[Keymap] Copy")
        // TODO: Copy 액션 실행
        return true
      },
      description: "Copy",
    },
    {
      combo: "cmd+x",
      handler: () => {
        console.log("[Keymap] Cut")
        // TODO: Cut 액션 실행
        return true
      },
      description: "Cut",
    },
    {
      combo: "cmd+v",
      handler: () => {
        console.log("[Keymap] Paste")
        // TODO: Paste 액션 실행
        return true
      },
      description: "Paste",
    },
  ],
}

// 텍스트 편집 모드 키맵
export const textEditingKeymap: Keymap = {
  id: "text-editing",
  name: "Text Editing",
  priority: 30,
  context: (ctx) => ctx.isEditing && ctx.selectedType === "text",
  bindings: [
    {
      combo: "escape",
      handler: () => {
        console.log("[Keymap] Escape - Stop Editing")
        pluginStore.stopAllEditing()
        return true
      },
      description: "Stop Editing",
    },
    // Enter는 텍스트 편집 중에는 기본 동작(줄바꿈) 허용
    {
      combo: "enter",
      handler: () => false, // 기본 동작 허용
      description: "Line Break",
    },
    // 편집 중에는 일부 단축키 비활성화
    {
      combo: "cmd+a",
      handler: () => false, // 텍스트 내에서 전체 선택 허용
      description: "Select All Text",
    },
  ],
}

// 네비게이션 키맵
export const navigationKeymap: Keymap = {
  id: "navigation",
  name: "Navigation",
  priority: 5,
  context: (ctx) => !ctx.isEditing,
  bindings: [
    {
      combo: "tab",
      handler: () => {
        console.log("[Keymap] Tab - Next Element")
        // TODO: 다음 요소로 이동
        return true
      },
      description: "Next Element",
    },
    {
      combo: "shift+tab",
      handler: () => {
        console.log("[Keymap] Shift+Tab - Previous Element")
        // TODO: 이전 요소로 이동
        return true
      },
      description: "Previous Element",
    },
    {
      combo: "arrowup",
      handler: () => {
        console.log("[Keymap] Arrow Up")
        // TODO: 위로 이동
        return true
      },
      description: "Move Up",
    },
    {
      combo: "arrowdown",
      handler: () => {
        console.log("[Keymap] Arrow Down")
        // TODO: 아래로 이동
        return true
      },
      description: "Move Down",
    },
    {
      combo: "arrowleft",
      handler: () => {
        console.log("[Keymap] Arrow Left")
        // TODO: 왼쪽으로 이동
        return true
      },
      description: "Move Left",
    },
    {
      combo: "arrowright",
      handler: () => {
        console.log("[Keymap] Arrow Right")
        // TODO: 오른쪽으로 이동
        return true
      },
      description: "Move Right",
    },
  ],
}

// 개발자 키맵
export const developerKeymap: Keymap = {
  id: "developer",
  name: "Developer",
  priority: 0,
  bindings: [
    {
      combo: "cmd+shift+d",
      handler: () => {
        console.log("[Keymap] Toggle Debug Mode")
        // TODO: 디버그 모드 토글
        return true
      },
      description: "Toggle Debug Mode",
    },
    {
      combo: "cmd+shift+i",
      handler: () => {
        console.log("[Keymap] Inspect Element")
        const selectedElements = selectionManager.getSelectedElements()
        console.log("Selected Elements:", selectedElements)
        console.log("Current Context:", keyboardManager.getContext())
        return true
      },
      description: "Inspect Element",
    },
  ],
}
