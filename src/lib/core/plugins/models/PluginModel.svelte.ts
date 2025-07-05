// 플러그인 모델 기반 시스템
import type { EditablePlugin, EditableAction } from "../core/interfaces"

export interface PluginState {
  isEditing: boolean
  value: any
  isDirty: boolean
  errors: string[]
}

export interface PluginModel {
  id: string
  type: string
  state: PluginState
  element?: HTMLElement
  
  // Actions
  startEdit(): void
  stopEdit(): void
  getValue(): any
  setValue(value: any): void
  validate(): { valid: boolean; message?: string }
  reset(): void
  
  // Event handlers - 순수 함수로 상태만 변경
  handleClick?(): void
  handleDoubleClick?(): void
  handleKeydown?(key: string): void
}

// 기본 플러그인 모델 클래스
export class BasePluginModel implements PluginModel {
  id: string
  type: string
  state = $state<PluginState>({
    isEditing: false,
    value: null,
    isDirty: false,
    errors: []
  })
  element?: HTMLElement
  
  constructor(id: string, type: string, initialValue?: any) {
    this.id = id
    this.type = type
    if (initialValue !== undefined) {
      this.state.value = initialValue
    }
  }
  
  startEdit(): void {
    this.state.isEditing = true
  }
  
  stopEdit(): void {
    this.state.isEditing = false
  }
  
  getValue(): any {
    return this.state.value
  }
  
  setValue(value: any): void {
    this.state.value = value
    this.state.isDirty = true
  }
  
  validate(): { valid: boolean; message?: string } {
    return { valid: true }
  }
  
  reset(): void {
    this.state.isDirty = false
    this.state.errors = []
  }
  
  handleDoubleClick(): void {
    this.startEdit()
  }
  
  handleKeydown(key: string): void {
    if (key === "Escape") {
      this.stopEdit()
    }
  }
}

// 플러그인 모델 팩토리
export function createPluginModel(type: string, id: string, initialValue?: any): PluginModel {
  switch (type) {
    case "text":
      return new TextPluginModel(id, initialValue)
    case "image":
      return new ImagePluginModel(id, initialValue)
    case "icon":
      return new IconPluginModel(id, initialValue)
    case "link":
      return new LinkPluginModel(id, initialValue)
    default:
      return new BasePluginModel(id, type, initialValue)
  }
}

// 텍스트 플러그인 모델
export class TextPluginModel extends BasePluginModel {
  constructor(id: string, initialValue = "") {
    super(id, "text", initialValue)
  }
  
  validate(): { valid: boolean; message?: string } {
    const value = this.state.value as string
    const maxLength = 1000 // 제약사항은 별도로 관리
    
    if (value.length > maxLength) {
      return {
        valid: false,
        message: `Text exceeds maximum length of ${maxLength} characters`
      }
    }
    
    return { valid: true }
  }
  
  handleKeydown(key: string): void {
    if (key === "Escape") {
      this.stopEdit()
    }
    // Enter는 줄바꿈으로 사용
  }
}

// 이미지 플러그인 모델
export class ImagePluginModel extends BasePluginModel {
  constructor(id: string, initialValue = "") {
    super(id, "image", initialValue)
  }
  
  validate(): { valid: boolean; message?: string } {
    const value = this.state.value as string
    
    if (!value) {
      return { valid: true } // 빈 이미지 허용
    }
    
    // URL 검증
    try {
      new URL(value)
      return { valid: true }
    } catch {
      return {
        valid: false,
        message: "Invalid image URL"
      }
    }
  }
  
  handleClick(): void {
    // 이미지 선택 UI 표시 (컴포넌트에서 처리)
    this.startEdit()
  }
}

// 아이콘 플러그인 모델
export class IconPluginModel extends BasePluginModel {
  constructor(id: string, initialValue = "") {
    super(id, "icon", initialValue)
  }
  
  handleClick(): void {
    // 아이콘 선택 UI 표시 (컴포넌트에서 처리)
    this.startEdit()
  }
}

// 링크 플러그인 모델
export class LinkPluginModel extends BasePluginModel {
  constructor(id: string, initialValue = { href: "#", text: "Link" }) {
    super(id, "link", initialValue)
  }
  
  validate(): { valid: boolean; message?: string } {
    const { href } = this.state.value
    
    if (!href || href === "#") {
      return { valid: true } // 빈 링크 허용
    }
    
    // URL 검증
    try {
      new URL(href, window.location.href)
      return { valid: true }
    } catch {
      return {
        valid: false,
        message: "Invalid URL"
      }
    }
  }
  
  handleClick(): void {
    // 링크 편집 UI 표시 (컴포넌트에서 처리)
    this.startEdit()
  }
}