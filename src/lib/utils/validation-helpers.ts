/**
 * 검증 관련 유틸리티 함수들
 */

/**
 * URL 유효성 검증
 */
export const isValidUrl = (url: string, baseUrl?: string): boolean => {
  try {
    new URL(url, baseUrl)
    return true
  } catch {
    return false
  }
}

/**
 * 파일 확장자 추출
 */
export const getFileExtension = (filename: string): string | null => {
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension || null
}

/**
 * 파일 형식 검증
 */
export const isAllowedFileFormat = (filename: string, allowedFormats: string[]): boolean => {
  const extension = getFileExtension(filename)
  return extension ? allowedFormats.includes(extension) : false
}

/**
 * 파일 크기 검증
 */
export const isFileSizeValid = (size: number, maxSize: number): boolean => {
  return size <= maxSize
}

/**
 * 텍스트 길이 검증
 */
export const isTextLengthValid = (
  text: string,
  constraints: { minLength?: number; maxLength?: number }
): { valid: boolean; message?: string } => {
  const { minLength, maxLength } = constraints
  
  if (minLength && text.length < minLength) {
    return {
      valid: false,
      message: `Text must be at least ${minLength} characters`,
    }
  }
  
  if (maxLength && text.length > maxLength) {
    return {
      valid: false,
      message: `Text exceeds maximum length of ${maxLength} characters`,
    }
  }
  
  return { valid: true }
}

/**
 * 통합 파일 검증
 */
export const validateFile = async (
  file: File,
  constraints: {
    maxSize?: number
    allowedFormats?: string[]
  }
): Promise<{ valid: boolean; message?: string }> => {
  const { maxSize, allowedFormats } = constraints
  
  // 파일 크기 검증
  if (maxSize && !isFileSizeValid(file.size, maxSize)) {
    const { formatFileSize } = await import("../core/plugins/utils/plugin-helpers")
    return {
      valid: false,
      message: `File size exceeds maximum of ${formatFileSize(maxSize)}`,
    }
  }
  
  // 파일 형식 검증
  if (allowedFormats && !isAllowedFileFormat(file.name, allowedFormats)) {
    return {
      valid: false,
      message: `File format not allowed. Allowed formats: ${allowedFormats.join(", ")}`,
    }
  }
  
  return { valid: true }
}