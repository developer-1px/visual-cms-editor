<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { textPlugin } from '$lib/plugins/reactive/TextPlugin.svelte';
  import { selectable } from '$lib/actions/selectable.svelte';
  
  interface Props {
    id?: string;
    content?: string;
    maxlength?: number;
    minlength?: number;
    placeholder?: string;
    class?: string;
  }
  
  let { 
    id = `text-${Date.now()}`,
    content = '',
    maxlength,
    minlength,
    placeholder,
    class: className = ''
  }: Props = $props();
  
  let element: HTMLElement;
  
  onMount(() => {
    if (element) {
      // Set data attributes
      if (maxlength) element.dataset.maxLength = maxlength.toString();
      if (minlength) element.dataset.minLength = minlength.toString();
      if (placeholder) element.dataset.placeholder = placeholder;
      
      // Register with plugin
      textPlugin.register(element);
    }
  });
  
  onDestroy(() => {
    if (element) {
      const elementId = element.getAttribute('data-element-id');
      if (elementId) {
        textPlugin.unregister(elementId);
      }
    }
  });
</script>

<p
  bind:this={element}
  use:selectable={{
    id,
    type: 'text',
    initialContent: content
  }}
  class="editable-text {className}"
  data-editable="text"
>
  {content}
</p>

<style>
  .editable-text {
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    min-height: 1.5em;
  }
  
  .editable-text:empty::before {
    content: attr(data-placeholder);
    color: #9ca3af;
    position: absolute;
    pointer-events: none;
  }
  
  .editable-text[data-selected="true"] {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    background-color: rgba(59, 130, 246, 0.05);
  }
  
  .editable-text[data-editing="true"] {
    outline: 3px solid #f59e0b;
    outline-offset: 2px;
    background-color: #fef3c7;
    cursor: text;
  }
  
  .editable-text:hover:not([data-selected="true"]) {
    background-color: rgba(0, 0, 0, 0.02);
  }
</style>