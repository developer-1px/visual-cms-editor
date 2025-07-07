import { LoroDoc } from "loro-crdt"

export interface HistoryInfo {
  canUndo: boolean
  canRedo: boolean
  currentVersion: number
  totalVersions: number
  currentText: string
}

export interface HistoryManager {
  canUndo(): boolean
  canRedo(): boolean
  undo(): string | null // Returns element ID that was changed
  redo(): string | null // Returns element ID that was changed
  startTransaction(): void
  commitTransaction(): void
  clear(): void
  getHistoryInfo(elementId: string): HistoryInfo | null
  registerElement(element: HTMLElement, initialText?: string): string
  updateText(elementId: string, newText: string): void
  onTextChange(elementId: string, callback: (text: string) => void): void
  getElementId(element: HTMLElement): string | undefined
  getElementById(elementId: string): HTMLElement | undefined
  commitPendingChanges(elementId?: string): void
  // DOM structure history methods
  saveState(): void
  saveStructuralState(container: HTMLElement): void
}

interface TextHistory {
  doc: LoroDoc
  text: LoroText
  versions: string[]
  currentIndex: number
  lastEditTimestamp: number
}

interface EditAction {
  elementId: string
  timestamp: number
  fromText: string
  toText: string
}

interface StructuralSnapshot {
  id: string
  timestamp: number
  html: string
}

export class LoroHistoryManager implements HistoryManager {
  private textHistories: Map<string, TextHistory> = new Map()
  private elementIdMap: WeakMap<HTMLElement, string> = new WeakMap()
  private elementMap: Map<string, WeakRef<HTMLElement>> = new Map()
  private listeners: Map<string, (text: string) => void> = new Map()
  private pendingUpdates: Map<string, { text: string; timer: number }> = new Map()
  private updateDelay = 500 // 500ms delay for grouping edits
  private editHistory: EditAction[] = [] // Global edit history
  private editHistoryIndex: number = -1 // Current position in edit history

  // DOM structure history
  private structuralSnapshots: StructuralSnapshot[] = []
  private structuralHistoryIndex: number = -1
  private contentContainer: HTMLElement | null = null

  constructor() {}

  registerElement(element: HTMLElement, initialText: string = ""): string {
    let elementId = this.elementIdMap.get(element)

    if (!elementId) {
      elementId = `text-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      this.elementIdMap.set(element, elementId)
      this.elementMap.set(elementId, new WeakRef(element))

      const doc = new LoroDoc()
      const text = doc.getText("content")

      // Initialize with the initial text
      if (initialText) {
        text.insert(0, initialText)
      }

      // Store the initial version
      const history: TextHistory = {
        doc,
        text,
        versions: [initialText],
        currentIndex: 0,
        lastEditTimestamp: Date.now(),
      }

      this.textHistories.set(elementId, history)

      // Subscribe to changes
      doc.subscribe(() => {
        const listener = this.listeners.get(elementId!)
        if (listener) {
          listener(text.toString())
        }
      })
    }

    return elementId
  }

  updateText(elementId: string, newText: string): void {
    const history = this.textHistories.get(elementId)
    if (!history) return

    const currentText = history.text.toString()
    if (currentText === newText) return

    // Update the text immediately in Loro
    history.text.delete(0, currentText.length)
    history.text.insert(0, newText)

    // Cancel any pending history save for this element
    const pending = this.pendingUpdates.get(elementId)
    if (pending) {
      clearTimeout(pending.timer)
    }

    // Schedule history save after delay
    const timer = window.setTimeout(() => {
      // Save to history
      const fromText = history.versions[history.currentIndex]

      // Remove any versions after current index (for redo functionality)
      history.versions = history.versions.slice(0, history.currentIndex + 1)
      history.versions.push(newText)
      history.currentIndex = history.versions.length - 1

      // Update last edit timestamp
      history.lastEditTimestamp = Date.now()

      // Add to global edit history
      const editAction: EditAction = {
        elementId,
        timestamp: history.lastEditTimestamp,
        fromText,
        toText: newText,
      }

      // Remove any actions after current index
      this.editHistory = this.editHistory.slice(0, this.editHistoryIndex + 1)
      this.editHistory.push(editAction)
      this.editHistoryIndex = this.editHistory.length - 1

      // Limit history size
      if (history.versions.length > 50) {
        history.versions.shift()
        history.currentIndex--
      }

      // Limit global history size
      if (this.editHistory.length > 100) {
        this.editHistory.shift()
        this.editHistoryIndex--
      }

      // Clean up pending update
      this.pendingUpdates.delete(elementId)
    }, this.updateDelay)

    // Store pending update
    this.pendingUpdates.set(elementId, { text: newText, timer })
  }

  onTextChange(elementId: string, callback: (text: string) => void): void {
    this.listeners.set(elementId, callback)
  }

  canUndo(): boolean {
    return this.editHistoryIndex >= 0 || this.structuralHistoryIndex > 0
  }

  canRedo(): boolean {
    return (
      this.editHistoryIndex < this.editHistory.length - 1 ||
      this.structuralHistoryIndex < this.structuralSnapshots.length - 1
    )
  }

  undo(): string | null {
    // Prioritize structural undo over text undo for now
    if (this.structuralHistoryIndex > 0 && this.contentContainer) {
      this.structuralHistoryIndex--
      const snapshot = this.structuralSnapshots[this.structuralHistoryIndex]
      this.contentContainer.innerHTML = snapshot.html
      return "structural-change"
    }

    // Fallback to text undo
    if (this.editHistoryIndex >= 0) {
      const action = this.editHistory[this.editHistoryIndex]
      const history = this.textHistories.get(action.elementId)

      if (!history) return null

      // Apply the undo
      const currentText = history.text.toString()
      history.text.delete(0, currentText.length)
      history.text.insert(0, action.fromText)

      // Update the element's history index
      history.currentIndex = history.versions.indexOf(action.fromText)
      if (history.currentIndex === -1) {
        history.currentIndex = Math.max(0, history.currentIndex - 1)
      }

      // Move the global history index back
      this.editHistoryIndex--

      // Notify listeners
      const listener = this.listeners.get(action.elementId)
      if (listener) {
        listener(action.fromText)
      }

      return action.elementId
    }

    return null
  }

  redo(): string | null {
    // Prioritize structural redo over text redo for now
    if (this.structuralHistoryIndex < this.structuralSnapshots.length - 1 && this.contentContainer) {
      this.structuralHistoryIndex++
      const snapshot = this.structuralSnapshots[this.structuralHistoryIndex]
      this.contentContainer.innerHTML = snapshot.html
      return "structural-change"
    }

    // Fallback to text redo
    if (this.editHistoryIndex < this.editHistory.length - 1) {
      this.editHistoryIndex++
      const action = this.editHistory[this.editHistoryIndex]
      const history = this.textHistories.get(action.elementId)

      if (!history) return null

      // Apply the redo
      const currentText = history.text.toString()
      history.text.delete(0, currentText.length)
      history.text.insert(0, action.toText)

      // Update the element's history index
      history.currentIndex = history.versions.indexOf(action.toText)
      if (history.currentIndex === -1) {
        history.currentIndex = Math.min(history.versions.length - 1, history.currentIndex + 1)
      }

      // Notify listeners
      const listener = this.listeners.get(action.elementId)
      if (listener) {
        listener(action.toText)
      }

      return action.elementId
    }

    return null
  }

  startTransaction(): void {
    // Not needed for simple history implementation
  }

  commitTransaction(): void {
    // Not needed for simple history implementation
  }

  clear(): void {
    // Clear all pending updates
    for (const [, pending] of this.pendingUpdates) {
      clearTimeout(pending.timer)
    }
    this.pendingUpdates.clear()

    this.textHistories.clear()
    this.listeners.clear()
    this.elementIdMap = new WeakMap()
    this.elementMap.clear()
    this.editHistory = []
    this.editHistoryIndex = -1
  }

  // Force save any pending changes immediately
  commitPendingChanges(elementId?: string): void {
    if (elementId) {
      const pending = this.pendingUpdates.get(elementId)
      if (pending) {
        clearTimeout(pending.timer)
        this.pendingUpdates.delete(elementId)

        const history = this.textHistories.get(elementId)
        if (history && history.currentIndex >= 0) {
          const fromText = history.versions[history.currentIndex]

          history.versions = history.versions.slice(0, history.currentIndex + 1)
          history.versions.push(pending.text)
          history.currentIndex = history.versions.length - 1
          history.lastEditTimestamp = Date.now()

          // Add to global edit history
          const editAction: EditAction = {
            elementId,
            timestamp: history.lastEditTimestamp,
            fromText,
            toText: pending.text,
          }

          this.editHistory = this.editHistory.slice(0, this.editHistoryIndex + 1)
          this.editHistory.push(editAction)
          this.editHistoryIndex = this.editHistory.length - 1

          if (history.versions.length > 50) {
            history.versions.shift()
            history.currentIndex--
          }

          if (this.editHistory.length > 100) {
            this.editHistory.shift()
            this.editHistoryIndex--
          }
        }
      }
    } else {
      // Commit all pending changes
      for (const [id, pending] of this.pendingUpdates) {
        clearTimeout(pending.timer)

        const history = this.textHistories.get(id)
        if (history && history.currentIndex >= 0) {
          const fromText = history.versions[history.currentIndex]

          history.versions = history.versions.slice(0, history.currentIndex + 1)
          history.versions.push(pending.text)
          history.currentIndex = history.versions.length - 1
          history.lastEditTimestamp = Date.now()

          // Add to global edit history
          const editAction: EditAction = {
            elementId: id,
            timestamp: history.lastEditTimestamp,
            fromText,
            toText: pending.text,
          }

          this.editHistory = this.editHistory.slice(0, this.editHistoryIndex + 1)
          this.editHistory.push(editAction)
          this.editHistoryIndex = this.editHistory.length - 1

          if (history.versions.length > 50) {
            history.versions.shift()
            history.currentIndex--
          }

          if (this.editHistory.length > 100) {
            this.editHistory.shift()
            this.editHistoryIndex--
          }
        }
      }
      this.pendingUpdates.clear()
    }
  }

  getElementId(element: HTMLElement): string | undefined {
    return this.elementIdMap.get(element)
  }

  getElementById(elementId: string): HTMLElement | undefined {
    const ref = this.elementMap.get(elementId)
    return ref?.deref()
  }

  getHistoryInfo(elementId: string): HistoryInfo | null {
    const history = this.textHistories.get(elementId)
    if (!history) return null

    return {
      canUndo: history.currentIndex > 0,
      canRedo: history.currentIndex < history.versions.length - 1,
      currentVersion: history.currentIndex + 1,
      totalVersions: history.versions.length,
      currentText: history.text.toString(),
    }
  }

  // DOM structure history methods
  saveState(): void {
    // This is a simple implementation - we can improve it later if needed
    // saveState called - using structural history
  }

  saveStructuralState(container: HTMLElement): void {
    this.contentContainer = container

    // Create a snapshot of the current DOM structure
    const snapshot: StructuralSnapshot = {
      id: `struct-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      html: container.innerHTML,
    }

    // Remove any snapshots after current index (for redo functionality)
    this.structuralSnapshots = this.structuralSnapshots.slice(0, this.structuralHistoryIndex + 1)
    this.structuralSnapshots.push(snapshot)
    this.structuralHistoryIndex = this.structuralSnapshots.length - 1

    // Limit structural history size
    if (this.structuralSnapshots.length > 50) {
      this.structuralSnapshots.shift()
      this.structuralHistoryIndex--
    }
  }

  // Get current history state for debugging
  getHistoryLength(): number {
    return Math.max(this.editHistory.length, this.structuralSnapshots.length)
  }

  getCurrentVersion(): { text: number; structural: number } {
    return {
      text: this.editHistoryIndex + 1,
      structural: this.structuralHistoryIndex + 1,
    }
  }
}

export const historyManager = new LoroHistoryManager()
