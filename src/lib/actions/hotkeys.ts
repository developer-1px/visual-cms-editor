// Svelte action for hotkeys
import { keyboardManager } from "$lib/core/keyboard/KeyboardManager.svelte"
import type { Keymap } from "$lib/core/keyboard/types"

export interface HotkeyOptions {
  bindings: Record<string, (event: KeyboardEvent) => void | boolean>
  context?: (ctx: unknown) => boolean
  priority?: number
  description?: string
}

// Svelte action으로 사용
export function hotkeys(node: HTMLElement, options: HotkeyOptions) {
  const keymapId = `hotkeys-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // 키맵 생성
  const keymap: Keymap = {
    id: keymapId,
    name: options.description || keymapId,
    priority: options.priority || 0,
    context: options.context,
    bindings: Object.entries(options.bindings).map(([combo, handler]) => ({
      combo,
      handler,
      description: `${combo} binding`,
    })),
  }

  // 키맵 등록
  const unregister = keyboardManager.registerKeymap(keymap)

  // 이벤트 리스너
  function handleKeydown(event: KeyboardEvent) {
    keyboardManager.handleKeydown(event)
  }

  node.addEventListener("keydown", handleKeydown)

  return {
    update(newOptions: HotkeyOptions) {
      // 기존 키맵 제거하고 새로 등록
      unregister()

      keymap.context = newOptions.context
      keymap.priority = newOptions.priority || 0
      keymap.bindings = Object.entries(newOptions.bindings).map(([combo, handler]) => ({
        combo,
        handler,
        description: `${combo} binding`,
      }))

      keyboardManager.registerKeymap(keymap)
    },

    destroy() {
      unregister()
      node.removeEventListener("keydown", handleKeydown)
    },
  }
}

// 전역 hotkeys (window level)
export function globalHotkeys(options: HotkeyOptions) {
  const keymapId = `global-hotkeys-${Date.now()}`

  const keymap: Keymap = {
    id: keymapId,
    name: options.description || keymapId,
    priority: options.priority || -1, // 전역은 낮은 우선순위
    context: options.context,
    bindings: Object.entries(options.bindings).map(([combo, handler]) => ({
      combo,
      handler,
      description: `${combo} binding`,
    })),
  }

  const unregister = keyboardManager.registerKeymap(keymap)

  function handleKeydown(event: KeyboardEvent) {
    keyboardManager.handleKeydown(event)
  }

  window.addEventListener("keydown", handleKeydown)

  return () => {
    unregister()
    window.removeEventListener("keydown", handleKeydown)
  }
}
