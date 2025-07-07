# Command Pattern 기반 시스템 설계

## 개요

모든 상태 변경을 Command 객체로 표현하고, 이를 직렬화하여 실행/취소/재실행 및 협업을 가능하게 하는 시스템입니다.

## 핵심 개념

### 1. Command Interface

```typescript
interface Command<TPayload = any> {
  id: string // 고유 ID (UUID)
  type: string // 커맨드 타입 (예: 'SELECT_ELEMENT', 'UPDATE_TEXT')
  payload: TPayload // 커맨드 데이터
  timestamp: number // 실행 시간
  userId?: string // 실행한 사용자 (협업용)
  meta?: {
    canUndo?: boolean // 실행 취소 가능 여부
    description?: string // 사람이 읽을 수 있는 설명
  }
}
```

### 2. CommandExecutor

```typescript
interface CommandExecutor<TState> {
  execute(state: TState, command: Command): TState
  undo(state: TState, command: Command): TState
  redo(state: TState, command: Command): TState
}
```

### 3. State Store

```typescript
interface StateStore<TState> {
  getState(): TState
  dispatch(command: Command): void
  subscribe(listener: (state: TState) => void): () => void

  // History
  undo(): void
  redo(): void
  canUndo(): boolean
  canRedo(): boolean

  // Serialization
  serialize(): string
  hydrate(serialized: string): void

  // Collaboration
  applyRemoteCommand(command: Command): void
}
```

## 구현 예시

### 1. Command Types

```typescript
// src/lib/core/commands/types.ts

// Selection Commands
export interface SelectElementCommand extends Command {
  type: "SELECT_ELEMENT"
  payload: {
    elementId: string
    selectionType: "text" | "image" | "icon" | "link" | "repeatable"
    multi?: boolean
  }
}

export interface DeselectElementCommand extends Command {
  type: "DESELECT_ELEMENT"
  payload: {
    elementId: string
  }
}

export interface ClearSelectionCommand extends Command {
  type: "CLEAR_SELECTION"
  payload: {}
}

// Content Commands
export interface UpdateTextCommand extends Command {
  type: "UPDATE_TEXT"
  payload: {
    elementId: string
    oldText: string
    newText: string
  }
}

export interface UpdateImageCommand extends Command {
  type: "UPDATE_IMAGE"
  payload: {
    elementId: string
    oldSrc: string
    newSrc: string
    oldAlt?: string
    newAlt?: string
  }
}

// Structure Commands
export interface AddElementCommand extends Command {
  type: "ADD_ELEMENT"
  payload: {
    parentId: string
    element: ElementModel
    index?: number
  }
}

export interface RemoveElementCommand extends Command {
  type: "REMOVE_ELEMENT"
  payload: {
    elementId: string
    parentId: string
    element: ElementModel // 복원을 위해 저장
    index: number
  }
}

export interface MoveElementCommand extends Command {
  type: "MOVE_ELEMENT"
  payload: {
    elementId: string
    oldParentId: string
    newParentId: string
    oldIndex: number
    newIndex: number
  }
}

// Template Commands
export interface AddTemplateCommand extends Command {
  type: "ADD_TEMPLATE"
  payload: {
    template: Template
    index: number
  }
}

export interface RemoveTemplateCommand extends Command {
  type: "REMOVE_TEMPLATE"
  payload: {
    templateId: string
    index: number
    template: Template // 복원을 위해 저장
  }
}
```

### 2. Command Executors

```typescript
// src/lib/core/commands/executors/SelectionExecutor.ts

export class SelectionExecutor implements CommandExecutor<AppState> {
  execute(state: AppState, command: SelectElementCommand): AppState {
    const { elementId, selectionType, multi } = command.payload

    const newSelectedElements = multi ? new Map(state.selection.selectedElements) : new Map()

    newSelectedElements.set(elementId, {
      id: elementId,
      type: selectionType,
      element: state.elements.get(elementId)!,
    })

    return {
      ...state,
      selection: {
        ...state.selection,
        selectedElements: newSelectedElements,
      },
    }
  }

  undo(state: AppState, command: SelectElementCommand): AppState {
    const { elementId } = command.payload
    const newSelectedElements = new Map(state.selection.selectedElements)
    newSelectedElements.delete(elementId)

    return {
      ...state,
      selection: {
        ...state.selection,
        selectedElements: newSelectedElements,
      },
    }
  }

  redo(state: AppState, command: SelectElementCommand): AppState {
    return this.execute(state, command)
  }
}
```

### 3. Command Store

```typescript
// src/lib/core/commands/CommandStore.ts

export class CommandStore<TState> implements StateStore<TState> {
  private state: TState
  private history: Command[] = []
  private currentIndex = -1
  private listeners: Set<(state: TState) => void> = new Set()
  private executors: Map<string, CommandExecutor<TState>> = new Map()

  constructor(initialState: TState) {
    this.state = initialState
  }

  registerExecutor(commandType: string, executor: CommandExecutor<TState>) {
    this.executors.set(commandType, executor)
  }

  getState(): TState {
    return this.state
  }

  dispatch(command: Command): void {
    const executor = this.executors.get(command.type)
    if (!executor) {
      throw new Error(`No executor registered for command type: ${command.type}`)
    }

    // Execute command
    const newState = executor.execute(this.state, command)
    this.setState(newState)

    // Add to history
    if (command.meta?.canUndo !== false) {
      // Remove any commands after current index
      this.history = this.history.slice(0, this.currentIndex + 1)
      this.history.push(command)
      this.currentIndex++

      // Limit history size
      if (this.history.length > 100) {
        this.history.shift()
        this.currentIndex--
      }
    }

    // Notify remote peers in collaborative mode
    this.broadcastCommand(command)
  }

  undo(): void {
    if (!this.canUndo()) return

    const command = this.history[this.currentIndex]
    const executor = this.executors.get(command.type)
    if (!executor) return

    const newState = executor.undo(this.state, command)
    this.setState(newState)
    this.currentIndex--
  }

  redo(): void {
    if (!this.canRedo()) return

    this.currentIndex++
    const command = this.history[this.currentIndex]
    const executor = this.executors.get(command.type)
    if (!executor) return

    const newState = executor.redo(this.state, command)
    this.setState(newState)
  }

  canUndo(): boolean {
    return this.currentIndex >= 0
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  subscribe(listener: (state: TState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private setState(newState: TState): void {
    this.state = newState
    this.listeners.forEach((listener) => listener(newState))
  }

  serialize(): string {
    return JSON.stringify({
      state: this.state,
      history: this.history,
      currentIndex: this.currentIndex,
    })
  }

  hydrate(serialized: string): void {
    const { state, history, currentIndex } = JSON.parse(serialized)
    this.state = state
    this.history = history
    this.currentIndex = currentIndex
    this.listeners.forEach((listener) => listener(this.state))
  }

  private broadcastCommand(command: Command): void {
    // WebSocket이나 다른 방법으로 다른 클라이언트에 전송
    // 예: this.websocket.send(JSON.stringify(command))
  }

  applyRemoteCommand(command: Command): void {
    // 원격 커맨드 적용 (history에는 추가하지 않음)
    const executor = this.executors.get(command.type)
    if (!executor) return

    const newState = executor.execute(this.state, command)
    this.setState(newState)
  }
}
```

### 4. Svelte Store Integration

```typescript
// src/lib/core/commands/stores.ts

import { writable, derived, get } from "svelte/store"
import { CommandStore } from "./CommandStore"
import type { AppState } from "./types"

// 초기 상태
const initialState: AppState = {
  elements: new Map(),
  selection: {
    selectedElements: new Map(),
  },
  templates: [],
  history: {
    canUndo: false,
    canRedo: false,
  },
}

// Command Store 생성
const commandStore = new CommandStore<AppState>(initialState)

// 모든 Executor 등록
commandStore.registerExecutor("SELECT_ELEMENT", new SelectionExecutor())
commandStore.registerExecutor("UPDATE_TEXT", new TextExecutor())
// ... 더 많은 executors

// Svelte Store로 래핑
export const state = writable<AppState>(commandStore.getState())

// Subscribe to command store
commandStore.subscribe((newState) => {
  state.set(newState)
})

// Derived stores
export const selectedElements = derived(state, ($state) => $state.selection.selectedElements)

export const canUndo = derived(state, () => commandStore.canUndo())
export const canRedo = derived(state, () => commandStore.canRedo())

// Command dispatch 함수
export function dispatch(command: Omit<Command, "id" | "timestamp">): void {
  const fullCommand: Command = {
    ...command,
    id: generateUUID(),
    timestamp: Date.now(),
  }
  commandStore.dispatch(fullCommand)
}

// Undo/Redo
export const undo = () => commandStore.undo()
export const redo = () => commandStore.redo()

// Serialization
export const serialize = () => commandStore.serialize()
export const hydrate = (data: string) => commandStore.hydrate(data)
```

### 5. 사용 예시

```typescript
// src/lib/components/SomeComponent.svelte
<script lang="ts">
  import { dispatch } from '$lib/core/commands/stores'

  function handleSelectElement(elementId: string) {
    dispatch({
      type: 'SELECT_ELEMENT',
      payload: {
        elementId,
        selectionType: 'text',
        multi: false
      },
      meta: {
        description: 'Select text element'
      }
    })
  }

  function handleUpdateText(elementId: string, newText: string) {
    const oldText = getCurrentText(elementId)

    dispatch({
      type: 'UPDATE_TEXT',
      payload: {
        elementId,
        oldText,
        newText
      },
      meta: {
        description: `Update text from "${oldText}" to "${newText}"`
      }
    })
  }
</script>
```

## 장점

1. **완전한 상태 추적**: 모든 상태 변경이 Command로 기록됨
2. **시간 여행 디버깅**: 상태를 특정 시점으로 되돌릴 수 있음
3. **직렬화 가능**: 상태와 히스토리를 저장/복원 가능
4. **협업 지원**: Command를 다른 클라이언트와 공유 가능
5. **테스트 용이성**: Command와 Executor를 독립적으로 테스트 가능
6. **확장성**: 새로운 Command 타입을 쉽게 추가 가능

## 구현 순서

1. **Phase 1**: 기본 Command Store 구현
   - Command 인터페이스 정의
   - CommandStore 클래스 구현
   - 기본 Executor들 구현

2. **Phase 2**: 기존 시스템 통합
   - SelectionManager를 Command 기반으로 변경
   - History 시스템을 Command Store로 교체
   - UI 컴포넌트에서 dispatch 사용

3. **Phase 3**: 고급 기능
   - Command 병합 (예: 연속된 텍스트 입력)
   - Command 배치 처리
   - 낙관적 업데이트 (Optimistic UI)

4. **Phase 4**: 협업 기능
   - WebSocket 통합
   - Conflict Resolution
   - Operational Transform 적용
