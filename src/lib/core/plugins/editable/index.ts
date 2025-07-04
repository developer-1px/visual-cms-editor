// Export types and interfaces
export type * from './interfaces';

// Export registry
export { editablePluginRegistry } from './registry';

// Export built-in plugins
export { textPlugin } from './plugins/text';
export { imagePlugin } from './plugins/image';
export { iconPlugin } from './plugins/icon';

// Plugin manager class
import type { EditablePlugin, EditableElement } from './interfaces';
import { editablePluginRegistry } from './registry';
import { textPlugin } from './plugins/text';
import { imagePlugin } from './plugins/image';
import { iconPlugin } from './plugins/icon';

export class EditablePluginManager {
	private initialized = false;

	constructor() {
		this.registerBuiltInPlugins();
	}

	private registerBuiltInPlugins(): void {
		if (this.initialized) return;

		editablePluginRegistry.register(textPlugin);
		editablePluginRegistry.register(imagePlugin);
		editablePluginRegistry.register(iconPlugin);

		this.initialized = true;
		console.log(
			'[EditablePluginManager] Built-in plugins registered:',
			editablePluginRegistry.listRegistered()
		);
	}

	// Initialize element with appropriate plugin
	initElement(element: HTMLElement): void {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return;

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.init) {
			plugin.init(element);
		}
	}

	// Destroy element plugin
	destroyElement(element: HTMLElement): void {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return;

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.destroy) {
			plugin.destroy(element);
		}
	}

	// Handle element click
	handleClick(element: HTMLElement, event: MouseEvent): void {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return;

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.onClick) {
			plugin.onClick(element, event);
		}
	}

	// Handle element double click
	handleDoubleClick(element: HTMLElement, event: MouseEvent): void {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return;

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.onDoubleClick) {
			plugin.onDoubleClick(element, event);
		}
	}

	// Handle keydown
	handleKeydown(element: HTMLElement, event: KeyboardEvent): void {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return;

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.onKeydown) {
			plugin.onKeydown(element, event);
		}
	}

	// Get element value
	getValue(element: HTMLElement): any {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return null;

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.getValue) {
			return plugin.getValue(element);
		}
		return null;
	}

	// Set element value
	setValue(element: HTMLElement, value: any): void {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return;

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.setValue) {
			plugin.setValue(element, value);
		}
	}

	// Check if element is empty
	isEmpty(element: HTMLElement): boolean {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return true;

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.isEmpty) {
			return plugin.isEmpty(element);
		}
		return true;
	}

	// Clear element
	clear(element: HTMLElement): void {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return;

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.clear) {
			plugin.clear(element);
		}
	}

	// Get available actions for element
	getActions(element: HTMLElement): any[] {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return [];

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.getActions) {
			return plugin.getActions(element);
		}
		return [];
	}

	// Apply selection styles
	applyStyles(element: HTMLElement, selected: boolean): void {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return;

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.applyStyles) {
			plugin.applyStyles(element, selected);
		}
	}

	// Remove selection styles
	removeStyles(element: HTMLElement): void {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return;

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.removeStyles) {
			plugin.removeStyles(element);
		}
	}

	// Validate element value
	validate(element: HTMLElement, value: any): { valid: boolean; message?: string } {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return { valid: true };

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.validate) {
			return plugin.validate(element, value);
		}
		return { valid: true };
	}

	// Get registered plugin types
	getRegisteredTypes(): string[] {
		return editablePluginRegistry.listRegistered();
	}

	// Check if type is supported
	isTypeSupported(type: string): boolean {
		return editablePluginRegistry.hasType(type);
	}

	// Handle action execution
	handleAction(element: HTMLElement, actionId: string): void {
		const editableType = element.getAttribute('data-editable');
		if (!editableType) return;

		const plugin = editablePluginRegistry.get(editableType);
		if (plugin && plugin.getActions) {
			const actions = plugin.getActions(element);
			const action = actions.find((a) => a.id === actionId);
			if (action && action.handler) {
				action.handler();
			}
		}
	}
}

// Singleton instance
export const editablePluginManager = new EditablePluginManager();
