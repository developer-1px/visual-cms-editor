import type { EditablePlugin, EditableAction } from "../core/interfaces"
import { isElementSelected, getConstraints, createEmptyStyleHandlers } from "./plugin-helpers"

export interface PluginFactoryOptions {
  type: string
  name: string
  description: string
  defaultConstraints?: Record<string, unknown>
  onClickSelected: (element: HTMLElement) => void
}

/**
 * 플러그인 생성을 위한 팩토리 함수
 * 공통 패턴을 추상화하여 코드 중복 제거
 */
export const createPlugin = (
  options: PluginFactoryOptions,
  implementation: Partial<EditablePlugin>
): EditablePlugin => {
  return {
    config: {
      type: options.type,
      name: options.name,
      description: options.description,
      defaultConstraints: options.defaultConstraints,
    },

    init(element: HTMLElement): void {
      element.setAttribute(`data-${options.type}-plugin`, "true")
      implementation.init?.(element)
    },

    destroy(element: HTMLElement): void {
      element.removeAttribute(`data-${options.type}-plugin`)
      implementation.destroy?.(element)
    },

    onClick(element: HTMLElement): void {
      const isSelected = isElementSelected(element, options.type)
      if (isSelected) {
        options.onClickSelected(element)
      }
      implementation.onClick?.(element)
    },

    onDoubleClick(element: HTMLElement): void {
      options.onClickSelected(element)
      implementation.onDoubleClick?.(element)
    },

    getValue(element: HTMLElement): unknown {
      return implementation.getValue?.(element) ?? ""
    },

    setValue(element: HTMLElement, value: unknown): void {
      implementation.setValue?.(element, value)
    },

    isEmpty(element: HTMLElement): boolean {
      return implementation.isEmpty?.(element) ?? true
    },

    clear(element: HTMLElement): void {
      implementation.clear?.(element)
    },

    validate(element: HTMLElement, value: unknown): { valid: boolean; message?: string } {
      return implementation.validate?.(element, value) ?? { valid: true }
    },

    getActions(element: HTMLElement): EditableAction[] {
      return implementation.getActions?.(element) ?? []
    },

    getConstraints(element: HTMLElement): Record<string, unknown> {
      return getConstraints(element, options.defaultConstraints ?? {})
    },

    ...createEmptyStyleHandlers(),

    // Allow custom methods to be added
    ...implementation,
  } as EditablePlugin
}