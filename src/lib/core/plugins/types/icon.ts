import type { EditablePlugin, EditableAction } from "../core/interfaces"
import { createPlugin } from "../utils/plugin-factory"
import { getConstraints } from "../utils/plugin-helpers"

// Common icon sets
const ICON_SETS = {
  lucide: {
    name: "Lucide",
    icons: [
      "lightning", "lock", "heart", "star", "check", "arrow-right",
      "user", "globe", "cog", "shield", "home", "settings",
      "search", "plus", "minus", "x", "arrow-left", "arrow-up",
      "arrow-down", "edit", "trash", "download", "upload", "mail",
      "phone", "map-pin", "calendar", "clock", "camera", "image",
      "video", "music", "book", "file", "folder", "link",
      "share", "bookmark", "tag", "flag",
    ],
  },
}

// Icon path mappings
const ICON_PATHS: Record<string, string> = {
  "home": '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>',
  "user": '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  "heart": '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  "star": '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>',
  "lightning": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>',
  "lock": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>',
  "check": '<polyline points="20,6 9,17 4,12"/>',
  "arrow-right": '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>',
  "globe": '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  "cog": '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  "settings": '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  "default": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
}

// Helper functions
const getIconPath = (iconName: string): string => {
  return ICON_PATHS[iconName] || ICON_PATHS["default"]
}

const setupIcon = (element: HTMLElement): void => {
  const currentIcon = element.getAttribute("data-icon")
  if (currentIcon) {
    const size = parseInt(element.getAttribute("data-icon-size") || "24")
    const color = element.getAttribute("data-icon-color") || "currentColor"
    renderIcon(element, currentIcon, size, color)
  }
}

const renderIcon = (element: HTMLElement, iconName: string, size = 24, color = "currentColor"): void => {
  element.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <title>${iconName}</title>
      ${getIconPath(iconName)}
    </svg>
  `
}

const openIconPicker = (element: HTMLElement): void => {
  const modal = createIconPickerModal(element)
  document.body.appendChild(modal)
}

const createIconPickerModal = (element: HTMLElement): HTMLElement => {
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
            ${getIconPath(icon)}
          </svg>
        </button>
      `,
        )
        .join("")}
    </div>
  `

  modal.appendChild(content)

  // Event handlers
  const closeBtn = content.querySelector(".close-btn") as HTMLButtonElement
  const iconOptions = content.querySelectorAll(".icon-option")

  closeBtn.onclick = () => modal.remove()
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove()
  }

  iconOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const iconName = option.getAttribute("data-icon")
      if (iconName) {
        const size = parseInt(element.getAttribute("data-icon-size") || "24")
        const color = element.getAttribute("data-icon-color") || "currentColor"
        iconPlugin.setValue!(element, { icon: iconName, size, color })
      }
      modal.remove()
    })
  })

  return modal
}

const openCustomizer = (element: HTMLElement): void => {
  const modal = createCustomizerModal(element)
  document.body.appendChild(modal)
}

const createCustomizerModal = (element: HTMLElement): HTMLElement => {
  const currentSize = parseInt(element.getAttribute("data-icon-size") || "24")
  const currentColor = element.getAttribute("data-icon-color") || "currentColor"

  const modal = document.createElement("div")
  modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"

  const content = document.createElement("div")
  content.className = "bg-white rounded-lg p-6 max-w-sm w-full mx-4"

  content.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Customize Icon</h3>
      <button class="close-btn text-gray-500 hover:text-gray-700">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Size</label>
        <input type="range" min="16" max="48" value="${currentSize}" step="4" class="size-slider w-full">
        <div class="text-sm text-gray-500 mt-1">Size: <span class="size-value">${currentSize}px</span></div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
        <input type="color" value="${currentColor === "currentColor" ? "#000000" : currentColor}" class="color-picker w-full h-10 rounded border border-gray-300">
      </div>
      <button class="apply-btn w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        Apply Changes
      </button>
    </div>
  `

  modal.appendChild(content)

  // Event handlers
  const closeBtn = content.querySelector(".close-btn") as HTMLButtonElement
  const sizeSlider = content.querySelector(".size-slider") as HTMLInputElement
  const sizeValue = content.querySelector(".size-value") as HTMLSpanElement
  const colorPicker = content.querySelector(".color-picker") as HTMLInputElement
  const applyBtn = content.querySelector(".apply-btn") as HTMLButtonElement

  closeBtn.onclick = () => modal.remove()
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove()
  }

  sizeSlider.oninput = () => {
    sizeValue.textContent = `${sizeSlider.value}px`
  }

  applyBtn.onclick = () => {
    const iconName = element.getAttribute("data-icon") || ""
    iconPlugin.setValue!(element, {
      icon: iconName,
      size: parseInt(sizeSlider.value),
      color: colorPicker.value,
    })
    modal.remove()
  }

  return modal
}

// Create the plugin using factory
export const iconPlugin: EditablePlugin = createPlugin(
  {
    type: "icon",
    name: "Icon Editor",
    description: "Editable icon with icon picker and customization",
    defaultConstraints: {
      iconSet: "lucide",
      size: 24,
      color: "currentColor",
    },
    onClickSelected: openIconPicker,
    onDoubleClick: openIconPicker,
  },
  {
    init(element: HTMLElement): void {
      element.setAttribute("data-icon-plugin", "true")
      setupIcon(element)
    },

    destroy(element: HTMLElement): void {
      element.removeAttribute("data-icon-plugin")
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
      renderIcon(element, value.icon, value.size, value.color)
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
          handler: () => openIconPicker(element),
        },
        {
          id: "customize",
          label: "Customize",
          icon: "settings",
          handler: () => openCustomizer(element),
          isAvailable: () => !iconPlugin.isEmpty!(element),
        },
        {
          id: "remove",
          label: "Remove Icon",
          icon: "trash",
          handler: () => iconPlugin.clear!(element),
          isDestructive: true,
          isAvailable: () => !iconPlugin.isEmpty!(element),
        },
      ]
    },
  }
)