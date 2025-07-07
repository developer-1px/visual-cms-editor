import type {
  TemplateElement,
  FrameModel,
  EditableModel,
  TextModel,
  ImageModel,
  IconModel,
  LinkModel,
  TemplateModel,
} from "../models/TemplateModels"
import { generateEditableElements } from "../templates/convention"
import { generateElementId } from "../utils/uuid"
import {
  isSvgContext,
  parseChildren,
  parseTextNodes,
  createFrameAttributes,
  extractInlineStyles,
  extractElementAttributes,
} from "./parser-helpers"

// Type guards for DOM elements
const isHTMLImageElement = (element: Element): element is HTMLImageElement => {
  return element.tagName.toLowerCase() === 'img'
}

const isSVGElement = (element: Element): element is SVGElement => {
  return element.tagName.toLowerCase() === 'svg' || element.closest('svg') !== null
}

const isHTMLAnchorElement = (element: Element): element is HTMLAnchorElement => {
  return element.tagName.toLowerCase() === 'a'
}

const isHTMLElement = (element: Element): element is HTMLElement => {
  return element instanceof HTMLElement
}

export class TemplateParser {
  private editableSelectors: Set<string> = new Set()

  /**
   * HTML 문자열을 TemplateModel로 변환
   */
  async parse(
    html: string,
    templateId: string = "template",
    templateName: string = "Untitled",
  ): Promise<TemplateModel> {
    // 컨벤션 시스템을 통해 편집 가능한 요소들 식별
    const editableElements = await generateEditableElements(html)

    // 편집 가능한 선택자들을 저장
    this.editableSelectors = new Set(editableElements.map((el) => el.selector))
    // Editable selectors have been identified and stored

    const doc = new DOMParser().parseFromString(html, "text/html")
    const rootElement = doc.body.firstElementChild || doc.body

    // 편집 가능한 요소들에 data-editable 속성 추가
    this.enhanceElementsWithDataAttributes(doc, editableElements)

    const parsedRoot = this.parseElement(rootElement)
    
    // Ensure root is a FrameModel
    if (parsedRoot.type !== 'frame') {
      throw new Error('Root element must be a FrameModel')
    }

    return {
      id: templateId,
      name: templateName,
      root: parsedRoot,
      metadata: {
        version: "1.0",
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      },
    }
  }

  /**
   * DOM 요소를 TemplateElement로 변환 (재귀)
   */
  private parseElement(element: Element): TemplateElement {
    // data-editable이 있으면 적절한 모델로 처리
    const editableType = element.getAttribute("data-editable")
    if (editableType) {
      // 특정 타입들은 직접 EditableModel로 생성
      if (editableType === "icon" || editableType === "image") {
        return this.createEditableModel(element, editableType)
      }
      // text, link나 기타는 구조를 유지하면서 편집 가능하게
      return this.createFrameModelWithEditableText(element, editableType)
    }

    // 그 외는 FrameModel로 변환
    return this.createFrameModel(element)
  }

  /**
   * FrameModel 생성
   */
  private createFrameModel(element: Element): FrameModel {
    const children: TemplateElement[] = []

    // 자식 요소들 파싱
    children.push(...parseChildren(element, (child) => this.parseElement(child)))
    
    // 텍스트 노드들 파싱 (SVG가 아닌 경우에만)
    if (!isSvgContext(element)) {
      children.push(...parseTextNodes(element, (text, isEditable) => 
        this.createTextModel(text, isEditable)
      ))
    }

    return {
      ...createFrameAttributes(element),
      styles: this.extractStyles(element),
      attributes: this.extractAttributes(element),
      children,
    }
  }

  /**
   * 구조를 유지하면서 텍스트만 편집 가능한 FrameModel 생성
   */
  private createFrameModelWithEditableText(element: Element, editableType: string): FrameModel {
    const children: TemplateElement[] = []

    // 자식 요소들 파싱
    children.push(...parseChildren(element, (child) => this.parseElement(child)))
    
    // 텍스트 노드들을 편집 가능한 TextModel로 처리 (SVG가 아닌 경우에만)
    if (!isSvgContext(element)) {
      for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim()
          if (text) {
            children.push(this.createTextModel(text, true))
          }
        }
      }
    }

    return {
      ...createFrameAttributes(element),
      styles: this.extractStyles(element),
      attributes: this.extractAttributes(element),
      children,
    }
  }

  /**
   * EditableModel 생성 (기존 방식 - 이미지/아이콘/링크용)
   */
  private createEditableModel(element: Element, editableType: string): EditableModel {
    switch (editableType) {
      case "text":
        return this.createTextModel(element.textContent || "", true, element)
      case "image":
        return this.createImageModel(element)
      case "icon":
        return this.createIconModel(element)
      case "link":
        return this.createLinkModel(element)
      default:
        // 알 수 없는 타입은 텍스트로 처리
        return this.createTextModel(element.textContent || "", true, element)
    }
  }

  /**
   * TextModel 생성
   */
  private createTextModel(content: string, isEditable: boolean, element?: Element): TextModel {
    const constraints: TextModel["constraints"] = {}

    if (element) {
      const maxLength = element.getAttribute("data-max-length")
      if (maxLength) constraints.maxLength = parseInt(maxLength)

      const placeholder = element.getAttribute("placeholder")
      if (placeholder) constraints.placeholder = placeholder
    }

    return {
      id: this.generateId(),
      type: "text",
      content,
      isEditable: true,
      constraints: Object.keys(constraints).length > 0 ? constraints : undefined,
    }
  }

  /**
   * ImageModel 생성
   */
  private createImageModel(element: Element): ImageModel {
    let img: HTMLImageElement | null = element.querySelector("img")
    if (!img && isHTMLImageElement(element)) {
      img = element
    }
    if (!img) {
      throw new Error("No image element found")
    }

    return {
      id: this.generateId(),
      type: "image",
      src: img.getAttribute("src") || "",
      alt: img.getAttribute("alt") || undefined,
      isEditable: true,
      className: element.className || undefined,
      attributes: this.extractAttributes(element),
    }
  }

  /**
   * IconModel 생성
   */
  private createIconModel(element: Element): IconModel {
    let svg: SVGElement | null = element.querySelector("svg")
    if (!svg && isSVGElement(element)) {
      svg = element
    }
    if (!svg) {
      throw new Error("No SVG element found")
    }

    return {
      id: this.generateId(),
      type: "icon",
      outerHTML: svg.outerHTML, // 전체 SVG outerHTML 저장
      isEditable: true,
      className: element.className || undefined,
      attributes: this.extractAttributes(element),
    }
  }

  /**
   * LinkModel 생성
   */
  private createLinkModel(element: Element): LinkModel {
    if (!isHTMLAnchorElement(element)) {
      throw new Error("Element is not an anchor element")
    }
    const anchor = element

    return {
      id: this.generateId(),
      type: "link",
      href: anchor.getAttribute("href") || "#",
      text: element.textContent || "Link",
      target: anchor.getAttribute("target") || undefined,
      isEditable: true,
      className: element.className || undefined,
      attributes: this.extractAttributes(element),
    }
  }

  /**
   * 인라인 스타일 추출
   */
  private extractStyles(element: Element): Record<string, string> | undefined {
    return extractInlineStyles(element)
  }

  /**
   * 속성 추출 (data-editable, class, style 제외)
   */
  private extractAttributes(element: Element): Record<string, string> | undefined {
    return extractElementAttributes(element)
  }

  /**
   * DOM에 data-editable 속성 추가
   */
  private enhanceElementsWithDataAttributes(
    doc: Document,
    editableElements: Array<{ selector: string; type: string; constraints?: { maxLength?: number } }>,
  ): void {
    editableElements.forEach((editableElement) => {
      try {
        const elements = doc.querySelectorAll(editableElement.selector)
        elements.forEach((element) => {
          element.setAttribute("data-editable", editableElement.type)
          if (editableElement.constraints?.maxLength) {
            element.setAttribute("data-max-length", editableElement.constraints.maxLength.toString())
          }
        })
      } catch {
        // Failed to apply selector - might be an invalid CSS selector
      }
    })
  }

  /**
   * 고유 ID 생성 (UUID 기반)
   */
  private generateId(): string {
    return generateElementId()
  }
}
