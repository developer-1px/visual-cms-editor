/**
 * Selection System Entity Types
 * 
 * 선택 시스템과 관련된 모든 타입 정의
 */

export type SelectionType = "text" | "image" | "icon" | "link" | "repeatable" | "section"
export type SelectionContext = "canvas" | "sidebar"

export interface SelectedItem {
  id: string
  element: HTMLElement | number // HTMLElement for elements, number for section index
  type: SelectionType
  context: SelectionContext
  data?: any
}

export interface SelectionItem {
  id: string
  element: HTMLElement | number
  type: SelectionType
  context: SelectionContext
  data?: unknown
}

export interface SelectionState {
  selectedElements: Map<string, SelectionItem>
  activeType: SelectionType | null
  activeContext: SelectionContext | null
}

export interface SelectionManager {
  select(
    element: HTMLElement | number,
    type: SelectionType,
    context?: SelectionContext,
    data?: any,
    options?: { multi?: boolean }
  ): string
  deselect(elementOrId: HTMLElement | string): void
  clear(): void
  isSelected(element: HTMLElement, type?: SelectionType, context?: SelectionContext): boolean
  getSelection(): SelectedItem[]
  getConfig(): SelectionConfig
}

export interface SelectionConfig {
  mode: "select"
  allowCrossContext: boolean
  styles: Record<SelectionType, SelectionStyle>
}

export interface SelectionStyle {
  outline: string
  overlayColor: string
}