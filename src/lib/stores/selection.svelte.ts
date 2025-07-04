// Svelte 5 Rune-based Selection State Management

export interface SelectionState {
  selectedElements: string[]; // Using element IDs instead of direct references
  editingElement: string | null;
  selectionType: Record<string, string>; // elementId -> type
  overlayPosition: { top: number; left: number; visible: boolean } | null;
}

export interface ElementState {
  id: string;
  selected: boolean;
  editing: boolean;
  type: string;
  attributes: Record<string, string>;
  styles: Record<string, string>;
  content?: string;
}

// Create reactive state class using runes
class SelectionStore {
  // Main selection state using $state rune
  private state = $state<SelectionState>({
    selectedElements: [],
    editingElement: null,
    selectionType: {},
    overlayPosition: null
  });

  // Element states registry
  private elements = $state<Record<string, ElementState>>({});

  // Derived states using $derived rune
  selectedElements = $derived(this.state.selectedElements);
  isAnySelected = $derived(this.state.selectedElements.length > 0);
  editingElement = $derived(this.state.editingElement);
  overlayPosition = $derived(this.state.overlayPosition);

  // Selection methods
  selectElement(elementId: string, type: string = 'text'): void {
    console.log('Selecting element:', elementId, type);
    if (!this.state.selectedElements.includes(elementId)) {
      this.state.selectedElements.push(elementId);
    }
    this.state.selectionType[elementId] = type;
    this.updateElementState(elementId, { selected: true, type });
    console.log('Selection state:', this.state);
  }

  deselectElement(elementId: string): void {
    console.log('Deselecting element:', elementId);
    this.state.selectedElements = this.state.selectedElements.filter(id => id !== elementId);
    delete this.state.selectionType[elementId];
    if (this.state.editingElement === elementId) {
      this.state.editingElement = null;
    }
    this.updateElementState(elementId, { selected: false, editing: false });
  }

  deselectAll(): void {
    console.log('Deselecting all');
    const selectedIds = [...this.state.selectedElements];
    
    this.state.selectedElements = [];
    this.state.editingElement = null;
    this.state.selectionType = {};
    this.state.overlayPosition = null;
    
    // Update all element states
    selectedIds.forEach(id => {
      this.updateElementState(id, { selected: false, editing: false });
    });
  }

  toggleSelection(elementId: string, type: string = 'text'): void {
    if (this.isSelected(elementId)) {
      this.deselectElement(elementId);
    } else {
      this.selectElement(elementId, type);
    }
  }

  startEditing(elementId: string): void {
    this.state.editingElement = elementId;
    this.updateElementState(elementId, { editing: true });
  }

  stopEditing(elementId: string): void {
    if (this.state.editingElement === elementId) {
      this.state.editingElement = null;
    }
    this.updateElementState(elementId, { editing: false });
  }

  updateOverlayPosition(position: { top: number; left: number; visible: boolean } | null): void {
    this.state.overlayPosition = position;
  }

  // Element state management
  registerElement(elementId: string, initialState: Partial<ElementState>): void {
    console.log('Registering element:', elementId, initialState);
    this.elements[elementId] = {
      id: elementId,
      selected: false,
      editing: false,
      type: 'text',
      attributes: {},
      styles: {},
      ...initialState
    };
  }

  unregisterElement(elementId: string): void {
    delete this.elements[elementId];
    this.deselectElement(elementId);
  }

  updateElementState(elementId: string, updates: Partial<ElementState>): void {
    const current = this.elements[elementId];
    if (current) {
      console.log('Updating element state:', elementId, updates);
      this.elements[elementId] = { ...current, ...updates };
    }
  }

  updateElementContent(elementId: string, content: string): void {
    this.updateElementState(elementId, { content });
  }

  updateElementAttributes(elementId: string, attributes: Record<string, string>): void {
    const current = this.elements[elementId];
    if (current) {
      this.elements[elementId] = {
        ...current,
        attributes: { ...current.attributes, ...attributes }
      };
    }
  }

  updateElementStyles(elementId: string, styles: Record<string, string>): void {
    const current = this.elements[elementId];
    if (current) {
      this.elements[elementId] = {
        ...current,
        styles: { ...current.styles, ...styles }
      };
    }
  }

  // Get element state by ID
  getElementState(elementId: string): ElementState | undefined {
    return this.elements[elementId];
  }

  // Check if element is selected
  isSelected(elementId: string): boolean {
    return this.state.selectedElements.includes(elementId);
  }

  // Check if element is being edited
  isEditing(elementId: string): boolean {
    return this.state.editingElement === elementId;
  }

  // Get all element states
  getAllElementStates(): Record<string, ElementState> {
    return this.elements;
  }
}

// Export singleton instance
export const selectionStore = new SelectionStore();