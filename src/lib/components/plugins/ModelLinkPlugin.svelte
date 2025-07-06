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
    // Prevent event propagation to avoid document click handler
    e.stopPropagation()

    // Always call the parent click handler first (for selection)
    if (onElementClick) {
      console.log("🔄 Calling parent onElementClick from ModelLinkPlugin")
      onElementClick(e)
    }

    // If already selected, also open link editor
    if (isSelected) {
      console.log("🔗 Opening link editor since element is already selected")
      const newUrl = prompt("Enter new URL:", model.href)
      const newText = prompt("Enter new link text:", model.text)

      if (newUrl !== null && newText !== null) {
        console.log("🔗 Link changed:", { id: model.id, href: newUrl, text: newText })

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
    outline: 3px solid #f59e0b;
    outline-offset: 3px;
  }
</style>
