<script lang="ts">
  import type { IconModel } from "$lib/core/models/TemplateModels"
  import { onMount } from "svelte"

  interface Props {
    model: IconModel
    isSelected?: boolean
    onElementClick?: (e: MouseEvent) => void
  }

  let { model, isSelected = false, onElementClick }: Props = $props()
  let container: HTMLElement

  function handleClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (onElementClick) {
      onElementClick(e)
    }

    // If already selected, open icon picker (edit mode)
    if (isSelected) {
      const newIcon = prompt("Enter new icon SVG HTML:", model.outerHTML)
      if (newIcon) {
        model.outerHTML = newIcon
        const historyEvent = new CustomEvent("iconChanged", {
          detail: { element: e.currentTarget, outerHTML: newIcon },
        })
        document.dispatchEvent(historyEvent)
      }
    }
  }

  onMount(() => {
    if (container) {
      // Parse and modify the SVG
      const parser = new DOMParser()
      const doc = parser.parseFromString(model.outerHTML, 'image/svg+xml')
      const svg = doc.querySelector('svg')
      
      if (svg) {
        // Add attributes
        svg.setAttribute('id', model.id)
        svg.setAttribute('data-editable', 'icon')
        svg.setAttribute('data-selected', isSelected ? 'true' : 'false')
        svg.classList.add('icon-svg')
        if (model.className) {
          model.className.split(' ').forEach(cls => svg.classList.add(cls))
        }
        
        // Add click handler
        svg.addEventListener('click', handleClick)
        
        // Replace container content with the SVG
        container.innerHTML = ''
        container.appendChild(svg)
        
        return () => {
          svg.removeEventListener('click', handleClick)
        }
      }
    }
  })

  // Update SVG attributes when selection changes
  $effect(() => {
    const svg = container?.querySelector('svg')
    if (svg) {
      svg.setAttribute('data-selected', isSelected ? 'true' : 'false')
    }
  })
</script>

<!-- Temporary container that will be replaced with SVG -->
<span bind:this={container} style="display: contents;">
  {@html model.outerHTML}
</span>

<style>
  :global(.icon-svg) {
    cursor: pointer;
    transition: all 0.2s ease;
  }

  :global(.icon-svg[data-selected="true"]) {
    filter: drop-shadow(0 0 3px #f59e0b);
  }
</style>