import type { CommandHandler, SelectionCommandManager as ISelectionCommandManager, CommandType } from "./action-interfaces"

// Command executor type
type CommandExecutor = (handler: CommandHandler, element: HTMLElement) => Promise<void>

/**
 * 중앙 집중식 Selection Command Manager
 * 전략 패턴과 레지스트리 패턴을 사용하여 다양한 타입의 커맨드 핸들러를 관리
 */
export class SelectionCommandManager implements ISelectionCommandManager {
  private handlers = new Map<string, CommandHandler>()
  
  // Command registry for better extensibility
  private commandRegistry = new Map<CommandType, CommandExecutor>([
    ["copy", async (handler, element) => handler.copy(element)],
    ["cut", async (handler, element) => handler.cut(element)],
    ["paste", async (handler, element) => handler.paste(element)],
    ["delete", async (handler, element) => handler.delete(element)],
  ])

  /**
   * 커맨드 핸들러 등록
   */
  registerHandler(handler: CommandHandler): void {
    if (this.handlers.has(handler.type)) {
      // Handler for this type already exists - replacing with new one
    }

    this.handlers.set(handler.type, handler)
    // Handler registered successfully
  }

  /**
   * 새로운 커맨드 타입 등록
   */
  registerCommand(command: CommandType, executor: CommandExecutor): void {
    this.commandRegistry.set(command, executor)
  }

  /**
   * 커맨드 핸들러 제거
   */
  unregisterHandler(type: string): void {
    if (this.handlers.has(type)) {
      this.handlers.delete(type)
      // Handler unregistered successfully
    } else {
      // No handler found for this type - nothing to unregister
    }
  }

  /**
   * 주어진 요소와 선택 타입에 대한 적절한 핸들러 찾기
   */
  private findHandler(element: HTMLElement, selectionType: string): CommandHandler | null {
    for (const handler of this.handlers.values()) {
      if (handler.canHandle(element, selectionType)) {
        return handler
      }
    }
    return null
  }

  /**
   * 커맨드 실행
   */
  async executeCommand(command: CommandType, element: HTMLElement, selectionType: string): Promise<void> {
    // Executing command for selection type

    const handler = this.findHandler(element, selectionType)

    if (!handler) {
      const errorMsg = `No handler found for selection type: ${selectionType}`
      console.error(`[SelectionCommandManager] ${errorMsg}`)
      throw new Error(errorMsg)
    }

    const executor = this.commandRegistry.get(command)
    if (!executor) {
      throw new Error(`Unknown command: ${command}`)
    }

    try {
      await executor(handler, element)
      // Command executed successfully
    } catch (error) {
      console.error(`[SelectionCommandManager] Command failed: ${command} for ${selectionType}`, error)
      throw error
    }
  }

  /**
   * 특정 타입에 대한 핸들러 존재 여부 확인
   */
  hasHandler(selectionType: string): boolean {
    return Array.from(this.handlers.values()).some((handler) =>
      handler.canHandle(document.createElement("div"), selectionType),
    )
  }

  /**
   * 등록된 모든 핸들러 타입 반환
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.handlers.keys())
  }

  /**
   * 디버깅을 위한 상태 정보 출력
   */
  debugInfo(): void {
    // Debug info can be logged using external logger if needed
    // Currently registered handlers: this.getRegisteredTypes()
    // Handler details are available in this.handlers map
  }
}

// 싱글톤 인스턴스 생성
export const selectionCommandManager = new SelectionCommandManager()
