/**
 * Plugin System Entity Types
 * 
 * 플러그인 시스템과 관련된 모든 타입 정의
 */

export interface PluginState<T = unknown> {
  isEditing: boolean
  value: T
  isDirty: boolean
  errors: string[]
}

export interface PluginModel<T = unknown> {
  id: string
  type: string
  state: PluginState<T>
  element?: HTMLElement
  startEdit(): void
  stopEdit(): void
  getValue(): T
  setValue(value: T): void
  validate(): { valid: boolean; message?: string }
  reset(): void
  handleClick?(): void
  handleDoubleClick?(): void
  handleKeydown?(key: string): void
}

export interface EditableElement {
  element: HTMLElement
  type: string
  defaultValue: unknown
  constraints?: Record<string, unknown>
}

export interface EditablePluginConfig {
  type: string
  name: string
  description: string
  defaultConstraints?: Record<string, unknown>
}

export interface EditableAction {
  id: string
  label: string
  icon?: string
  handler: (element: HTMLElement, data?: unknown) => void | Promise<void>
  isAvailable?: (element: HTMLElement) => boolean
  isDestructive?: boolean
}

export interface EditablePlugin {
  config: EditablePluginConfig
  init?(element: HTMLElement): void | Promise<void>
  destroy?(element: HTMLElement): void
  onClick?(element: HTMLElement, event: MouseEvent): void | Promise<void>
  onDoubleClick?(element: HTMLElement, event: MouseEvent): void | Promise<void>
  onKeydown?(element: HTMLElement, event: KeyboardEvent): void
  getValue?(element: HTMLElement): unknown
  setValue?(element: HTMLElement, value: unknown): void | Promise<void>
  isEmpty?(element: HTMLElement): boolean
  clear?(element: HTMLElement): void
  validate?(element: HTMLElement, value: unknown): { valid: boolean; message?: string }
  getActions?(element: HTMLElement): EditableAction[]
  applyStyles?(element: HTMLElement, selected: boolean): void
  removeStyles?(element: HTMLElement): void
}

export interface EditablePluginRegistry {
  register(plugin: EditablePlugin): void
  unregister(type: string): void
  get(type: string): EditablePlugin | undefined
  getAll(): Map<string, EditablePlugin>
  hasType(type: string): boolean
}

export interface PluginManager {
  initElement(element: HTMLElement): void
  destroyElement(element: HTMLElement): void
  handleClick(element: HTMLElement, event: MouseEvent): void
  handleDoubleClick(element: HTMLElement, event: MouseEvent): void
  handleKeydown(element: HTMLElement, event: KeyboardEvent): void
  getPlugin(type: string): EditablePlugin | undefined
  registerPlugin(plugin: EditablePlugin): void
  unregisterPlugin(type: string): void
}