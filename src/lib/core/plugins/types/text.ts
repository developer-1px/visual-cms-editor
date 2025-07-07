import type { EditablePlugin, EditableAction } from "../core/interfaces"

export const textPlugin: EditablePlugin = {
  config: {
    type: "text",
    name: "Text Editor",
    description: "Editable text content with rich text support",
    defaultConstraints: {
      maxLength: 1000,
      minLength: 0,
      allowHTML: false,
    },
  },

  init(element: HTMLElement): void {
    // Add text-specific initialization
    element.setAttribute("data-text-plugin", "true")
  },

  destroy(element: HTMLElement): void {
    element.removeAttribute("data-text-plugin")
    element.removeAttribute("contenteditable")
  },

  onClick(element: HTMLElement): void {
    // Handle text element click - start editing for single click on already selected element
    // Text element clicked - checking selection state

    // Check if element is already selected and this is a second click
    if (element.hasAttribute("data-selected")) {
      this.startEdit(element)
    }
  },

  onDoubleClick(element: HTMLElement): void {
    // Start editing on double click
    this.startEdit(element)
  },

  onKeydown(element: HTMLElement, event: KeyboardEvent): void {
    // 편집 모드에서는 기본 키 동작을 허용
    if (event.key === "Escape") {
      event.preventDefault()
      this.stopEdit(element)
      return
    }
    
    // Enter, Space 등 다른 키들은 자연스럽게 처리되도록 함
    // contenteditable에서 기본 동작 허용
  },

  getValue(element: HTMLElement): string {
    return element.textContent || ""
  },

  setValue(element: HTMLElement, value: string): void {
    element.textContent = value
  },

  isEmpty(element: HTMLElement): boolean {
    return !element.textContent?.trim()
  },

  clear(element: HTMLElement): void {
    element.textContent = ""
  },

  async validate(element: HTMLElement, value: string): Promise<{ valid: boolean; message?: string }> {
    const constraints = this.getConstraints(element)
    
    const { isTextLengthValid } = await import("../../../utils/validation-helpers")
    return isTextLengthValid(value, constraints)
  },

  getActions(element: HTMLElement): EditableAction[] {
    return [
      {
        id: "edit",
        label: "Edit Text",
        icon: "edit",
        handler: () => this.startEdit(element),
      },
      {
        id: "clear",
        label: "Clear Text",
        icon: "trash",
        handler: () => this.clear(element),
        isDestructive: true,
        isAvailable: () => !this.isEmpty(element),
      },
    ]
  },

  applyStyles(): void {
    // DOM 조작 없음 - 순수한 상태 관리만
    // 실제 스타일링은 Svelte 컴포넌트에서 반응적으로 처리
  },

  removeStyles(): void {
    // DOM 조작 없음 - 순수한 상태 관리만
    // 실제 스타일 제거는 Svelte 컴포넌트에서 반응적으로 처리
  },

  // Private methods
  startEdit(element: HTMLElement): void {
    console.log('🚫 Legacy text plugin startEdit called - SHOULD NOT BE USED')
    // This method should not be called anymore
    // ModelTextPlugin handles editing now
  },

  stopEdit(element: HTMLElement): void {
    console.log('🚫 Legacy text plugin stopEdit called - SHOULD NOT BE USED')
    // This method should not be called anymore
    // ModelTextPlugin handles editing now
  },

  getConstraints(element: HTMLElement): Record<string, unknown> {
    const constraintsAttr = element.getAttribute("data-constraints")
    if (constraintsAttr) {
      try {
        return JSON.parse(constraintsAttr)
      } catch {
        // Ignore invalid JSON
      }
    }
    return this.config.defaultConstraints || {}
  },

  handleTextInput(e: Event): void {
    const element = e.target as HTMLElement
    // Dispatch a custom event for history management
    const historyEvent = new CustomEvent("textChanged", {
      detail: { element, text: element.textContent },
    })
    document.dispatchEvent(historyEvent)
  },

  handleFocus(e: FocusEvent): void {
    console.log('🚫 Legacy text plugin handleFocus called - SHOULD NOT BE USED')
    // This method should not be called anymore
    // ModelTextPlugin handles focus events now
  },

  handleBlur(e: FocusEvent): void {
    console.log('🚫 Legacy text plugin handleBlur called - SHOULD NOT BE USED')
    // This method should not be called anymore
    // ModelTextPlugin handles blur events now
  },
}
