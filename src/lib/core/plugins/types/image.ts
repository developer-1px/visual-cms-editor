import type { EditablePlugin, EditableAction } from "../core/interfaces"
import { createPlugin } from "../utils/plugin-factory"
import {
  animateCopy,
  animateCut,
  animatePaste,
  animateDelete,
  fileToDataUrl,
  formatFileSize,
  getConstraints,
} from "../utils/plugin-helpers"

// Define constraint types
interface ImageConstraints {
  maxSize?: number
  allowedFormats?: string[]
  maxWidth?: number
  maxHeight?: number
}

// Image clipboard storage
let imageClipboard: string | null = null

// Export clipboard functions
export const setImageClipboard = (url: string | null) => {
  imageClipboard = url
}

export const getImageClipboard = () => imageClipboard

// Helper functions
const setupImageContainer = (element: HTMLElement): void => {
  // Now element is the container itself, no need to find parent
  // The container click is handled by the main click handler in the selection system
}

const getPlaceholder = (element: HTMLElement): HTMLElement | null => {
  // Now element is the container, find placeholder inside
  const placeholder = element.querySelector(".image-placeholder")
  return placeholder instanceof HTMLElement ? placeholder : null
}

const openFileDialog = (element: HTMLElement): void => {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = "image/*"

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const validation = imagePlugin.validate!(element, file)
      if (!validation.valid) {
        alert(validation.message)
        return
      }

      try {
        const dataUrl = await fileToDataUrl(file)
        imagePlugin.setValue!(element, dataUrl)

        // Trigger change event for history tracking
        element.dispatchEvent(
          new CustomEvent("imageChanged", {
            detail: { src: dataUrl, file },
          }),
        )
      } catch (error) {
        console.error("Error loading image:", error)
        alert("Failed to load image")
      }
    }
  }

  input.click()
}

const copyImage = (element: HTMLElement): void => {
  const imageUrl = imagePlugin.getValue!(element)
  if (imageUrl) {
    imageClipboard = imageUrl as string

    // Visual feedback
    animateCopy(element)

    // Also copy to system clipboard as data URL
    try {
      navigator.clipboard.writeText(imageUrl as string)
    } catch {
      // Failed to copy image URL to system clipboard - using internal clipboard only
    }
  }
}

const cutImage = (element: HTMLElement): void => {
  const imageUrl = imagePlugin.getValue!(element)
  if (imageUrl) {
    // First copy the image
    imageClipboard = imageUrl as string

    // Also copy to system clipboard as data URL
    try {
      navigator.clipboard.writeText(imageUrl as string)
    } catch {
      // Failed to copy image URL to system clipboard - using internal clipboard only
    }

    // Then clear the image
    imagePlugin.setValue!(element, "")

    // Trigger change event for history tracking
    element.dispatchEvent(
      new CustomEvent("imageChanged", {
        detail: { src: "", action: "cut" },
      }),
    )

    // Visual feedback
    animateCut(element)
  }
}

const pasteImage = (element: HTMLElement): void => {
  if (imageClipboard) {
    imagePlugin.setValue!(element, imageClipboard)

    // Trigger change event for history tracking
    element.dispatchEvent(
      new CustomEvent("imageChanged", {
        detail: { src: imageClipboard, action: "paste" },
      }),
    )

    // Visual feedback
    animatePaste(element)
  }
}

const deleteImage = (element: HTMLElement): void => {
  if (!imagePlugin.isEmpty!(element)) {
    // Visual feedback before deletion
    animateDelete(element)

    // Clear the image
    imagePlugin.setValue!(element, "")

    // Trigger change event for history tracking
    element.dispatchEvent(
      new CustomEvent("imageChanged", {
        detail: { src: "", action: "delete" },
      }),
    )
  }
}

const hasImageInClipboard = (): boolean => {
  return imageClipboard !== null
}

export const imagePlugin: EditablePlugin = createPlugin(
  {
    type: "image",
    name: "Image Editor",
    description: "Editable image content with upload and management",
    defaultConstraints: {
      allowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
      maxSize: 5242880, // 5MB
      minWidth: 100,
      minHeight: 100,
    },
    onClickSelected: openFileDialog,
  },
  {
    init(element: HTMLElement): void {
      setupImageContainer(element)
    },

  getValue(element: HTMLElement): string {
    // Now element is the container, find the img inside
    const img = element.querySelector(".content-image")
    return (img instanceof HTMLImageElement) ? img.src : ""
  },

  setValue(element: HTMLElement, value: string): void {
    // Now element is the container, find the img and placeholder inside
    const img = element.querySelector(".content-image")

    if (img instanceof HTMLImageElement) {
      if (value) {
        img.src = value
        // Use CSS custom properties for display control
        element.style.setProperty("--image-display", "block")
        element.style.setProperty("--placeholder-display", "none")
      } else {
        img.src = ""
        // Use CSS custom properties for display control
        element.style.setProperty("--image-display", "none")
        element.style.setProperty("--placeholder-display", "flex")
      }
    }
  },

  isEmpty(element: HTMLElement): boolean {
    // Now element is the container, find the img inside
    const img = element.querySelector(".content-image")
    return !(img instanceof HTMLImageElement && img.src && img.src !== "")
  },

  clear(element: HTMLElement): void {
    this.setValue!(element, "")
  },

    async validate(element: HTMLElement, file: File): Promise<{ valid: boolean; message?: string }> {
      const constraints = getConstraints<ImageConstraints>(
        element,
        imagePlugin.config.defaultConstraints as ImageConstraints
      )

      const { validateFile } = await import("../../../utils/validation-helpers")
      return validateFile(file, constraints)
    },

  getActions(element: HTMLElement): EditableAction[] {
    return [
      {
        id: "upload",
        label: "Upload Image",
        icon: "upload",
        handler: () => openFileDialog(element),
      },
      {
        id: "replace",
        label: "Replace Image",
        icon: "refresh",
        handler: () => openFileDialog(element),
        isAvailable: () => !this.isEmpty!(element),
      },
      {
        id: "copy",
        label: "Copy Image",
        icon: "copy",
        handler: () => copyImage(element),
        isAvailable: () => !this.isEmpty!(element),
      },
      {
        id: "cut",
        label: "Cut Image",
        icon: "scissors",
        handler: () => cutImage(element),
        isAvailable: () => !this.isEmpty!(element),
      },
      {
        id: "paste",
        label: "Paste Image",
        icon: "clipboard",
        handler: () => pasteImage(element),
        isAvailable: () => hasImageInClipboard(),
      },
      {
        id: "delete",
        label: "Remove Image",
        icon: "trash",
        handler: () => deleteImage(element),
        isDestructive: true,
        isAvailable: () => !this.isEmpty!(element),
      },
    ]
  },

  },
)