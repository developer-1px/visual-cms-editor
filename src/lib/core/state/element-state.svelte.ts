/**
 * DOM을 전혀 사용하지 않는 순수한 요소 상태 관리
 * Core level - Svelte 5 반응성만 사용
 */

export type ElementType = "text" | "image" | "icon" | "link" | "repeatable" | "section"

export interface ElementState {
  id: string
  type: ElementType | null
  selected: boolean
  editing: boolean
  visible: boolean
  constraints?: Record<string, unknown>
  data?: Record<string, unknown>
}

export interface SelectionState {
  selectedIds: Set<string>
  editingId: string | null
  activeType: ElementType | null
  multiSelect: boolean
}

class PureElementStateManager {
  // 순수한 상태만 관리 - DOM 참조 없음
  private elements = $state<Map<string, ElementState>>(new Map())
  private selection = $state<SelectionState>({
    selectedIds: new Set(),
    editingId: null,
    activeType: null,
    multiSelect: false,
  })

  // 요소 등록 (DOM 없이 순수한 ID와 타입만)
  registerElement(id: string, type: ElementType, initialData?: Record<string, unknown>): void {
    this.elements.set(id, {
      id,
      type,
      selected: false,
      editing: false,
      visible: true,
      data: initialData,
    })
  }

  // 요소 해제
  unregisterElement(id: string): void {
    this.elements.delete(id)
    this.selection.selectedIds.delete(id)
    if (this.selection.editingId === id) {
      this.selection.editingId = null
    }
  }

  // 선택 상태 관리
  select(id: string, multiSelect: boolean = false): void {
    const element = this.elements.get(id)
    if (!element) return

    if (!multiSelect) {
      // 단일 선택 - 다른 모든 요소 선택 해제
      this.clearSelection()
    }

    this.selection.selectedIds.add(id)
    this.selection.activeType = element.type
    this.selection.multiSelect = this.selection.selectedIds.size > 1

    // 요소 상태 업데이트
    element.selected = true
  }

  deselect(id: string): void {
    const element = this.elements.get(id)
    if (!element) return

    this.selection.selectedIds.delete(id)
    element.selected = false

    // 활성 타입 업데이트
    if (this.selection.selectedIds.size === 0) {
      this.selection.activeType = null
      this.selection.multiSelect = false
    } else {
      const firstSelected = this.elements.get(Array.from(this.selection.selectedIds)[0])
      this.selection.activeType = firstSelected?.type || null
    }
  }

  clearSelection(): void {
    for (const id of this.selection.selectedIds) {
      const element = this.elements.get(id)
      if (element) {
        element.selected = false
      }
    }
    this.selection.selectedIds.clear()
    this.selection.activeType = null
    this.selection.multiSelect = false
  }

  // 편집 상태 관리
  startEdit(id: string): void {
    const element = this.elements.get(id)
    if (!element) return

    // 다른 편집 중인 요소 정리
    this.stopAllEditing()

    element.editing = true
    this.selection.editingId = id
  }

  stopEdit(id: string): void {
    const element = this.elements.get(id)
    if (!element) return

    element.editing = false
    if (this.selection.editingId === id) {
      this.selection.editingId = null
    }
  }

  stopAllEditing(): void {
    if (this.selection.editingId) {
      const element = this.elements.get(this.selection.editingId)
      if (element) {
        element.editing = false
      }
    }
    this.selection.editingId = null
  }

  // 가시성 관리
  setVisible(id: string, visible: boolean): void {
    const element = this.elements.get(id)
    if (element) {
      element.visible = visible
    }
  }

  // 데이터 업데이트
  updateData(id: string, data: Record<string, unknown>): void {
    const element = this.elements.get(id)
    if (element) {
      element.data = { ...element.data, ...data }
    }
  }

  // 제약 조건 설정
  setConstraints(id: string, constraints: Record<string, unknown>): void {
    const element = this.elements.get(id)
    if (element) {
      element.constraints = constraints
    }
  }

  // 상태 조회 메서드들
  getElement(id: string): ElementState | undefined {
    return this.elements.get(id)
  }

  isSelected(id: string): boolean {
    return this.selection.selectedIds.has(id)
  }

  isEditing(id: string): boolean {
    return this.selection.editingId === id
  }

  getSelectedElements(): ElementState[] {
    return Array.from(this.selection.selectedIds)
      .map((id) => this.elements.get(id))
      .filter((el): el is ElementState => el !== undefined)
  }

  getEditingElement(): ElementState | null {
    return this.selection.editingId ? this.elements.get(this.selection.editingId) || null : null
  }

  // 선택 정보
  get selectionInfo() {
    return {
      count: this.selection.selectedIds.size,
      isEmpty: this.selection.selectedIds.size === 0,
      activeType: this.selection.activeType,
      isMultiSelect: this.selection.multiSelect,
      editingId: this.selection.editingId,
    }
  }

  // 전체 상태 조회 (디버깅용)
  getAllElements(): Map<string, ElementState> {
    return new Map(this.elements)
  }

  getSelectionState(): SelectionState {
    return { ...this.selection, selectedIds: new Set(this.selection.selectedIds) }
  }
}

// 싱글톤 인스턴스
export const elementStateManager = new PureElementStateManager()

// 편의 함수들 (DOM 없음)
export function useElementState(id: string) {
  return {
    get element() {
      return elementStateManager.getElement(id)
    },
    get isSelected() {
      return elementStateManager.isSelected(id)
    },
    get isEditing() {
      return elementStateManager.isEditing(id)
    },
    select: (multiSelect = false) => elementStateManager.select(id, multiSelect),
    deselect: () => elementStateManager.deselect(id),
    startEdit: () => elementStateManager.startEdit(id),
    stopEdit: () => elementStateManager.stopEdit(id),
    updateData: (data: Record<string, unknown>) => elementStateManager.updateData(id, data),
  }
}
