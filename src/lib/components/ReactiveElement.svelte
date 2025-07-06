<!--
  DOM 사용부와 상태 관리부를 완전히 분리한 반응형 요소
  오직 Svelte 반응성만 사용, DOM API 직접 조작 없음
-->
<script lang="ts">
  import { elementStateManager, type ElementType } from "$lib/core/state/element-state.svelte.ts"
  import { purePluginManager } from "$lib/core/plugins/pure-plugin-system.ts"

  import type { Snippet } from "svelte"

  interface Props {
    elementId: string
    type: ElementType
    data?: Record<string, unknown>
    constraints?: Record<string, unknown>
    children?: Snippet
  }

  let { elementId, type, data = {}, constraints = {}, children }: Props = $props()

  // 요소 등록 (mount 시)
  $effect(() => {
    elementStateManager.registerElement(elementId, type, data)
    purePluginManager.emitSelect(type, elementId, data)

    return () => {
      elementStateManager.unregisterElement(elementId)
    }
  })

  // 순수한 상태 조회 (DOM 없음)
  let elementState = $derived(elementStateManager.getElement(elementId))
  let isSelected = $derived(elementState?.selected ?? false)
  let isEditing = $derived(elementState?.editing ?? false)
  let isVisible = $derived(elementState?.visible ?? true)

  // 이벤트 핸들러들 (DOM 조작 없음)
  function handleClick(event: MouseEvent) {
    const multiSelect = event.shiftKey || event.metaKey || event.ctrlKey

    if (isSelected && !multiSelect) {
      // 이미 선택된 경우 편집 모드로 전환 (텍스트만)
      if (type === "text") {
        elementStateManager.startEdit(elementId)
        purePluginManager.emitEditStart(type, elementId)
      }
    } else {
      // 선택 상태 변경
      if (isSelected) {
        elementStateManager.deselect(elementId)
        purePluginManager.emitDeselect(type, elementId)
      } else {
        elementStateManager.select(elementId, multiSelect)
        purePluginManager.emitSelect(type, elementId, data)
      }
    }
  }

  function handleDoubleClick(event: MouseEvent) {
    event.preventDefault()
    if (type === "text") {
      elementStateManager.startEdit(elementId)
      purePluginManager.emitEditStart(type, elementId)
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      if (isEditing) {
        elementStateManager.stopEdit(elementId)
        purePluginManager.emitEditStop(type, elementId)
      } else if (isSelected) {
        elementStateManager.deselect(elementId)
        purePluginManager.emitDeselect(type, elementId)
      }
    } else if (event.key === "Enter" && isSelected && !isEditing && type === "text") {
      elementStateManager.startEdit(elementId)
      purePluginManager.emitEditStart(type, elementId)
    }
  }

  function handleEditComplete(newText: string) {
    if (type === "text") {
      const oldData = elementState?.data
      const newData = { ...data, text: newText }

      // 데이터 검증 (순수 함수)
      const validation = purePluginManager.validateData(type, newData, constraints)
      if (validation.valid) {
        elementStateManager.updateData(elementId, newData)
        purePluginManager.emitDataChange(type, elementId, newData, oldData)
      } else {
        console.warn(`[ReactiveElement] Validation failed: ${validation.message}`)
      }

      elementStateManager.stopEdit(elementId)
      purePluginManager.emitEditStop(type, elementId)
    }
  }

  // 스타일 클래스 계산 (반응형)
  let elementClasses = $derived(
    `
    reactive-element
    type-${type}
    ${isSelected ? "selected" : ""}
    ${isEditing ? "editing" : ""}
    ${!isVisible ? "hidden" : ""}
  `
      .trim()
      .replace(/\s+/g, " "),
  )
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  class={elementClasses}
  data-element-id={elementId}
  data-element-type={type}
  data-selected={isSelected}
  data-editing={isEditing}
  data-visible={isVisible}
  on:click={handleClick}
  on:dblclick={handleDoubleClick}
  role="button"
  tabindex="0"
>
  {#if type === "text" && isEditing}
    <!-- 편집 모드: contenteditable 사용 -->
    <span
      contenteditable="true"
      on:blur={(e) => handleEditComplete(e.target.textContent || "")}
      on:keydown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          e.target.blur()
        }
      }}
    >
      {@render children?.()}
    </span>
  {:else}
    <!-- 일반 모드: 읽기 전용 -->
    {@render children?.()}
  {/if}
</div>

<style>
  .reactive-element {
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;
  }

  .reactive-element:hover {
    outline: 1px solid var(--color-accent-light, #3b82f6);
    outline-offset: 1px;
  }

  .reactive-element.selected {
    outline: 2px solid var(--color-primary, #3b82f6);
    outline-offset: 2px;
    background-color: var(--color-primary-light, rgba(59, 130, 246, 0.1));
  }

  .reactive-element.editing {
    outline: 3px solid var(--color-warning, #f59e0b) !important;
    outline-offset: 3px;
    background: var(--color-warning-light, rgba(245, 158, 11, 0.08));
    animation: editPulse 2s ease-in-out infinite;
    border-radius: 4px;
  }

  .reactive-element.hidden {
    opacity: 0.5;
    pointer-events: none;
  }

  /* 타입별 스타일링 */
  .reactive-element.type-text.selected {
    outline-color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.1);
  }

  .reactive-element.type-image.selected {
    outline-color: #fb923c;
    background-color: rgba(251, 146, 60, 0.1);
  }

  .reactive-element.type-icon.selected {
    outline-color: #a855f7;
    background-color: rgba(168, 85, 247, 0.1);
    border-radius: 4px;
  }

  .reactive-element.type-link.selected {
    outline-color: #06b6d4;
    background-color: rgba(6, 182, 212, 0.1);
  }

  .reactive-element.type-repeatable.selected {
    outline-color: #22c55e;
    background-color: rgba(34, 197, 94, 0.1);
  }

  @keyframes editPulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
    }
  }
</style>
