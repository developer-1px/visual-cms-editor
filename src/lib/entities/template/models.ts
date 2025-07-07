/**
 * Template Model Entity Types
 * 
 * 템플릿 모델과 관련된 모든 타입 정의
 */

export type ElementId = string

export interface BaseModel {
  id: ElementId
  className?: string
  attributes?: Record<string, string>
}

export interface FrameModel extends BaseModel {
  type: "frame"
  tagName: string
  styles?: Record<string, string>
  children: TemplateElement[]
}

export interface TextModel extends BaseModel {
  type: "text"
  content: string
  isEditable: true
  constraints?: {
    maxLength?: number
    placeholder?: string
  }
}

export interface ImageModel extends BaseModel {
  type: "image"
  src: string
  alt?: string
  isEditable: true
}

export interface IconModel extends BaseModel {
  type: "icon"
  outerHTML: string // 전체 SVG outerHTML 저장
  isEditable: true
}

export interface LinkModel extends BaseModel {
  type: "link"
  href: string
  text: string
  target?: string
  isEditable: true
}

export type EditableModel = TextModel | ImageModel | IconModel | LinkModel
export type TemplateElement = FrameModel | EditableModel

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

// Type Guards
export function isFrameModel(element: TemplateElement): element is FrameModel {
  return element.type === "frame"
}

export function isEditableModel(element: TemplateElement): element is EditableModel {
  return ["text", "image", "icon", "link"].includes(element.type)
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