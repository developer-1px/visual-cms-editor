/**
 * Command Logger System
 *
 * 명령 실행 및 시스템 로깅
 */

import { writable } from "svelte/store"

// Re-export types from entities
export type {
  LogLevel,
  LogEntry,
  LogFilter,
  LoggerConfig,
  Logger,
  LogExporter,
  LogStorage,
} from "$lib/entities/logger/types"
import type { LogLevel, LogEntry } from "$lib/entities/logger/types"
import type { Command } from "./types"

// Logger implementation
class CommandLogger {
  private entries = writable<LogEntry[]>([])
  private maxEntries = 1000
  private level: LogLevel = "debug" // 더 자세한 로그를 위해 debug 레벨로 설정

  log(level: LogLevel, message: string, data?: unknown, command?: Command): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      level,
      message,
      data,
      command,
      stack: level === "error" ? new Error().stack : undefined,
    }

    this.entries.update((entries) => {
      const newEntries = [...entries, entry]
      return newEntries.slice(-this.maxEntries)
    })
  }

  debug(message: string, data?: unknown): void {
    this.log("debug", message, data)
  }

  info(message: string, data?: unknown): void {
    this.log("info", message, data)
  }

  warn(message: string, data?: unknown): void {
    this.log("warn", message, data)
  }

  error(message: string, error?: Error | unknown): void {
    this.log("error", message, error)
  }

  logCommand(command: Command, message?: string): void {
    this.log("info", message || `Command executed: ${command.type}`, command.payload, command)
  }

  logCommandError(command: Command, error: Error): void {
    this.log("error", `Command failed: ${command.type} - ${error.message}`, {
      command,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    }, command)
  }

  logCommandUndo(command: Command): void {
    this.log("info", `Command undone: ${command.type}`, command.payload, command)
  }

  logCommandRedo(command: Command): void {
    this.log("info", `Command redone: ${command.type}`, command.payload, command)
  }

  getEntries() {
    return this.entries
  }

  clear(): void {
    this.entries.set([])
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = ["debug", "info", "warn", "error"]
    return levels.indexOf(level) >= levels.indexOf(this.level)
  }
}

export const logger = new CommandLogger()
