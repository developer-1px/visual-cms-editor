import type { TemplateElement } from "../models/TemplateModels"
import { generateElementId } from "../utils/uuid"

/**
 * 파서 헬퍼 함수들
 */

/**
 * SVG 요소인지 확인
 */
export const isSvgContext = (element: Element): boolean => {
  return element.tagName.toLowerCase() === "svg" || element.closest("svg") !== null
}

/**
 * 자식 요소들을 파싱
 */
export const parseChildren = (
  element: Element,
  parseElement: (el: Element) => TemplateElement
): TemplateElement[] => {
  const children: TemplateElement[] = []
  
  // 자식 요소들을 재귀적으로 파싱
  for (const child of element.children) {
    children.push(parseElement(child))
  }
  
  return children
}

/**
 * 텍스트 노드들을 파싱
 */
export const parseTextNodes = (
  element: Element,
  createTextModel: (text: string, isEditable: boolean) => TemplateElement
): TemplateElement[] => {
  const textNodes: TemplateElement[] = []
  
  // SVG 컨텍스트에서는 텍스트 노드 무시
  if (isSvgContext(element)) {
    return textNodes
  }
  
  // 텍스트 노드 처리
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        textNodes.push(createTextModel(text, false))
      }
    }
  }
  
  return textNodes
}

/**
 * FrameModel 기본 속성 생성
 */
export const createFrameAttributes = (element: Element) => {
  // SVG 요소의 className은 SVGAnimatedString 객체일 수 있음
  let className: string | undefined
  
  if (element instanceof SVGElement && element.className && typeof element.className === "object") {
    // SVG 요소의 경우 baseVal 속성 사용
    className = (element.className as any).baseVal || undefined
  } else if (element instanceof HTMLElement) {
    // HTML 요소의 경우 일반적인 className 사용
    className = element.className || undefined
  } else {
    // 기타 요소의 경우 getAttribute 사용
    className = element.getAttribute("class") || undefined
  }
  
  return {
    id: generateElementId(),
    type: "frame" as const,
    tagName: element.tagName.toLowerCase(),
    className,
  }
}

/**
 * 요소의 인라인 스타일 추출
 */
export const extractInlineStyles = (element: Element): Record<string, string> | undefined => {
  if (!(element instanceof HTMLElement)) {
    return undefined
  }
  
  const style = element.style
  if (!style || style.length === 0) return undefined

  const styles: Record<string, string> = {}
  for (let i = 0; i < style.length; i++) {
    const property = style.item(i)
    styles[property] = style.getPropertyValue(property)
  }

  return Object.keys(styles).length > 0 ? styles : undefined
}

/**
 * 요소 속성 추출 (특정 속성 제외)
 */
export const extractElementAttributes = (
  element: Element,
  excludeAttrs: string[] = ["class", "style", "data-editable", "data-max-length"]
): Record<string, string> | undefined => {
  const attributes: Record<string, string> = {}

  for (const attr of element.attributes) {
    if (!excludeAttrs.includes(attr.name)) {
      // SVG 요소의 경우 value가 SVGAnimatedString일 수 있음
      const value = attr.value || ""
      attributes[attr.name] = typeof value === "string" ? value : String(value)
    }
  }

  return Object.keys(attributes).length > 0 ? attributes : undefined
}