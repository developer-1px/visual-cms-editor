<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { imagePlugin } from '$lib/plugins/reactive/ImagePlugin.svelte';
  import { selectable } from '$lib/actions/selectable.svelte';
  
  interface Props {
    id?: string;
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    aspectratio?: string;
    objectfit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    class?: string;
  }
  
  let { 
    id = `image-${Date.now()}`,
    src,
    alt = '',
    width,
    height,
    aspectratio,
    objectfit,
    class: className = ''
  }: Props = $props();
  
  let element: HTMLImageElement;
  
  onMount(() => {
    if (element) {
      // Set data attributes
      element.dataset.originalSrc = src;
      if (width) element.dataset.width = width.toString();
      if (height) element.dataset.height = height.toString();
      if (aspectratio) element.dataset.aspectRatio = aspectratio;
      if (objectfit) element.dataset.objectFit = objectfit;
      
      // Register with plugin
      imagePlugin.register(element);
    }
  });
  
  onDestroy(() => {
    if (element) {
      const elementId = element.getAttribute('data-element-id');
      if (elementId) {
        imagePlugin.unregister(elementId);
      }
    }
  });
  
  // Apply dynamic styles
  let imageStyles = $derived.by(() => {
    const styles: string[] = [];
    if (width) styles.push(`width: var(--img-width, ${width}px)`);
    if (height) styles.push(`height: var(--img-height, ${height}px)`);
    if (aspectratio) styles.push(`aspect-ratio: var(--img-aspect-ratio, ${aspectratio})`);
    if (objectfit) styles.push(`object-fit: var(--img-object-fit, ${objectfit})`);
    return styles.join('; ');
  });
</script>

<img
  bind:this={element}
  use:selectable={{
    id,
    type: 'image'
  }}
  {src}
  {alt}
  class="editable-image {className}"
  style={imageStyles}
  data-editable="image"
/>

<style>
  .editable-image {
    cursor: pointer;
    transition: all 0.2s ease;
    display: block;
    max-width: 100%;
    height: auto;
  }
  
  .editable-image[data-selected="true"] {
    outline: 2px solid #10b981;
    outline-offset: 2px;
    filter: brightness(1.05);
  }
  
  .editable-image[data-editing="true"] {
    outline: 3px solid #f59e0b;
    outline-offset: 2px;
    opacity: 0.8;
  }
  
  .editable-image:hover:not([data-selected="true"]) {
    opacity: 0.95;
  }
</style>