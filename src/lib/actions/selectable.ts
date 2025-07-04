import { get } from 'svelte/store';
import {
  registerElement,
  unregisterElement,
  selectElement,
  deselectElement,
  deselectAll,
  startEditing,
  elementStates,
  selectionState,
  updateElementContent,
  isElementSelected
} from '$lib/stores/selection';

export interface SelectableOptions {
  id: string;
  type: string;
  initialContent?: string;
  onEdit?: (element: HTMLElement) => void;
  onSelect?: (element: HTMLElement) => void;
  onDeselect?: (element: HTMLElement) => void;
}

export function selectable(node: HTMLElement, options: SelectableOptions) {
  const { id, type, initialContent, onEdit, onSelect, onDeselect } = options;
  
  // Register element in store
  registerElement(id, {
    type,
    content: initialContent || node.textContent || ''
  });
  
  // Set initial data attributes for CSS styling
  node.setAttribute('data-element-id', id);
  node.setAttribute('data-editable', type);
  
  // Handle click events
  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    
    const isShift = e.shiftKey;
    const isCtrlCmd = e.ctrlKey || e.metaKey;
    
    if (isShift || isCtrlCmd) {
      // Multi-select
      if (isElementSelected(id)) {
        deselectElement(id);
        onDeselect?.(node);
      } else {
        selectElement(id, type);
        onSelect?.(node);
      }
    } else {
      // Single select
      const state = get(selectionState);
      if (state.selectedElements.size > 0 && !isElementSelected(id)) {
        deselectAll();
      }
      selectElement(id, type);
      onSelect?.(node);
    }
  }
  
  // Handle double-click for editing
  function handleDoubleClick(e: MouseEvent) {
    e.stopPropagation();
    if (isElementSelected(id)) {
      startEditing(id);
      onEdit?.(node);
    }
  }
  
  // Handle content changes
  function handleInput() {
    if (node.contentEditable === 'true') {
      updateElementContent(id, node.textContent || '');
    }
  }
  
  // Subscribe to state changes
  const unsubscribe = elementStates.subscribe(states => {
    const state = states.get(id);
    if (!state) return;
    
    // Update data attributes based on state
    node.setAttribute('data-selected', state.selected.toString());
    node.setAttribute('data-editing', state.editing.toString());
    node.setAttribute('data-selection-type', state.type);
    
    // Apply attributes from state
    Object.entries(state.attributes).forEach(([key, value]) => {
      node.setAttribute(key, value);
    });
    
    // Apply styles from state
    Object.entries(state.styles).forEach(([key, value]) => {
      node.style.setProperty(key, value);
    });
    
    // Update content if changed externally
    if (state.content !== undefined && node.textContent !== state.content && !state.editing) {
      node.textContent = state.content;
    }
    
    // Handle contentEditable
    if (state.editing && type === 'text') {
      node.contentEditable = 'true';
      node.focus();
    } else {
      node.contentEditable = 'false';
    }
  });
  
  // Add event listeners
  node.addEventListener('click', handleClick);
  node.addEventListener('dblclick', handleDoubleClick);
  node.addEventListener('input', handleInput);
  
  return {
    update(newOptions: SelectableOptions) {
      // Update options if needed
      if (newOptions.id !== id) {
        unregisterElement(id);
        registerElement(newOptions.id, {
          type: newOptions.type,
          content: newOptions.initialContent || node.textContent || ''
        });
      }
    },
    
    destroy() {
      // Clean up
      unsubscribe();
      node.removeEventListener('click', handleClick);
      node.removeEventListener('dblclick', handleDoubleClick);
      node.removeEventListener('input', handleInput);
      unregisterElement(id);
    }
  };
}