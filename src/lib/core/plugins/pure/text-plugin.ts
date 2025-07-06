/**
 * DOM을 전혀 사용하지 않는 순수한 텍스트 플러그인
 * Core level - 데이터와 로직만 처리
 */

import type { PurePlugin } from "../pure-plugin-system.ts"

export interface TextData {
  text: string
  maxLength?: number
  placeholder?: string
}

export const pureTextPlugin: PurePlugin = {
  config: {
    type: "text",
    name: "Pure Text Plugin",
    description: "Text editing without DOM manipulation",
    defaultConstraints: {
      maxLength: 100,
      minLength: 0,
      allowHTML: false,
    },
    defaultData: {
      text: "",
      placeholder: "Enter text...",
    },
  },

  // 순수한 데이터 검증
  validateData(data: unknown, constraints?: Record<string, unknown>): { valid: boolean; message?: string } {
    if (typeof data !== "object" || data === null || !("text" in data)) {
      return { valid: false, message: "Invalid text data format" }
    }

    const textData = data as TextData
    const text = textData.text

    if (typeof text !== "string") {
      return { valid: false, message: "Text must be a string" }
    }

    // 길이 검증
    if (constraints?.maxLength && text.length > constraints.maxLength) {
      return {
        valid: false,
        message: `Text too long. Maximum ${constraints.maxLength} characters allowed.`,
      }
    }

    if (constraints?.minLength && text.length < constraints.minLength) {
      return {
        valid: false,
        message: `Text too short. Minimum ${constraints.minLength} characters required.`,
      }
    }

    // HTML 검증
    if (constraints?.allowHTML === false && /<[^>]*>/.test(text)) {
      return { valid: false, message: "HTML tags are not allowed" }
    }

    return { valid: true }
  },

  // 데이터 변환 (정규화)
  transformData(data: unknown): TextData {
    if (typeof data === "string") {
      return { text: data.trim() }
    }

    if (typeof data === "object" && data !== null && "text" in data) {
      const textData = data as Partial<TextData>
      return {
        text: (textData.text || "").trim(),
        maxLength: textData.maxLength,
        placeholder: textData.placeholder,
      }
    }

    return { text: "" }
  },

  // 기본값 생성
  getDefaultValue(): TextData {
    return {
      text: "",
      placeholder: "Enter text...",
    }
  },

  // 상태 변경 이벤트 핸들러들
  onSelect(elementId: string, data?: Record<string, unknown>): void {
    console.log(`[PureTextPlugin] Selected: ${elementId}`, data)
  },

  onDeselect(elementId: string): void {
    console.log(`[PureTextPlugin] Deselected: ${elementId}`)
  },

  onEditStart(elementId: string): void {
    console.log(`[PureTextPlugin] Edit started: ${elementId}`)
  },

  onEditStop(elementId: string): void {
    console.log(`[PureTextPlugin] Edit stopped: ${elementId}`)
  },

  onDataChange(elementId: string, newData: unknown, oldData?: unknown): void {
    console.log(`[PureTextPlugin] Data changed: ${elementId}`, { newData, oldData })

    // 변경 사항 검증
    const validation = this.validateData!(newData)
    if (!validation.valid) {
      console.warn(`[PureTextPlugin] Invalid data: ${validation.message}`)
    }
  },
}

// 유틸리티 함수들 (순수 함수)
export function createTextData(text: string, options?: Partial<TextData>): TextData {
  return {
    text: text.trim(),
    maxLength: options?.maxLength,
    placeholder: options?.placeholder,
  }
}

export function isTextEmpty(data: TextData): boolean {
  return !data.text || data.text.trim().length === 0
}

export function truncateText(data: TextData, maxLength: number): TextData {
  if (data.text.length <= maxLength) {
    return data
  }

  return {
    ...data,
    text: data.text.substring(0, maxLength).trim(),
  }
}

export function sanitizeText(data: TextData, allowHTML: boolean = false): TextData {
  if (allowHTML) {
    return data
  }

  return {
    ...data,
    text: data.text.replace(/<[^>]*>/g, ""),
  }
}
