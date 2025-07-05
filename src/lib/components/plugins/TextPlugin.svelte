<script lang="ts">
  import type { TextPluginModel } from "$lib/core/plugins/models/PluginModel.svelte"
  
  interface Props {
    model: TextPluginModel
    class?: string
  }
  
  let { model, class: className = "" }: Props = $props()
  
  let elementRef: HTMLElement
  
  // 편집 모드 변경 감지
  $effect(() => {
    if (model.state.isEditing && elementRef) {
      elementRef.setAttribute("contenteditable", "plaintext-only")
      elementRef.setAttribute("data-editing", "true")
      elementRef.style.whiteSpace = "pre-wrap"
      elementRef.focus()
    } else if (elementRef) {
      elementRef.removeAttribute("contenteditable")
      elementRef.removeAttribute("data-editing")
      elementRef.style.whiteSpace = ""
    }
  })
  
  function handleClick(e: MouseEvent) {
    // 이미 선택된 상태에서 클릭하면 편집 모드로
    if (model.element?.hasAttribute("data-selected")) {
      model.startEdit()
    }
  }
  
  function handleDoubleClick(e: MouseEvent) {
    model.handleDoubleClick()
  }
  
  function handleKeydown(e: KeyboardEvent) {
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
  
  function handleBlur(e: FocusEvent) {
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
  bind:this={elementRef}
  bind:this={model.element}
  class={className}
  data-editable="text"
  data-selected={model.element?.hasAttribute("data-selected") || null}
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
    cursor: pointer;
    transition: all var(--transition-fast);
    position: relative;
  }
  
  [data-selected="true"] {
    cursor: text;
  }
</style>