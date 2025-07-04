export interface EditableElement {
  element: HTMLElement;
  type: string;
  defaultValue: any;
  constraints?: Record<string, any>;
}

export interface EditablePluginConfig {
  type: string;
  name: string;
  description: string;
  defaultConstraints?: Record<string, any>;
}

export interface EditableAction {
  id: string;
  label: string;
  icon?: string;
  handler: (element: HTMLElement, data?: any) => void | Promise<void>;
  isAvailable?: (element: HTMLElement) => boolean;
  isDestructive?: boolean;
}

export interface EditablePlugin {
  config: EditablePluginConfig;
  
  // Lifecycle methods
  init?(element: HTMLElement): void | Promise<void>;
  destroy?(element: HTMLElement): void;
  
  // Event handlers
  onClick?(element: HTMLElement, event: MouseEvent): void | Promise<void>;
  onDoubleClick?(element: HTMLElement, event: MouseEvent): void | Promise<void>;
  onKeydown?(element: HTMLElement, event: KeyboardEvent): void;
  
  // Content management
  getValue?(element: HTMLElement): any;
  setValue?(element: HTMLElement, value: any): void | Promise<void>;
  isEmpty?(element: HTMLElement): boolean;
  clear?(element: HTMLElement): void;
  
  // Validation
  validate?(element: HTMLElement, value: any): { valid: boolean; message?: string };
  
  // UI actions
  getActions?(element: HTMLElement): EditableAction[];
  
  // Visual feedback
  applyStyles?(element: HTMLElement, selected: boolean): void;
  removeStyles?(element: HTMLElement): void;
}

export interface EditablePluginRegistry {
  register(plugin: EditablePlugin): void;
  unregister(type: string): void;
  get(type: string): EditablePlugin | undefined;
  getAll(): Map<string, EditablePlugin>;
  hasType(type: string): boolean;
}