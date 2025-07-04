<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import EditableText from '$lib/components/EditableText.svelte';
  import EditableImage from '$lib/components/EditableImage.svelte';
  import SelectionOverlay from '$lib/components/SelectionOverlay.svelte';
  import { ReactiveSelectionManager } from '$lib/core/selection/ReactiveSelectionManager';
  import { selectionStore } from '$lib/stores/selection.svelte';
  
  let manager: ReactiveSelectionManager | undefined = $state();
  
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
        document.execCommand('copy');
        break;
      
      case 'delete':
        elements.forEach((id: string) => {
          const element = document.querySelector(`[data-element-id="${id}"]`);
          const elementState = selectionStore.getElementState(id);
          
          if (element && elementState?.type === 'text') {
            element.textContent = '';
          } else if (element && elementState?.type === 'image') {
            // Reset to placeholder image
            (element as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Deleted';
          }
        });
        break;
    }
  }
  
  // Reactive debug info
  let debugInfo = $derived({
    selectedCount: selectionStore.selectedElements.length,
    editingElement: selectionStore.editingElement,
    totalElements: selectionStore.getAllElementStates().size
  });
</script>

<div class="min-h-screen bg-gray-50 p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Reactive Components Demo</h1>
    
    <div class="bg-white rounded-lg shadow-lg p-8 space-y-8">
      <!-- Text Components Section -->
      <section>
        <h2 class="text-xl font-semibold mb-4">Editable Text Components</h2>
        <div class="space-y-4">
          <EditableText 
            id="text-title"
            content="Click to edit this title"
            maxlength={50}
            class="text-2xl font-bold"
          />
          
          <EditableText 
            id="text-paragraph"
            content="This is a paragraph with a maximum length of 200 characters. Try editing it!"
            maxlength={200}
            class="text-base"
          />
          
          <EditableText 
            id="text-short"
            content="Short text"
            minlength={5}
            maxlength={20}
            placeholder="Enter short text..."
            class="text-sm text-gray-600"
          />
        </div>
      </section>
      
      <!-- Image Components Section -->
      <section>
        <h2 class="text-xl font-semibold mb-4">Editable Image Components</h2>
        <div class="grid grid-cols-2 gap-4">
          <EditableImage 
            id="img-1"
            src="https://via.placeholder.com/400x300?text=Click+to+Replace"
            alt="Sample Image 1"
            aspectratio="4/3"
            objectfit="cover"
            class="w-full"
          />
          
          <EditableImage 
            id="img-2"
            src="https://via.placeholder.com/400x400?text=Square+Image"
            alt="Sample Image 2"
            aspectratio="1/1"
            objectfit="contain"
            class="w-full"
          />
        </div>
      </section>
      
      <!-- Mixed Content Section -->
      <section>
        <h2 class="text-xl font-semibold mb-4">Mixed Content</h2>
        <div class="border border-gray-200 rounded-lg p-6 space-y-4">
          <EditableText 
            id="card-title"
            content="Card Title"
            maxlength={30}
            class="text-xl font-semibold"
          />
          
          <EditableImage 
            id="card-image"
            src="https://via.placeholder.com/600x300?text=Card+Image"
            alt="Card Image"
            aspectratio="2/1"
            objectfit="cover"
            class="w-full rounded"
          />
          
          <EditableText 
            id="card-description"
            content="This is a card description. All elements are individually editable using the reactive selection system."
            maxlength={150}
            class="text-gray-600"
          />
        </div>
      </section>
    </div>
    
    <!-- Instructions -->
    <div class="mt-8 p-4 bg-gray-100 rounded">
      <h3 class="font-semibold mb-2">Features:</h3>
      <ul class="list-disc list-inside space-y-1 text-sm">
        <li>All data binding is handled through Svelte 5 runes</li>
        <li>No direct DOM manipulation - all state changes are reactive</li>
        <li>Text components have length validation</li>
        <li>Image components support click-to-upload</li>
        <li>Selection state is centrally managed</li>
        <li>CSS styling based on data attributes</li>
      </ul>
    </div>
    
    <!-- Debug Info -->
    <div class="mt-4 p-4 bg-blue-50 rounded">
      <h3 class="font-semibold mb-2">Debug Info (Reactive State):</h3>
      <pre class="text-xs overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  </div>
</div>

<!-- Selection Overlay -->
<SelectionOverlay onaction={handleOverlayAction} />

<style>
  /* Global styles for editable elements */
  :global([data-editable]) {
    position: relative;
    min-width: 50px;
  }
  
  :global([data-editable]:focus) {
    outline: none;
  }
  
  /* Section styles */
  section {
    position: relative;
  }
  
  section::before {
    content: '';
    position: absolute;
    left: -1rem;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, #3b82f6, #10b981);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  section:hover::before {
    opacity: 0.3;
  }
</style>