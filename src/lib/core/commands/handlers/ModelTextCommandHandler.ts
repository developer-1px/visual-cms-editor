import type { CommandHandler } from "../interfaces"
import type { TextModel } from "$lib/core/models/TemplateModels"
import { modelElementRegistry } from "$lib/core/selection"
import { isTextModel } from "$lib/entities/template/models"

/**
 * Model 기반 텍스트 Command Handler
 * DOM 조작 없이 Model을 통해 텍스트 명령 수행
 */
export class ModelTextCommandHandler implements CommandHandler {
  readonly type = "text"

  // 텍스트 클립보드 (Model 기반)
  private copiedModel: TextModel | null = null
  private copiedContent: string | null = null
  
  // Track the last operation for view layer
  private lastOperation: { type: string; modelId?: string; content?: string; timestamp: number } | null = null

  /**
   * Helper function to get and validate text model
   */
  private getTextModel(element: HTMLElement): TextModel {
    const model = modelElementRegistry.getModel(element)
    if (!model || !isTextModel(model)) {
      throw new Error("No text model found for element")
    }
    return model
  }

  /**
   * 텍스트 타입 Model을 처리할 수 있는지 확인
   */
  canHandle(element: HTMLElement, selectionType: string): boolean {
    const model = modelElementRegistry.getModel(element)
    return (
      selectionType === "text" &&
      ((model && "type" in model && model.type === "text") || element.dataset.editable === "text")
    )
  }

  /**
   * 텍스트 복사 (Model 기반)
   */
  async copy(element: HTMLElement): Promise<void> {
    // Copying text model

    const textModel = this.getTextModel(element)
    const textContent = textModel.content || ""

    if (!textContent.trim()) {
      throw new Error("No text content to copy")
    }

    try {
      // Model과 내용을 내부 클립보드에 저장
      this.copiedModel = { ...textModel } // 복사본 생성
      this.copiedContent = textContent

      // 시스템 클립보드에도 복사
      try {
        await navigator.clipboard.writeText(textContent)
      } catch {
        // Failed to copy text to system clipboard - using internal clipboard only
      }

      // VIEW LAYER SHOULD: Show visual feedback for copy action
      // Apply scale pulse animation (1 -> 1.05 -> 1)
      
      this.lastOperation = { type: 'copy', modelId: textModel.id, content: textContent, timestamp: Date.now() }

      // Text copied successfully
    } catch (error) {
      console.error("[ModelTextCommandHandler] Copy failed:", error)
      throw error
    }
  }

  /**
   * 텍스트 잘라내기 (Model 기반)
   */
  async cut(element: HTMLElement): Promise<void> {
    // Cutting text model

    const textModel = this.getTextModel(element)
    const textContent = textModel.content || ""

    if (!textContent.trim()) {
      throw new Error("No text content to cut")
    }

    try {
      // 먼저 복사
      this.copiedModel = { ...textModel }
      this.copiedContent = textContent

      try {
        await navigator.clipboard.writeText(textContent)
      } catch {
        // Failed to copy text to system clipboard - using internal clipboard only
      }

      // Model 내용 제거
      textModel.content = ""

      // State change: Text content cleared
      // VIEW LAYER SHOULD:
      // 1. Observe model content change to empty string
      // 2. Apply cut animation (scale down + fade)
      // 3. Update history with the change
      
      this.lastOperation = { type: 'cut', modelId: textModel.id, content: '', timestamp: Date.now() }

      // Text cut successfully
    } catch (error) {
      console.error("[ModelTextCommandHandler] Cut failed:", error)
      throw error
    }
  }

  /**
   * 텍스트 붙여넣기 (Model 기반)
   */
  async paste(element: HTMLElement): Promise<void> {
    // Pasting text to model

    const textModel = this.getTextModel(element)

    try {
      let textToPaste: string | null = null

      // 1. 시스템 클립보드에서 텍스트 가져오기
      try {
        const clipboardText = await navigator.clipboard.readText()
        if (clipboardText) {
          textToPaste = clipboardText
          // Got text from system clipboard
        }
      } catch {
        // Could not read from system clipboard - will try internal clipboard
      }

      // 2. 내부 클립보드 사용
      if (!textToPaste && this.copiedContent) {
        textToPaste = this.copiedContent
        // Using internal clipboard
      }

      if (!textToPaste) {
        throw new Error("No text in clipboard to paste")
      }

      // Model 내용 업데이트
      textModel.content = textToPaste

      // State change: Text content updated
      // VIEW LAYER SHOULD:
      // 1. Observe model content change to new text
      // 2. Apply paste animation (scale up + fade in)
      // 3. Update history with the change
      
      this.lastOperation = { type: 'paste', modelId: textModel.id, content: textToPaste, timestamp: Date.now() }

      // Text pasted successfully
    } catch (error) {
      console.error("[ModelTextCommandHandler] Paste failed:", error)
      throw error
    }
  }

  /**
   * 텍스트 삭제 (Model 기반)
   */
  async delete(element: HTMLElement): Promise<void> {
    // Deleting text model content

    const textModel = this.getTextModel(element)
    const hasContent = (textModel.content || "").trim().length > 0

    if (!hasContent) {
      // No text content to delete - skipping
      return
    }

    try {
      // Model 내용 제거
      textModel.content = ""
      
      // State change: Text deleted
      // VIEW LAYER SHOULD:
      // 1. Apply delete animation first
      // 2. Observe model content cleared
      // 3. Update history with deletion
      
      this.lastOperation = { type: 'delete', modelId: textModel.id, content: '', timestamp: Date.now() }

      // Text content deleted successfully
    } catch (error) {
      console.error("[ModelTextCommandHandler] Delete failed:", error)
      throw error
    }
  }

  /**
   * Model 변경 이벤트 발생
   * @deprecated VIEW LAYER SHOULD: Observe model changes directly
   */
  private emitModelChangeEvent(element: HTMLElement, model: TextModel, newContent: string): void {
    // The view layer should observe TextModel changes directly
    // through reactive state management (stores, signals, etc.)
    // History updates should be triggered by state changes
  }

  /**
   * 시각적 피드백 이벤트 발생
   * @deprecated VIEW LAYER SHOULD: Apply animations based on command execution
   * 
   * Animation specifications:
   * - copy: scale pulse effect
   * - cut: scale down + opacity fade
   * - paste: scale up + fade in
   * - delete: scale down + fade out
   */
  private emitFeedbackEvent(element: HTMLElement, command: string): void {
    // The view layer should apply visual feedback
    // based on observing command execution results
  }

  /**
   * 클립보드에 텍스트가 있는지 확인
   */
  hasClipboardContent(): boolean {
    return this.copiedContent !== null
  }

  /**
   * 클립보드 내용 초기화
   */
  clearClipboard(): void {
    this.copiedModel = null
    this.copiedContent = null
  }

  /**
   * 클립보드 내용 반환 (디버깅용)
   */
  getClipboardContent(): string | null {
    return this.copiedContent
  }

  /**
   * 복사된 Model 반환 (고급 기능용)
   */
  getCopiedModel(): TextModel | null {
    return this.copiedModel ? { ...this.copiedModel } : null
  }
  
  /**
   * Get the last operation performed
   * Used by view layer to determine what animations/actions to take
   */
  getLastOperation() {
    return this.lastOperation
  }
}
