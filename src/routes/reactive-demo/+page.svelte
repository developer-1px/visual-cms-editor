<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { selectable } from '$lib/actions/selectable';
  import { 
    selectionState, 
    elementStates, 
    deselectAll,
    startEditing,
    stopEditing
  } from '$lib/stores/selection';
  import { ReactiveSelectionManager } from '$lib/core/selection/ReactiveSelectionManager';
  import '$lib/styles/selection.css';

  let manager: ReactiveSelectionManager;
  let contentContainer: HTMLElement;

  // Sample content with unique IDs
  const sampleContent = [
    { id: 'text-1', type: 'text', content: 'Click me to select' },
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

  function handleOverlayAction(event: CustomEvent) {
    const { action, elements } = event.detail;
    
    switch (action) {
      case 'edit':
        if (elements.length === 1) {
          startEditing(elements[0]);
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

  // Subscribe to selection changes for debugging
  $: console.log('Selection state:', $selectionState);
  $: console.log('Element states:', Array.from($elementStates.entries()));
</script>

<div class="min-h-screen bg-gray-50 p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Reactive Selection System Demo</h1>
    
    <div class="bg-white rounded-lg shadow-lg p-8 space-y-6" bind:this={contentContainer}>
      {#each sampleContent as item}
        {#if item.type === 'text'}
          <p
            use:selectable={{
              id: item.id,
              type: item.type,
              initialContent: item.content
            }}
            class="text-lg p-4 rounded transition-all"
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
            class="rounded transition-all"
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
      <h3 class="font-semibold mb-2">Current Selection:</h3>
      <pre class="text-xs">{JSON.stringify($selectionState, null, 2)}</pre>
    </div>
  </div>
</div>

<!-- Selection Overlay -->
{#if $selectionState.overlayPosition?.visible}
  <div 
    class="selection-overlay"
    style="--top: {$selectionState.overlayPosition.top}px; --left: {$selectionState.overlayPosition.left}px;"
  >
    <div class="floating-ui animate-fade-in">
      <button 
        on:click={() => handleOverlayAction({ detail: { action: 'edit', elements: Array.from($selectionState.selectedElements) }})}
        class="px-3 py-1 bg-white hover:bg-gray-50 border-r border-gray-200 rounded-l-md text-sm"
      >
        편집
      </button>
      <button 
        on:click={() => handleOverlayAction({ detail: { action: 'copy', elements: Array.from($selectionState.selectedElements) }})}
        class="px-3 py-1 bg-white hover:bg-gray-50 border-r border-gray-200 text-sm"
      >
        복사
      </button>
      <button 
        on:click={() => handleOverlayAction({ detail: { action: 'delete', elements: Array.from($selectionState.selectedElements) }})}
        class="px-3 py-1 bg-white hover:bg-gray-50 rounded-r-md text-sm text-red-600"
      >
        삭제
      </button>
    </div>
  </div>
{/if}

<style>
  /* Reactive selection styles based on data attributes */
  [data-selected="true"] {
    outline: 2px solid #3b82f6 !important;
    outline-offset: 2px !important;
  }
  
  [data-editing="true"] {
    outline: 3px solid #f59e0b !important;
    outline-offset: 2px !important;
    background-color: #fef3c7 !important;
  }
  
  [data-selected="true"][data-selection-type="image"] {
    outline-color: #10b981 !important;
  }
  
  .selection-overlay {
    position: fixed;
    left: var(--left);
    top: var(--top);
    z-index: 9999;
    pointer-events: auto;
  }
  
  .floating-ui {
    display: flex;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
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