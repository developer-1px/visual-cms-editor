<script lang="ts">
  import type { TextModel } from "$lib/core/models/TemplateModels"
  import { TextPluginModel } from "$lib/core/plugins/models/PluginModel.svelte"
  import { modelElementRegistry } from "$lib/core/selection/ModelSelectionManager"
  import { onDestroy } from "svelte"

  interface Props {
    model: TextModel
    isSelected?: boolean
    onElementClick?: (e: MouseEvent) => void
  }

  let { model, isSelected = false, onElementClick }: Props = $props()

  // TextPluginModel과 연결
  let pluginModel = new TextPluginModel(model.content)
  let elementRef: HTMLElement

  // Model-Element Registry 등록
  $effect(() => {
    if (elementRef && model) {
      modelElementRegistry.register(model, elementRef)
    }
  })

  // 컴포넌트 제거시 Registry에서 해제
  onDestroy(() => {
    if (model) {
      modelElementRegistry.unregister(model)
    }
  })

  // Model 동기화
  $effect(() => {
    if (elementRef && !pluginModel.element) {
      pluginModel.element = elementRef
    }

    // content 변경 시 동기화
    if (pluginModel.state.value !== model.content) {
      pluginModel.setValue(model.content)
    }
  })

  // Model 변경 이벤트 수신
  $effect(() => {
    if (!elementRef) return

    const handleModelChange = (e: CustomEvent) => {
      if (e.detail.model === model && e.detail.content !== undefined) {
        pluginModel.setValue(e.detail.content)
        model.content = e.detail.content
      }
    }

    elementRef.addEventListener("modelContentChanged", handleModelChange)

    return () => {
      elementRef.removeEventListener("modelContentChanged", handleModelChange)
    }
  })

  // 편집 모드와 선택 모드 처리
  $effect(() => {
    if (!elementRef) return

    if (pluginModel.state.isEditing) {
      // 편집 모드가 가장 우선
      elementRef.setAttribute("contenteditable", "plaintext-only")
      elementRef.setAttribute("data-editing", "true")
      elementRef.style.whiteSpace = "pre-wrap"
      elementRef.focus()
    } else {
      // 편집 모드가 아닐 때
      elementRef.removeAttribute("data-editing")
      elementRef.style.whiteSpace = ""

      // 선택 모드일 때는 contenteditable="false"
      if (isSelected) {
        elementRef.setAttribute("contenteditable", "false")
      } else {
        elementRef.removeAttribute("contenteditable")
      }
    }
  })

  function handleClick(e: MouseEvent) {
    // Prevent event propagation to avoid document click handler
    e.stopPropagation()

    console.log("🟢 ModelTextPlugin handleClick:", {
      isSelected,
      element: elementRef?.tagName,
      modelId: model.id,
      content: model.content,
      hasOnElementClick: !!onElementClick,
    })

    // Always call the parent click handler first (for selection)
    if (onElementClick && elementRef) {
      console.log("🔄 Calling parent onElementClick from ModelTextPlugin", {
        elementRef,
        elementId: elementRef.id,
      })
      // Pass the element as the event target/currentTarget
      const evt = new MouseEvent("click", e)
      Object.defineProperties(evt, {
        target: { value: elementRef, writable: false },
        currentTarget: { value: elementRef, writable: false },
      })
      onElementClick(evt)
    }

    // If already selected, also start editing
    if (isSelected) {
      console.log("🖊️ Starting edit mode since element is already selected")
      pluginModel.startEdit()
    }
  }

  function handleDoubleClick() {
    pluginModel.handleDoubleClick()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (pluginModel.state.isEditing && e.key === "Enter") {
      return
    }
    pluginModel.handleKeydown(e.key)
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLElement
    pluginModel.setValue(target.textContent || "")

    // 히스토리 이벤트 발생
    const historyEvent = new CustomEvent("textChanged", {
      detail: { element: target, text: target.textContent },
    })
    document.dispatchEvent(historyEvent)
  }

  function handleBlur() {
    setTimeout(() => {
      const activeEl = document.activeElement as HTMLElement
      if (activeEl !== elementRef) {
        pluginModel.stopEdit()
      }
    }, 0)
  }
</script>

<span
  id={model.id}
  bind:this={elementRef}
  class="inline-block {model.className}"
  data-editable="text"
  data-selected={isSelected ? "true" : null}
  data-editing={pluginModel.state.isEditing ? "true" : null}
  onclick={handleClick}
  ondblclick={handleDoubleClick}
  onkeydown={handleKeydown}
  oninput={handleInput}
  onblur={handleBlur}
  {...model.attributes}
>
  {pluginModel.state.value}
</span>

