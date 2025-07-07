/**
 * Template System Entity Types
 * 
 * 템플릿 시스템과 관련된 모든 타입 정의
 */

export interface Template {
  id: string
  name: string
  description: string
  category: "hero" | "features" | "cta" | "content" | "testimonial" | "pricing"
  html: string
  thumbnail?: string
  editableElements: EditableElement[]
}

export interface EditableElement {
  selector: string
  type: "text" | "image" | "icon" | "link"
  defaultValue: string
  constraints?: {
    maxLength?: number
    minLength?: number
    allowedFormats?: string[]
  }
}

export interface TemplateToComponentOptions {
  preserveStyles?: boolean
  addEditableMarkers?: boolean
  generateProps?: boolean
}

export interface ConventionRules {
  classPatterns: Array<{
    pattern: RegExp
    type: "text" | "image" | "icon" | "link"
    maxLength?: number
  }>
  dataAttributes: Array<{
    attribute: string
    type: "text" | "image" | "icon" | "link"
  }>
  tagDefaults: Record<string, {
    type: "text" | "image" | "icon" | "link"
    maxLength?: number
  }>
}

export interface TemplateRegistry {
  register(template: Template): void
  unregister(id: string): void
  get(id: string): Template | undefined
  getAll(): Template[]
  getByCategory(category: Template["category"]): Template[]
  search(query: string): Template[]
}