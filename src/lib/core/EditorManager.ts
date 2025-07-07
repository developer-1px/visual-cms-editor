/**
 * EditorManager - 메인 에디터의 모든 로직을 통합 관리
 * 
 * +page.svelte에서 복잡한 로직을 제거하고 단순한 인터페이스만 제공
 */

import { derived, writable, type Writable } from "svelte/store"
import { historyManager } from "./history"
import {
  state,
  leftSidebarOpen,
  rightPanelOpen,
  devicePreview,
  isEditing as isEditingStore,
  editingElementId,
  templateSelectorOpen,
  canUndo as canUndoStore,
  canRedo as canRedoStore,
  toggleSidebar,
  setDevicePreview,
  toggleTemplateSelector
} from "./commands/stores"
import {
  selectionManager,
  selectedElements,
  selectedSectionIndex,
  activeSelectionType,
  selectionCount,
  isSelectionEmpty,
} from "./selection"
import { modelBasedPluginManager } from "./plugins"
import { selectionCommandManager, initializeCommandHandlers } from "./commands"
import { defaultTemplates } from "./templates/templates"
import type { Template } from "./templates/types"
import type { SelectionType } from "./selection"

export class EditorManager {
  // 템플릿 관리
  private selectedTemplatesStore: Writable<Template[]> = writable([
    defaultTemplates[0], // Hero minimal
    defaultTemplates[defaultTemplates.length - 1], // SVG showcase (last template)
    defaultTemplates[2], // Features grid
    defaultTemplates[3], // CTA simple
    defaultTemplates[5], // Testimonial single
    defaultTemplates[6], // Pricing simple
  ])

  // 상태 스토어들 (read-only로 노출)
  public readonly selectedTemplates = { subscribe: this.selectedTemplatesStore.subscribe }
  public readonly leftSidebarOpen = { subscribe: leftSidebarOpen.subscribe }
  public readonly rightPanelOpen = { subscribe: rightPanelOpen.subscribe }
  public readonly devicePreview = { subscribe: devicePreview.subscribe }
  public readonly isEditing = { subscribe: isEditingStore.subscribe }
  public readonly editingElementId = { subscribe: editingElementId.subscribe }
  public readonly templateSelectorOpen = { subscribe: templateSelectorOpen.subscribe }
  public readonly canUndo = { subscribe: canUndoStore.subscribe }
  public readonly canRedo = { subscribe: canRedoStore.subscribe }
  public readonly selectedElements = { subscribe: selectedElements.subscribe }
  public readonly selectedSectionIndex = { subscribe: selectedSectionIndex.subscribe }
  public readonly activeSelectionType = { subscribe: activeSelectionType.subscribe }
  public readonly selectionCount = { subscribe: selectionCount.subscribe }
  public readonly isSelectionEmpty = { subscribe: isSelectionEmpty.subscribe }

  // 파생 상태들
  public readonly showLeftSidebar = derived(leftSidebarOpen, ($leftSidebarOpen) => $leftSidebarOpen)
  public readonly showRightPanel = derived(rightPanelOpen, ($rightPanelOpen) => $rightPanelOpen)
  public readonly showTemplateSelector = derived(templateSelectorOpen, ($templateSelectorOpen) => $templateSelectorOpen)
  public readonly selectedTemplateCount = derived(this.selectedTemplates, ($templates) => $templates.length)

  constructor() {
    // 초기화
    this.initialize()
  }

  private initialize() {
    // 커맨드 핸들러 초기화
    initializeCommandHandlers()
    
    // 플러그인 매니저 초기화
    modelBasedPluginManager.initialize()
  }

  // 템플릿 관리
  public addTemplate(template: Template) {
    this.selectedTemplatesStore.update(templates => [...templates, template])
  }

  public removeTemplate(index: number) {
    this.selectedTemplatesStore.update(templates => 
      templates.filter((_, i) => i !== index)
    )
  }

  public moveTemplate(from: number, to: number) {
    this.selectedTemplatesStore.update(templates => {
      const newTemplates = [...templates]
      const [moved] = newTemplates.splice(from, 1)
      newTemplates.splice(to, 0, moved)
      return newTemplates
    })
  }

  // UI 상태 관리
  public toggleLeftSidebar() {
    toggleSidebar("left")
  }

  public toggleRightPanel() {
    toggleSidebar("right")
  }

  public toggleTemplateSelector() {
    toggleTemplateSelector()
  }

  public setDevicePreview(device: "mobile" | "tablet" | "desktop") {
    setDevicePreview(device)
  }

  // 히스토리 관리
  public undo() {
    historyManager.undo()
  }

  public redo() {
    historyManager.redo()
  }

  // 선택 관리
  public clearSelection() {
    selectionManager.clear()
  }

  public selectSection(index: number) {
    selectionManager.select(index, "section", "canvas")
  }

  // 키보드 핸들러
  public handleKeydown(event: KeyboardEvent) {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
    const metaKey = isMac ? event.metaKey : event.ctrlKey

    if (metaKey && event.key === "z" && !event.shiftKey) {
      event.preventDefault()
      this.undo()
    } else if (metaKey && (event.key === "z" && event.shiftKey || event.key === "y")) {
      event.preventDefault()
      this.redo()
    } else if (event.key === "Escape") {
      event.preventDefault()
      this.clearSelection()
    }
  }

  // 클릭 핸들러
  public handleCanvasClick(event: MouseEvent) {
    // 캔버스 클릭 시 선택 해제
    if (event.target && (event.target as HTMLElement).classList.contains("canvas-area")) {
      this.clearSelection()
    }
  }

  // 정리
  public destroy() {
    // 필요시 정리 로직 추가
  }
}

// 싱글톤 인스턴스
export const editorManager = new EditorManager()