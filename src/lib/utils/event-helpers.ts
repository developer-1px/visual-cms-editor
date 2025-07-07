/**
 * 이벤트 관련 유틸리티 함수들
 */

/**
 * 커스텀 이벤트 생성 및 디스패치
 */
export const dispatchCustomEvent = (
  target: EventTarget,
  eventName: string,
  detail?: unknown,
  options: CustomEventInit = {}
): void => {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    ...options,
  })
  target.dispatchEvent(event)
}

/**
 * 키보드 이벤트 헬퍼
 */
export const preventDefaultAndStop = (e: Event): void => {
  e.preventDefault()
  e.stopPropagation()
}

/**
 * 이벤트 핸들러 생성 헬퍼
 */
export const createEventHandler = <T extends Event>(
  handler: (e: T) => void,
  options: { preventDefault?: boolean; stopPropagation?: boolean } = {}
) => {
  return (e: T) => {
    if (options.preventDefault) e.preventDefault()
    if (options.stopPropagation) e.stopPropagation()
    handler(e)
  }
}

/**
 * 안전한 이벤트 리스너 추가
 */
export const addEventListenerSafe = (
  element: EventTarget,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): (() => void) => {
  element.addEventListener(event, handler, options)
  
  // 클린업 함수 반환
  return () => {
    element.removeEventListener(event, handler, options)
  }
}