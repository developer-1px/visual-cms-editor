import type { ActionHandler } from "../interfaces"
import type { TextModel } from "$lib/core/models/TemplateModels"
import { modelElementRegistry } from "$lib/core/selection/ModelSelectionManager"

/**
 * Model 기반 텍스트 Action Handler
 * DOM 조작 없이 Model을 통해 텍스트 작업 수행
 */
export class ModelTextActionHandler implements ActionHandler {
  readonly type = "text"

  // 텍스트 클립보드 (Model 기반)
  private copiedModel: TextModel | null = null
  private copiedContent: string | null = null

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
    console.log("[ModelTextActionHandler] Copying text model")

    const model = modelElementRegistry.getModel(element)
    if (!model || !("content" in model)) {
      throw new Error("No text model found for element")
    }

    const textModel = model as TextModel
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
      } catch (error) {
        console.warn("Failed to copy text to system clipboard:", error)
      }

      // 시각적 피드백을 위한 이벤트 발생
      this.emitFeedbackEvent(element, "copy")

      console.log("[ModelTextActionHandler] Text copied successfully:", textContent.substring(0, 50) + "...")
    } catch (error) {
      console.error("[ModelTextActionHandler] Copy failed:", error)
      throw error
    }
  }

  /**
   * 텍스트 잘라내기 (Model 기반)
   */
  async cut(element: HTMLElement): Promise<void> {
    console.log("[ModelTextActionHandler] Cutting text model")

    const model = modelElementRegistry.getModel(element)
    if (!model || !("content" in model)) {
      throw new Error("No text model found for element")
    }

    const textModel = model as TextModel
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
      } catch (error) {
        console.warn("Failed to copy text to system clipboard:", error)
      }

      // Model 내용 제거
      textModel.content = ""

      // Model 변경 이벤트 발생
      this.emitModelChangeEvent(element, textModel, "")

      // 시각적 피드백
      this.emitFeedbackEvent(element, "cut")

      console.log("[ModelTextActionHandler] Text cut successfully")
    } catch (error) {
      console.error("[ModelTextActionHandler] Cut failed:", error)
      throw error
    }
  }

  /**
   * 텍스트 붙여넣기 (Model 기반)
   */
  async paste(element: HTMLElement): Promise<void> {
    console.log("[ModelTextActionHandler] Pasting text to model")

    const model = modelElementRegistry.getModel(element)
    if (!model || !("content" in model)) {
      throw new Error("No text model found for element")
    }

    const textModel = model as TextModel

    try {
      let textToPaste: string | null = null

      // 1. 시스템 클립보드에서 텍스트 가져오기
      try {
        const clipboardText = await navigator.clipboard.readText()
        if (clipboardText) {
          textToPaste = clipboardText
          console.log("[ModelTextActionHandler] Got text from system clipboard")
        }
      } catch (error) {
        console.log("[ModelTextActionHandler] Could not read from system clipboard:", error)
      }

      // 2. 내부 클립보드 사용
      if (!textToPaste && this.copiedContent) {
        textToPaste = this.copiedContent
        console.log("[ModelTextActionHandler] Using internal clipboard")
      }

      if (!textToPaste) {
        throw new Error("No text in clipboard to paste")
      }

      // Model 내용 업데이트
      textModel.content = textToPaste

      // Model 변경 이벤트 발생
      this.emitModelChangeEvent(element, textModel, textToPaste)

      // 시각적 피드백
      this.emitFeedbackEvent(element, "paste")

      console.log("[ModelTextActionHandler] Text pasted successfully:", textToPaste.substring(0, 50) + "...")
    } catch (error) {
      console.error("[ModelTextActionHandler] Paste failed:", error)
      throw error
    }
  }

  /**
   * 텍스트 삭제 (Model 기반)
   */
  async delete(element: HTMLElement): Promise<void> {
    console.log("[ModelTextActionHandler] Deleting text model content")

    const model = modelElementRegistry.getModel(element)
    if (!model || !("content" in model)) {
      throw new Error("No text model found for element")
    }

    const textModel = model as TextModel
    const hasContent = (textModel.content || "").trim().length > 0

    if (!hasContent) {
      console.warn("[ModelTextActionHandler] No text content to delete")
      return
    }

    try {
      // 시각적 피드백 먼저
      this.emitFeedbackEvent(element, "delete")

      // Model 내용 제거
      textModel.content = ""

      // Model 변경 이벤트 발생
      this.emitModelChangeEvent(element, textModel, "")

      console.log("[ModelTextActionHandler] Text content deleted successfully")
    } catch (error) {
      console.error("[ModelTextActionHandler] Delete failed:", error)
      throw error
    }
  }

  /**
   * Model 변경 이벤트 발생
   */
  private emitModelChangeEvent(element: HTMLElement, model: TextModel, newContent: string): void {
    const event = new CustomEvent("modelContentChanged", {
      detail: {
        model,
        content: newContent,
        previousContent: model.content,
      },
      bubbles: true,
    })
    element.dispatchEvent(event)

    // 히스토리를 위한 이벤트도 발생
    const historyEvent = new CustomEvent("textChanged", {
      detail: {
        element,
        text: newContent,
        modelId: model.id,
      },
      bubbles: true,
    })
    document.dispatchEvent(historyEvent)
  }

  /**
   * 시각적 피드백 이벤트 발생
   */
  private emitFeedbackEvent(element: HTMLElement, action: string): void {
    const event = new CustomEvent("visualFeedback", {
      detail: {
        action,
        modelId: modelElementRegistry.getModel(element)?.id,
      },
      bubbles: true,
    })
    element.dispatchEvent(event)
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
}
