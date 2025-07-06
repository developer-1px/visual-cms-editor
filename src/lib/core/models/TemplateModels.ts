// Template Model Types for Svelte-native rendering

export type ElementId = string

export interface BaseModel {
  id: ElementId
  className?: string
  attributes?: Record<string, string>
}

// Frame Model: 레이아웃/컨테이너 요소
export interface FrameModel extends BaseModel {
  type: "frame"
  tagName: string // 'div', 'section', 'article', etc.
  styles?: Record<string, string>
  children: TemplateElement[]
}

// Text Model: 편집 가능한 콘텐츠 요소
export interface TextModel extends BaseModel {
  type: "text"
  content: string
  isEditable: true
  constraints?: {
    maxLength?: number
    placeholder?: string
  }
}

// Image Model
export interface ImageModel extends BaseModel {
  type: "image"
  src: string
  alt?: string
  isEditable: true
}

// Icon Model
export interface IconModel extends BaseModel {
  type: "icon"
  pathData: string
  viewBox?: string
  isEditable: true
}

// Link Model
export interface LinkModel extends BaseModel {
  type: "link"
  href: string
  text: string
  target?: string
  isEditable: true
}

// Union type for all editable elements
export type EditableModel = TextModel | ImageModel | IconModel | LinkModel

// Union type for all template elements
export type TemplateElement = FrameModel | EditableModel

// Root template model
export interface TemplateModel {
  id: string
  name: string
  root: FrameModel
  metadata?: {
    version: string
    created: string
    modified: string
  }
}

// Type guards
export function isFrameModel(element: TemplateElement): element is FrameModel {
  return element.type === "frame"
}

export function isEditableModel(element: TemplateElement): element is EditableModel {
  return element.type !== "frame"
}

export function isTextModel(element: TemplateElement): element is TextModel {
  return element.type === "text"
}

export function isImageModel(element: TemplateElement): element is ImageModel {
  return element.type === "image"
}

export function isIconModel(element: TemplateElement): element is IconModel {
  return element.type === "icon"
}

export function isLinkModel(element: TemplateElement): element is LinkModel {
  return element.type === "link"
}
