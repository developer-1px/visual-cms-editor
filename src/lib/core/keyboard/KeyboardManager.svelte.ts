// 키보드 매니저 - Svelte 5 반응형
import { parseKeyCombo, matchesKeyCombo } from "./parser"
import type { Keymap, KeymapContext, KeyboardManagerOptions, KeyBinding } from "./types"

export class KeyboardManager {
  private keymaps = $state<Keymap[]>([])
  private context = $state<KeymapContext>({})
  private enabled = $state(true)
  private options: KeyboardManagerOptions

  constructor(options: KeyboardManagerOptions = {}) {
    this.options = {
      debug: false,
      preventDefault: true,
      ...options,
    }
  }

  // 키맵 등록
  registerKeymap(keymap: Keymap): () => void {
    this.keymaps.push(keymap)
    this.keymaps.sort((a, b) => b.priority - a.priority) // 높은 우선순위 먼저

    if (this.options.debug) {
      console.log(`[KeyboardManager] Registered keymap: ${keymap.name}`)
    }

    // unregister 함수 반환
    return () => {
      const index = this.keymaps.indexOf(keymap)
      if (index > -1) {
        this.keymaps.splice(index, 1)
      }
    }
  }

  // 컨텍스트 업데이트
  updateContext(updates: Partial<KeymapContext>): void {
    this.context = { ...this.context, ...updates }

    if (this.options.debug) {
      console.log("[KeyboardManager] Context updated:", this.context)
    }
  }

  // 현재 컨텍스트 가져오기
  getContext(): KeymapContext {
    return { ...this.context }
  }

  // 활성화/비활성화
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  // 키 이벤트 처리
  handleKeydown(event: KeyboardEvent): void {
    if (!this.enabled) return

    // 활성 키맵 필터링 (컨텍스트에 맞는 것만)
    const activeKeymaps = this.keymaps.filter((keymap) => {
      if (!keymap.context) return true
      return keymap.context(this.context)
    })

    if (this.options.debug) {
      console.log(`[KeyboardManager] Active keymaps: ${activeKeymaps.map((k) => k.name).join(", ")}`)
    }

    // 각 키맵의 바인딩 확인
    for (const keymap of activeKeymaps) {
      for (const binding of keymap.bindings) {
        const parsed = parseKeyCombo(binding.combo)

        if (matchesKeyCombo(event, parsed)) {
          if (this.options.debug) {
            console.log(`[KeyboardManager] Matched: ${binding.combo} in ${keymap.name}`)
          }

          const result = binding.handler(event)

          // preventDefault 처리
          const shouldPrevent = binding.preventDefault ?? this.options.preventDefault
          if (shouldPrevent && result !== false) {
            event.preventDefault()
            event.stopPropagation()
          }

          // 핸들러가 false를 반환하지 않으면 전파 중단
          if (result !== false) {
            return
          }
        }
      }
    }
  }

  // 현재 활성 바인딩 목록 가져오기
  getActiveBindings(): Array<{ keymap: string; bindings: KeyBinding[] }> {
    return this.keymaps
      .filter((keymap) => !keymap.context || keymap.context(this.context))
      .map((keymap) => ({
        keymap: keymap.name,
        bindings: keymap.bindings,
      }))
  }
}

// 전역 키보드 매니저 인스턴스
export const keyboardManager = new KeyboardManager({
  debug: true,
  preventDefault: true,
})
