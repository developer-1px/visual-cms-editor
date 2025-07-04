import type { EditablePlugin, EditableAction } from '../interfaces';

export const textPlugin: EditablePlugin = {
  config: {
    type: 'text',
    name: 'Text Editor',
    description: 'Editable text content with rich text support',
    defaultConstraints: {
      maxLength: 1000,
      minLength: 0,
      allowHTML: false
    }
  },

  init(element: HTMLElement): void {
    // Add text-specific initialization
    element.setAttribute('data-text-plugin', 'true');
  },

  destroy(element: HTMLElement): void {
    element.removeAttribute('data-text-plugin');
    element.removeAttribute('contenteditable');
  },

  onClick(element: HTMLElement, event: MouseEvent): void {
    // Handle text element click
    console.log('Text element clicked:', element);
  },

  onDoubleClick(element: HTMLElement, event: MouseEvent): void {
    // Start editing on double click
    this.startEdit(element);
  },

  onKeydown(element: HTMLElement, event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.stopEdit(element);
    } else if (event.key === 'Escape') {
      this.stopEdit(element);
    }
  },

  getValue(element: HTMLElement): string {
    return element.textContent || '';
  },

  setValue(element: HTMLElement, value: string): void {
    element.textContent = value;
  },

  isEmpty(element: HTMLElement): boolean {
    return !element.textContent?.trim();
  },

  clear(element: HTMLElement): void {
    element.textContent = '';
  },

  validate(element: HTMLElement, value: string): { valid: boolean; message?: string } {
    const constraints = this.getConstraints(element);
    
    if (constraints.maxLength && value.length > constraints.maxLength) {
      return {
        valid: false,
        message: `Text exceeds maximum length of ${constraints.maxLength} characters`
      };
    }
    
    if (constraints.minLength && value.length < constraints.minLength) {
      return {
        valid: false,
        message: `Text must be at least ${constraints.minLength} characters`
      };
    }
    
    return { valid: true };
  },

  getActions(element: HTMLElement): EditableAction[] {
    return [
      {
        id: 'edit',
        label: 'Edit Text',
        icon: 'edit',
        handler: () => this.startEdit(element)
      },
      {
        id: 'clear',
        label: 'Clear Text',
        icon: 'trash',
        handler: () => this.clear(element),
        isDestructive: true,
        isAvailable: () => !this.isEmpty(element)
      }
    ];
  },

  applyStyles(element: HTMLElement, selected: boolean): void {
    if (selected) {
      element.style.outline = '2px solid rgb(59, 130, 246)';
      element.style.outlineOffset = '2px';
      element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    }
  },

  removeStyles(element: HTMLElement): void {
    element.style.outline = '';
    element.style.outlineOffset = '';
    element.style.backgroundColor = '';
    element.removeAttribute('contenteditable');
  },

  // Private methods
  startEdit(element: HTMLElement): void {
    element.contentEditable = 'true';
    element.focus();
    
    // Select all text
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    selection?.removeAllRanges();
    selection?.addRange(range);
  },

  stopEdit(element: HTMLElement): void {
    element.removeAttribute('contenteditable');
    element.blur();
  },

  getConstraints(element: HTMLElement): Record<string, any> {
    const constraintsAttr = element.getAttribute('data-constraints');
    if (constraintsAttr) {
      try {
        return JSON.parse(constraintsAttr);
      } catch {
        // Ignore invalid JSON
      }
    }
    return this.config.defaultConstraints || {};
  }
};