/**
 * Svelte 5 기반 요소 상태 관리
 * DOM API 직접 조작 대신 반응형 상태로 관리
 */

export interface ElementState {
  selected: boolean
  editing: boolean
  type: "text" | "image" | "icon" | "link" | "repeatable" | "section" | null
  elementId: string
}

class ElementStateManager {
  private states = $state<Map<string, ElementState>>(new Map())

  // 요소 상태 가져오기
  getState(elementId: string): ElementState {
    return (
      this.states.get(elementId) ?? {
        selected: false,
        editing: false,
        type: null,
        elementId,
      }
    )
  }

  // 요소 선택 상태 설정
  setSelected(elementId: string, selected: boolean, type?: ElementState["type"]): void {
    const current = this.getState(elementId)
    this.states.set(elementId, {
      ...current,
      selected,
      type: type ?? current.type,
    })
  }

  // 요소 편집 상태 설정
  setEditing(elementId: string, editing: boolean): void {
    const current = this.getState(elementId)
    this.states.set(elementId, {
      ...current,
      editing,
    })
  }

  // 모든 선택 해제
  clearAllSelected(): void {
    for (const [id, state] of this.states) {
      if (state.selected) {
        this.states.set(id, {
          ...state,
          selected: false,
          editing: false,
        })
      }
    }
  }

  // 모든 편집 상태 해제
  clearAllEditing(): void {
    for (const [id, state] of this.states) {
      if (state.editing) {
        this.states.set(id, {
          ...state,
          editing: false,
        })
      }
    }
  }

  // 선택된 요소들 가져오기
  getSelectedElements(): ElementState[] {
    return Array.from(this.states.values()).filter((state) => state.selected)
  }

  // 편집 중인 요소 가져오기
  getEditingElement(): ElementState | null {
    return Array.from(this.states.values()).find((state) => state.editing) ?? null
  }

  // 요소 ID 생성 헬퍼
  generateElementId(element: HTMLElement): string {
    if (element.id) return element.id

    // data-* 속성 기반 ID 생성
    const type = element.dataset.editable || element.dataset.repeatable
    const tagName = element.tagName.toLowerCase()
    const index = Array.from(element.parentElement?.children || []).indexOf(element)

    return `${type || tagName}-${index}-${Date.now()}`
  }

  // 요소에서 ID 추출 또는 생성
  ensureElementId(element: HTMLElement): string {
    let id = element.dataset.elementId
    if (!id) {
      id = this.generateElementId(element)
      element.dataset.elementId = id
    }
    return id
  }

  // 상태 변경 구독 (반응성)
  subscribe(callback: (states: Map<string, ElementState>) => void): () => void {
    // Svelte 5의 $effect를 사용하여 상태 변경 감지
    $effect(() => {
      callback(this.states)
    })

    return () => {
      // cleanup if needed
    }
  }

  // 디버깅용
  getAllStates(): Map<string, ElementState> {
    return new Map(this.states)
  }
}

export const elementStateManager = new ElementStateManager()

// 편의 함수들
export function useElementState(element: HTMLElement) {
  const elementId = elementStateManager.ensureElementId(element)

  return {
    get state() {
      return elementStateManager.getState(elementId)
    },
    setSelected: (selected: boolean, type?: ElementState["type"]) =>
      elementStateManager.setSelected(elementId, selected, type),
    setEditing: (editing: boolean) => elementStateManager.setEditing(elementId, editing),
    elementId,
  }
}

// 반응형 선택 상태 체크
export function isElementSelected(elementId: string): boolean {
  return elementStateManager.getState(elementId).selected
}

// 반응형 편집 상태 체크
export function isElementEditing(elementId: string): boolean {
  return elementStateManager.getState(elementId).editing
}
