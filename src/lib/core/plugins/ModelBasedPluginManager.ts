// 모델 기반 플러그인 매니저
import { pluginStore } from "./models/PluginStore.svelte"
import type { PluginModel } from "./models/PluginModel.svelte"

export class ModelBasedPluginManager {
  // 플러그인 매니저 초기화
  initialize(): void {
    // 필요한 초기화 로직이 있다면 여기에 추가
    console.log("ModelBasedPluginManager initialized")
  }

  // 요소 초기화 - 모델 생성
  initElement(element: HTMLElement): void {
    const editableType = element.getAttribute("data-editable")
    if (!editableType) return

    const elementId = this.getElementId(element)
    const initialValue = this.getInitialValue(element, editableType)

    // 모델 생성 또는 가져오기
    const model = pluginStore.getOrCreate(elementId, editableType, initialValue)

    // 요소에 모델 연결
    model.element = element
  }

  // 요소에서 초기값 추출
  private getInitialValue(element: HTMLElement, type: string): unknown {
    switch (type) {
      case "text": {
        return element.textContent || ""
      }
      case "image": {
        const img = element.querySelector("img")
        return img?.src || ""
      }
      case "icon": {
        const path = element.querySelector("path")
        return path?.getAttribute("d") || ""
      }
      case "link": {
        const linkElement = element as HTMLAnchorElement
        return {
          href: linkElement.href || "#",
          text: linkElement.textContent || "Link",
        }
      }
      default:
        return null
    }
  }

  // 요소 ID 생성
  private getElementId(element: HTMLElement): string {
    if (!element.id) {
      element.id = `plugin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    return element.id
  }

  // 클릭 핸들러
  handleClick(element: HTMLElement): void {
    const elementId = this.getElementId(element)
    const model = pluginStore.get(elementId)

    if (model?.handleClick) {
      model.handleClick()
    }
  }

  // 더블클릭 핸들러
  handleDoubleClick(element: HTMLElement): void {
    const elementId = this.getElementId(element)
    const model = pluginStore.get(elementId)

    if (model?.handleDoubleClick) {
      // 다른 모든 편집 중인 플러그인 중지
      pluginStore.stopAllEditing()
      model.handleDoubleClick()
    }
  }

  // 키다운 핸들러
  handleKeydown(element: HTMLElement, event: KeyboardEvent): void {
    const elementId = this.getElementId(element)
    const model = pluginStore.get(elementId)

    if (model?.handleKeydown) {
      model.handleKeydown(event.key)
    }
  }

  // 값 가져오기
  getValue(element: HTMLElement): unknown {
    const elementId = this.getElementId(element)
    const model = pluginStore.get(elementId)

    return model?.getValue() || null
  }

  // 값 설정
  setValue(element: HTMLElement, value: unknown): void {
    const elementId = this.getElementId(element)
    const model = pluginStore.get(elementId)

    if (model) {
      model.setValue(value)
    }
  }

  // 스타일 적용 (모델 기반에서는 불필요)
  applyStyles(): void {
    // 스타일은 Svelte 컴포넌트에서 반응적으로 처리
  }

  // 스타일 제거 (모델 기반에서는 불필요)
  removeStyles(): void {
    // 스타일은 Svelte 컴포넌트에서 반응적으로 처리
  }

  // 요소 파괴
  destroyElement(element: HTMLElement): void {
    const elementId = this.getElementId(element)
    pluginStore.remove(elementId)
  }

  // 편집 중인 모델 가져오기
  getEditingModel(): PluginModel<unknown> | undefined {
    return pluginStore.getEditingModel()
  }

  // 모든 편집 중지
  stopAllEditing(): void {
    pluginStore.stopAllEditing()
  }
}

// 싱글톤 인스턴스
export const modelBasedPluginManager = new ModelBasedPluginManager()
