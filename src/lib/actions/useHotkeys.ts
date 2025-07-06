// Svelte action for hotkeys (tinykeys 기반)
import { tinykeys } from "tinykeys"
import type { KeyBindingMap } from "tinykeys"

export interface UseHotkeysOptions {
  bindings: KeyBindingMap
  enabled?: boolean
}

// Svelte action으로 사용
export function useHotkeys(node: HTMLElement, options: UseHotkeysOptions) {
  let unsubscribe: (() => void) | null = null

  function setup(opts: UseHotkeysOptions) {
    // 기존 바인딩 해제
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }

    // 활성화된 경우에만 바인딩
    if (opts.enabled !== false && Object.keys(opts.bindings).length > 0) {
      unsubscribe = tinykeys(node, opts.bindings)
    }
  }

  setup(options)

  return {
    update(newOptions: UseHotkeysOptions) {
      setup(newOptions)
    },
    destroy() {
      if (unsubscribe) {
        unsubscribe()
      }
    },
  }
}

// 전역 hotkeys helper
export function createGlobalHotkeys(bindings: KeyBindingMap): () => void {
  return tinykeys(window, bindings)
}
