<script lang="ts">
  import { selectedItems, selectionBounds } from '$lib/core/selection'
  import { getDebugInfo, getHistory } from '$lib/core/commands'
  
  let showDebug = $state(false)
</script>

<!-- Debug Toggle -->
<button
  class="fixed bottom-4 right-4 z-50 rounded-full bg-gray-800 p-3 text-white shadow-lg hover:bg-gray-700"
  onclick={() => showDebug = !showDebug}
  title="Toggle Debug Panel"
>
  🐛
</button>

{#if showDebug}
  <div class="fixed bottom-20 right-4 z-50 w-96 max-h-[70vh] overflow-auto rounded-lg bg-gray-900 p-4 text-white shadow-xl">
    <h3 class="mb-4 text-lg font-bold">Debug Panel</h3>
    
    <!-- Selection Info -->
    <div class="mb-4">
      <h4 class="mb-2 font-semibold text-blue-400">Selection State</h4>
      <div class="space-y-1 text-sm">
        <p>Selected Items: {$selectedItems.size}</p>
        <p>Selection Bounds: {$selectionBounds.length}</p>
      </div>
    </div>
    
    <!-- Selection Bounds Details -->
    <div class="mb-4">
      <h4 class="mb-2 font-semibold text-green-400">Selection Bounds</h4>
      <div class="max-h-60 overflow-y-auto">
        {#each $selectionBounds as bounds}
          <div class="mb-2 rounded bg-gray-800 p-2 text-xs">
            <p class="font-mono">ID: {bounds.id}</p>
            <p class="font-mono">Element: {bounds.elementId}</p>
            <p class="font-mono">Type: <span class="text-yellow-400">{bounds.type}</span></p>
            <p class="font-mono">
              Rect: x:{Math.round(bounds.rect.x)}, y:{Math.round(bounds.rect.y)}, 
              w:{Math.round(bounds.rect.width)}, h:{Math.round(bounds.rect.height)}
            </p>
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Command Info -->
    <div class="mb-4">
      <h4 class="mb-2 font-semibold text-purple-400">Command Store</h4>
      <div class="space-y-1 text-sm">
        <p>History Length: {getDebugInfo().historyLength}</p>
        <p>Current Index: {getDebugInfo().currentIndex}</p>
        <p>Can Undo: {getDebugInfo().canUndo ? '✓' : '✗'}</p>
        <p>Can Redo: {getDebugInfo().canRedo ? '✓' : '✗'}</p>
      </div>
    </div>
    
    <!-- Recent Commands -->
    <div>
      <h4 class="mb-2 font-semibold text-orange-400">Recent Commands</h4>
      <div class="max-h-40 overflow-y-auto">
        {#each getHistory().slice(-5) as cmd}
          <div class="mb-1 rounded bg-gray-800 p-1 text-xs">
            <span class="font-mono">{cmd.type}</span>
            <span class="ml-2 text-gray-400">{new Date(cmd.timestamp).toLocaleTimeString()}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Custom scrollbar for debug panel */
  :global(.overflow-y-auto::-webkit-scrollbar) {
    width: 6px;
  }
  
  :global(.overflow-y-auto::-webkit-scrollbar-track) {
    background: rgba(0, 0, 0, 0.1);
  }
  
  :global(.overflow-y-auto::-webkit-scrollbar-thumb) {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  
  :global(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
    background: rgba(255, 255, 255, 0.3);
  }
</style>