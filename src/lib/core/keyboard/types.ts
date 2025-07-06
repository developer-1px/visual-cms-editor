// 키보드 시스템 타입 정의

export type KeyCombo = string // e.g., "cmd+s", "ctrl+shift+z", "escape"

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

export interface KeyboardManagerOptions {
  debug?: boolean
  preventDefault?: boolean
}
