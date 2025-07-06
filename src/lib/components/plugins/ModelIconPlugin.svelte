<script lang="ts">
  import type { IconModel } from "$lib/core/models/TemplateModels"

  interface Props {
    model: IconModel
    isSelected?: boolean
    onElementClick?: (e: MouseEvent) => void
  }

  let { model, isSelected = false, onElementClick }: Props = $props()

  function handleClick(e: MouseEvent) {
    // Prevent event propagation to avoid document click handler
    e.stopPropagation()

    // Always call the parent click handler first (for selection)
    if (onElementClick) {
      console.log("🔄 Calling parent onElementClick from ModelIconPlugin")
      onElementClick(e)
    }

    // If already selected, also open icon picker
    if (isSelected) {
      console.log("🎯 Opening icon picker since element is already selected")
      const newIcon = prompt("Enter new icon path data (simplified):")
      if (newIcon) {
        console.log("🎯 Icon changed:", { id: model.id, pathData: newIcon })

        // Dispatch history event
        const historyEvent = new CustomEvent("iconChanged", {
          detail: { element: document.getElementById(model.id), pathData: newIcon },
        })
        document.dispatchEvent(historyEvent)
      }
    }
  }
</script>

<div
  id={model.id}
  class="icon-container {model.className}"
  data-editable="icon"
  data-selected={isSelected ? "true" : null}
  onclick={handleClick}
  {...model.attributes}
>
  <svg
    viewBox={model.viewBox || "0 0 24 24"}
    fill="currentColor"
    width="24"
    height="24"
  >
    <path d={model.pathData} />
  </svg>
</div>

<style>
  .icon-container {
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
  }

  [data-selected="true"] {
    outline: 3px solid #f59e0b;
    outline-offset: 3px;
  }
</style>
