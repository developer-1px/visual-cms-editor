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

  // Lifecycle methods
  init?(element: HTMLElement): void | Promise<void>
  destroy?(element: HTMLElement): void

  // Event handlers
  onClick?(element: HTMLElement, event: MouseEvent): void | Promise<void>
  onDoubleClick?(element: HTMLElement, event: MouseEvent): void | Promise<void>
  onKeydown?(element: HTMLElement, event: KeyboardEvent): void

  // Content management
  getValue?(element: HTMLElement): unknown
  setValue?(element: HTMLElement, value: unknown): void | Promise<void>
  isEmpty?(element: HTMLElement): boolean
  clear?(element: HTMLElement): void

  // Validation
  validate?(element: HTMLElement, value: unknown): { valid: boolean; message?: string }

  // UI actions
  getActions?(element: HTMLElement): EditableAction[]

  // Visual feedback
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
