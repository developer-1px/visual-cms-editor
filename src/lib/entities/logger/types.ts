/**
 * Logger System Entity Types
 * 
 * 로거 시스템과 관련된 모든 타입 정의
 */

import type { Command } from "../command/types"

export type LogLevel = "debug" | "info" | "warn" | "error"

export interface LogEntry {
  id: string
  timestamp: number
  level: LogLevel
  command?: Command
  message: string
  data?: unknown
  stack?: string
}

export interface LogFilter {
  levels?: LogLevel[]
  timeRange?: {
    start: number
    end: number
  }
  hasCommand?: boolean
  messagePattern?: RegExp
}

export interface LoggerConfig {
  level: LogLevel
  maxEntries: number
  enableConsoleOutput: boolean
  enablePersistence: boolean
  timestampFormat: string
}

export interface Logger {
  debug(message: string, data?: unknown): void
  info(message: string, data?: unknown): void
  warn(message: string, data?: unknown): void
  error(message: string, error?: Error | unknown): void
  logCommand(command: Command, message?: string): void
  getEntries(filter?: LogFilter): LogEntry[]
  clear(): void
  setLevel(level: LogLevel): void
  getLevel(): LogLevel
  enable(): void
  disable(): void
  isEnabled(): boolean
}

export interface LogExporter {
  exportToFile(entries: LogEntry[], format: "json" | "csv" | "txt"): Promise<Blob>
  exportToConsole(entries: LogEntry[]): void
  exportToServer(entries: LogEntry[], endpoint: string): Promise<void>
}

export interface LogStorage {
  save(entries: LogEntry[]): Promise<void>
  load(): Promise<LogEntry[]>
  clear(): Promise<void>
  getSize(): Promise<number>
}