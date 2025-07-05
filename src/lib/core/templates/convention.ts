import type { Template, EditableElement } from "./types"

/**
 * HTML 관례 기반 자동 편집 요소 감지
 * Convention over Configuration 접근법
 */

interface ConventionRules {
  // 클래스명 패턴으로 타입 추론
  classPatterns: Array<{
    pattern: RegExp
    type: "text" | "image" | "icon" | "link"
    maxLength?: number
  }>

  // data-* 속성 직접 감지
  dataAttributes: Array<{
    attribute: string
    type: "text" | "image" | "icon" | "link"
  }>

  // HTML 태그별 기본 처리
  tagDefaults: Record<
    string,
    {
      type: "text" | "image" | "icon" | "link"
      maxLength?: number
    }
  >
}

const CONVENTION_RULES: ConventionRules = {
  classPatterns: [
    // 제목/타이틀 관련
    { pattern: /title/i, type: "text", maxLength: 60 },
    { pattern: /heading/i, type: "text", maxLength: 60 },
    { pattern: /headline/i, type: "text", maxLength: 60 },

    // 설명/내용 관련
    { pattern: /description/i, type: "text", maxLength: 200 },
    { pattern: /content/i, type: "text", maxLength: 300 },
    { pattern: /text/i, type: "text", maxLength: 150 },
    { pattern: /quote/i, type: "text", maxLength: 250 },

    // 버튼/액션 관련
    { pattern: /button/i, type: "text", maxLength: 30 },
    { pattern: /btn/i, type: "text", maxLength: 30 },
    { pattern: /cta/i, type: "text", maxLength: 30 },
    { pattern: /action/i, type: "text", maxLength: 30 },

    // 이름/라벨 관련
    { pattern: /name/i, type: "text", maxLength: 50 },
    { pattern: /label/i, type: "text", maxLength: 50 },
    { pattern: /author/i, type: "text", maxLength: 50 },
    { pattern: /role/i, type: "text", maxLength: 50 },

    // 가격 관련
    { pattern: /price/i, type: "text", maxLength: 20 },
    { pattern: /amount/i, type: "text", maxLength: 20 },
    { pattern: /cost/i, type: "text", maxLength: 20 },

    // 이미지 관련
    { pattern: /image/i, type: "image" },
    { pattern: /img/i, type: "image" },
    { pattern: /photo/i, type: "image" },
    { pattern: /picture/i, type: "image" },

    // 아이콘 관련
    { pattern: /icon/i, type: "icon" },
    { pattern: /symbol/i, type: "icon" },

    // 링크 관련
    { pattern: /link/i, type: "link" },
  ],

  dataAttributes: [
    { attribute: "data-editable", type: "text" }, // 기본값
    { attribute: "data-repeatable", type: "text" },
  ],

  tagDefaults: {
    h1: { type: "text", maxLength: 60 },
    h2: { type: "text", maxLength: 60 },
    h3: { type: "text", maxLength: 50 },
    h4: { type: "text", maxLength: 50 },
    h5: { type: "text", maxLength: 40 },
    h6: { type: "text", maxLength: 40 },
    p: { type: "text", maxLength: 300 },
    span: { type: "text", maxLength: 100 },
    button: { type: "text", maxLength: 30 },
    a: { type: "link" },
    img: { type: "image" },
    blockquote: { type: "text", maxLength: 250 },
  },
}

/**
 * HTML을 분석해서 자동으로 editableElements 생성
 */
export async function generateEditableElements(html: string): Promise<EditableElement[]> {
  let doc: Document

  // Browser environment
  if (typeof window !== "undefined") {
    const parser = new DOMParser()
    doc = parser.parseFromString(html, "text/html")
  } else {
    // Server environment - use JSDOM if available
    try {
      // Dynamic import for server-side usage
      const jsdom = await import("jsdom")
      const dom = new jsdom.JSDOM(html)
      doc = dom.window.document
    } catch {
      // Fallback for server environments without JSDOM
      return []
    }
  }
  const elements: EditableElement[] = []
  const processedSelectors = new Set<string>()

  // 1. data-editable 속성이 있는 요소들 우선 처리
  const dataEditables = doc.querySelectorAll("[data-editable]")
  dataEditables.forEach((element) => {
    const editableType = element.getAttribute("data-editable")
    const selector = generateUniqueSelector(element as HTMLElement)

    if (!processedSelectors.has(selector)) {
      elements.push({
        selector,
        type: (editableType as "text" | "image" | "icon" | "link") || "text",
        defaultValue: element.textContent?.trim() || "",
        constraints: getConstraintsForType((editableType as "text" | "image" | "icon" | "link") || "text"),
      })
      processedSelectors.add(selector)
    }
  })

  // 2. 클래스명 기반 자동 감지
  const allElements = doc.querySelectorAll("*")
  allElements.forEach((element) => {
    const htmlElement = element as HTMLElement
    const className = htmlElement.className

    if (!className) return

    // 클래스명 패턴 매칭
    for (const rule of CONVENTION_RULES.classPatterns) {
      if (rule.pattern.test(className)) {
        const selector = `.${className.split(" ")[0]}` // 첫 번째 클래스 사용

        if (!processedSelectors.has(selector)) {
          elements.push({
            selector,
            type: rule.type,
            defaultValue: getDefaultValue(htmlElement, rule.type),
            constraints: getConstraintsForType(rule.type, rule.maxLength),
          })
          processedSelectors.add(selector)
        }
        break // 첫 번째 매칭되는 패턴만 사용
      }
    }
  })

  // 3. 태그별 기본 처리 (클래스가 없는 요소들)
  Object.keys(CONVENTION_RULES.tagDefaults).forEach((tagName) => {
    const elementsOfTag = doc.querySelectorAll(tagName)
    elementsOfTag.forEach((element, index) => {
      const htmlElement = element as HTMLElement

      // 클래스가 없고 data-editable도 없는 경우만
      if (!htmlElement.className && !htmlElement.hasAttribute("data-editable")) {
        const rule = CONVENTION_RULES.tagDefaults[tagName]
        const selector = index === 0 ? tagName : `${tagName}:nth-of-type(${index + 1})`

        if (!processedSelectors.has(selector)) {
          elements.push({
            selector,
            type: rule.type,
            defaultValue: getDefaultValue(htmlElement, rule.type),
            constraints: getConstraintsForType(rule.type, rule.maxLength),
          })
          processedSelectors.add(selector)
        }
      }
    })
  })

  return elements
}

/**
 * CSS 선택자에서 안전하지 않은 문자들을 이스케이프
 */
function escapeCSSSelector(className: string): string {
  // Tailwind CSS arbitrary values나 특수 문자가 포함된 클래스는 attribute selector로 변환
  if (className.includes("[") || className.includes("]") || className.includes(":")) {
    return `[class~="${className}"]`
  }
  return `.${className}`
}

/**
 * 요소의 고유 선택자 생성
 */
function generateUniqueSelector(element: HTMLElement): string {
  // 1. ID가 있으면 사용
  if (element.id) {
    return `#${element.id}`
  }

  // 2. data-editable 속성 우선 처리 (더 구체적이므로)
  if (element.hasAttribute("data-editable")) {
    const type = element.getAttribute("data-editable")
    return `[data-editable="${type}"]`
  }

  // 3. 클래스가 있으면 사용 (안전한 선택자로 변환)
  if (element.className) {
    const classes = element.className.split(" ").filter(Boolean)

    // 가장 의미있는 클래스를 찾기 (일반적인 Tailwind 유틸리티 클래스 제외)
    const meaningfulClass =
      classes.find(
        (cls) =>
          !cls.startsWith("text-") ||
          !cls.startsWith("bg-") ||
          !cls.startsWith("p-") ||
          !cls.startsWith("m-") ||
          !cls.startsWith("w-") ||
          !cls.startsWith("h-") ||
          cls.includes("title") ||
          cls.includes("description") ||
          cls.includes("button") ||
          cls.includes("feature") ||
          cls.includes("price") ||
          cls.includes("author") ||
          cls.includes("content"),
      ) || classes[0]

    return escapeCSSSelector(meaningfulClass)
  }

  // 4. 태그명 + nth-child
  const parent = element.parentElement
  if (parent) {
    const siblings = Array.from(parent.children).filter((el) => el.tagName === element.tagName)
    const index = siblings.indexOf(element)
    return index === 0 ? element.tagName.toLowerCase() : `${element.tagName.toLowerCase()}:nth-of-type(${index + 1})`
  }

  return element.tagName.toLowerCase()
}

/**
 * 요소 타입에 따른 기본값 추출
 */
function getDefaultValue(element: HTMLElement, type: string): string {
  switch (type) {
    case "text":
      return element.textContent?.trim() || ""
    case "link":
      return (element as HTMLAnchorElement).href || "#"
    case "image":
      return (element as HTMLImageElement).src || ""
    case "icon":
      return "default-icon"
    default:
      return element.textContent?.trim() || ""
  }
}

/**
 * 타입별 제약조건 생성
 */
function getConstraintsForType(type: string, maxLength?: number): Record<string, unknown> {
  const constraints: Record<string, unknown> = {}

  switch (type) {
    case "text":
      if (maxLength) {
        constraints.maxLength = maxLength
      }
      break
    case "image":
      constraints.allowedFormats = ["jpg", "jpeg", "png", "webp"]
      constraints.maxSize = 5242880 // 5MB
      break
    case "icon":
      constraints.allowedIcons = [
        "lightning",
        "lock",
        "heart",
        "star",
        "check",
        "arrow-right",
        "user",
        "globe",
        "cog",
        "shield",
      ]
      break
    case "link":
      constraints.allowedProtocols = ["http", "https", "mailto", "tel"]
      break
  }

  return constraints
}

/**
 * 관례 기반 템플릿 생성 헬퍼
 */
export async function createTemplate(
  id: string,
  name: string,
  html: string,
  options: {
    description?: string
    category?: Template["category"]
    customElements?: EditableElement[]
  } = {},
): Promise<Template> {
  const autoElements = await generateEditableElements(html)
  const finalElements = options.customElements ? [...autoElements, ...options.customElements] : autoElements

  return {
    id,
    name,
    description: options.description || `${name} template`,
    category: options.category || "content",
    html,
    editableElements: finalElements,
  }
}
