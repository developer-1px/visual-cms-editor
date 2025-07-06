// 플러그인 모델 중앙 저장소
import { createPluginModel, type PluginModel } from "./PluginModel.svelte"

class PluginStore {
  private models = $state<Map<string, PluginModel<unknown>>>(new Map())

  // 플러그인 모델 생성 또는 가져오기
  getOrCreate(elementId: string, type: string, initialValue?: unknown): PluginModel<unknown> {
    let model = this.models.get(elementId)

    if (!model) {
      model = createPluginModel(type, elementId, initialValue)
      this.models.set(elementId, model)
    }

    return model
  }

  // 플러그인 모델 가져오기
  get(elementId: string): PluginModel<unknown> | undefined {
    return this.models.get(elementId)
  }

  // 플러그인 모델 제거
  remove(elementId: string): void {
    this.models.delete(elementId)
  }

  // 모든 편집 중인 플러그인 중지
  stopAllEditing(): void {
    this.models.forEach((model) => {
      if (model.state.isEditing) {
        model.stopEdit()
      }
    })
  }

  // 특정 타입의 모든 플러그인 가져오기
  getByType(type: string): PluginModel<unknown>[] {
    return Array.from(this.models.values()).filter((model) => model.type === type)
  }

  // 편집 중인 플러그인 가져오기
  getEditingModel(): PluginModel<unknown> | undefined {
    return Array.from(this.models.values()).find((model) => model.state.isEditing)
  }
}

// 싱글톤 인스턴스
export const pluginStore = new PluginStore()
