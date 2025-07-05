<script lang="ts">
  import { onMount } from "svelte"
  import { computePosition, flip, shift, offset } from "@floating-ui/dom"
  import { Type, Copy, Trash2, Replace, Link, ArrowUp, ArrowDown, Eye } from "lucide-svelte"
  import {
    selectedElements,
    activeSelectionType,
    isSelectionEmpty,
    selectedSectionIndex,
  } from "$lib/core/selection/SelectionManager"

  interface Props {
    container?: HTMLElement | null
    onAction?: (action: string, data?: unknown) => void
  }

  let { container = null, onAction }: Props = $props()

  let overlayElement = $state<HTMLElement | undefined>()
  let visible = $state(false)
  let position = $state({ x: 0, y: 0 })

  // Get actions based on selection type
  let actions = $derived(getActionsForType($activeSelectionType))

  function getActionsForType(type: string | null) {
    if (!type) return []

    switch (type) {
      case "text":
        return [
          { id: "edit", icon: Type, title: "Edit" },
          { id: "copy", icon: Copy, title: "Copy" },
          { id: "cut", icon: Trash2, title: "Cut" },
          { id: "delete", icon: Trash2, title: "Delete", color: "text-red-600" },
        ]
      case "image":
        return [
          { id: "replace", icon: Replace, title: "Replace" },
          { id: "copy", icon: Copy, title: "Copy" },
          { id: "delete", icon: Trash2, title: "Delete", color: "text-red-600" },
        ]
      case "icon":
        return [
          { id: "replace", icon: Replace, title: "Replace" },
          { id: "copy", icon: Copy, title: "Copy" },
          { id: "delete", icon: Trash2, title: "Delete", color: "text-red-600" },
        ]
      case "link":
        return [
          { id: "editLink", icon: Link, title: "Edit Link" },
          { id: "copy", icon: Copy, title: "Copy" },
          { id: "delete", icon: Trash2, title: "Delete", color: "text-red-600" },
        ]
      case "repeatable":
        return [
          { id: "copy", icon: Copy, title: "Copy" },
          { id: "cut", icon: Trash2, title: "Cut" },
          { id: "delete", icon: Trash2, title: "Delete", color: "text-red-600" },
        ]
      case "section":
        return [
          { id: "moveUp", icon: ArrowUp, title: "Move Up", disabled: $selectedSectionIndex === 0 },
          { id: "moveDown", icon: ArrowDown, title: "Move Down" },
          { id: "toggleVisibility", icon: Eye, title: "Toggle Visibility" },
          { id: "delete", icon: Trash2, title: "Delete", color: "text-red-600" },
        ]
      default:
        return []
    }
  }

  function handleAction(action: string) {
    onAction?.(action)
  }

  async function updatePosition() {
    if ($isSelectionEmpty || !overlayElement) {
      visible = false
      return
    }

    // Get the first selected element
    const firstElement = Array.from($selectedElements)[0]

    if (!firstElement) {
      // For section selection, position at the section
      if ($activeSelectionType === "section" && $selectedSectionIndex !== null && container) {
        const sections = container.querySelectorAll(".template-section")
        const sectionElement = sections[$selectedSectionIndex] as HTMLElement
        if (sectionElement) {
          const { x, y } = await computePosition(sectionElement, overlayElement, {
            placement: "top",
            middleware: [offset(8), flip(), shift({ padding: 8 })],
          })

          position = { x, y }
          visible = true
          return
        }
      }
      visible = false
      return
    }

    const { x, y } = await computePosition(firstElement, overlayElement, {
      placement: "top",
      middleware: [offset(8), flip(), shift({ padding: 8 })],
    })

    position = { x, y }
    visible = true
  }

  // Update position when selection changes
  $effect(() => {
    if (!$isSelectionEmpty && overlayElement) {
      updatePosition()
    } else {
      visible = false
    }
  })

  // Handle window resize
  onMount(() => {
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  })
</script>

{#if visible}
  <div
    bind:this={overlayElement}
    class="selection-overlay"
    style="left: {position.x}px; top: {position.y}px;"
  >
    <div class="floating-ui animate-fade-in">
      {#each actions as action (action.id)}
        <button
          onclick={() => handleAction(action.id)}
          class="bg-white px-3 py-1 text-sm hover:bg-gray-50 {action.color || ''}"
          class:border-r={action !== actions[actions.length - 1]}
          class:rounded-l-md={action === actions[0]}
          class:rounded-r-md={action === actions[actions.length - 1]}
        >
          {action.title}
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  .selection-overlay {
    position: fixed;
    z-index: 9999;
    pointer-events: auto;
  }

  .floating-ui {
    display: flex;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  button {
    transition: all 0.15s ease;
    border-color: #e5e7eb;
  }

  button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
  }

  .animate-fade-in {
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
