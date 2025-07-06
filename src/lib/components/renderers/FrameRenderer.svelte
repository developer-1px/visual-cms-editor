<script lang="ts">
  import type { TemplateElement } from "$lib/core/models/TemplateModels"
  import { isFrameModel } from "$lib/core/models/TemplateModels"
  import { selectedElements } from "$lib/core/selection/SelectionManager"
  import { modelElementRegistry } from "$lib/core/selection/ModelSelectionManager"
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
  let isSelected = $derived(
    elementRef ? $selectedElements.has(elementRef) : false
  )

  // 스타일 문자열 생성
  function buildStyleString(styles?: Record<string, string>): string {
    if (!styles) return ""
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ")
  }

  // 클릭 핸들러
  function handleClick(e: MouseEvent) {
    // data-repeatable 속성이 있으면 클릭 이벤트 전달
    if (element.attributes?.["data-repeatable"] !== undefined) {
      console.log("🔵 FrameRenderer: Repeatable element clicked", {
        tagName: element.tagName,
        className: element.className,
        attributes: element.attributes,
      })
      if (onElementClick) {
        onElementClick(e)
      }
    }
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
    onclick={element.attributes?.["data-repeatable"] !== undefined ? handleClick : undefined}
  >
    {#each element.children as child (child.id)}
      {#if isFrameModel(child)}
        <svelte:self
          element={child}
          {onElementClick}
        />
      {:else}
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
