import { LoroDoc, LoroText } from 'loro-crdt';

export interface HistoryInfo {
	canUndo: boolean;
	canRedo: boolean;
	currentVersion: number;
	totalVersions: number;
	currentText: string;
}

export interface HistoryManager {
	canUndo(): boolean;
	canRedo(): boolean;
	undo(): void;
	redo(): void;
	startTransaction(): void;
	commitTransaction(): void;
	clear(): void;
	getHistoryInfo(elementId: string): HistoryInfo | null;
	registerElement(element: HTMLElement, initialText?: string): string;
	updateText(element: HTMLElement, newText: string): void;
	onTextChange(elementId: string, callback: (text: string) => void): void;
	getElementId(element: HTMLElement): string | undefined;
	commitPendingChanges(elementId?: string): void;
}

interface TextHistory {
	doc: LoroDoc;
	text: LoroText;
	versions: string[];
	currentIndex: number;
}

export class LoroHistoryManager implements HistoryManager {
	private textHistories: Map<string, TextHistory> = new Map();
	private elementIdMap: WeakMap<HTMLElement, string> = new WeakMap();
	private listeners: Map<string, (text: string) => void> = new Map();
	private pendingUpdates: Map<string, { text: string; timer: number }> = new Map();
	private updateDelay = 500; // 500ms delay for grouping edits

	constructor() {}

	registerElement(element: HTMLElement, initialText: string = ''): string {
		let elementId = this.elementIdMap.get(element);
		
		if (!elementId) {
			elementId = `text-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
			this.elementIdMap.set(element, elementId);
			
			const doc = new LoroDoc();
			const text = doc.getText('content');
			
			// Initialize with the initial text
			if (initialText) {
				text.insert(0, initialText);
			}
			
			// Store the initial version
			const history: TextHistory = {
				doc,
				text,
				versions: [initialText],
				currentIndex: 0
			};
			
			this.textHistories.set(elementId, history);
			
			// Subscribe to changes
			doc.subscribe(() => {
				const listener = this.listeners.get(elementId!);
				if (listener) {
					listener(text.toString());
				}
			});
		}
		
		return elementId;
	}

	updateText(element: HTMLElement, newText: string): void {
		const elementId = this.elementIdMap.get(element);
		if (!elementId) {
			console.warn('Element not registered for history tracking');
			return;
		}

		const history = this.textHistories.get(elementId);
		if (!history) return;

		const currentText = history.text.toString();
		if (currentText === newText) return;

		// Update the text immediately in Loro
		history.text.delete(0, currentText.length);
		history.text.insert(0, newText);

		// Cancel any pending history save for this element
		const pending = this.pendingUpdates.get(elementId);
		if (pending) {
			clearTimeout(pending.timer);
		}

		// Schedule history save after delay
		const timer = window.setTimeout(() => {
			// Save to history
			// Remove any versions after current index (for redo functionality)
			history.versions = history.versions.slice(0, history.currentIndex + 1);
			history.versions.push(newText);
			history.currentIndex = history.versions.length - 1;
			
			// Limit history size
			if (history.versions.length > 50) {
				history.versions.shift();
				history.currentIndex--;
			}

			// Clean up pending update
			this.pendingUpdates.delete(elementId);
		}, this.updateDelay);

		// Store pending update
		this.pendingUpdates.set(elementId, { text: newText, timer });
	}

	onTextChange(elementId: string, callback: (text: string) => void): void {
		this.listeners.set(elementId, callback);
	}

	canUndo(): boolean {
		// Check if any text has undo history
		for (const [_, history] of this.textHistories) {
			if (history.currentIndex > 0) {
				return true;
			}
		}
		return false;
	}

	canRedo(): boolean {
		// Check if any text has redo history
		for (const [_, history] of this.textHistories) {
			if (history.currentIndex < history.versions.length - 1) {
				return true;
			}
		}
		return false;
	}

	undo(): void {
		// Find the most recently edited text with undo history
		for (const [elementId, history] of this.textHistories) {
			if (history.currentIndex > 0) {
				history.currentIndex--;
				const previousText = history.versions[history.currentIndex];
				
				// Update the text without adding to history
				const currentText = history.text.toString();
				history.text.delete(0, currentText.length);
				history.text.insert(0, previousText);
				
				// Notify listeners
				const listener = this.listeners.get(elementId);
				if (listener) {
					listener(previousText);
				}
				break;
			}
		}
	}

	redo(): void {
		// Find the most recently edited text with redo history
		for (const [elementId, history] of this.textHistories) {
			if (history.currentIndex < history.versions.length - 1) {
				history.currentIndex++;
				const nextText = history.versions[history.currentIndex];
				
				// Update the text without adding to history
				const currentText = history.text.toString();
				history.text.delete(0, currentText.length);
				history.text.insert(0, nextText);
				
				// Notify listeners
				const listener = this.listeners.get(elementId);
				if (listener) {
					listener(nextText);
				}
				break;
			}
		}
	}

	startTransaction(): void {
		// Not needed for simple history implementation
	}

	commitTransaction(): void {
		// Not needed for simple history implementation
	}

	clear(): void {
		// Clear all pending updates
		for (const [_, pending] of this.pendingUpdates) {
			clearTimeout(pending.timer);
		}
		this.pendingUpdates.clear();
		
		this.textHistories.clear();
		this.listeners.clear();
		this.elementIdMap = new WeakMap();
	}

	// Force save any pending changes immediately
	commitPendingChanges(elementId?: string): void {
		if (elementId) {
			const pending = this.pendingUpdates.get(elementId);
			if (pending) {
				clearTimeout(pending.timer);
				this.pendingUpdates.delete(elementId);
				
				const history = this.textHistories.get(elementId);
				if (history) {
					history.versions = history.versions.slice(0, history.currentIndex + 1);
					history.versions.push(pending.text);
					history.currentIndex = history.versions.length - 1;
					
					if (history.versions.length > 50) {
						history.versions.shift();
						history.currentIndex--;
					}
				}
			}
		} else {
			// Commit all pending changes
			for (const [id, pending] of this.pendingUpdates) {
				clearTimeout(pending.timer);
				
				const history = this.textHistories.get(id);
				if (history) {
					history.versions = history.versions.slice(0, history.currentIndex + 1);
					history.versions.push(pending.text);
					history.currentIndex = history.versions.length - 1;
					
					if (history.versions.length > 50) {
						history.versions.shift();
						history.currentIndex--;
					}
				}
			}
			this.pendingUpdates.clear();
		}
	}

	getElementId(element: HTMLElement): string | undefined {
		return this.elementIdMap.get(element);
	}

	getHistoryInfo(elementId: string): HistoryInfo | null {
		const history = this.textHistories.get(elementId);
		if (!history) return null;
		
		return {
			canUndo: history.currentIndex > 0,
			canRedo: history.currentIndex < history.versions.length - 1,
			currentVersion: history.currentIndex + 1,
			totalVersions: history.versions.length,
			currentText: history.text.toString()
		};
	}
}

export const historyManager = new LoroHistoryManager();