/**
 * DOM을 전혀 사용하지 않는 순수한 플러그인 시스템
 * Core level - 상태와 로직만 관리
 */

import type { ElementType } from '$lib/core/state/element-state.svelte.ts'

export interface PurePluginConfig {
  type: ElementType
  name: string
  description: string
  defaultConstraints?: Record<string, unknown>
  defaultData?: Record<string, unknown>
}

export interface PurePlugin {
  config: PurePluginConfig
  
  // 순수한 데이터 처리 메서드들 (DOM 없음)
  validateData?(data: unknown, constraints?: Record<string, unknown>): { valid: boolean; message?: string }
  transformData?(data: unknown): unknown
  getDefaultValue?(): unknown
  
  // 상태 변경 이벤트 핸들러들
  onSelect?(elementId: string, data?: Record<string, unknown>): void
  onDeselect?(elementId: string): void
  onEditStart?(elementId: string): void
  onEditStop?(elementId: string): void
  onDataChange?(elementId: string, newData: unknown, oldData?: unknown): void
}

class PurePluginManager {
  private plugins = new Map<ElementType, PurePlugin>()
  private eventHandlers = new Map<string, Array<(...args: any[]) => void>>()

  // 플러그인 등록
  register(plugin: PurePlugin): void {
    this.plugins.set(plugin.config.type, plugin)
  }

  // 플러그인 해제
  unregister(type: ElementType): void {
    this.plugins.delete(type)
  }

  // 플러그인 가져오기
  getPlugin(type: ElementType): PurePlugin | undefined {
    return this.plugins.get(type)
  }

  // 데이터 검증 (순수 함수)
  validateData(type: ElementType, data: unknown, constraints?: Record<string, unknown>): { valid: boolean; message?: string } {
    const plugin = this.plugins.get(type)
    if (plugin?.validateData) {
      return plugin.validateData(data, constraints)
    }
    return { valid: true }
  }

  // 데이터 변환 (순수 함수)
  transformData(type: ElementType, data: unknown): unknown {
    const plugin = this.plugins.get(type)
    if (plugin?.transformData) {
      return plugin.transformData(data)
    }
    return data
  }

  // 기본값 가져오기 (순수 함수)
  getDefaultValue(type: ElementType): unknown {
    const plugin = this.plugins.get(type)
    if (plugin?.getDefaultValue) {
      return plugin.getDefaultValue()
    }
    return null
  }

  // 이벤트 발생 (상태 변경 시 호출)
  emitSelect(type: ElementType, elementId: string, data?: Record<string, unknown>): void {
    const plugin = this.plugins.get(type)
    plugin?.onSelect?.(elementId, data)
    this.emit('element:select', { type, elementId, data })
  }

  emitDeselect(type: ElementType, elementId: string): void {
    const plugin = this.plugins.get(type)
    plugin?.onDeselect?.(elementId)
    this.emit('element:deselect', { type, elementId })
  }

  emitEditStart(type: ElementType, elementId: string): void {
    const plugin = this.plugins.get(type)
    plugin?.onEditStart?.(elementId)
    this.emit('element:editStart', { type, elementId })
  }

  emitEditStop(type: ElementType, elementId: string): void {
    const plugin = this.plugins.get(type)
    plugin?.onEditStop?.(elementId)
    this.emit('element:editStop', { type, elementId })
  }

  emitDataChange(type: ElementType, elementId: string, newData: unknown, oldData?: unknown): void {
    const plugin = this.plugins.get(type)
    plugin?.onDataChange?.(elementId, newData, oldData)
    this.emit('element:dataChange', { type, elementId, newData, oldData })
  }

  // 이벤트 시스템 (DOM 없음)
  on(event: string, handler: (...args: any[]) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event)!.push(handler)
  }

  off(event: string, handler: (...args: any[]) => void): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach(handler => handler(data))
    }
  }

  // 등록된 플러그인 목록
  getRegisteredTypes(): ElementType[] {
    return Array.from(this.plugins.keys())
  }

  // 플러그인 설정 가져오기
  getPluginConfig(type: ElementType): PurePluginConfig | undefined {
    return this.plugins.get(type)?.config
  }
}

// 싱글톤 인스턴스
export const purePluginManager = new PurePluginManager()