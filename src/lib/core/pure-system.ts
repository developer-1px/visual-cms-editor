/**
 * DOM을 전혀 사용하지 않는 순수한 시스템 통합
 * Core level - 상태와 로직만 관리
 */

// 순수한 상태 관리
export {
  elementStateManager,
  useElementState,
  type ElementState,
  type ElementType,
} from "./state/element-state.svelte.ts"

// 순수한 플러그인 시스템
export { purePluginManager, type PurePlugin, type PurePluginConfig } from "./plugins/pure-plugin-system.ts"

// 순수한 플러그인들
export {
  pureTextPlugin,
  createTextData,
  isTextEmpty,
  truncateText,
  sanitizeText,
  type TextData,
} from "./plugins/pure/text-plugin.ts"

// 시스템 초기화
export function initializePureSystem(): void {
  // 기본 플러그인들 등록
  purePluginManager.register(pureTextPlugin)

  console.log("[PureSystem] Initialized with plugins:", purePluginManager.getRegisteredTypes())
}

// 시스템 상태 확인 (디버깅용)
export function getSystemState() {
  return {
    elements: elementStateManager.getAllElements(),
    selection: elementStateManager.getSelectionState(),
    plugins: purePluginManager.getRegisteredTypes(),
  }
}
