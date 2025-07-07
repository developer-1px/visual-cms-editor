/**
 * History Management Entity Types
 * 
 * 히스토리 관리와 관련된 모든 타입 정의
 */

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
  undo(): string | null
  redo(): string | null
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
  saveState(): void
  saveStructuralState(container: HTMLElement): void
}

export interface HistoryEntry {
  id: string
  timestamp: number
  action: string
  elementId?: string
  beforeState: unknown
  afterState: unknown
  metadata?: Record<string, unknown>
}

export interface HistorySnapshot {
  id: string
  timestamp: number
  state: unknown
  description?: string
}

export interface HistoryConfiguration {
  maxEntries: number
  debounceMs: number
  enableBranching: boolean
  enableSnapshots: boolean
  autoSave: boolean
}

export interface HistoryBranch {
  id: string
  name: string
  parentId?: string
  entries: HistoryEntry[]
  createdAt: number
}

export interface HistoryState {
  currentBranchId: string
  branches: Map<string, HistoryBranch>
  snapshots: HistorySnapshot[]
  currentPosition: number
  configuration: HistoryConfiguration
}