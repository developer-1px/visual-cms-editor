/**
 * Command Action Interfaces
 *
 * 명령 실행 관련 인터페이스
 */

// Re-export from entities for backwards compatibility
export type {
  CommandHandler,
  SelectionCommandManager,
  CommandType,
  CommandResult,
  CommandContext,
} from "$lib/entities/command/types"
