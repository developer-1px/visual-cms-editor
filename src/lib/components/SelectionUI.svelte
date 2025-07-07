<script lang="ts">
  import { selectionBounds, updateSelectionBounds } from '$lib/core/selection'
  import { onMount } from 'svelte'
  
  // Force initial update on mount
  onMount(() => {
    updateSelectionBounds()
  })
</script>

<!-- Selection UI Container -->
<div class="selection-ui pointer-events-none absolute inset-0 z-20">
  {#each $selectionBounds as bounds (bounds.id)}
    <div
      class="selection-box absolute"
      data-selection-id={bounds.id}
      data-element-id={bounds.elementId}
      style="
        left: {bounds.rect.x}px;
        top: {bounds.rect.y}px;
        width: {bounds.rect.width}px;
        height: {bounds.rect.height}px;
        outline: {bounds.style.outline.replace('2px', '3px')};
        outline-offset: 2px;
      "
    >
      
      <!-- Type badge -->
      <div class="type-badge" style="background-color: {bounds.style.overlayColor}">
        {#if bounds.type === 'text'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
          </svg>
        {:else if bounds.type === 'image'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        {:else if bounds.type === 'icon'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
        {:else if bounds.type === 'link'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        {:else if bounds.type === 'repeatable'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M17 1l4 4-4 4"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <path d="m7 23-4-4 4-4"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
        {:else}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="3"/>
          </svg>
        {/if}
      </div>
      
      <!-- Selection glow effect -->
      <div class="selection-glow" style="box-shadow: 0 0 0 2px {bounds.style.overlayColor}40"></div>
      
      <!-- Debug info -->
      {#if import.meta.env.DEV}
        <div class="debug-info">
          <span>ID: {bounds.id}</span>
          <span>Type: {bounds.type}</span>
          <span>Pos: {Math.round(bounds.rect.x)}, {Math.round(bounds.rect.y)}</span>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .selection-ui {
    /* Ensure this layer doesn't block interactions */
    pointer-events: none;
  }
  
  .selection-box {
    /* Animate selection appearance */
    animation: fadeIn 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
  }
  
  
  .type-badge {
    position: absolute;
    top: -26px;
    left: -1px;
    padding: 4px 6px;
    color: white;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    pointer-events: none;
    user-select: none;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 20px;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .selection-glow {
    position: absolute;
    inset: -4px;
    border-radius: 3px;
    pointer-events: none;
    opacity: 0.3;
    animation: glow 2s ease-in-out infinite alternate;
  }
  
  /* Debug info */
  .debug-info {
    position: absolute;
    top: -20px;
    left: 0;
    font-size: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 2px 4px;
    border-radius: 2px;
    white-space: nowrap;
    display: flex;
    gap: 8px;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
  
  @keyframes glow {
    from {
      opacity: 0.2;
    }
    to {
      opacity: 0.4;
    }
  }
</style>