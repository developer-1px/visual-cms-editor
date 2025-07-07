<script lang="ts">
  import type { TextModel } from "$lib/core/models/TemplateModels"
  import { modelElementRegistry } from "$lib/core/selection"
  import { onDestroy } from "svelte"
  import { startEditing, stopEditing, editingElementId } from "$lib/core/commands/stores"

  interface Props {
    model: TextModel
    isSelected?: boolean
    onElementClick?: (e: MouseEvent) => void
  }

  let { model, isSelected = false, onElementClick }: Props = $props()

  let elementRef: HTMLElement
  let isEditing = $state(false)

  // Registry 등록/해제
  $effect(() => {
    if (elementRef && model) {
      modelElementRegistry.register(model, elementRef)
    }
  })

  onDestroy(() => {
    if (model) {
      modelElementRegistry.unregister(model)
    }
  })

  // 편집 모드 제어
  function startEdit() {
    isEditing = true
    startEditing(model.id)
    
    if (elementRef) {
      elementRef.setAttribute("contenteditable", "plaintext-only")
      elementRef.setAttribute("data-editing", "true")
      elementRef.focus()
    }
  }

  function stopEdit() {
    if (elementRef) {
      const newText = elementRef.textContent || ""
      if (newText !== model.content) {
        model.content = newText
        
        // 히스토리 이벤트
        const historyEvent = new CustomEvent("textChanged", {
          detail: { element: elementRef, text: newText },
        })
        document.dispatchEvent(historyEvent)
      }
      
      elementRef.removeAttribute("contenteditable")
      elementRef.removeAttribute("data-editing")
      elementRef.textContent = model.content
    }
    
    isEditing = false
    stopEditing()
  }

  function handleClick(e: MouseEvent) {
    // 편집 중이면 커서 이동만
    if (isEditing) return
    
    e.stopPropagation()

    // 클릭 전에 이미 선택된 상태였는지 확인
    const wasAlreadySelected = isSelected

    // 항상 먼저 선택 이벤트 처리
    if (onElementClick) onElementClick(e)

    // 이미 선택된 상태에서 다시 클릭하면 편집 모드로 전환
    if (wasAlreadySelected && !$editingElementId) {
      startEdit()
    }
    // 다른 요소가 편집 중이면 컨텍스트 전환
    else if ($editingElementId && $editingElementId !== model.id) {
      stopEditing() // 전역 stop
      startEdit()
    }
  }

  function handleDoubleClick(e: MouseEvent) {
    // 편집 중이면 단어 선택
    if (isEditing) return

    e.stopPropagation()
    
    // 다른 요소 편집 종료
    if ($editingElementId && $editingElementId !== model.id) {
      stopEditing()
    }
    
    // 선택 후 편집 시작
    if (onElementClick) onElementClick(e)
    startEdit()
    
    // 전체 텍스트 선택
    if (elementRef && isEditing) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(elementRef)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (isEditing) {
      if (e.key === "Escape") {
        e.preventDefault()
        e.stopPropagation()
        stopEdit()
      } else if (e.key === " " || e.key === "Enter" || e.key.length === 1) {
        e.stopPropagation()
      }
    }
  }

  function handleBlur() {
    if (isEditing && document.activeElement !== elementRef) {
      stopEdit()
    }
  }
</script>

<span
  id={model.id}
  bind:this={elementRef}
  class="inline-block {model.className}"
  data-editable="text"
  data-selected={isSelected ? "true" : null}
  onclick={handleClick}
  ondblclick={handleDoubleClick}
  onkeydown={handleKeydown}
  onblur={handleBlur}
  {...model.attributes}
>
  {model.content}
</span>

<style>
  [data-selected="true"] {
    box-shadow: 0 0 0 3px #3b82f6;
  }
</style>