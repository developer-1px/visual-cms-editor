// 모든 액션 관련 요소들을 한 곳에서 내보내기

// 인터페이스
export type * from "./interfaces"

// 메인 매니저
export { SelectionActionManager, selectionActionManager } from "./SelectionActionManager"

// 핸들러들
export { ImageActionHandler } from "./handlers/ImageActionHandler"
export { RepeatableActionHandler } from "./handlers/RepeatableActionHandler"
export { ModelTextActionHandler } from "./handlers/ModelTextActionHandler"

// 모든 핸들러를 자동으로 등록하는 함수
import { selectionActionManager } from "./SelectionActionManager"
import { ImageActionHandler } from "./handlers/ImageActionHandler"
import { RepeatableActionHandler } from "./handlers/RepeatableActionHandler"
import { ModelTextActionHandler } from "./handlers/ModelTextActionHandler"

/**
 * 모든 기본 핸들러들을 등록하는 초기화 함수
 */
export function initializeActionHandlers(): void {
  console.log("[Actions] Initializing action handlers...")

  // 기본 핸들러들 등록
  selectionActionManager.registerHandler(new ImageActionHandler())
  selectionActionManager.registerHandler(new RepeatableActionHandler())
  selectionActionManager.registerHandler(new ModelTextActionHandler())

  console.log("[Actions] Action handlers initialized successfully")

  // 디버깅 정보 출력
  if (typeof window !== "undefined" && window.location?.hostname === "localhost") {
    selectionActionManager.debugInfo()
  }
}

/**
 * 액션 시스템이 준비되었는지 확인
 */
export function isActionSystemReady(): boolean {
  const registeredTypes = selectionActionManager.getRegisteredTypes()
  const expectedTypes = ["image", "repeatable", "text"]

  return expectedTypes.every((type) => registeredTypes.includes(type))
}

/**
 * 디버깅을 위한 전역 액세스
 */
if (typeof window !== "undefined") {
  // 디버깅용 전역 액세스
  const globalWindow = window as Window & { __selectionActionManager?: SelectionActionManager }
  globalWindow.__selectionActionManager = selectionActionManager
}
