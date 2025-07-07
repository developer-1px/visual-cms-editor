// 단순하고 확실한 키보드 매니저
export type KeyboardContext = {
  isEditing: boolean
  editingType?: string
  hasSelection: boolean
  selectedType?: string
}

export type KeyHandler = (e: KeyboardEvent) => void | boolean

export class SimpleKeyboardManager {
  private context: KeyboardContext = {
    isEditing: false,
    hasSelection: false
  }

  private listeners: { [key: string]: KeyHandler[] } = {}
  private isAttached = false

  constructor() {
    this.attachGlobalListener()
  }

  // 컨텍스트 업데이트
  updateContext(newContext: Partial<KeyboardContext>) {
    this.context = { ...this.context, ...newContext }
  }

  // 글로벌 키보드 리스너 연결
  private attachGlobalListener() {
    if (this.isAttached) return
    
    document.addEventListener('keydown', this.handleKeyDown.bind(this), true)
    this.isAttached = true
  }

  // 키 이벤트 처리
  private handleKeyDown(e: KeyboardEvent) {
    const key = this.getKeyString(e)
    
    // 현재 컨텍스트에 따라 핸들러 실행
    if (this.context.isEditing) {
      this.handleEditingMode(e, key)
    } else if (this.context.hasSelection) {
      this.handleSelectionMode(e, key)
    } else {
      this.handleNavigationMode(e, key)
    }
  }

  // 편집 모드 키 처리
  private handleEditingMode(e: KeyboardEvent, key: string) {
    // Escape: 편집 종료
    if (key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('stopEditing')
      return
    }

    // Cmd/Ctrl+Z: Undo
    if (key === 'Meta+z' || key === 'Control+z') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('undo')
      return
    }

    // Cmd/Ctrl+Shift+Z: Redo
    if (key === 'Meta+Shift+z' || key === 'Control+Shift+z') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('redo')
      return
    }

    // 텍스트 편집 중일 때는 다른 모든 키는 기본 동작 허용
    if (this.context.editingType === 'text') {
      // Enter, Space 등은 contenteditable의 기본 동작 사용
      return
    }
  }

  // 선택 모드 키 처리  
  private handleSelectionMode(e: KeyboardEvent, key: string) {
    // Enter: 편집 시작
    if (key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('startEditing')
      return
    }

    // Escape: 선택 해제
    if (key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('clearSelection')
      return
    }

    // Delete/Backspace: 삭제
    if (key === 'Delete' || key === 'Backspace') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('delete')
      return
    }

    // Cmd/Ctrl+C: 복사
    if (key === 'Meta+c' || key === 'Control+c') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('copy')
      return
    }

    // Cmd/Ctrl+X: 잘라내기
    if (key === 'Meta+x' || key === 'Control+x') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('cut')
      return
    }

    // Cmd/Ctrl+V: 붙여넣기
    if (key === 'Meta+v' || key === 'Control+v') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('paste')
      return
    }

    // Cmd/Ctrl+Z: Undo
    if (key === 'Meta+z' || key === 'Control+z') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('undo')
      return
    }

    // Cmd/Ctrl+Shift+Z: Redo
    if (key === 'Meta+Shift+z' || key === 'Control+Shift+z') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('redo')
      return
    }
  }

  // 네비게이션 모드 키 처리
  private handleNavigationMode(e: KeyboardEvent, key: string) {
    // 전역 단축키들
    
    // Cmd/Ctrl+Z: Undo
    if (key === 'Meta+z' || key === 'Control+z') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('undo')
      return
    }

    // Cmd/Ctrl+Shift+Z: Redo
    if (key === 'Meta+Shift+z' || key === 'Control+Shift+z') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('redo')
      return
    }

    // Escape: 모든 선택 해제
    if (key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      this.emit('clearSelection')
      return
    }
  }

  // 키 문자열 생성
  private getKeyString(e: KeyboardEvent): string {
    const parts: string[] = []
    
    if (e.metaKey) parts.push('Meta')
    if (e.ctrlKey) parts.push('Control')
    if (e.altKey) parts.push('Alt')
    if (e.shiftKey) parts.push('Shift')
    
    let key = e.key
    if (key === ' ') key = 'Space'
    
    parts.push(key)
    
    return parts.join('+')
  }

  // 이벤트 발생
  private emit(eventName: string) {
    const handlers = this.listeners[eventName] || []
    handlers.forEach(handler => {
      try {
        handler(new KeyboardEvent('keydown'))
      } catch (error) {
        console.error(`Error in keyboard handler for ${eventName}:`, error)
      }
    })
  }

  // 이벤트 리스너 등록
  on(eventName: string, handler: KeyHandler) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = []
    }
    this.listeners[eventName].push(handler)
    
    // 제거 함수 반환
    return () => {
      const index = this.listeners[eventName].indexOf(handler)
      if (index > -1) {
        this.listeners[eventName].splice(index, 1)
      }
    }
  }

  // 정리
  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this), true)
    this.isAttached = false
    this.listeners = {}
  }
}

// 전역 인스턴스
export const simpleKeyboardManager = new SimpleKeyboardManager()