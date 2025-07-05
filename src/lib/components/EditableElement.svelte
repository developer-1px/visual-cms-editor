<!--
  DOM API 직접 조작 대신 Svelte 바인딩을 사용하는 편집 가능한 요소 래퍼
-->
<script lang="ts">
  import { elementStateManager } from '$lib/stores/element-states.svelte.ts'
  
  interface Props {
    element?: HTMLElement
    type: 'text' | 'image' | 'icon' | 'link' | 'repeatable'
    children?: any
  }
  
  let { element = $bindable(), type, children }: Props = $props()
  
  // 요소 상태 관리
  let elementId = $state('')
  let elementState = $derived(elementStateManager.getState(elementId))
  
  // 요소가 설정되면 ID 확보
  $effect(() => {
    if (element) {
      elementId = elementStateManager.ensureElementId(element)
    }
  })
  
  // 클릭 핸들러
  function handleClick(event: MouseEvent) {
    if (!element) return
    
    const isMultiSelect = event.shiftKey || event.metaKey || event.ctrlKey
    
    if (!isMultiSelect) {
      elementStateManager.clearAllSelected()
    }
    
    elementStateManager.setSelected(elementId, !elementState.selected, type)
  }
  
  // 더블클릭 핸들러 (편집 모드)
  function handleDoubleClick(event: MouseEvent) {
    if (!element || type !== 'text') return
    
    event.preventDefault()
    elementStateManager.clearAllEditing()
    elementStateManager.setEditing(elementId, true)
  }
  
  // 편집 완료 핸들러
  function handleEditComplete() {
    if (type === 'text') {
      elementStateManager.setEditing(elementId, false)
    }
  }
  
  // 키보드 핸들러
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (elementState.editing) {
        elementStateManager.setEditing(elementId, false)
      } else {
        elementStateManager.clearAllSelected()
      }
    } else if (event.key === 'Enter' && elementState.selected && !elementState.editing && type === 'text') {
      elementStateManager.setEditing(elementId, true)
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div 
  bind:this={element}
  class="editable-element"
  class:selected={elementState.selected}
  class:editing={elementState.editing}
  data-element-type={type}
  data-element-id={elementId}
  data-selected={elementState.selected}
  data-editing={elementState.editing}
  on:click={handleClick}
  on:dblclick={handleDoubleClick}
  role="button"
  tabindex="0"
>
  {#if type === 'text' && elementState.editing}
    <span
      contenteditable="true"
      on:blur={handleEditComplete}
      on:keydown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          handleEditComplete()
        }
      }}
    >
      {@render children?.()}
    </span>
  {:else}
    {@render children?.()}
  {/if}
</div>

<style>
  .editable-element {
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;
  }
  
  .editable-element:hover {
    outline: 1px solid var(--color-accent-light, #3b82f6);
    outline-offset: 1px;
  }
  
  .editable-element.selected {
    outline: 2px solid var(--color-primary, #3b82f6);
    outline-offset: 2px;
    background-color: var(--color-primary-light, rgba(59, 130, 246, 0.1));
  }
  
  .editable-element.editing {
    outline: 3px solid var(--color-warning, #f59e0b) !important;
    outline-offset: 3px;
    background: var(--color-warning-light, rgba(245, 158, 11, 0.08));
    animation: editPulse 2s ease-in-out infinite;
    border-radius: 4px;
  }
  
  .editable-element[data-element-type="text"].selected {
    outline-color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.1);
  }
  
  .editable-element[data-element-type="image"].selected {
    outline-color: #fb923c;
    background-color: rgba(251, 146, 60, 0.1);
  }
  
  .editable-element[data-element-type="icon"].selected {
    outline-color: #a855f7;
    background-color: rgba(168, 85, 247, 0.1);
    border-radius: 4px;
  }
  
  .editable-element[data-element-type="link"].selected {
    outline-color: #06b6d4;
    background-color: rgba(6, 182, 212, 0.1);
  }
  
  .editable-element[data-element-type="repeatable"].selected {
    outline-color: #22c55e;
    background-color: rgba(34, 197, 94, 0.1);
  }
  
  @keyframes editPulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
    }
  }
</style>