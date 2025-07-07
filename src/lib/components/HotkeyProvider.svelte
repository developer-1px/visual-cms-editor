<script lang="ts">
  import { onMount } from "svelte"
  import { exclusiveKeyboardManager } from "$lib/core/keyboard/ExclusiveKeyboardManager"
  import { selectedElements, activeSelectionType, isSelectionEmpty } from "$lib/core/selection"
  import { pluginStore } from "$lib/core/plugins/models/PluginStore.svelte"
  import { historyManager } from "$lib/core/history"
  import { selectionManager } from "$lib/core/selection"
  import { modelBasedPluginManager } from "$lib/core/plugins"
  import { get } from "svelte/store"

  interface Props {
    children?: import("svelte").Snippet
  }

  let { children }: Props = $props()

  // 상태 업데이트 - exclusive 상태 관리
  $effect(() => {
    const hasSelection = !$isSelectionEmpty
    const editingModel = pluginStore.getEditingModel()
    const isEditing = !!editingModel

    // exclusive 상태 설정
    if (isEditing && editingModel) {
      exclusiveKeyboardManager.setState({
        mode: 'editing',
        editingType: editingModel.type
      })
    } else if (hasSelection) {
      exclusiveKeyboardManager.setState({
        mode: 'selection',
        selectedType: $activeSelectionType || 'text'
      })
    } else {
      exclusiveKeyboardManager.setState({
        mode: 'navigation'
      })
    }
  })

  onMount(() => {
    // exclusive 키보드 이벤트 핸들러 등록
    const unsubscribers = [
      exclusiveKeyboardManager.on('startEditing', () => {
        const selected = get(selectedElements)
        if (selected.size === 1) {
          const element = Array.from(selected)[0]
          const type = element.getAttribute("data-editable") || "text"
          
          // 모델 초기화 후 편집 시작
          modelBasedPluginManager.initElement(element)
          
          // 편집 시작
          const elementId = element.id || `plugin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          if (!element.id) element.id = elementId
          
          const model = pluginStore.get(elementId)
          if (model && model.startEdit) {
            model.startEdit()
          }
        }
      }),

      exclusiveKeyboardManager.on('stopEditing', () => {
        pluginStore.stopAllEditing()
      }),

      exclusiveKeyboardManager.on('clearSelection', () => {
        selectionManager.clear()
      }),

      exclusiveKeyboardManager.on('clearAll', () => {
        pluginStore.stopAllEditing()
        selectionManager.clear()
      }),

      exclusiveKeyboardManager.on('undo', () => {
        historyManager.undo()
      }),

      exclusiveKeyboardManager.on('redo', () => {
        historyManager.redo()
      }),

      exclusiveKeyboardManager.on('delete', () => {
        console.log('[Keyboard] Delete selected element')
      }),

      exclusiveKeyboardManager.on('copy', () => {
        console.log('[Keyboard] Copy selected element')
      }),

      exclusiveKeyboardManager.on('cut', () => {
        console.log('[Keyboard] Cut selected element')
      }),

      exclusiveKeyboardManager.on('paste', () => {
        console.log('[Keyboard] Paste element')
      }),

      exclusiveKeyboardManager.on('duplicate', () => {
        console.log('[Keyboard] Duplicate selected element')
      })
    ]

    return () => {
      // 모든 핸들러 해제
      unsubscribers.forEach(unsubscribe => unsubscribe())
    }
  })
</script>

<div class="hotkey-provider">
  {@render children?.()}
</div>

<style>
  .hotkey-provider {
    display: contents;
  }
</style>
