// tinykeys 기반 Hotkey 매니저
import { tinykeys } from "tinykeys"
import type { KeyBindingMap } from "tinykeys"

export interface HotkeyContext {
  mode: "select" | "edit"
  hasSelection: boolean
  isEditing: boolean
  selectedType?: string
  selectionCount: number
}

export interface ConditionalKeymap {
  condition: (ctx: HotkeyContext) => boolean
  bindings: KeyBindingMap
  priority?: number
}

export class HotkeyManager {
  private context: HotkeyContext = {
    mode: "select",
    hasSelection: false,
    isEditing: false,
    selectionCount: 0,
  }

  private keymaps: ConditionalKeymap[] = []
  private unsubscribers: Array<() => void> = []
  private target: Window | HTMLElement = window

  constructor() {
    // constructor에서는 $effect를 사용할 수 없음
  }

  // 컨텍스트 업데이트
  updateContext(updates: Partial<HotkeyContext>): void {
    this.context = { ...this.context, ...updates }
    // 컨텍스트가 변경되면 키맵 재구성
    this.rebindKeys()
  }

  // 조건부 키맵 등록
  registerKeymap(keymap: ConditionalKeymap): () => void {
    this.keymaps.push(keymap)
    this.keymaps.sort((a, b) => (b.priority || 0) - (a.priority || 0))
    this.rebindKeys()

    // unregister 함수 반환
    return () => {
      const index = this.keymaps.indexOf(keymap)
      if (index > -1) {
        this.keymaps.splice(index, 1)
        this.rebindKeys()
      }
    }
  }

  // 대상 요소 설정
  setTarget(target: Window | HTMLElement): void {
    this.target = target
    this.rebindKeys()
  }

  // 키 바인딩 재구성
  private rebindKeys(): void {
    // 기존 바인딩 해제
    this.unsubscribers.forEach((unsub) => unsub())
    this.unsubscribers = []

    // 활성 키맵 수집
    const activeBindings: KeyBindingMap = {}

    // 우선순위가 낮은 것부터 처리하여 높은 우선순위가 덮어쓰도록
    const sortedKeymaps = [...this.keymaps].sort((a, b) => (a.priority || 0) - (b.priority || 0))

    for (const keymap of sortedKeymaps) {
      if (keymap.condition(this.context)) {
        // 바인딩 병합 (높은 우선순위가 낮은 우선순위를 덮어씀)
        Object.entries(keymap.bindings).forEach(([key, handler]) => {
          activeBindings[key] = handler
        })
      }
    }

    // 새 바인딩 적용
    if (Object.keys(activeBindings).length > 0) {
      // capture: false로 명시적 설정하여 버블링 단계에서 처리
      // 이렇게 하면 contenteditable 요소에서 stopPropagation이 제대로 작동
      const unsubscribe = tinykeys(this.target, activeBindings, {
        capture: false
      })
      this.unsubscribers.push(unsubscribe)
    }
  }

  // 현재 활성 키 바인딩 가져오기
  getActiveBindings(): KeyBindingMap {
    const activeBindings: KeyBindingMap = {}

    for (const keymap of this.keymaps) {
      if (keymap.condition(this.context)) {
        Object.assign(activeBindings, keymap.bindings)
      }
    }

    return activeBindings
  }

  // 디버그 정보
  debug(): void {
    // === HotkeyManager Debug ===
    // Current Context: this.context

    const activeKeymaps = this.keymaps
      .filter((k) => k.condition(this.context))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    // Active Keymaps (by priority):
    activeKeymaps.forEach((km) => {
      // - Priority ${km.priority || 0}: ${Object.keys(km.bindings).join(", ")}
    })

    // Final Active Bindings: Object.keys(this.getActiveBindings())
    // ========================
  }
}

// 전역 인스턴스
export const hotkeyManager = new HotkeyManager()
