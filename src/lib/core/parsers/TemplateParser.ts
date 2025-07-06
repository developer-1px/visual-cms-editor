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
    console.log("🔍 Editable selectors found:", Array.from(this.editableSelectors))

    const doc = new DOMParser().parseFromString(html, "text/html")
    const rootElement = doc.body.firstElementChild || doc.body

    // 편집 가능한 요소들에 data-editable 속성 추가
    this.enhanceElementsWithDataAttributes(doc, editableElements)

    const root = this.parseElement(rootElement) as FrameModel

    return {
      id: templateId,
      name: templateName,
      root,
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
    // data-editable이 있으면 구조를 유지하면서 텍스트만 편집 가능하게
    const editableType = element.getAttribute("data-editable")
    if (editableType) {
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

    // SVG 요소는 특별 처리 - 내부 구조를 보존
    if (element.tagName.toLowerCase() === "svg" || element.closest("svg")) {
      // SVG 내부는 자식 요소만 처리하고 텍스트 노드는 무시
      for (const child of element.children) {
        children.push(this.parseElement(child))
      }
    } else {
      // 일반 요소: 자식 요소들을 재귀적으로 파싱
      for (const child of element.children) {
        children.push(this.parseElement(child))
      }

      // 텍스트 노드 처리 (data-editable 없는 순수 텍스트)
      for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim()
          if (text) {
            children.push(this.createTextModel(text, false))
          }
        }
      }
    }

    return {
      id: this.generateId(),
      type: "frame",
      tagName: element.tagName.toLowerCase(),
      className: element.className || undefined,
      styles: this.extractStyles(element),
      attributes: this.extractAttributes(element),
      children,
    }
  }

  /**
   * 구조를 유지하면서 텍스트만 편집 가능한 FrameModel 생성
   */
  private createFrameModelWithEditableText(element: Element): FrameModel {
    const children: TemplateElement[] = []

    // SVG 요소는 특별 처리
    if (element.tagName.toLowerCase() === "svg" || element.closest("svg")) {
      // SVG 내부는 자식 요소만 처리
      for (const child of element.children) {
        children.push(this.parseElement(child))
      }
    } else {
      // 자식 요소들을 처리
      for (const child of element.children) {
        children.push(this.parseElement(child))
      }

      // 텍스트 노드들을 편집 가능한 TextModel로 처리
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
      id: this.generateId(),
      type: "frame",
      tagName: element.tagName.toLowerCase(),
      className: element.className || undefined,
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
    const img = element.querySelector("img") || (element as HTMLImageElement)

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
    const svg = element.querySelector("svg") || (element as SVGElement)
    const path = svg.querySelector("path")

    return {
      id: this.generateId(),
      type: "icon",
      pathData: path?.getAttribute("d") || "",
      viewBox: svg.getAttribute("viewBox") || "0 0 24 24",
      isEditable: true,
      className: element.className || undefined,
      attributes: this.extractAttributes(element),
    }
  }

  /**
   * LinkModel 생성
   */
  private createLinkModel(element: Element): LinkModel {
    const anchor = element as HTMLAnchorElement

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
    const style = (element as HTMLElement).style
    if (!style || style.length === 0) return undefined

    const styles: Record<string, string> = {}
    for (let i = 0; i < style.length; i++) {
      const property = style.item(i)
      styles[property] = style.getPropertyValue(property)
    }

    return Object.keys(styles).length > 0 ? styles : undefined
  }

  /**
   * 속성 추출 (data-editable, class, style 제외)
   */
  private extractAttributes(element: Element): Record<string, string> | undefined {
    const attributes: Record<string, string> = {}
    const excludeAttrs = ["class", "style", "data-editable", "data-max-length"]

    for (const attr of element.attributes) {
      if (!excludeAttrs.includes(attr.name)) {
        attributes[attr.name] = attr.value
      }
    }

    return Object.keys(attributes).length > 0 ? attributes : undefined
  }

  /**
   * DOM에 data-editable 속성 추가
   */
  private enhanceElementsWithDataAttributes(doc: Document, editableElements: Array<{selector: string; type: string; constraints?: {maxLength?: number}}>): void {
    editableElements.forEach((editableElement) => {
      try {
        const elements = doc.querySelectorAll(editableElement.selector)
        elements.forEach((element) => {
          element.setAttribute("data-editable", editableElement.type)
          if (editableElement.constraints?.maxLength) {
            element.setAttribute("data-max-length", editableElement.constraints.maxLength.toString())
          }
        })
      } catch (error) {
        console.warn(`Failed to apply selector "${editableElement.selector}":`, error)
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
