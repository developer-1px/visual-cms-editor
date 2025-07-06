<script lang="ts">
  import { Edit2, Copy, Trash2, Type, Scissors, Eye, EyeOff, ChevronUp, ChevronDown, Replace, Link } from "lucide-svelte"
  import {
    selectedItems,
    selectedElements,
    activeSelectionType,
    activeSelectionStyle,
    selectionCount,
    isSelectionEmpty,
    selectedSectionIndex,
  } from "$lib/core/selection/SelectionManager"

  interface Props {
    container?: HTMLElement | null
    onAction?: (action: string, data?: unknown) => void
  }

  let { container = null, onAction }: Props = $props()

  let overlayElement = $state<HTMLElement | undefined>()

  // Get overlay color and actions based on selection type
  let overlayColor = $derived($activeSelectionStyle?.overlayColor || 'rgb(31, 41, 55)') // stone-900
  let actions = $derived(getActionsForType($activeSelectionType))

  // Computed position based on selection
  let position = $derived.by(() => {
    if ($isSelectionEmpty || !overlayElement || !container) {
      return { x: 0, y: 0 }
    }

    // Get the first selected item
    const firstItem = Array.from($selectedItems)[0]
    if (!firstItem) {
      return { x: 0, y: 0 }
    }

    let targetElement: HTMLElement | null = null

    if (firstItem.context === 'sidebar' && typeof firstItem.element === 'number') {
      // For section selections, position near the section in sidebar
      const sectionElements = document.querySelectorAll('.template-section')
      targetElement = sectionElements[firstItem.element] as HTMLElement
    } else if (firstItem.element instanceof HTMLElement) {
      // For canvas elements
      targetElement = firstItem.element
    }

    if (!targetElement) {
      return { x: 0, y: 0 }
    }

    const rect = targetElement.getBoundingClientRect()
    
    // Find the scroll container (the one with overflow-auto)
    const scrollContainer = targetElement.closest('.overflow-auto')
    const scrollContainerRect = scrollContainer?.getBoundingClientRect() || { left: 0, top: 0 }
    
    // Calculate position relative to scroll container
    const relativeX = rect.left - scrollContainerRect.left
    const relativeY = rect.top - scrollContainerRect.top
    
    // Get scroll position of scroll container
    const containerScrollTop = scrollContainer?.scrollTop || 0
    const containerScrollLeft = scrollContainer?.scrollLeft || 0
    
    // Get overlay height (estimated if not available)
    const overlayHeight = overlayElement.offsetHeight || 40 // estimated height
    
    return { 
      x: relativeX + containerScrollLeft, 
      y: relativeY + containerScrollTop - overlayHeight - 8 
    }
  })

  function getActionsForType(type: string | null) {
    if (!type) return []

    const commonActions = [
      { id: 'copy', icon: Copy, title: 'Copy', shortcut: 'Ctrl+C' },
      { id: 'delete', icon: Trash2, title: 'Delete', shortcut: 'Delete', color: 'text-red-400' }
    ]

    switch (type) {
      case "text":
        return [
          { id: 'edit', icon: Type, title: 'Edit', shortcut: 'Enter' },
          ...commonActions
        ]
      case "repeatable":
        return [
          ...commonActions,
          { id: 'cut', icon: Scissors, title: 'Cut', shortcut: 'Ctrl+X' }
        ]
      case "section":
        return [
          { id: 'moveUp', icon: ChevronUp, title: 'Move Up' },
          { id: 'moveDown', icon: ChevronDown, title: 'Move Down' },
          { id: 'toggleVisibility', icon: Eye, title: 'Toggle Visibility' },
          { id: 'delete', icon: Trash2, title: 'Remove Section', color: 'text-red-400' }
        ]
      case "image":
      case "icon":
        return [
          { id: 'replace', icon: Edit2, title: 'Replace' },
          ...commonActions
        ]
      case "link":
        return [
          { id: 'editLink', icon: Edit2, title: 'Edit Link' },
          ...commonActions
        ]
      default:
        return commonActions
    }
  }

  function handleAction(actionId: string) {
    onAction?.(actionId, { 
      selection: $selectedItems,
      type: $activeSelectionType
    })
  }

  // Debug effect
  $effect(() => {
    console.log("🎯 SelectionOverlay state:", {
      selectedItemsSize: $selectedItems.size,
      isSelectionEmpty: $isSelectionEmpty,
      activeSelectionType: $activeSelectionType,
      actions: actions.length,
      overlayElement: !!overlayElement,
      position
    })
  })
</script>

<!-- Always render overlay but control visibility -->
<div
  bind:this={overlayElement}
  class="absolute shadow-xl flex items-center gap-1 px-1 py-1 z-30 animate-fade-in floating-ui {!$isSelectionEmpty ? 'block' : 'hidden'}"
  style="
    left: {position.x}px; 
    top: {position.y}px; 
    background-color: {overlayColor};
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  "
>
  
  {#if actions.length > 0}
    {#each actions as action}
      {#if action.id === 'divider'}
        <div class="w-px h-5 bg-white/20"></div>
      {:else}
        {@const IconComponent = action.icon}
        <button
          class="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded transition-all {action.color || ''}"
          onclick={() => handleAction(action.id)}
          title="{action.title}{action.shortcut ? ` (${action.shortcut})` : ''}"
        >
          <IconComponent class="w-4 h-4" />
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
    <div class="px-2 py-1 text-xs text-white bg-red-500 rounded">
      DEBUG: No actions
    </div>
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

