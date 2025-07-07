import type { CommandHandler } from "../interfaces"
import { cloneHTMLElement } from "../../../utils/dom-helpers"

/**
 * Repeatable 요소를 위한 Command Handler
 * 기존 repeatable 관련 함수들의 로직을 통합하여 구현
 */
export class RepeatableCommandHandler implements CommandHandler {
  readonly type = "repeatable"

  // 복사된 요소를 저장하는 클립보드
  private copiedElement: HTMLElement | null = null
  
  // Track the last operation for view layer
  private lastOperation: { type: string; elementId?: string; timestamp: number } | null = null

  /**
   * Repeatable 타입 요소를 처리할 수 있는지 확인
   */
  canHandle(element: HTMLElement, selectionType: string): boolean {
    return selectionType === "repeatable" && element.hasAttribute("data-repeatable")
  }

  /**
   * Repeatable 요소 복사
   */
  async copy(element: HTMLElement): Promise<void> {
    // Copying repeatable element

    if (!this.canHandle(element, "repeatable")) {
      throw new Error("Element is not a valid repeatable element")
    }

    try {
      // 요소를 깊은 복사로 클론
      this.copiedElement = cloneHTMLElement(element)

      // VIEW LAYER SHOULD: Apply visual feedback animation
      // The view should animate the element with a scale effect when observing a copy command

      // Track operation for view layer
      this.lastOperation = { type: 'copy', elementId: element.id, timestamp: Date.now() }

      // Element copied successfully
      // VIEW LAYER SHOULD: Observe copiedElement state to show copy feedback
    } catch (error) {
      console.error("[RepeatableCommandHandler] Copy failed:", error)
      throw error
    }
  }

  /**
   * Repeatable 요소 잘라내기
   */
  async cut(element: HTMLElement): Promise<void> {
    // Cutting repeatable element

    if (!this.canHandle(element, "repeatable")) {
      throw new Error("Element is not a valid repeatable element")
    }

    try {
      // 먼저 복사
      this.copiedElement = cloneHTMLElement(element)

      // 히스토리 상태 저장
      this.saveHistoryState()

      // VIEW LAYER SHOULD: Animate element removal
      // The view should apply a scale-down animation before removing the element
      // After animation completes, the view should remove the element from DOM
      
      // State change: Mark element for removal
      // VIEW LAYER SHOULD: 
      // 1. Observe that this element was cut (via state or event)
      // 2. Apply scale-down animation (200ms)
      // 3. Remove element from DOM after animation
      // 4. Update history state

      // Track operation for view layer
      this.lastOperation = { type: 'cut', elementId: element.id, timestamp: Date.now() }

      // Element cut successfully
    } catch (error) {
      console.error("[RepeatableCommandHandler] Cut failed:", error)
      throw error
    }
  }

  /**
   * Repeatable 요소 붙여넣기
   */
  async paste(element: HTMLElement): Promise<void> {
    // Pasting repeatable element

    if (!this.canHandle(element, "repeatable")) {
      throw new Error("Element is not a valid repeatable element")
    }

    if (!this.copiedElement) {
      throw new Error("No element in clipboard to paste")
    }

    try {
      const parentElement = element.parentElement
      if (!parentElement) {
        throw new Error("Cannot paste: element has no parent")
      }

      // 히스토리 상태 저장
      this.saveHistoryState()

      // 복사된 요소를 클론
      const newElement = cloneHTMLElement(this.copiedElement)

      // VIEW LAYER SHOULD: Insert the new element after the current element
      // The view should handle DOM insertion, event listener attachment, and animation
      
      // State change: Paste operation details
      // VIEW LAYER SHOULD:
      // 1. Clone the copiedElement data
      // 2. Insert new element after current element
      // 3. Attach event listeners to new element
      // 4. Apply scale-up fade-in animation (300ms)
      // 5. Select the new element
      // 6. Update history state
      
      // The view can access this.copiedElement through a getter method

      // Track operation for view layer
      this.lastOperation = { type: 'paste', elementId: element.id, timestamp: Date.now() }

      // Element pasted successfully
    } catch (error) {
      console.error("[RepeatableCommandHandler] Paste failed:", error)
      throw error
    }
  }

  /**
   * Repeatable 요소 삭제
   */
  async delete(element: HTMLElement): Promise<void> {
    // Deleting repeatable element

    if (!this.canHandle(element, "repeatable")) {
      throw new Error("Element is not a valid repeatable element")
    }

    try {
      // 히스토리 상태 저장
      this.saveHistoryState()

      // VIEW LAYER SHOULD: Animate and remove element
      // The view should apply a scale-down fade-out animation
      // After animation completes, the view should remove the element
      
      // State change: Mark element for deletion
      // VIEW LAYER SHOULD:
      // 1. Observe deletion request for this element
      // 2. Apply scale-down fade-out animation (200ms)
      // 3. Remove element from DOM after animation
      // 4. Update history state

      // Track operation for view layer
      this.lastOperation = { type: 'delete', elementId: element.id, timestamp: Date.now() }

      // Element deletion started
    } catch (error) {
      console.error("[RepeatableCommandHandler] Delete failed:", error)
      throw error
    }
  }

  /**
   * 새로운 요소에 이벤트 리스너 추가 (하이드레이션)
   * @deprecated VIEW LAYER SHOULD: Handle element hydration after DOM insertion
   */
  private hydrateNewElement(element: HTMLElement): void {
    // The view layer should attach necessary event listeners
    // when it inserts the new element into the DOM
  }

  /**
   * 히스토리 상태 저장
   * @deprecated VIEW LAYER SHOULD: Save history state before operations
   */
  private saveHistoryState(): void {
    // The view layer should save history state
    // when it observes command execution results
  }

  /**
   * 히스토리 상태 업데이트
   * @deprecated VIEW LAYER SHOULD: Update history after operations complete
   */
  private updateHistoryState(): void {
    // The view layer should update history state
    // after DOM operations are complete
  }

  /**
   * 요소에 애니메이션 적용
   * @deprecated VIEW LAYER SHOULD: Apply animations based on command results
   */
  private animateElement(element: HTMLElement, keyframes: Keyframe[]): void {
    // The view layer should apply animations
    // when it processes command execution results
  }

  /**
   * 클립보드에 요소가 있는지 확인
   */
  hasClipboardContent(): boolean {
    return this.copiedElement !== null
  }

  /**
   * 클립보드 내용 초기화
   */
  clearClipboard(): void {
    this.copiedElement = null
  }

  /**
   * Get copied element data for view layer
   * @returns The copied element's HTML or null
   */
  getCopiedElementData(): string | null {
    return this.copiedElement ? this.copiedElement.outerHTML : null
  }

  /**
   * Get the last operation performed
   * Used by view layer to determine what animations/actions to take
   */
  getLastOperation() {
    return this.lastOperation
  }
}
