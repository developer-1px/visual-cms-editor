/**
 * Command Store Implementation
 *
 * Redux와 유사한 상태 관리 시스템이지만 Command 패턴을 사용하여
 * 더 간단하고 직렬화 가능한 구조
 */

import type { Command, CommandExecutor, StateStore } from "./types"
import { logger } from "./logger"
import { toError } from "../../utils/type-guards"

// Serialization types
type SerializedValue =
  | { _type: "Map"; entries: [unknown, SerializedValue][] }
  | { _type: "Set"; values: SerializedValue[] }
  | { _type: "Date"; value: string }
  | SerializedValue[]
  | { [key: string]: SerializedValue }
  | string
  | number
  | boolean
  | null
  | undefined

interface StateWithHistory {
  history?: {
    canUndo: boolean
    canRedo: boolean
    lastCommand: Command | null
  }
}

export class CommandStore<TState> implements StateStore<TState> {
  private state: TState
  private history: Command[] = []
  private currentIndex = -1
  private listeners: Set<(state: TState) => void> = new Set()
  private executors: Map<string, CommandExecutor<TState>> = new Map()
  private maxHistorySize = 100

  // For command merging
  private lastCommandTime = 0
  private mergeTimeout = 500 // ms

  constructor(initialState: TState) {
    this.state = initialState
  }

  /**
   * Register a command executor for a specific command type
   */
  registerExecutor(commandType: string, executor: CommandExecutor<TState>): void {
    this.executors.set(commandType, executor)
  }

  /**
   * Get current state
   */
  getState(): TState {
    return this.state
  }

  /**
   * Dispatch a command
   */
  dispatch(command: Command): void {
    const executor = this.executors.get(command.type)
    if (!executor) {
      logger.error(`No executor registered for command type: ${command.type}`, { command })
      return
    }

    // Log command dispatch start
    logger.debug(`Dispatching command: ${command.type}`, {
      commandId: command.id,
      payload: command.payload,
      meta: command.meta
    })

    try {
      // Check if we should merge with previous command
      const shouldMerge = this.shouldMergeCommand(command)
      if (shouldMerge) {
        // Replace the last command with this one (merge)
        this.history[this.currentIndex] = command
        logger.debug(`Command merged: ${command.type}`, { commandId: command.id })
      } else {
        // Add to history
        if (command.meta?.canUndo !== false) {
          // Remove any commands after current index (for redo)
          this.history = this.history.slice(0, this.currentIndex + 1)
          this.history.push(command)
          this.currentIndex++

          // Limit history size
          if (this.history.length > this.maxHistorySize) {
            this.history.shift()
            this.currentIndex--
            logger.debug("Command history trimmed", { maxSize: this.maxHistorySize })
          }
          
          logger.debug(`Command added to history: ${command.type}`, { 
            commandId: command.id,
            historyIndex: this.currentIndex,
            historyLength: this.history.length
          })
        }
      }

      // Execute command
      const startTime = performance.now()
      const newState = executor.execute(this.state, command)
      const executionTime = performance.now() - startTime
      
      this.setState(newState, command)

      // Update last command time
      this.lastCommandTime = command.timestamp

      // Log successful command execution with timing
      logger.logCommand(command, `Command executed: ${command.type} (${executionTime.toFixed(2)}ms)`)

      // Notify remote peers in collaborative mode
      this.broadcastCommand(command)
    } catch (error) {
      const errorObject = error instanceof Error ? error : new Error(String(error))
      logger.logCommandError(command, errorObject)
      throw error
    }
  }

  /**
   * Check if command should be merged with previous command
   */
  private shouldMergeCommand(command: Command): boolean {
    if (!command.meta?.merge) return false
    if (this.currentIndex < 0) return false

    const lastCommand = this.history[this.currentIndex]
    if (lastCommand.type !== command.type) return false

    // Check time difference
    const timeDiff = command.timestamp - this.lastCommandTime
    return timeDiff < this.mergeTimeout
  }

  /**
   * Undo last command
   */
  undo(): void {
    if (!this.canUndo()) return

    const command = this.history[this.currentIndex]
    const executor = this.executors.get(command.type)
    if (!executor) {
      logger.error(`No executor for command type: ${command.type}`, { command })
      return
    }

    try {
      const newState = executor.undo(this.state, command)
      this.currentIndex--
      this.setState(newState)
      
      // Log successful undo
      logger.logCommandUndo(command)
    } catch (error) {
      const errorObject = error instanceof Error ? error : new Error(String(error))
      logger.logCommandError(command, errorObject)
      logger.error("Error undoing command", { command, error: errorObject.message }, errorObject)
    }
  }

  /**
   * Redo next command
   */
  redo(): void {
    if (!this.canRedo()) return

    this.currentIndex++
    const command = this.history[this.currentIndex]
    const executor = this.executors.get(command.type)
    if (!executor) {
      logger.error(`No executor for command type: ${command.type}`, { command })
      this.currentIndex-- // Revert index
      return
    }

    try {
      const newState = executor.redo(this.state, command)
      this.setState(newState)
      
      // Log successful redo
      logger.logCommandRedo(command)
    } catch (error) {
      const errorObject = error instanceof Error ? error : new Error(String(error))
      logger.logCommandError(command, errorObject)
      logger.error("Error redoing command", { command, error: errorObject.message }, errorObject)
      this.currentIndex-- // Revert index
    }
  }

  /**
   * Check if can undo
   */
  canUndo(): boolean {
    return this.currentIndex >= 0
  }

  /**
   * Check if can redo
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  /**
   * Get command history
   */
  getHistory(): Command[] {
    return [...this.history]
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: TState) => void): () => void {
    this.listeners.add(listener)
    // Return unsubscribe function
    return () => this.listeners.delete(listener)
  }

  /**
   * Type guard to check if state has history property
   */
  private hasHistory(state: TState): state is TState & StateWithHistory {
    return "history" in state && typeof state.history === "object"
  }

  /**
   * Update state and notify listeners
   */
  private setState(newState: TState, command?: Command): void {
    this.state = newState

    // Update history metadata in state if it exists
    if (this.hasHistory(newState)) {
      newState.history = {
        ...(newState.history || {}),
        canUndo: this.canUndo(),
        canRedo: this.canRedo(),
        lastCommand: command || null,
      }
    }

    // Notify all listeners
    this.listeners.forEach((listener) => {
      try {
        listener(newState)
      } catch (error) {
        const errorObject = toError(error)
        logger.error("Error in state listener", { error: errorObject.message })
      }
    })
  }

  /**
   * Serialize state and history
   */
  serialize(): string {
    return JSON.stringify(
      {
        state: this.serializeState(this.state),
        history: this.history,
        currentIndex: this.currentIndex,
        version: "1.0.0",
      },
      null,
      2,
    )
  }

  /**
   * Serialize state (handle Map and Set)
   */
  private serializeState(state: unknown): SerializedValue {
    if (state instanceof Map) {
      return {
        _type: "Map",
        entries: Array.from(state.entries()).map(([k, v]) => [k, this.serializeState(v)]),
      }
    }
    if (state instanceof Set) {
      return {
        _type: "Set",
        values: Array.from(state.values()).map((v) => this.serializeState(v)),
      }
    }
    if (state instanceof Date) {
      return {
        _type: "Date",
        value: state.toISOString(),
      }
    }
    if (Array.isArray(state)) {
      return state.map((v) => this.serializeState(v))
    }
    if (state && typeof state === "object") {
      const result: { [key: string]: SerializedValue } = {}
      for (const [key, value] of Object.entries(state)) {
        result[key] = this.serializeState(value)
      }
      return result
    }
    return state
  }

  /**
   * Hydrate from serialized data
   */
  hydrate(serialized: string): void {
    try {
      const data = JSON.parse(serialized)

      // Validate version
      if (data.version !== "1.0.0") {
        logger.warn(`Unknown version: ${data.version}`, { version: data.version })
      }

      // Restore state
      this.state = this.deserializeState(data.state)
      this.history = data.history || []
      this.currentIndex = data.currentIndex ?? -1

      // Notify listeners
      this.setState(this.state)
    } catch (error) {
      const errorObject = toError(error)
      logger.error("Error hydrating state", { error: errorObject.message })
      throw error
    }
  }

  /**
   * Deserialize state (handle Map and Set)
   */
  private deserializeState(data: SerializedValue): unknown {
    if (data && typeof data === "object") {
      if (data._type === "Map") {
        return new Map(data.entries.map(([k, v]) => [k, this.deserializeState(v)]))
      }
      if (data._type === "Set") {
        return new Set(data.values.map((v) => this.deserializeState(v)))
      }
      if (data._type === "Date") {
        return new Date(data.value)
      }
      if (Array.isArray(data)) {
        return data.map((v) => this.deserializeState(v))
      }

      const result: { [key: string]: unknown } = {}
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.deserializeState(value)
      }
      return result
    }
    return data
  }

  /**
   * Broadcast command to remote peers
   */
  private broadcastCommand(command: Command): void {
    // Note: Event broadcasting should be handled by a dedicated
    // collaboration manager that listens to state changes
    // This maintains separation between state management and I/O
  }

  /**
   * Apply a command from remote peer
   */
  applyRemoteCommand(command: Command): void {
    const executor = this.executors.get(command.type)
    if (!executor) {
      logger.error(`No executor for remote command type: ${command.type}`, { command })
      return
    }

    try {
      // Execute without adding to history
      const newState = executor.execute(this.state, command)
      this.setState(newState, command)
    } catch (error) {
      logger.error("Error applying remote command", { command, error: (error as Error).message }, error as Error)
    }
  }

  /**
   * Clear history (useful for testing)
   */
  clearHistory(): void {
    this.history = []
    this.currentIndex = -1
    this.setState(this.state)
  }

  /**
   * Get debug info
   */
  getDebugInfo(): {
    historyLength: number
    currentIndex: number
    canUndo: boolean
    canRedo: boolean
    executors: string[]
  } {
    return {
      historyLength: this.history.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      executors: Array.from(this.executors.keys()),
    }
  }
}
