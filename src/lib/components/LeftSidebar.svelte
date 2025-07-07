<script lang="ts">
  import { onMount } from "svelte"
  import { Layers, Eye, GripVertical, Plus } from "lucide-svelte"
  import type { Template } from "$lib/core/templates/templates"
  import { selectedSectionIndex } from "$lib/core/selection"

  export let isOpen: boolean = true
  export let templates: Template[] = []
  export let onSelectSection: (index: number) => void = () => {}
  export let onReorderSections: (fromIndex: number, toIndex: number) => void = () => {}
  export let onToggleVisibility: (index: number) => void = () => {}
  export let onAddSection: () => void = () => {}

  let sectionPreviews: HTMLElement[] = []
  let draggedIndex: number | null = null
  let dragOverIndex: number | null = null

  // Generate preview HTML with scaled styles
  function generatePreviewHtml(template: Template): string {
    // Simple HTML processing without DOM API for SSR compatibility
    let html = template?.html || ""

    // Add inline styles for preview scaling if html exists
    if (html) {
      html = html.replace(/<section([^>]*)>/gi, '<section$1 style="padding: 12px; margin: 0;">')
    }

    return html
  }

  function handleDragStart(e: DragEvent, index: number) {
    draggedIndex = index
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move"
    }
  }

  function handleDragOver(e: DragEvent, index: number) {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move"
    }
    dragOverIndex = index
  }

  function handleDragEnd() {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      onReorderSections(draggedIndex, dragOverIndex)
    }
    draggedIndex = null
    dragOverIndex = null
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
  }

  onMount(() => {
    // Initialize section observers if needed
    return () => {
      // Cleanup
    }
  })
</script>

<div class="fixed top-12 bottom-0 left-0 z-20 flex">
  <!-- Sidebar -->
  <div
    class="overflow-hidden border-r border-stone-200 bg-white shadow-sm transition-all duration-300 {isOpen
      ? 'w-40'
      : 'w-0'}"
  >
    <div class="flex h-full flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-stone-200 px-2 py-2">
        <div class="flex items-center gap-1">
          <Layers class="h-3 w-3 text-stone-600" />
          <h3 class="text-[11px] font-medium text-stone-900">Sections</h3>
          <span class="text-[11px] text-stone-500">{templates.length}</span>
        </div>
        <button
          on:click={onAddSection}
          class="flex h-5 w-5 items-center justify-center rounded transition-colors hover:bg-stone-100"
          title="Add Section"
        >
          <Plus class="h-3 w-3 text-stone-600" />
        </button>
      </div>

      <!-- Section List -->
      <div class="flex-1 space-y-1 overflow-y-auto p-1.5">
        {#each templates.filter((t) => t && t.html) as template, index (`${template.id}-${index}`)}
          <div
            class="group relative cursor-pointer overflow-hidden rounded border bg-stone-50 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm {dragOverIndex ===
            index
              ? 'border-blue-500'
              : $selectedSectionIndex === index
                ? 'border-2 border-indigo-500 bg-indigo-50'
                : 'border-stone-200 hover:border-stone-300'}"
            on:click={() => onSelectSection(index)}
            draggable={true}
            on:dragstart={(e) => handleDragStart(e, index)}
            on:dragover={(e) => handleDragOver(e, index)}
            on:dragend={handleDragEnd}
            on:drop={handleDrop}
          >
            <!-- Drag Handle -->
            <div class="absolute top-1 left-1 z-10 cursor-move opacity-0 transition-opacity group-hover:opacity-100">
              <GripVertical class="h-3 w-3 text-stone-400" />
            </div>

            <!-- Visibility Toggle -->
            <button
              class="absolute top-1 right-1 z-10 opacity-0 transition-opacity group-hover:opacity-100"
              on:click|stopPropagation={() => onToggleVisibility(index)}
              title="Toggle visibility"
            >
              <Eye class="h-3 w-3 text-stone-600" />
            </button>

            <!-- Section Info - Single Line -->
            <div class="flex items-center gap-1.5 bg-white px-2 py-1">
              <span class="text-[9px] font-medium text-stone-500">{index + 1}</span>
              <span class="flex-1 truncate text-[10px] font-medium text-stone-700">{template.name}</span>
            </div>

            <!-- Preview Container -->
            <div class="relative h-[50px] overflow-hidden bg-stone-50">
              <div
                class="pointer-events-none absolute left-1/2 h-auto origin-top -translate-x-1/2 scale-[0.08] transform select-none [&_*]:!text-[6px] [&_*]:!leading-[1.1] [&_*::-webkit-scrollbar]:hidden [&_[class*='h-']]:!h-auto [&_[class*='h-']]:!min-h-0 [&_img]:h-auto [&_img]:max-w-full"
                style="width: 1250%;"
              >
                <div
                  bind:this={sectionPreviews[index]}
                  class="mx-auto w-[1200px]"
                >
                  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                  {@html generatePreviewHtml(template)}
                </div>
              </div>
            </div>
          </div>
        {/each}

        {#if templates.length === 0}
          <div class="py-6 text-center">
            <Layers class="mx-auto mb-1 h-6 w-6 text-stone-300" />
            <p class="text-xs text-stone-500">No sections</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
