import { get } from "svelte/store"
import { selectionManager } from "./SelectionManager"
import type { TemplateElement } from "$lib/core/models/TemplateModels"

// Model과 Element를 연결하는 Registry
export class ModelElementRegistry {
  private modelToElement = new WeakMap<TemplateElement, HTMLElement>()
  private elementToModel = new WeakMap<HTMLElement, TemplateElement>()
  private idToModel = new Map<string, TemplateElement>()

  register(model: TemplateElement, element: HTMLElement) {
    this.modelToElement.set(model, element)
    this.elementToModel.set(element, model)
    this.idToModel.set(model.id, model)
  }

  unregister(model: TemplateElement) {
    const element = this.modelToElement.get(model)
    if (element) {
      this.elementToModel.delete(element)
    }
    this.modelToElement.delete(model)
    this.idToModel.delete(model.id)
  }

  getElement(model: TemplateElement): HTMLElement | undefined {
    return this.modelToElement.get(model)
  }

  getModel(element: HTMLElement): TemplateElement | undefined {
    return this.elementToModel.get(element)
  }

  getModelById(id: string): TemplateElement | undefined {
    return this.idToModel.get(id)
  }

  getAllModels(): TemplateElement[] {
    return Array.from(this.idToModel.values())
  }
}

// Global registry instance
export const modelElementRegistry = new ModelElementRegistry()

// Model 기반 Selection Manager
export class ModelSelectionManager {
  private keyboardHandler: ((e: KeyboardEvent) => void) | null = null
  private clickHandler: ((e: MouseEvent) => void) | null = null
  private currentEditingModel: TemplateElement | null = null

  constructor() {
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    // Global click handler for deselection
    this.clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const model = modelElementRegistry.getModel(target)

      // If clicking outside any registered model element
      if (!model && !target.closest(".selection-overlay")) {
        selectionManager.clear()
      }
    }

    // Keyboard navigation
    this.keyboardHandler = (e: KeyboardEvent) => {
      const items = get(selectionManager.selectedItems)

      if (items.length === 0) return

      switch (e.key) {
        case "Enter":
          if (!this.currentEditingModel && items.length === 1) {
            e.preventDefault()
            const model = modelElementRegistry.getModelById(items[0].id)
            if (model) {
              this.enterEditMode(model)
            }
          }
          break

        case "Escape":
          e.preventDefault()
          if (this.currentEditingModel) {
            this.exitEditMode()
          } else {
            selectionManager.clear()
          }
          break

        case "Tab":
          e.preventDefault()
          this.navigateNext(e.shiftKey)
          break

        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          if (!this.currentEditingModel) {
            e.preventDefault()
            this.navigateDirection(e.key)
          }
          break

        case "Delete":
        case "Backspace":
          if (!this.currentEditingModel && items.length > 0) {
            e.preventDefault()
            this.deleteSelected()
          }
          break
      }

      // Copy/paste handling
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "c":
            if (!this.currentEditingModel) {
              e.preventDefault()
              this.copySelected()
            }
            break

          case "v":
            if (!this.currentEditingModel) {
              e.preventDefault()
              this.pasteContent()
            }
            break

          case "x":
            if (!this.currentEditingModel) {
              e.preventDefault()
              this.cutSelected()
            }
            break

          case "a":
            if (!this.currentEditingModel) {
              e.preventDefault()
              this.selectAll()
            }
            break
        }
      }
    }

    document.addEventListener("click", this.clickHandler)
    document.addEventListener("keydown", this.keyboardHandler)
  }

  // Selection methods using Model
  selectModel(model: TemplateElement): void {
    const element = modelElementRegistry.getElement(model)
    if (!element) return

    const type = this.getModelType(model)
    selectionManager.select(element, type, "canvas", model)
  }

  selectMultipleModels(models: TemplateElement[]): void {
    selectionManager.clear()
    models.forEach((model) => {
      const element = modelElementRegistry.getElement(model)
      if (element) {
        const type = this.getModelType(model)
        selectionManager.select(element, type, "canvas", model, { multi: true })
      }
    })
  }

  // Edit mode methods using Model
  enterEditMode(model: TemplateElement): void {
    this.currentEditingModel = model

    // Dispatch custom event for plugins to handle
    const event = new CustomEvent("enterEditMode", {
      detail: { model },
      bubbles: true,
    })

    const element = modelElementRegistry.getElement(model)
    element?.dispatchEvent(event)
  }

  exitEditMode(): void {
    if (this.currentEditingModel) {
      const event = new CustomEvent("exitEditMode", {
        detail: { model: this.currentEditingModel },
        bubbles: true,
      })

      const element = modelElementRegistry.getElement(this.currentEditingModel)
      element?.dispatchEvent(event)

      this.currentEditingModel = null
    }
  }

  // Navigation methods using Model
  private navigateNext(reverse: boolean = false): void {
    const allModels = modelElementRegistry.getAllModels().filter((model) => this.isEditable(model))

    const selectedItems = get(selectionManager.selectedItems)
    if (selectedItems.length === 0) return

    const currentModel = modelElementRegistry.getModelById(selectedItems[0].id)
    if (!currentModel) return

    const currentIndex = allModels.indexOf(currentModel)

    let nextIndex = reverse ? currentIndex - 1 : currentIndex + 1
    if (nextIndex < 0) nextIndex = allModels.length - 1
    if (nextIndex >= allModels.length) nextIndex = 0

    const nextModel = allModels[nextIndex]
    selectionManager.clear()
    this.selectModel(nextModel)
  }

  private navigateDirection(key: string): void {
    const isBackward = key === "ArrowUp" || key === "ArrowLeft"
    this.navigateNext(isBackward)
  }

  private selectAll(): void {
    const allEditableModels = modelElementRegistry.getAllModels().filter((model) => this.isEditable(model))

    this.selectMultipleModels(allEditableModels)
  }

  // Action methods using Model
  private copySelected(): void {
    const selectedItems = get(selectionManager.selectedItems)
    const contents = selectedItems
      .map((item) => {
        const model = item.data as TemplateElement
        return this.getModelContent(model)
      })
      .filter((content) => content)

    if (contents.length > 0) {
      navigator.clipboard.writeText(contents.join("\n"))
    }
  }

  private async pasteContent(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText()
      const selectedItems = get(selectionManager.selectedItems)

      if (text && selectedItems.length === 1) {
        const model = selectedItems[0].data as TemplateElement
        this.setModelContent(model, text)
      }
    } catch (err) {
      console.error("Failed to paste:", err)
    }
  }

  private cutSelected(): void {
    this.copySelected()
    this.deleteSelected()
  }

  private deleteSelected(): void {
    const selectedItems = get(selectionManager.selectedItems)

    selectedItems.forEach((item) => {
      const model = item.data as TemplateElement
      this.setModelContent(model, "")
    })
  }

  // Helper methods
  private getModelType(model: TemplateElement): string {
    if ("type" in model && model.type !== "frame") {
      return model.type
    }
    if (model.attributes?.["data-repeatable"]) {
      return "repeatable"
    }
    return "frame"
  }

  private isEditable(model: TemplateElement): boolean {
    return "type" in model && model.type !== "frame"
  }

  private getModelContent(model: TemplateElement): string {
    if ("content" in model) {
      return model.content || ""
    }
    return ""
  }

  private setModelContent(model: TemplateElement, content: string): void {
    if ("content" in model) {
      model.content = content

      // Dispatch change event
      const event = new CustomEvent("modelContentChanged", {
        detail: { model, content },
        bubbles: true,
      })

      const element = modelElementRegistry.getElement(model)
      element?.dispatchEvent(event)
    }
  }

  // Cleanup
  destroy(): void {
    if (this.clickHandler) {
      document.removeEventListener("click", this.clickHandler)
    }
    if (this.keyboardHandler) {
      document.removeEventListener("keydown", this.keyboardHandler)
    }
  }
}

// Global instance
export const modelSelectionManager = new ModelSelectionManager()
