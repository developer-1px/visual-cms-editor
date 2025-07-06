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
    console.log("Text element clicked:", element)

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
    if (event.key === "Escape") {
      event.preventDefault()
      this.stopEdit(element)
    }
    // Enter key will naturally create line breaks in contenteditable
    // No need to prevent default or stop editing
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

  validate(element: HTMLElement, value: string): { valid: boolean; message?: string } {
    const constraints = this.getConstraints(element)

    if (constraints.maxLength && value.length > constraints.maxLength) {
      return {
        valid: false,
        message: `Text exceeds maximum length of ${constraints.maxLength} characters`,
      }
    }

    if (constraints.minLength && value.length < constraints.minLength) {
      return {
        valid: false,
        message: `Text must be at least ${constraints.minLength} characters`,
      }
    }

    return { valid: true }
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
    console.log("[TextPlugin] Starting edit mode for:", element)

    // Set contenteditable with plaintext-only to prevent HTML formatting
    element.setAttribute("contenteditable", "plaintext-only")
    element.setAttribute("data-editing", "true")

    // white-space: pre-wrap은 이제 CSS에서 항상 적용됨

    // Focus the element
    element.focus()

    // Don't select all text - let the cursor stay where clicked
    // The browser will automatically place the cursor at the click position

    // Add event listeners for editing
    element.addEventListener("blur", this.handleBlur.bind(this))
    element.addEventListener("input", this.handleTextInput.bind(this))
    element.addEventListener("keydown", (e) => this.onKeydown(element, e))
  },

  stopEdit(element: HTMLElement): void {
    console.log("[TextPlugin] Stopping edit mode for:", element)

    // Remove contenteditable
    element.removeAttribute("contenteditable")
    element.removeAttribute("data-editing")

    // white-space는 CSS에서 항상 적용되므로 제거하지 않음

    // Remove event listeners
    element.removeEventListener("blur", this.handleBlur.bind(this))
    element.removeEventListener("input", this.handleTextInput.bind(this))

    // Blur the element
    element.blur()
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

  handleBlur(e: FocusEvent): void {
    const element = e.target as HTMLElement

    // Use setTimeout to check if focus moved to another element
    setTimeout(() => {
      const activeEl = document.activeElement as HTMLElement

      // If focus moved away from this element, stop editing
      if (activeEl !== element) {
        this.stopEdit(element)
      }
    }, 0)
  },
}
