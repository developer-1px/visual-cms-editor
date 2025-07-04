import { writable, derived, get, type Writable, type Readable } from 'svelte/store';

// Selection types
export type SelectionType = 'section' | 'repeatable' | 'text' | 'image' | 'icon' | 'link';
export type SelectionContext = 'sidebar' | 'canvas';
export type SelectionMode = 'single' | 'multiple';

// Selection item interface
export interface SelectionItem {
	id: string; // Unique identifier
	type: SelectionType;
	element: HTMLElement | number; // HTMLElement for canvas items, number (index) for sections
	context: SelectionContext;
	data?: any; // Additional data like template info for sections
}

// Style configuration for each selection type
export interface SelectionStyle {
	outline: string;
	backgroundColor: string;
	hoverOutline?: string;
	hoverBackgroundColor?: string;
	overlayColor?: string;
	color: string;
}

// Selection manager configuration
export interface SelectionConfig {
	mode: SelectionMode;
	allowCrossContext: boolean; // Allow selecting items from different contexts simultaneously
	styles: Record<SelectionType, SelectionStyle>;
}

// Default styles
const defaultStyles: Record<SelectionType, SelectionStyle> = {
	section: {
		outline: '2px solid rgb(99, 102, 241)', // indigo-500
		backgroundColor: 'rgba(99, 102, 241, 0.1)',
		overlayColor: 'rgb(79, 70, 229)', // indigo-600
		color: 'indigo'
	},
	repeatable: {
		outline: '2px solid rgb(34, 197, 94)', // green-500
		backgroundColor: 'rgba(34, 197, 94, 0.1)',
		overlayColor: 'rgb(22, 163, 74)', // green-600
		hoverOutline: '2px dashed rgb(34, 197, 94)',
		hoverBackgroundColor: 'rgba(34, 197, 94, 0.05)',
		color: 'green'
	},
	text: {
		outline: '2px solid rgb(59, 130, 246)', // blue-500
		backgroundColor: 'rgba(59, 130, 246, 0.1)',
		overlayColor: 'rgb(37, 99, 235)', // blue-600
		color: 'blue'
	},
	image: {
		outline: '2px solid rgb(251, 146, 60)', // orange-400
		backgroundColor: 'rgba(251, 146, 60, 0.1)',
		overlayColor: 'rgb(249, 115, 22)', // orange-500
		color: 'orange'
	},
	icon: {
		outline: '2px solid rgb(168, 85, 247)', // purple-500
		backgroundColor: 'rgba(168, 85, 247, 0.1)',
		overlayColor: 'rgb(147, 51, 234)', // purple-600
		color: 'purple'
	},
	link: {
		outline: '2px solid rgb(6, 182, 212)', // cyan-500
		backgroundColor: 'rgba(6, 182, 212, 0.1)',
		overlayColor: 'rgb(8, 145, 178)', // cyan-600
		color: 'cyan'
	}
};

export class SelectionManager {
	// Stores
	private items: Writable<Map<string, SelectionItem>>;
	private config: Writable<SelectionConfig>;

	// Derived stores
	public selectedItems: Readable<SelectionItem[]>;
	public selectedElements: Readable<Set<HTMLElement>>;
	public selectedSectionIndex: Readable<number | null>;
	public activeType: Readable<SelectionType | null>;
	public activeContext: Readable<SelectionContext | null>;
	public activeStyle: Readable<SelectionStyle | null>;
	public isEmpty: Readable<boolean>;
	public count: Readable<number>;

	// Event callbacks
	private onSelectionChange?: (items: SelectionItem[]) => void;
	private onStyleApply?: (element: HTMLElement, style: SelectionStyle, selected: boolean) => void;

	constructor(config?: Partial<SelectionConfig>) {
		// Initialize config
		this.config = writable({
			mode: 'single',
			allowCrossContext: false,
			styles: defaultStyles,
			...config
		});

		// Initialize items store
		this.items = writable(new Map());

		// Derived stores
		this.selectedItems = derived(this.items, ($items) => Array.from($items.values()));

		this.selectedElements = derived(this.items, ($items) => {
			const elements = new Set<HTMLElement>();
			$items.forEach((item) => {
				if (item.element instanceof HTMLElement) {
					elements.add(item.element);
				}
			});
			return elements;
		});

		this.selectedSectionIndex = derived(this.items, ($items) => {
			const sectionItem = Array.from($items.values()).find((item) => item.type === 'section');
			return sectionItem && typeof sectionItem.element === 'number' ? sectionItem.element : null;
		});

		this.activeType = derived(this.items, ($items) => {
			const types = Array.from($items.values()).map((item) => item.type);
			// Priority: section > repeatable > others
			if (types.includes('section')) return 'section';
			if (types.includes('repeatable')) return 'repeatable';
			return types[0] || null;
		});

		this.activeContext = derived(this.items, ($items) => {
			const contexts = Array.from($items.values()).map((item) => item.context);
			return contexts[0] || null;
		});

		this.activeStyle = derived([this.activeType, this.config], ([$activeType, $config]) => {
			return $activeType ? $config.styles[$activeType] : null;
		});

		this.isEmpty = derived(this.items, ($items) => $items.size === 0);
		this.count = derived(this.items, ($items) => $items.size);
	}

	// Set event callbacks
	public setCallbacks(callbacks: {
		onSelectionChange?: (items: SelectionItem[]) => void;
		onStyleApply?: (element: HTMLElement, style: SelectionStyle, selected: boolean) => void;
	}) {
		if (callbacks.onSelectionChange) this.onSelectionChange = callbacks.onSelectionChange;
		if (callbacks.onStyleApply) this.onStyleApply = callbacks.onStyleApply;
	}

	// Select an item
	public select(
		element: HTMLElement | number,
		type: SelectionType,
		context: SelectionContext,
		data?: any,
		options: { multi?: boolean; id?: string } = {}
	): string {
		const config = get(this.config);
		const items = get(this.items);

		// Generate ID
		const id = options.id || this.generateId(element, type, context);

		// Check if we need to clear existing selection
		if (!options.multi || config.mode === 'single') {
			this.clear();
		} else if (!config.allowCrossContext) {
			// Clear items from different contexts
			const currentContext = Array.from(items.values())[0]?.context;
			if (currentContext && currentContext !== context) {
				this.clear();
			}
		}

		// Create selection item
		const item: SelectionItem = { id, type, element, context, data };

		// Update store
		this.items.update((items) => {
			items.set(id, item);
			return new Map(items);
		});

		// Apply styles if element is HTMLElement
		if (element instanceof HTMLElement) {
			this.applyStyles(element, type, true);
		}

		// Trigger callback
		this.onSelectionChange?.(get(this.selectedItems));

		return id;
	}

	// Deselect an item
	public deselect(id: string): boolean {
		const items = get(this.items);
		const item = items.get(id);

		if (!item) return false;

		// Remove styles if element is HTMLElement
		if (item.element instanceof HTMLElement) {
			this.removeStyles(item.element);
		}

		// Update store
		this.items.update((items) => {
			items.delete(id);
			return new Map(items);
		});

		// Trigger callback
		this.onSelectionChange?.(get(this.selectedItems));

		return true;
	}

	// Toggle selection
	public toggle(
		element: HTMLElement | number,
		type: SelectionType,
		context: SelectionContext,
		data?: any
	): { selected: boolean; id: string } {
		const id = this.findId(element, type, context);

		if (id) {
			this.deselect(id);
			return { selected: false, id };
		} else {
			const newId = this.select(element, type, context, data, { multi: true });
			return { selected: true, id: newId };
		}
	}

	// Clear all selections
	public clear(): void {
		const items = get(this.items);

		// Remove styles from all elements
		items.forEach((item) => {
			if (item.element instanceof HTMLElement) {
				this.removeStyles(item.element);
			}
		});

		// Clear store
		this.items.set(new Map());

		// Trigger callback
		this.onSelectionChange?.([]);
	}

	// Check if an item is selected
	public isSelected(
		element: HTMLElement | number,
		type?: SelectionType,
		context?: SelectionContext
	): boolean {
		return this.findId(element, type, context) !== null;
	}

	// Get selection by ID
	public getById(id: string): SelectionItem | null {
		return get(this.items).get(id) || null;
	}

	// Get selections by type
	public getByType(type: SelectionType): SelectionItem[] {
		return Array.from(get(this.items).values()).filter((item) => item.type === type);
	}

	// Get selections by context
	public getByContext(context: SelectionContext): SelectionItem[] {
		return Array.from(get(this.items).values()).filter((item) => item.context === context);
	}

	// Get current configuration
	public getConfig(): SelectionConfig {
		return get(this.config);
	}

	// Update configuration
	public updateConfig(config: Partial<SelectionConfig>): void {
		this.config.update((current) => ({ ...current, ...config }));
	}

	// Update styles for a specific type
	public updateStyles(type: SelectionType, styles: Partial<SelectionStyle>): void {
		this.config.update((current) => ({
			...current,
			styles: {
				...current.styles,
				[type]: { ...current.styles[type], ...styles }
			}
		}));
	}

	// Private methods
	private generateId(
		element: HTMLElement | number,
		type: SelectionType,
		context: SelectionContext
	): string {
		if (typeof element === 'number') {
			return `${context}-${type}-${element}`;
		}
		// For HTMLElements, try to use existing ID or generate one
		if (element.id) {
			return element.id;
		}
		// Generate based on element properties
		const tag = element.tagName.toLowerCase();
		const className = element.className.split(' ')[0] || 'element';
		const index = Array.from(element.parentElement?.children || []).indexOf(element);
		return `${context}-${type}-${tag}-${className}-${index}`;
	}

	private findId(
		element: HTMLElement | number,
		type?: SelectionType,
		context?: SelectionContext
	): string | null {
		const items = get(this.items);

		for (const [id, item] of items) {
			if (item.element === element) {
				if (!type || item.type === type) {
					if (!context || item.context === context) {
						return id;
					}
				}
			}
		}

		return null;
	}

	private applyStyles(element: HTMLElement, type: SelectionType, selected: boolean): void {
		const config = get(this.config);
		const style = config.styles[type];

		if (selected) {
			// Use data attributes for model-driven styling
			element.setAttribute('data-selected', 'true');
			element.setAttribute('data-selection-type', type);
		}

		// Trigger callback
		this.onStyleApply?.(element, style, selected);
	}

	private removeStyles(element: HTMLElement): void {
		// Remove data attributes
		element.removeAttribute('data-selected');
		element.removeAttribute('data-selection-type');
	}
}

// Create singleton instance
export const selectionManager = new SelectionManager();

// Export convenience functions
export const select = selectionManager.select.bind(selectionManager);
export const deselect = selectionManager.deselect.bind(selectionManager);
export const toggle = selectionManager.toggle.bind(selectionManager);
export const clearSelection = selectionManager.clear.bind(selectionManager);
export const isSelected = selectionManager.isSelected.bind(selectionManager);

// Export stores
export const selectedItems = selectionManager.selectedItems;
export const selectedElements = selectionManager.selectedElements;
export const selectedSectionIndex = selectionManager.selectedSectionIndex;
export const activeSelectionType = selectionManager.activeType;
export const activeSelectionContext = selectionManager.activeContext;
export const activeSelectionStyle = selectionManager.activeStyle;
export const isSelectionEmpty = selectionManager.isEmpty;
export const selectionCount = selectionManager.count;
