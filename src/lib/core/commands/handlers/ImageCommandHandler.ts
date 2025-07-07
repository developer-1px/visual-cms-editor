import type { CommandHandler } from "../action-interfaces"
import { imagePlugin, setImageClipboard, getImageClipboard } from "../../plugins/types/image"

/**
 * 이미지 요소를 위한 Command Handler
 * 기존 이미지 플러그인의 로직을 재사용하여 구현
 */
export class ImageCommandHandler implements CommandHandler {
  readonly type = "image"
  
  // Track the last operation for view layer
  private lastOperation: { type: string; elementId?: string; imageUrl?: string; timestamp: number } | null = null

  /**
   * 이미지 타입 요소를 처리할 수 있는지 확인
   */
  canHandle(element: HTMLElement, selectionType: string): boolean {
    return selectionType === "image" && element.dataset.editable === "image"
  }

  /**
   * 이미지 복사
   */
  async copy(element: HTMLElement): Promise<void> {
    // Copying image element

    if (!this.canHandle(element, "image")) {
      throw new Error("Element is not a valid image element")
    }

    try {
      // 이미지 플러그인의 copyImage 메서드 사용
      if (imagePlugin.copyImage) {
        imagePlugin.copyImage(element)
      } else {
        // 폴백: 기본 이미지 복사 로직
        const imageUrl = imagePlugin.getValue(element)
        if (imageUrl) {
          // 내부 클립보드에 저장
          setImageClipboard(imageUrl)

          // 시스템 클립보드에도 복사 시도
          try {
            await navigator.clipboard.writeText(imageUrl)
          } catch {
            // Failed to copy image URL to system clipboard - using internal clipboard only
          }

          // VIEW LAYER SHOULD: Apply copy animation effect
          // Scale animation: 1 -> 1.05 -> 1 with 300ms duration
          
          this.lastOperation = { type: 'copy', elementId: element.id, imageUrl, timestamp: Date.now() }
        } else {
          throw new Error("No image to copy")
        }
      }
    } catch (error) {
      console.error("[ImageCommandHandler] Copy failed:", error)
      throw error
    }
  }

  /**
   * 이미지 잘라내기
   */
  async cut(element: HTMLElement): Promise<void> {
    // Cutting image element

    if (!this.canHandle(element, "image")) {
      throw new Error("Element is not a valid image element")
    }

    try {
      // 이미지 플러그인의 cutImage 메서드 사용
      if (imagePlugin.cutImage) {
        imagePlugin.cutImage(element)
      } else {
        // 폴백: 기본 이미지 잘라내기 로직
        const imageUrl = imagePlugin.getValue(element)
        if (imageUrl) {
          // 먼저 복사
          setImageClipboard(imageUrl)

          try {
            await navigator.clipboard.writeText(imageUrl)
          } catch {
            // Failed to copy image URL to system clipboard - using internal clipboard only
          }

          // 그다음 삭제
          imagePlugin.setValue(element, "")

          // State change: Image was cut
          // VIEW LAYER SHOULD:
          // 1. Observe image src changed to empty string
          // 2. Apply cut animation (scale 1 -> 0.95, opacity fade)
          // 3. Update history with the change
          
          this.lastOperation = { type: 'cut', elementId: element.id, imageUrl: '', timestamp: Date.now() }
        } else {
          throw new Error("No image to cut")
        }
      }
    } catch (error) {
      console.error("[ImageCommandHandler] Cut failed:", error)
      throw error
    }
  }

  /**
   * 이미지 붙여넣기
   */
  async paste(element: HTMLElement): Promise<void> {
    // Pasting image element

    if (!this.canHandle(element, "image")) {
      throw new Error("Element is not a valid image element")
    }

    try {
      // 이미지 플러그인의 pasteImage 메서드 사용
      if (imagePlugin.pasteImage) {
        imagePlugin.pasteImage(element)
      } else {
        // 폴백: 기본 이미지 붙여넣기 로직
        const clipboardImage = getImageClipboard()
        if (clipboardImage) {
          imagePlugin.setValue(element, clipboardImage)

          // State change: Image was pasted
          // VIEW LAYER SHOULD:
          // 1. Observe image src changed to clipboardImage
          // 2. Apply paste animation (scale 0.9 -> 1, fade in)
          // 3. Update history with the change
          
          this.lastOperation = { type: 'paste', elementId: element.id, imageUrl: clipboardImage, timestamp: Date.now() }
        } else {
          throw new Error("No image in clipboard to paste")
        }
      }
    } catch (error) {
      console.error("[ImageCommandHandler] Paste failed:", error)
      throw error
    }
  }

  /**
   * 이미지 삭제
   */
  async delete(element: HTMLElement): Promise<void> {
    // Deleting image element

    if (!this.canHandle(element, "image")) {
      throw new Error("Element is not a valid image element")
    }

    try {
      // 이미지 플러그인의 deleteImage 메서드 사용
      if (imagePlugin.deleteImage) {
        imagePlugin.deleteImage(element)
      } else {
        // 폴백: 기본 이미지 삭제 로직
        if (!imagePlugin.isEmpty(element)) {
          // State change: Image deletion
          // VIEW LAYER SHOULD:
          // 1. Apply delete animation first (scale down, fade out)
          // 2. Clear the image src after animation
          // 3. Update history with the deletion
          
          // Clear image value
          imagePlugin.setValue(element, "")
          
          this.lastOperation = { type: 'delete', elementId: element.id, imageUrl: '', timestamp: Date.now() }
        } else {
          // No image to delete - skipping
        }
      }
    } catch (error) {
      console.error("[ImageCommandHandler] Delete failed:", error)
      throw error
    }
  }

  /**
   * 커맨드에 따른 시각적 피드백 애니메이션
   * @deprecated VIEW LAYER SHOULD: Handle animations based on command type
   * 
   * Animation specifications:
   * - copy: scale(1) -> scale(1.05) -> scale(1), opacity pulse
   * - cut: scale(1) -> scale(0.95), opacity fade to 0.5
   * - paste: scale(0.9) -> scale(1), opacity fade in
   * - delete: scale(1) -> scale(0.9), opacity fade to 0.3
   * All animations: 300ms duration, ease-out timing
   */
  private animateElement(element: HTMLElement, command: string): void {
    // The view layer should apply animations based on observed state changes
  }
  
  /**
   * Get the last operation performed
   * Used by view layer to determine what animations/actions to take
   */
  getLastOperation() {
    return this.lastOperation
  }
}
