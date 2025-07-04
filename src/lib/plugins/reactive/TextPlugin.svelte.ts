import { selectionStore } from '$lib/stores/selection.svelte';

export interface TextPluginState {
  elementId: string;
  content: string;
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
  isEditing: boolean;
}

export class ReactiveTextPlugin {
  private states = $state<Map<string, TextPluginState>>(new Map());
  
  // Register a text element
  register(element: HTMLElement): void {
    const elementId = element.getAttribute('data-element-id') || this.generateId();
    const maxLength = element.dataset.maxLength ? parseInt(element.dataset.maxLength) : undefined;
    const minLength = element.dataset.minLength ? parseInt(element.dataset.minLength) : undefined;
    const placeholder = element.dataset.placeholder;
    
    // Set element ID if not exists
    if (!element.getAttribute('data-element-id')) {
      element.setAttribute('data-element-id', elementId);
    }
    
    // Initialize state
    this.states.set(elementId, {
      elementId,
      content: element.textContent || '',
      maxLength,
      minLength,
      placeholder,
      isEditing: false
    });
    
    // Register with selection store
    selectionStore.registerElement(elementId, {
      type: 'text',
      content: element.textContent || ''
    });
    
    // Set up reactive effects
    this.setupEffects(element, elementId);
  }
  
  private setupEffects(element: HTMLElement, elementId: string): void {
    // React to selection state changes
    $effect(() => {
      const isSelected = selectionStore.isSelected(elementId);
      const isEditing = selectionStore.isEditing(elementId);
      const state = this.states.get(elementId);
      
      if (!state) return;
      
      // Update local state
      state.isEditing = isEditing;
      
      // Update element attributes for CSS styling
      element.setAttribute('data-selected', isSelected.toString());
      element.setAttribute('data-editing', isEditing.toString());
      element.setAttribute('data-selection-type', 'text');
      
      // Handle contentEditable
      if (isEditing) {
        element.contentEditable = 'true';
        element.focus();
        this.selectAllText(element);
      } else {
        element.contentEditable = 'false';
      }
    });
    
    // Handle content changes
    element.addEventListener('input', () => {
      const state = this.states.get(elementId);
      if (!state) return;
      
      const newContent = element.textContent || '';
      
      // Validate max length
      if (state.maxLength && newContent.length > state.maxLength) {
        element.textContent = newContent.substring(0, state.maxLength);
        return;
      }
      
      // Update state
      state.content = newContent;
      selectionStore.updateElementContent(elementId, newContent);
    });
    
    // Handle blur to exit edit mode
    element.addEventListener('blur', () => {
      const state = this.states.get(elementId);
      if (state?.isEditing) {
        selectionStore.stopEditing(elementId);
      }
    });
    
    // Handle Enter key to exit edit mode
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        element.blur();
      }
    });
  }
  
  private selectAllText(element: HTMLElement): void {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
  
  private generateId(): string {
    return `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Get state for an element
  getState(elementId: string): TextPluginState | undefined {
    return this.states.get(elementId);
  }
  
  // Update content programmatically
  updateContent(elementId: string, content: string): void {
    const state = this.states.get(elementId);
    if (!state) return;
    
    // Validate constraints
    if (state.maxLength && content.length > state.maxLength) {
      content = content.substring(0, state.maxLength);
    }
    
    state.content = content;
    selectionStore.updateElementContent(elementId, content);
    
    // Update DOM if element exists
    const element = document.querySelector(`[data-element-id="${elementId}"]`);
    if (element && element.textContent !== content) {
      element.textContent = content;
    }
  }
  
  // Validate content
  validate(elementId: string): { valid: boolean; errors: string[] } {
    const state = this.states.get(elementId);
    if (!state) return { valid: false, errors: ['Element not found'] };
    
    const errors: string[] = [];
    
    if (state.minLength && state.content.length < state.minLength) {
      errors.push(`Content must be at least ${state.minLength} characters`);
    }
    
    if (state.maxLength && state.content.length > state.maxLength) {
      errors.push(`Content must be no more than ${state.maxLength} characters`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  // Clean up
  unregister(elementId: string): void {
    this.states.delete(elementId);
    selectionStore.unregisterElement(elementId);
  }
}

// Export singleton instance
export const textPlugin = new ReactiveTextPlugin();