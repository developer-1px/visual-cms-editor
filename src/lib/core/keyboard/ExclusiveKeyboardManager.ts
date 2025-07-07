// Exclusive 키보드 매니저 - 하나의 핸들러로 모든 키 이벤트를 중앙 처리
export type KeyboardState = 
  | { mode: 'navigation' }
  | { mode: 'selection', selectedType: string }
  | { mode: 'editing', editingType: string }

export type KeyEventHandler = (e: KeyboardEvent, state: KeyboardState) => boolean

export class ExclusiveKeyboardManager {
  private state: KeyboardState = { mode: 'navigation' }
  private handlers: { [eventName: string]: (() => void)[] } = {}
  private isAttached = false

  constructor() {
    this.attachGlobalListener()
  }

  // 상태 업데이트
  setState(newState: KeyboardState) {
    this.state = newState
  }

  // 글로벌 키보드 리스너 - 모든 키 이벤트를 exclusive하게 처리
  private attachGlobalListener() {
    if (this.isAttached) return
    
    // capture: true로 설정하여 다른 모든 키 이벤트보다 먼저 처리
    document.addEventListener('keydown', this.handleKeyDown.bind(this), { capture: true })
    this.isAttached = true
  }

  // 중앙 키 이벤트 처리 - exclusive 처리
  private handleKeyDown(e: KeyboardEvent) {
    // 모든 키 이벤트를 여기서 exclusive하게 처리
    const handled = this.processKey(e, this.state)
    
    if (handled) {
      // 키가 처리되었으면 다른 핸들러로 전파되지 않도록 완전 차단
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
    }
  }

  // 상태별 키 처리
  private processKey(e: KeyboardEvent, state: KeyboardState): boolean {
    const key = this.getKeyString(e)

    // 전역 키들 (모든 상태에서 동작)
    if (this.handleGlobalKeys(key, e)) {
      return true
    }

    // 상태별 처리
    switch (state.mode) {
      case 'navigation':
        return this.handleNavigationMode(key, e)
        
      case 'selection':
        return this.handleSelectionMode(key, state.selectedType, e)
        
      case 'editing':
        return this.handleEditingMode(key, state.editingType, e)
        
      default:
        return false
    }
  }

  // 전역 키 처리 (모든 상태에서 동작)
  private handleGlobalKeys(key: string, e: KeyboardEvent): boolean {
    switch (key) {
      case 'Meta+z':
      case 'Control+z':
        this.emit('undo')
        return true
        
      case 'Meta+Shift+z':
      case 'Control+Shift+z':
      case 'Meta+y':
      case 'Control+y':
        this.emit('redo')
        return true
        
      default:
        return false
    }
  }

  // 네비게이션 모드 키 처리
  private handleNavigationMode(key: string, e: KeyboardEvent): boolean {
    switch (key) {
      case 'Escape':
        this.emit('clearAll')
        return true
        
      case 'Enter':
        // Enter 키 - 버튼 클릭 등 기본 동작 방지
        return true
        
      case 'Space':
        // Space 키 - 스크롤 이동 방지
        return true
        
      case 'Tab':
      case 'Shift+Tab':
        // Tab 키 - 포커스 이동 방지
        return true
        
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        // 화살표 키 - 스크롤/포커스 이동 방지
        return true
        
      case 'PageUp':
      case 'PageDown':
      case 'Home':
      case 'End':
        // 페이지 이동 키들 방지
        return true
        
      default:
        return false
    }
  }

  // 선택 모드 키 처리
  private handleSelectionMode(key: string, selectedType: string, e: KeyboardEvent): boolean {
    switch (key) {
      case 'Enter':
        this.emit('startEditing')
        return true
        
      case 'Escape':
        this.emit('clearSelection')
        return true
        
      case 'Delete':
      case 'Backspace':
        this.emit('delete')
        return true
        
      case 'Meta+c':
      case 'Control+c':
        this.emit('copy')
        return true
        
      case 'Meta+x':
      case 'Control+x':
        this.emit('cut')
        return true
        
      case 'Meta+v':
      case 'Control+v':
        this.emit('paste')
        return true
        
      case 'Meta+d':
      case 'Control+d':
        this.emit('duplicate')
        return true
        
      default:
        return false
    }
  }

  // 편집 모드 키 처리
  private handleEditingMode(key: string, editingType: string, e: KeyboardEvent): boolean {
    switch (key) {
      case 'Escape':
        this.emit('stopEditing')
        return true
        
      default:
        // 편집 모드에서는 위의 특수 키들 외에는 모두 기본 동작 허용
        return false
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
    const handlers = this.handlers[eventName] || []
    handlers.forEach(handler => {
      try {
        handler()
      } catch (error) {
        console.error(`Error in keyboard handler for ${eventName}:`, error)
      }
    })
  }

  // 이벤트 리스너 등록
  on(eventName: string, handler: () => void) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = []
    }
    this.handlers[eventName].push(handler)
    
    // 제거 함수 반환
    return () => {
      const index = this.handlers[eventName].indexOf(handler)
      if (index > -1) {
        this.handlers[eventName].splice(index, 1)
      }
    }
  }

  // 디버그 정보
  debug() {
    console.log('=== ExclusiveKeyboardManager Debug ===')
    console.log('Current State:', this.state)
    console.log('Registered Events:', Object.keys(this.handlers))
    console.log('=======================================')
  }

  // 정리
  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this), { capture: true })
    this.isAttached = false
    this.handlers = {}
  }
}

// 전역 인스턴스
export const exclusiveKeyboardManager = new ExclusiveKeyboardManager()