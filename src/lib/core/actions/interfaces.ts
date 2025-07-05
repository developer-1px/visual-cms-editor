/**
 * Action Handler Interface for Strategy Pattern
 * 전략 패턴을 위한 액션 핸들러 인터페이스
 */

export interface ActionHandler {
  /**
   * 이 핸들러가 주어진 요소와 선택 타입을 처리할 수 있는지 확인
   */
  canHandle(element: HTMLElement, selectionType: string): boolean

  /**
   * 요소 복사
   */
  copy(element: HTMLElement): Promise<void>

  /**
   * 요소 잘라내기
   */
  cut(element: HTMLElement): Promise<void>

  /**
   * 요소 붙여넣기
   */
  paste(element: HTMLElement): Promise<void>

  /**
   * 요소 삭제
   */
  delete(element: HTMLElement): Promise<void>

  /**
   * 핸들러 타입 식별자
   */
  readonly type: string
}

/**
 * Selection Action Manager Interface
 * 선택 액션 매니저 인터페이스
 */
export interface SelectionActionManager {
  /**
   * 액션 핸들러 등록
   */
  registerHandler(handler: ActionHandler): void

  /**
   * 액션 핸들러 제거
   */
  unregisterHandler(type: string): void

  /**
   * 액션 실행
   */
  executeAction(action: ActionType, element: HTMLElement, selectionType: string): Promise<void>

  /**
   * 특정 타입에 대한 핸들러 존재 여부 확인
   */
  hasHandler(selectionType: string): boolean

  /**
   * 등록된 모든 핸들러 타입 반환
   */
  getRegisteredTypes(): string[]
}

/**
 * 지원되는 액션 타입들
 */
export type ActionType = "copy" | "cut" | "paste" | "delete"

/**
 * 액션 실행 결과
 */
export interface ActionResult {
  success: boolean
  message?: string
  data?: unknown
}

/**
 * 액션 컨텍스트 (추가 정보가 필요한 경우)
 */
export interface ActionContext {
  element: HTMLElement
  selectionType: string
  metadata?: Record<string, unknown>
}
