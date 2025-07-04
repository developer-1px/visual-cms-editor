import { get } from 'svelte/store';
import {
  selectionState,
  elementStates,
  selectElement,
  deselectElement,
  deselectAll,
  startEditing,
  stopEditing,
  updateOverlayPosition,
  isElementSelected,
  isElementEditing,
  type ElementState
} from '$lib/stores/selection';

export class ReactiveSelectionManager {
  private keyboardHandler: ((e: KeyboardEvent) => void) | null = null;
  private clickHandler: ((e: MouseEvent) => void) | null = null;
  private elementIdCounter = 0;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Global click handler for deselection
    this.clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // If clicking outside any selectable element or overlay
      if (!target.closest('[data-editable]') && !target.closest('.selection-overlay')) {
        deselectAll();
      }
    };

    // Keyboard navigation
    this.keyboardHandler = (e: KeyboardEvent) => {
      const state = get(selectionState);
      const selectedIds = Array.from(state.selectedElements);
      
      if (selectedIds.length === 0) return;

      switch (e.key) {
        case 'Enter':
          if (!state.editingElement && selectedIds.length === 1) {
            e.preventDefault();
            this.enterEditMode(selectedIds[0]);
          }
          break;

        case 'Escape':
          e.preventDefault();
          if (state.editingElement) {
            this.exitEditMode(state.editingElement);
          } else {
            deselectAll();
          }
          break;

        case 'Tab':
          e.preventDefault();
          this.navigateNext(e.shiftKey);
          break;

        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          if (!state.editingElement) {
            e.preventDefault();
            this.navigateDirection(e.key);
          }
          break;

        case 'Delete':
        case 'Backspace':
          if (!state.editingElement && selectedIds.length > 0) {
            e.preventDefault();
            this.deleteSelected();
          }
          break;
      }

      // Copy/paste handling
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'c':
            if (!state.editingElement) {
              e.preventDefault();
              this.copySelected();
            }
            break;

          case 'v':
            if (!state.editingElement) {
              e.preventDefault();
              this.pasteContent();
            }
            break;

          case 'x':
            if (!state.editingElement) {
              e.preventDefault();
              this.cutSelected();
            }
            break;

          case 'a':
            if (!state.editingElement) {
              e.preventDefault();
              this.selectAll();
            }
            break;
        }
      }
    };

    document.addEventListener('click', this.clickHandler);
    document.addEventListener('keydown', this.keyboardHandler);
  }

  // Generate unique element IDs
  generateElementId(type: string): string {
    return `${type}-${Date.now()}-${this.elementIdCounter++}`;
  }

  // Selection methods
  select(elementId: string, type: string = 'text'): void {
    selectElement(elementId, type);
    this.updateOverlay();
  }

  selectMultiple(elementIds: string[]): void {
    elementIds.forEach(id => {
      const element = document.querySelector(`[data-element-id="${id}"]`);
      const type = element?.getAttribute('data-editable') || 'text';
      selectElement(id, type);
    });
    this.updateOverlay();
  }

  deselect(elementId?: string): void {
    if (elementId) {
      deselectElement(elementId);
    }
    this.updateOverlay();
  }

  deselectAllElements(): void {
    deselectAll();
  }

  getSelected(): string[] {
    return Array.from(get(selectionState).selectedElements);
  }

  isSelected(elementId: string): boolean {
    return isElementSelected(elementId);
  }

  // Edit mode methods
  enterEditMode(elementId: string): void {
    startEditing(elementId);
    const element = document.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement;
    if (element && element.getAttribute('data-editable') === 'text') {
      // The contenteditable will be set by the reactive subscription
      setTimeout(() => element.focus(), 0);
    }
  }

  exitEditMode(elementId: string): void {
    stopEditing(elementId);
    const element = document.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement;
    if (element) {
      element.blur();
    }
  }

  // Navigation methods
  private navigateNext(reverse: boolean = false): void {
    const allEditables = Array.from(document.querySelectorAll('[data-editable]')) as HTMLElement[];
    const selectedIds = this.getSelected();
    
    if (selectedIds.length === 0) return;

    const currentElement = document.querySelector(`[data-element-id="${selectedIds[0]}"]`);
    const currentIndex = allEditables.indexOf(currentElement as HTMLElement);

    let nextIndex = reverse ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex < 0) nextIndex = allEditables.length - 1;
    if (nextIndex >= allEditables.length) nextIndex = 0;

    const nextElement = allEditables[nextIndex];
    const nextId = nextElement.getAttribute('data-element-id');
    
    if (nextId) {
      deselectAll();
      this.select(nextId, nextElement.getAttribute('data-editable') || 'text');
    }
  }

  private navigateDirection(key: string): void {
    // Simple implementation - can be enhanced with spatial navigation
    const isBackward = key === 'ArrowUp' || key === 'ArrowLeft';
    this.navigateNext(isBackward);
  }

  private selectAll(): void {
    const allEditables = Array.from(document.querySelectorAll('[data-editable]')) as HTMLElement[];
    const ids = allEditables
      .map(el => el.getAttribute('data-element-id'))
      .filter(id => id !== null) as string[];
    
    deselectAll();
    this.selectMultiple(ids);
  }

  // Action methods
  private copySelected(): void {
    const selectedIds = this.getSelected();
    const contents = selectedIds.map(id => {
      const state = get(elementStates).get(id);
      return state?.content || '';
    }).filter(content => content);

    if (contents.length > 0) {
      navigator.clipboard.writeText(contents.join('\n'));
    }
  }

  private async pasteContent(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      const selectedIds = this.getSelected();
      
      if (text && selectedIds.length === 1) {
        const elementId = selectedIds[0];
        const element = document.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement;
        
        if (element && element.getAttribute('data-editable') === 'text') {
          element.textContent = text;
          // The content will be synced via the input event handler
        }
      }
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  }

  private cutSelected(): void {
    this.copySelected();
    this.deleteSelected();
  }

  private deleteSelected(): void {
    const selectedIds = this.getSelected();
    
    selectedIds.forEach(id => {
      const element = document.querySelector(`[data-element-id="${id}"]`) as HTMLElement;
      if (element && element.getAttribute('data-editable') === 'text') {
        element.textContent = '';
        // The content will be synced via the input event handler
      }
    });
  }

  // Overlay management
  private updateOverlay(): void {
    const selectedIds = this.getSelected();
    
    if (selectedIds.length === 0) {
      updateOverlayPosition(null);
      return;
    }

    const firstElement = document.querySelector(`[data-element-id="${selectedIds[0]}"]`);
    if (firstElement) {
      const rect = firstElement.getBoundingClientRect();
      updateOverlayPosition({
        top: rect.top - 36,
        left: rect.left,
        visible: true
      });
    }
  }

  // Cleanup
  destroy(): void {
    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler);
    }
    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler);
    }
  }
}