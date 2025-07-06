/**
 * UUID 생성 유틸리티
 */

/**
 * UUID v4 생성
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 짧은 UUID 생성 (element ID용)
 */
export function generateShortUUID(): string {
  return generateUUID().split('-')[0]
}

/**
 * 접두어가 있는 UUID 생성
 */
export function generateElementId(prefix: string = 'element'): string {
  return `${prefix}-${generateShortUUID()}`
}