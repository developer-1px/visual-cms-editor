import { selectionStore } from '$lib/stores/selection.svelte';

export interface ImagePluginState {
  elementId: string;
  src: string;
  alt: string;
  originalSrc: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  objectFit?: string;
}

export class ReactiveImagePlugin {
  private states = $state<Map<string, ImagePluginState>>(new Map());
  
  // Register an image element
  register(element: HTMLImageElement): void {
    const elementId = element.getAttribute('data-element-id') || this.generateId();
    
    // Set element ID if not exists
    if (!element.getAttribute('data-element-id')) {
      element.setAttribute('data-element-id', elementId);
    }
    
    // Initialize state
    const state: ImagePluginState = {
      elementId,
      src: element.src,
      alt: element.alt || '',
      originalSrc: element.dataset.originalSrc || element.src,
      width: element.dataset.width ? parseInt(element.dataset.width) : undefined,
      height: element.dataset.height ? parseInt(element.dataset.height) : undefined,
      aspectRatio: element.dataset.aspectRatio,
      objectFit: element.dataset.objectFit
    };
    
    this.states.set(elementId, state);
    
    // Register with selection store
    selectionStore.registerElement(elementId, {
      type: 'image',
      attributes: {
        src: state.src,
        alt: state.alt
      }
    });
    
    // Set up reactive effects
    this.setupEffects(element, elementId);
  }
  
  private setupEffects(element: HTMLImageElement, elementId: string): void {
    // React to selection state changes
    $effect(() => {
      const isSelected = selectionStore.isSelected(elementId);
      const isEditing = selectionStore.isEditing(elementId);
      
      // Update element attributes for CSS styling
      element.setAttribute('data-selected', isSelected.toString());
      element.setAttribute('data-editing', isEditing.toString());
      element.setAttribute('data-selection-type', 'image');
      
      // Show upload UI when editing
      if (isEditing) {
        this.showUploadUI(element, elementId);
      }
    });
    
    // React to state changes
    $effect(() => {
      const state = this.states.get(elementId);
      if (!state) return;
      
      // Update image attributes
      if (element.src !== state.src) {
        element.src = state.src;
      }
      if (element.alt !== state.alt) {
        element.alt = state.alt;
      }
      
      // Apply styles via CSS custom properties
      const styles: Record<string, string> = {};
      if (state.width) styles['--img-width'] = `${state.width}px`;
      if (state.height) styles['--img-height'] = `${state.height}px`;
      if (state.aspectRatio) styles['--img-aspect-ratio'] = state.aspectRatio;
      if (state.objectFit) styles['--img-object-fit'] = state.objectFit;
      
      selectionStore.updateElementStyles(elementId, styles);
    });
    
    // Handle click to select
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!selectionStore.isSelected(elementId)) {
        selectionStore.deselectAll();
        selectionStore.selectElement(elementId, 'image');
      } else if (selectionStore.isSelected(elementId) && !selectionStore.isEditing(elementId)) {
        selectionStore.startEditing(elementId);
      }
    });
  }
  
  private showUploadUI(element: HTMLImageElement, elementId: string): void {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      // Read file as data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        this.updateImage(elementId, dataUrl, file.name);
        selectionStore.stopEditing(elementId);
      };
      reader.readAsDataURL(file);
    });
    
    // Trigger file input
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }
  
  private generateId(): string {
    return `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Update image source
  updateImage(elementId: string, src: string, alt?: string): void {
    const state = this.states.get(elementId);
    if (!state) return;
    
    state.src = src;
    if (alt !== undefined) state.alt = alt;
    
    // Update selection store
    selectionStore.updateElementAttributes(elementId, {
      src: state.src,
      alt: state.alt
    });
    
    // Dispatch custom event
    const element = document.querySelector(`[data-element-id="${elementId}"]`);
    if (element) {
      element.dispatchEvent(new CustomEvent('imageChanged', {
        detail: { src: state.src, alt: state.alt }
      }));
    }
  }
  
  // Update image dimensions
  updateDimensions(elementId: string, width?: number, height?: number): void {
    const state = this.states.get(elementId);
    if (!state) return;
    
    if (width !== undefined) state.width = width;
    if (height !== undefined) state.height = height;
    
    // Trigger effect to update styles
    this.states.set(elementId, { ...state });
  }
  
  // Reset to original
  resetToOriginal(elementId: string): void {
    const state = this.states.get(elementId);
    if (!state) return;
    
    this.updateImage(elementId, state.originalSrc);
  }
  
  // Get state
  getState(elementId: string): ImagePluginState | undefined {
    return this.states.get(elementId);
  }
  
  // Clean up
  unregister(elementId: string): void {
    this.states.delete(elementId);
    selectionStore.unregisterElement(elementId);
  }
}

// Export singleton instance
export const imagePlugin = new ReactiveImagePlugin();