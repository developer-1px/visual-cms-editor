<script lang="ts">
  import type { EditableModel } from "$lib/core/models/TemplateModels"
  import { isTextModel, isImageModel, isIconModel, isLinkModel } from "$lib/core/models/TemplateModels"
  import { selectedElements } from "$lib/core/selection/SelectionManager"
  import ModelTextPlugin from "../plugins/ModelTextPlugin.svelte"
  import ModelImagePlugin from "../plugins/ModelImagePlugin.svelte"
  import ModelIconPlugin from "../plugins/ModelIconPlugin.svelte"
  import ModelLinkPlugin from "../plugins/ModelLinkPlugin.svelte"

  interface Props {
    element: EditableModel
    onElementClick?: (e: MouseEvent) => void
  }

  let { element, onElementClick }: Props = $props()

  // 선택 상태 추적 - 실제 DOM 요소와 비교
  let isSelected = $derived.by(() => {
    // ModelTextPlugin 등에서 렌더링된 실제 DOM 요소를 찾아야 함
    if (typeof document === "undefined") return false

    const domElement = document.getElementById(element.id)
    if (!domElement) return false

    return $selectedElements.has(domElement)
  })
</script>

{#if isTextModel(element)}
  <ModelTextPlugin
    model={element}
    {isSelected}
    {onElementClick}
  />
{:else if isImageModel(element)}
  <ModelImagePlugin
    model={element}
    {isSelected}
    {onElementClick}
  />
{:else if isIconModel(element)}
  <ModelIconPlugin
    model={element}
    {isSelected}
    {onElementClick}
  />
{:else if isLinkModel(element)}
  <ModelLinkPlugin
    model={element}
    {isSelected}
    {onElementClick}
  />
{:else}
  <!-- 알 수 없는 타입: 기본 텍스트로 렌더링 -->
  <span
    class="unknown-editable"
    onclick={onElementClick}
  >
    Unknown editable type: {element.type}
  </span>
{/if}

<style>
  .unknown-editable {
    background: #ffebee;
    color: #c62828;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
</style>
