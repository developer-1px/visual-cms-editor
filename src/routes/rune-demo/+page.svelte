<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { selectable } from '$lib/actions/selectable.svelte';
  import { selectionStore } from '$lib/stores/selection.svelte';
  import SelectionOverlay from '$lib/components/SelectionOverlay.svelte';
  import { ReactiveSelectionManager } from '$lib/core/selection/ReactiveSelectionManager';
  import '$lib/styles/selection.css';

  let manager: ReactiveSelectionManager | undefined = $state();
  let contentContainer: HTMLElement;

  // Sample content with unique IDs
  const sampleContent = [
    { id: 'text-1', type: 'text', content: 'Click me to select (Svelte 5 Runes)' },
    { id: 'text-2', type: 'text', content: 'Use Shift+Click for multi-select' },
    { id: 'text-3', type: 'text', content: 'Double-click or press Enter to edit' },
    { id: 'image-1', type: 'image', content: 'https://via.placeholder.com/300x200' },
    { id: 'text-4', type: 'text', content: 'Press Tab to navigate between elements' },
    { id: 'text-5', type: 'text', content: 'Use Ctrl/Cmd+C to copy, Ctrl/Cmd+V to paste' }
  ];

  onMount(() => {
    manager = new ReactiveSelectionManager();
  });

  onDestroy(() => {
    manager?.destroy();
  });

  function handleOverlayAction(event: { action: string; elements: string[] }) {
    const { action, elements } = event;
    
    switch (action) {
      case 'edit':
        if (elements.length === 1) {
          selectionStore.startEditing(elements[0]);
        }
        break;
      
      case 'copy':
        // Copy logic handled by ReactiveSelectionManager
        document.execCommand('copy');
        break;
      
      case 'delete':
        elements.forEach((id: string) => {
          const element = document.querySelector(`[data-element-id="${id}"]`);
          if (element && element.getAttribute('data-editable') === 'text') {
            element.textContent = '';
          }
        });
        break;
    }
  }

  // Reactive values using $derived
  let selectedCount = $derived(selectionStore.selectedElements.length);
  let hasSelection = $derived(selectionStore.isAnySelected);
  let editingId = $derived(selectionStore.editingElement);
  
  // Debug info using $derived
  let debugInfo = $derived({
    selectedElements: selectionStore.selectedElements,
    editingElement: selectionStore.editingElement,
    overlayPosition: selectionStore.overlayPosition,
    elementCount: Object.keys(selectionStore.getAllElementStates()).length,
    allElements: selectionStore.getAllElementStates()
  });
</script>

<div class="min-h-screen bg-gray-50 p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Svelte 5 Runes - Reactive Selection Demo</h1>
    
    <div class="bg-white rounded-lg shadow-lg p-8 space-y-6" bind:this={contentContainer}>
      {#each sampleContent as item}
        {#if item.type === 'text'}
          <p
            use:selectable={{
              id: item.id,
              type: item.type,
              initialContent: item.content
            }}
            class="text-lg p-4 rounded transition-all cursor-pointer"
          >
            {item.content}
          </p>
        {:else if item.type === 'image'}
          <img
            use:selectable={{
              id: item.id,
              type: item.type
            }}
            src={item.content}
            alt="Sample"
            class="rounded transition-all cursor-pointer"
          />
        {/if}
      {/each}
    </div>

    <div class="mt-8 p-4 bg-gray-100 rounded">
      <h2 class="font-semibold mb-2">Instructions:</h2>
      <ul class="list-disc list-inside space-y-1 text-sm">
        <li>Click to select an element</li>
        <li>Shift+Click or Cmd/Ctrl+Click for multi-select</li>
        <li>Double-click or press Enter to edit text</li>
        <li>Use Tab/Shift+Tab to navigate</li>
        <li>Press Escape to deselect</li>
        <li>Ctrl/Cmd+A to select all</li>
        <li>Ctrl/Cmd+C/V/X for copy/paste/cut</li>
      </ul>
    </div>

    <div class="mt-4 p-4 bg-blue-50 rounded">
      <h3 class="font-semibold mb-2">Selection State (using Svelte 5 Runes):</h3>
      <div class="text-sm space-y-1">
        <p>Selected count: <strong>{selectedCount}</strong></p>
        <p>Has selection: <strong>{hasSelection}</strong></p>
        <p>Editing element: <strong>{editingId || 'none'}</strong></p>
      </div>
      <details class="mt-2">
        <summary class="cursor-pointer text-sm text-blue-600">Debug Info</summary>
        <pre class="text-xs mt-2 overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
      </details>
    </div>
  </div>
</div>

<!-- Selection Overlay Component -->
<SelectionOverlay onaction={handleOverlayAction} />

<style>
  /* Reactive selection styles based on data attributes */
  :global([data-selected="true"]) {
    outline: 2px solid #3b82f6 !important;
    outline-offset: 2px !important;
    background-color: rgba(59, 130, 246, 0.05) !important;
  }
  
  :global([data-editing="true"]) {
    outline: 3px solid #f59e0b !important;
    outline-offset: 2px !important;
    background-color: #fef3c7 !important;
  }
  
  :global([data-selected="true"][data-selection-type="image"]) {
    outline-color: #10b981 !important;
    background-color: rgba(16, 185, 129, 0.05) !important;
  }
  
  p:hover:not([data-selected="true"]) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  img:hover:not([data-selected="true"]) {
    opacity: 0.9;
  }
</style>