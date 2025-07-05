import type { EditablePlugin } from "../core/interfaces"
import { selectionManager } from "../../selection/SelectionManager"

export const linkPlugin: EditablePlugin = {
  config: {
    type: "link",
    name: "Link Editor",
    description: "Editable link with URL and text management",
    defaultConstraints: {
      allowedProtocols: ["http", "https", "mailto", "tel"],
      maxLength: 200,
    },
  },

  init(): void {
    // Links don't need special initialization
    // Browser handles default link behavior
  },

  destroy(): void {
    // Nothing to clean up
  },

  onClick(element: HTMLElement): void {
    // Check if element is already selected
    const isSelected = this.isElementSelected(element)

    if (isSelected) {
      this.openLinkEditor(element)
    }
    // Selection and event prevention are handled by the selection system
  },

  onDoubleClick(element: HTMLElement): void {
    this.openLinkEditor(element)
  },

  getValue(element: HTMLElement): { href: string; text: string } {
    const href = element.getAttribute("href") || "#"
    const textElement = element.querySelector('[data-editable="text"]') as HTMLElement
    const text = textElement ? textElement.textContent || "" : element.textContent || ""

    return { href, text }
  },

  setValue(element: HTMLElement, value: unknown): void {
    if (typeof value === "object" && value !== null && "href" in value) {
      const linkValue = value as { href: string; text?: string }

      if (linkValue.href) {
        element.setAttribute("href", linkValue.href)
      }

      if (linkValue.text) {
        const textElement = element.querySelector('[data-editable="text"]') as HTMLElement
        if (textElement) {
          textElement.textContent = linkValue.text
        } else {
          element.textContent = linkValue.text
        }
      }
    }
  },

  isEmpty(element: HTMLElement): boolean {
    const href = element.getAttribute("href")
    const text = element.textContent?.trim()
    return (!href || href === "#") && !text
  },

  clear(element: HTMLElement): void {
    element.setAttribute("href", "#")
    element.textContent = "Link"
  },

  getActions(element: HTMLElement): Array<{
    id: string
    label: string
    icon?: string
    handler: () => void
  }> {
    return [
      {
        id: "edit-link",
        label: "Edit Link",
        icon: "link",
        handler: () => this.openLinkEditor(element),
      },
      {
        id: "open-link",
        label: "Open Link",
        icon: "external-link",
        handler: () => {
          const href = element.getAttribute("href")
          if (href && href !== "#") {
            window.open(href, "_blank")
          }
        },
      },
    ]
  },

  // Helper methods
  isElementSelected(element: HTMLElement): boolean {
    return selectionManager.isSelected(element, "link", "canvas")
  },

  openLinkEditor(element: HTMLElement): void {
    const currentValue = this.getValue(element)

    // Simple prompt for now - could be replaced with a custom modal
    const newHref = prompt("Enter URL:", currentValue.href)

    if (newHref !== null) {
      const textElement = element.querySelector('[data-editable="text"]') as HTMLElement
      const currentText = textElement ? textElement.textContent || "" : element.textContent || ""
      const newText = prompt("Enter link text:", currentText)

      if (newText !== null) {
        this.setValue(element, { href: newHref, text: newText })
      }
    }
  },
}
