// 모든 커맨드 관련 요소들을 한 곳에서 내보내기

// 인터페이스
export type * from "./action-interfaces"

// 메인 매니저
export { SelectionCommandManager, selectionCommandManager } from "./SelectionCommandManager"

// 핸들러들
export { ImageCommandHandler } from "./handlers/ImageCommandHandler"
export { RepeatableCommandHandler } from "./handlers/RepeatableCommandHandler"
export { ModelTextCommandHandler } from "./handlers/ModelTextCommandHandler"

// 모든 핸들러를 자동으로 등록하는 함수
import { selectionCommandManager } from "./SelectionCommandManager"
import { ImageCommandHandler } from "./handlers/ImageCommandHandler"
import { RepeatableCommandHandler } from "./handlers/RepeatableCommandHandler"
import { ModelTextCommandHandler } from "./handlers/ModelTextCommandHandler"

/**
 * 모든 기본 핸들러들을 등록하는 초기화 함수
 */
export function initializeCommandHandlers(): void {
  // [Commands] Initializing command handlers...

  // 기본 핸들러들 등록
  selectionCommandManager.registerHandler(new ImageCommandHandler())
  selectionCommandManager.registerHandler(new RepeatableCommandHandler())
  selectionCommandManager.registerHandler(new ModelTextCommandHandler())

  // [Commands] Command handlers initialized successfully

  // 디버깅 정보 출력
  if (typeof window !== "undefined" && window.location?.hostname === "localhost") {
    selectionCommandManager.debugInfo()
  }
}

/**
 * 커맨드 시스템이 준비되었는지 확인
 */
export function isCommandSystemReady(): boolean {
  const registeredTypes = selectionCommandManager.getRegisteredTypes()
  const expectedTypes = ["image", "repeatable", "text"]

  return expectedTypes.every((type) => registeredTypes.includes(type))
}

/**
 * 디버깅을 위한 전역 액세스
 */
if (typeof window !== "undefined") {
  // 디버깅용 전역 액세스
  const globalWindow = window as Window & { __selectionCommandManager?: SelectionCommandManager }
  globalWindow.__selectionCommandManager = selectionCommandManager
}
