<script lang="ts">
  import { Edit2, Copy, Trash2, Type, Scissors, Eye, ChevronUp, ChevronDown } from "lucide-svelte"
  import {
    selectedItems,
    activeSelectionType,
    activeSelectionStyle,
    selectionCount,
    isSelectionEmpty,
  } from "$lib/core/selection"

  interface Props {
    container?: HTMLElement | null
    onAction?: (action: string, data?: unknown) => void
  }

  let { container = null, onAction }: Props = $props()

  let overlayElement = $state<HTMLElement | undefined>()

  // Get overlay color and actions based on selection type
  let overlayColor = $derived($activeSelectionStyle?.overlayColor || "rgb(31, 41, 55)") // stone-900
  let actions = $derived(getActionsForType($activeSelectionType))

  // Computed position based on selected elements directly
  let position = $derived.by(() => {
    if ($isSelectionEmpty || !overlayElement) {
      return { x: 0, y: 0, visible: false }
    }

    // Get the first selected item and try to get its element
    const firstItem = Array.from($selectedItems.values())[0]
    if (!firstItem) {
      return { x: 0, y: 0, visible: false }
    }

    // Try to find the element in the DOM using the ID
    let targetElement: HTMLElement | null = null
    
    if (firstItem.element instanceof HTMLElement) {
      targetElement = firstItem.element
    } else {
      // Fallback: try to find by ID in the DOM
      const elementId = (firstItem.element as any)?.id || firstItem.id
      if (elementId) {
        targetElement = document.getElementById(elementId)
      }
    }

    if (!targetElement) {
      console.warn('SelectionOverlay: No target element found', { firstItem })
      return { x: 0, y: 0, visible: false }
    }

    // Calculate position relative to the container (for absolute positioning)
    const rect = targetElement.getBoundingClientRect()
    
    // Find the editor container for relative positioning
    const editorContainer = document.querySelector('.relative.flex-1.overflow-auto') || document.body
    const containerRect = editorContainer.getBoundingClientRect()
    
    // Calculate position relative to container
    const relativeX = rect.left - containerRect.left + rect.width / 2 - (overlayElement.offsetWidth || 80) / 2
    const relativeY = rect.top - containerRect.top - (overlayElement.offsetHeight || 40) - 8
    
    // Add scroll offset for absolute positioning
    const scrollTop = (editorContainer as HTMLElement).scrollTop || 0
    const scrollLeft = (editorContainer as HTMLElement).scrollLeft || 0

    return {
      x: Math.max(8, relativeX + scrollLeft),
      y: Math.max(8, relativeY + scrollTop),
      visible: true
    }
  })

  function getActionsForType(type: string | null) {
    if (!type) return []

    const commonActions = [
      { id: "copy", icon: Copy, title: "Copy", shortcut: "Ctrl+C" },
      { id: "delete", icon: Trash2, title: "Delete", shortcut: "Delete", color: "text-red-400" },
    ]

    switch (type) {
      case "text":
        return [{ id: "edit", icon: Type, title: "Edit", shortcut: "Enter" }, ...commonActions]
      case "repeatable":
        return [...commonActions, { id: "cut", icon: Scissors, title: "Cut", shortcut: "Ctrl+X" }]
      case "section":
        return [
          { id: "moveUp", icon: ChevronUp, title: "Move Up" },
          { id: "moveDown", icon: ChevronDown, title: "Move Down" },
          { id: "toggleVisibility", icon: Eye, title: "Toggle Visibility" },
          { id: "delete", icon: Trash2, title: "Remove Section", color: "text-red-400" },
        ]
      case "image":
      case "icon":
        return [{ id: "replace", icon: Edit2, title: "Replace" }, ...commonActions]
      case "link":
        return [{ id: "editLink", icon: Edit2, title: "Edit Link" }, ...commonActions]
      default:
        return commonActions
    }
  }

  function handleAction(actionId: string) {
    onAction?.(actionId, {
      selection: $selectedItems,
      type: $activeSelectionType,
    })
  }

  // Track selection state changes for overlay positioning
  $effect(() => {
    // Force position recalculation when selection changes
    $selectedItems;
    $activeSelectionType;
    
    // Small delay to ensure DOM updates have completed
    if (!$isSelectionEmpty) {
      setTimeout(() => {
        // Force a re-render by updating a dummy state
        if (overlayElement) {
          overlayElement.style.opacity = '0.99'
          setTimeout(() => {
            if (overlayElement) overlayElement.style.opacity = '1'
          }, 10)
        }
      }, 50)
    }
  })
</script>

<!-- Always render overlay but control visibility -->
<div
  bind:this={overlayElement}
  class="animate-fade-in floating-ui absolute z-50 flex items-center gap-1 px-1 py-1 shadow-xl {position.visible && !$isSelectionEmpty
    ? 'block'
    : 'hidden'}"
  style="
    left: {position.x}px; 
    top: {position.y}px; 
    background-color: {overlayColor};
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    pointer-events: auto;
  "
>
  {#if actions.length > 0}
    {#each actions as action (action.id)}
      {#if action.id === "divider"}
        <div class="h-5 w-px bg-white/20"></div>
      {:else}
        {@const IconComponent = action.icon}
        <button
          class="flex h-8 w-8 items-center justify-center rounded text-white transition-all hover:bg-white/20 {action.color ||
            ''}"
          onclick={() => handleAction(action.id)}
          title="{action.title}{action.shortcut ? ` (${action.shortcut})` : ''}"
        >
          <IconComponent class="h-4 w-4" />
        </button>
      {/if}
    {/each}

    {#if $selectionCount > 1}
      <div class="px-2 text-xs text-white/80">
        {$selectionCount}
      </div>
    {/if}
  {:else}
    <!-- Fallback content for debugging -->
    <div class="rounded bg-red-500 px-2 py-1 text-xs text-white">DEBUG: No actions</div>
  {/if}
</div>

<style>
  .floating-ui {
    pointer-events: auto;
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
