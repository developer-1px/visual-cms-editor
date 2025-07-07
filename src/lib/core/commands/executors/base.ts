/**
 * Base executor class with type checking
 */
import type { Command, CommandExecutor } from "../types"

export abstract class TypedCommandExecutor<TState, TCommand extends Command> 
  implements CommandExecutor<TState> {
  
  protected abstract commandType: string
  protected abstract isValidCommand(command: Command): command is TCommand
  protected abstract executeTyped(state: TState, command: TCommand): TState
  
  execute(state: TState, command: Command): TState {
    if (!this.isValidCommand(command)) {
      throw new Error(`Invalid command type for ${this.constructor.name}: expected ${this.commandType}, got ${command.type}`)
    }
    return this.executeTyped(state, command)
  }
  
  // Default implementations
  undo(state: TState, command: Command): TState {
    return state
  }
  
  redo(state: TState, command: Command): TState {
    return this.execute(state, command)
  }
}