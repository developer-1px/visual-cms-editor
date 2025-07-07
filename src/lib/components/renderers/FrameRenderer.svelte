<script lang="ts">
  import type { TemplateElement } from "$lib/core/models/TemplateModels"
  import { isFrameModel, isTextModel } from "$lib/core/models/TemplateModels"
  import { selectedElements, modelElementRegistry } from "$lib/core/selection"
  import EditableRenderer from "./EditableRenderer.svelte"
  import { onDestroy } from "svelte"

  interface Props {
    element: TemplateElement
    onElementClick?: (e: MouseEvent) => void
  }

  let { element, onElementClick }: Props = $props()
  let elementRef: HTMLElement | undefined

  // Registry에 Model-Element 매핑 등록
  $effect(() => {
    if (elementRef && element) {
      modelElementRegistry.register(element, elementRef)
    }
  })

  // 컴포넌트 제거시 Registry에서 해제
  onDestroy(() => {
    if (element) {
      modelElementRegistry.unregister(element)
    }
  })

  // 선택 상태 추적 - Registry 사용
  let isSelected = $derived(elementRef ? $selectedElements.has(elementRef) : false)

  // 스타일 문자열 생성
  function buildStyleString(styles?: Record<string, string>): string {
    if (!styles) return ""
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ")
  }

  // 클릭 핸들러
  function handleClick(e: MouseEvent) {
    // data-editable="link"인 경우 기본 동작 방지
    if (element.attributes?.["data-editable"] === "link") {
      e.preventDefault()
    }
    
    // data-repeatable 또는 data-editable 속성이 있으면 클릭 이벤트 전달
    if (element.attributes?.["data-repeatable"] !== undefined || element.attributes?.["data-editable"] !== undefined) {
      // Element clicked - forward event to parent handler
      // This allows elements to be selected and managed
      if (onElementClick) {
        onElementClick(e)
      }
    }
  }
  
  // 빈 텍스트 모델 체크
  function isEmptyTextModel(element: TemplateElement): boolean {
    return isTextModel(element) && (!element.content || element.content.trim() === "")
  }
</script>

{#if isFrameModel(element)}
  <!-- Frame 요소: 동적 태그로 렌더링 -->
  <svelte:element
    this={element.tagName}
    bind:this={elementRef}
    id={element.id}
    class={element.className}
    style={buildStyleString(element.styles)}
    {...element.attributes}
    data-selected={isSelected ? "true" : undefined}
    data-selection-type={isSelected && element.attributes?.["data-repeatable"] !== undefined ? "repeatable" : undefined}
    data-editable={element.attributes?.["data-repeatable"] !== undefined ? "repeatable" : element.attributes?.["data-editable"]}
    onclick={element.attributes?.["data-repeatable"] !== undefined || element.attributes?.["data-editable"] !== undefined ? handleClick : undefined}
  >
    {#each element.children as child (child.id)}
      {#if isFrameModel(child)}
        <svelte:self
          element={child}
          {onElementClick}
        />
      {:else if !isEmptyTextModel(child)}
        <EditableRenderer
          element={child}
          {onElementClick}
        />
      {/if}
    {/each}
  </svelte:element>
{:else}
  <!-- Editable 요소: EditableRenderer로 위임 -->
  <EditableRenderer
    {element}
    {onElementClick}
  />
{/if}
