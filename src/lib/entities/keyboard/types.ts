/**
 * Keyboard/Hotkey System Entity Types
 * 
 * 키보드 단축키 시스템과 관련된 모든 타입 정의
 */

export type KeyCombo = string

export interface KeyBinding {
  combo: KeyCombo
  handler: (event: KeyboardEvent) => void | boolean
  description?: string
  preventDefault?: boolean
}

export interface KeymapContext {
  mode?: string
  hasSelection?: boolean
  isEditing?: boolean
  selectedType?: string
  [key: string]: unknown
}

export interface Keymap {
  id: string
  name: string
  priority: number
  context?: (ctx: KeymapContext) => boolean
  bindings: KeyBinding[]
}

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

export interface ParsedKeyCombo {
  key: string
  modifiers: {
    ctrl: boolean
    alt: boolean
    shift: boolean
    meta: boolean
  }
}

export interface KeyBindingMap {
  [combo: string]: KeyBinding
}

export interface HotkeyManager {
  register(keymap: Keymap): void
  unregister(id: string): void
  setContext(context: KeymapContext): void
  getContext(): KeymapContext
  handleKeydown(event: KeyboardEvent): boolean
  isEnabled(): boolean
  enable(): void
  disable(): void
}

export interface KeyParser {
  parse(combo: string): ParsedKeyCombo
  normalize(combo: string): string
  matches(event: KeyboardEvent, combo: string): boolean
}

export interface HotkeyHint {
  combo: string
  description: string
  group?: string
  condition?: (ctx: HotkeyContext) => boolean
}

export interface HotkeyGroup {
  id: string
  name: string
  hints: HotkeyHint[]
  visible: boolean
  priority: number
}