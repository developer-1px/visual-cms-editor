// 키 조합 파서
import type { KeyCombo } from "./types"

export interface ParsedKeyCombo {
  key: string
  modifiers: {
    ctrl: boolean
    alt: boolean
    shift: boolean
    meta: boolean
  }
}

// 키 별칭 맵핑
const KEY_ALIASES: Record<string, string> = {
  cmd: "meta",
  command: "meta",
  ctrl: "control",
  option: "alt",
  opt: "alt",
  return: "enter",
  esc: "escape",
  del: "delete",
  ins: "insert",
  plus: "+",
  minus: "-",
  space: " ",
}

// 특수 키 정규화
const SPECIAL_KEYS: Record<string, string> = {
  arrowup: "ArrowUp",
  arrowdown: "ArrowDown",
  arrowleft: "ArrowLeft",
  arrowright: "ArrowRight",
  pageup: "PageUp",
  pagedown: "PageDown",
  home: "Home",
  end: "End",
  tab: "Tab",
  enter: "Enter",
  escape: "Escape",
  backspace: "Backspace",
  delete: "Delete",
  insert: "Insert",
}

export function parseKeyCombo(combo: KeyCombo): ParsedKeyCombo {
  const parts = combo
    .toLowerCase()
    .split("+")
    .map((p) => p.trim())

  const modifiers = {
    ctrl: false,
    alt: false,
    shift: false,
    meta: false,
  }

  let key = ""

  for (const part of parts) {
    const normalized = KEY_ALIASES[part] || part

    switch (normalized) {
      case "control":
      case "ctrl":
        modifiers.ctrl = true
        break
      case "alt":
        modifiers.alt = true
        break
      case "shift":
        modifiers.shift = true
        break
      case "meta":
        modifiers.meta = true
        break
      default:
        key = SPECIAL_KEYS[normalized] || normalized
    }
  }

  return { key, modifiers }
}

export function matchesKeyCombo(event: KeyboardEvent, combo: ParsedKeyCombo): boolean {
  // 키 매칭
  const eventKey = event.key.toLowerCase()
  const comboKey = combo.key.toLowerCase()

  if (eventKey !== comboKey) {
    return false
  }

  // 수정자 키 매칭
  if (combo.modifiers.ctrl !== (event.ctrlKey || event.metaKey)) return false
  if (combo.modifiers.alt !== event.altKey) return false
  if (combo.modifiers.shift !== event.shiftKey) return false
  if (combo.modifiers.meta !== event.metaKey && !event.ctrlKey) return false

  return true
}

// 키 조합을 사람이 읽기 쉬운 형태로 변환
export function formatKeyCombo(combo: KeyCombo): string {
  const parsed = parseKeyCombo(combo)
  const parts: string[] = []

  if (parsed.modifiers.meta) parts.push("⌘")
  if (parsed.modifiers.ctrl) parts.push("Ctrl")
  if (parsed.modifiers.alt) parts.push("⌥")
  if (parsed.modifiers.shift) parts.push("⇧")

  // 키 이름 포맷팅
  const keyName = parsed.key.charAt(0).toUpperCase() + parsed.key.slice(1)
  parts.push(keyName)

  return parts.join("")
}
