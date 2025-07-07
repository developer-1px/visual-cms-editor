<script lang="ts">
  import type { LinkModel } from "$lib/core/models/TemplateModels"

  interface Props {
    model: LinkModel
    isSelected?: boolean
    onElementClick?: (e: MouseEvent) => void
  }

  let { model, isSelected = false, onElementClick }: Props = $props()

  function handleClick(e: MouseEvent) {
    // 편집 모드에서는 링크 클릭 방지
    e.preventDefault()
    // Stop propagation to prevent bubbling
    e.stopPropagation()

    // For selection, we need to ensure the event target has the data-editable attribute
    // Create a synthetic event with the container as the target
    const container = e.currentTarget as HTMLElement
    const syntheticEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: e.clientX,
      clientY: e.clientY,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey,
      ctrlKey: e.ctrlKey
    })
    
    // Define the target property to point to our container
    Object.defineProperty(syntheticEvent, 'target', {
      value: container,
      enumerable: true
    })
    
    // Always call the parent click handler first (for selection)
    if (onElementClick) {
      onElementClick(syntheticEvent)
    }

    // If already selected, open link editor (edit mode)
    if (isSelected) {
      // Element is selected, open link editor
      const newUrl = prompt("Enter new URL:", model.href)
      const newText = prompt("Enter new link text:", model.text)

      if (newUrl !== null && newText !== null) {
        // Update model
        model.href = newUrl
        model.text = newText

        // Dispatch history event
        const historyEvent = new CustomEvent("linkChanged", {
          detail: { element: document.getElementById(model.id), href: newUrl, text: newText },
        })
        document.dispatchEvent(historyEvent)
      }
    }
  }
</script>

<a
  id={model.id}
  href={model.href}
  target={model.target}
  class="link-element {model.className}"
  data-editable="link"
  data-selected={isSelected ? "true" : null}
  onclick={handleClick}
  {...model.attributes}
>
  {model.text}
</a>

<style>
  .link-element {
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: underline;
  }

  [data-selected="true"] {
    box-shadow: 0 0 0 3px #f59e0b;
  }
</style>
