import { selectionManager } from "$lib/core/selection"

/**
 * 공통 플러그인 헬퍼 함수들
 */

/**
 * 요소가 현재 선택되어 있는지 확인
 */
export const isElementSelected = (element: HTMLElement, type: string): boolean => {
  return selectionManager.isSelected(element, type, "canvas")
}

/**
 * 요소의 제약사항 가져오기
 */
export const getConstraints = <T extends Record<string, unknown>>(
  element: HTMLElement,
  defaultConstraints: T
): T => {
  const constraintsAttr = element.getAttribute("data-constraints")
  if (constraintsAttr) {
    try {
      return JSON.parse(constraintsAttr) as T
    } catch {
      // Ignore invalid JSON
    }
  }
  return defaultConstraints
}

/**
 * 시각적 피드백 애니메이션
 */
export const animateElement = (
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions = {}
): Animation => {
  const defaultOptions: KeyframeAnimationOptions = {
    duration: 300,
    easing: "ease-out",
    ...options,
  }
  return element.animate(keyframes, defaultOptions)
}

/**
 * 복사 애니메이션
 */
export const animateCopy = (element: HTMLElement): Animation => {
  return animateElement(element, [
    { transform: "scale(1)", opacity: 1 },
    { transform: "scale(1.05)", opacity: 0.8 },
    { transform: "scale(1)", opacity: 1 },
  ])
}

/**
 * 잘라내기 애니메이션
 */
export const animateCut = (element: HTMLElement): Animation => {
  return animateElement(element, [
    { transform: "scale(1)", opacity: 1 },
    { transform: "scale(0.95)", opacity: 0.5 },
    { transform: "scale(1)", opacity: 1 },
  ])
}

/**
 * 붙여넣기 애니메이션
 */
export const animatePaste = (element: HTMLElement): Animation => {
  return animateElement(element, [
    { transform: "scale(0.9)", opacity: 0.5 },
    { transform: "scale(1)", opacity: 1 },
  ])
}

/**
 * 삭제 애니메이션
 */
export const animateDelete = (element: HTMLElement): Animation => {
  return animateElement(element, [
    { transform: "scale(1)", opacity: 1 },
    { transform: "scale(0.9)", opacity: 0.3 },
    { transform: "scale(1)", opacity: 1 },
  ])
}

/**
 * 파일 크기 포맷팅
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * File을 Data URL로 변환
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === "string") {
        resolve(result)
      } else {
        reject(new Error("Failed to read file as data URL"))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 빈 스타일 핸들러 생성
 */
export const createEmptyStyleHandlers = () => ({
  applyStyles: () => {
    // DOM 조작 없음 - 순수한 상태 관리만
    // 실제 스타일링은 Svelte 컴포넌트에서 반응적으로 처리
  },
  removeStyles: () => {
    // DOM 조작 없음 - 순수한 상태 관리만
    // 실제 스타일 제거는 Svelte 컴포넌트에서 반응적으로 처리
  },
})