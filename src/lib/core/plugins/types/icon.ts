import type { EditablePlugin, EditableAction } from "../core/interfaces"
import { selectionManager } from "$lib/core/selection/SelectionManager"

// Common icon sets
const ICON_SETS = {
  lucide: {
    name: "Lucide",
    icons: [
      "lightning",
      "lock",
      "heart",
      "star",
      "check",
      "arrow-right",
      "user",
      "globe",
      "cog",
      "shield",
      "home",
      "settings",
      "search",
      "plus",
      "minus",
      "x",
      "arrow-left",
      "arrow-up",
      "arrow-down",
      "edit",
      "trash",
      "download",
      "upload",
      "mail",
      "phone",
      "map-pin",
      "calendar",
      "clock",
      "camera",
      "image",
      "video",
      "music",
      "book",
      "file",
      "folder",
      "link",
      "share",
      "bookmark",
      "tag",
      "flag",
    ],
  },
}

export const iconPlugin: EditablePlugin = {
  config: {
    type: "icon",
    name: "Icon Editor",
    description: "Editable icon with icon picker and customization",
    defaultConstraints: {
      iconSet: "lucide",
      size: 24,
      color: "currentColor",
    },
  },

  init(element: HTMLElement): void {
    element.setAttribute("data-icon-plugin", "true")
    this.setupIcon(element)
  },

  destroy(element: HTMLElement): void {
    element.removeAttribute("data-icon-plugin")
  },

  onClick(element: HTMLElement): void {
    // Check if element is already selected by looking for selection manager styles
    const isSelected = this.isElementSelected(element)

    if (isSelected) {
      // If already selected, open icon picker for selection/replace
      this.openIconPicker(element)
    }
    // If not selected, let the selection manager handle selection first
    // Icon picker will be triggered on next click when selected
  },

  onDoubleClick(element: HTMLElement): void {
    this.openIconPicker(element)
  },

  getValue(element: HTMLElement): { icon: string; size?: number; color?: string } {
    const iconName = element.getAttribute("data-icon") || ""
    const size = parseInt(element.getAttribute("data-icon-size") || "24")
    const color = element.getAttribute("data-icon-color") || "currentColor"

    return { icon: iconName, size, color }
  },

  setValue(element: HTMLElement, value: { icon: string; size?: number; color?: string }): void {
    element.setAttribute("data-icon", value.icon)
    if (value.size) {
      element.setAttribute("data-icon-size", value.size.toString())
    }
    if (value.color) {
      element.setAttribute("data-icon-color", value.color)
    }

    this.renderIcon(element, value.icon, value.size, value.color)
  },

  isEmpty(element: HTMLElement): boolean {
    return !element.getAttribute("data-icon")
  },

  clear(element: HTMLElement): void {
    element.removeAttribute("data-icon")
    element.removeAttribute("data-icon-size")
    element.removeAttribute("data-icon-color")
    element.innerHTML = ""
  },

  getActions(element: HTMLElement): EditableAction[] {
    return [
      {
        id: "change-icon",
        label: "Change Icon",
        icon: "edit",
        handler: () => this.openIconPicker(element),
      },
      {
        id: "customize",
        label: "Customize",
        icon: "settings",
        handler: () => this.openCustomizer(element),
        isAvailable: () => !this.isEmpty(element),
      },
      {
        id: "remove",
        label: "Remove Icon",
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
  isElementSelected(element: HTMLElement): boolean {
    // Check if element is currently selected in the selection manager
    return selectionManager.isSelected(element, "icon", "canvas")
  },

  setupIcon(element: HTMLElement): void {
    const currentIcon = element.getAttribute("data-icon")
    if (currentIcon) {
      const size = parseInt(element.getAttribute("data-icon-size") || "24")
      const color = element.getAttribute("data-icon-color") || "currentColor"
      this.renderIcon(element, currentIcon, size, color)
    }
  },

  renderIcon(element: HTMLElement, iconName: string, size = 24, color = "currentColor"): void {
    // For now, we'll use a simple SVG placeholder
    // In a real implementation, you'd integrate with an icon library like Lucide
    element.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <title>${iconName}</title>
        ${this.getIconPath(iconName)}
      </svg>
    `
  },

  getIconPath(iconName: string): string {
    // Simple icon path mappings - in real implementation, use proper icon library
    const iconPaths: Record<string, string> = {
      "home": '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>',
      "user": '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      "heart":
        '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
      "star":
        '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>',
      "lightning":
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>',
      "lock":
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>',
      "check": '<polyline points="20,6 9,17 4,12"/>',
      "arrow-right": '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>',
      "globe":
        '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
      "cog":
        '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
      "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      "settings":
        '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
      "default": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    }

    return iconPaths[iconName] || iconPaths["default"]
  },

  openIconPicker(element: HTMLElement): void {
    // Create a simple icon picker modal
    const modal = this.createIconPickerModal(element)
    document.body.appendChild(modal)
  },

  createIconPickerModal(element: HTMLElement): HTMLElement {
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"

    const content = document.createElement("div")
    content.className = "bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto"

    content.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Choose Icon</h3>
        <button class="close-btn text-gray-500 hover:text-gray-700">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-6 gap-2">
        ${ICON_SETS.lucide.icons
          .map(
            (icon) => `
          <button class="icon-option p-2 hover:bg-gray-100 rounded border border-transparent hover:border-gray-300 transition-colors" data-icon="${icon}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${this.getIconPath(icon)}
            </svg>
          </button>
        `,
          )
          .join("")}
      </div>
    `

    modal.appendChild(content)

    // Event listeners
    content.querySelector(".close-btn")?.addEventListener("click", () => {
      modal.remove()
    })

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove()
      }
    })

    content.querySelectorAll(".icon-option").forEach((button) => {
      button.addEventListener("click", () => {
        const iconName = (button as HTMLElement).getAttribute("data-icon")!
        this.setValue(element, { icon: iconName })

        // Trigger change event
        element.dispatchEvent(
          new CustomEvent("iconChanged", {
            detail: { icon: iconName },
          }),
        )

        modal.remove()
      })
    })

    return modal
  },

  openCustomizer(element: HTMLElement): void {
    // Simple size customizer
    const currentValue = this.getValue(element)
    const newSize = prompt("Enter icon size (pixels):", currentValue.size?.toString() || "24")

    if (newSize && !isNaN(parseInt(newSize))) {
      this.setValue(element, {
        ...currentValue,
        size: parseInt(newSize),
      })

      element.dispatchEvent(
        new CustomEvent("iconChanged", {
          detail: { ...currentValue, size: parseInt(newSize) },
        }),
      )
    }
  },
}
