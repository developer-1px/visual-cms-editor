<script lang="ts">
  import { TextPluginModel } from "$lib/core/plugins/models/PluginModel.svelte"

  interface Props {
    elementId: string
    class?: string
    onElementClick?: (e: MouseEvent) => void
    isSelected?: boolean
  }

  let { elementId, class: className = "", onElementClick, isSelected = false }: Props = $props()

  // 모델 생성
  let model = new TextPluginModel("Sample text")

  let elementRef: HTMLElement

  // 편집 모드 변경 감지
  $effect(() => {
    // element 참조 동기화
    if (elementRef && !model.element) {
      model.element = elementRef
    }

    if (model.state.isEditing && elementRef) {
      elementRef.setAttribute("contenteditable", "plaintext-only")
      elementRef.setAttribute("data-editing", "true")
      elementRef.style.whiteSpace = "pre-wrap"
      elementRef.focus()
    } else if (elementRef) {
      // 선택 모드일 때는 contenteditable="false"
      if (isSelected) {
        elementRef.setAttribute("contenteditable", "false")
      } else {
        elementRef.removeAttribute("contenteditable")
      }
      elementRef.removeAttribute("data-editing")
      elementRef.style.whiteSpace = ""
    }
  })

  function handleClick(e: MouseEvent) {
    console.log("🟢 TextPlugin handleClick:", {
      isSelected,
      element: elementRef?.tagName,
      elementClass: elementRef?.className,
      dataEditable: elementRef?.getAttribute("data-editable"),
      modelValue: model.state.value,
    })

    // 이미 선택된 상태에서 클릭하면 편집 모드로
    if (isSelected) {
      e.stopPropagation() // 편집 모드 진입 시에만 전파 중단
      model.startEdit()
    } else {
      // 선택되지 않은 상태에서는 선택 기능을 위해 상위 핸들러 호출
      if (onElementClick) {
        onElementClick(e)
      }
    }
  }

  function handleDoubleClick() {
    model.handleDoubleClick()
  }

  function handleKeydown(e: KeyboardEvent) {
    // 편집 중일 때는 Enter 키 버블링 방지
    if (model.state.isEditing && e.key === "Enter") {
      // Enter는 기본 동작(줄바꿈) 허용
      return
    }

    model.handleKeydown(e.key)
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLElement
    model.setValue(target.textContent || "")

    // 히스토리 이벤트 발생
    const historyEvent = new CustomEvent("textChanged", {
      detail: { element: target, text: target.textContent },
    })
    document.dispatchEvent(historyEvent)
  }

  function handleBlur() {
    // 포커스가 다른 곳으로 이동하면 편집 종료
    setTimeout(() => {
      const activeEl = document.activeElement as HTMLElement
      if (activeEl !== elementRef) {
        model.stopEdit()
      }
    }, 0)
  }
</script>

<span
  id={elementId}
  bind:this={elementRef}
  class={className}
  data-editable="text"
  data-selected={isSelected ? "true" : null}
  data-editing={model.state.isEditing || null}
  onclick={handleClick}
  ondblclick={handleDoubleClick}
  onkeydown={handleKeydown}
  oninput={handleInput}
  onblur={handleBlur}
>
  {model.state.value}
</span>

<style>
  [data-editable="text"] {
    cursor: pointer !important;
    transition: all 0.2s ease;
    position: relative;
    white-space: pre-wrap; /* 항상 줄바꿈과 공백 보존 */
    border: 1px solid transparent;
  }

  [data-editable="text"]:hover {
    outline: 2px solid #3b82f6 !important;
    outline-offset: 1px;
    background-color: rgba(59, 130, 246, 0.1) !important;
  }

  [data-selected="true"] {
    cursor: text;
    outline: 2px solid #f59e0b !important;
    outline-offset: 1px;
    background-color: rgba(245, 158, 11, 0.1) !important;
  }
</style>
