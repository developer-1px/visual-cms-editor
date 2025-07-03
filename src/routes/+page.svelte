<script lang="ts">
import { onMount } from 'svelte';
import { Edit2, Copy, Trash2, Type, Mouse, PenTool, Undo2, Redo2, Plus, Settings, Target, Grid3X3 } from 'lucide-svelte';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import { historyManager, type HistoryInfo } from '$lib/core/history';
import RightPanel from '$lib/components/RightPanel.svelte';
import TemplateSelector from '$lib/components/TemplateSelector.svelte';
import TemplateRenderer from '$lib/components/TemplateRenderer.svelte';
import type { Template } from '$lib/core/templates/templates';
import { defaultTemplates } from '$lib/core/templates/templates';

type Mode = 'select' | 'edit';

let selectedElements: Set<HTMLElement> = new Set();
let overlayElement: HTMLElement;
let mode: Mode = 'select';
let rightPanelOpen = false;
let canUndo = false;
let canRedo = false;
let templateSelectorOpen = false;
let selectedTemplates: Template[] = [
	defaultTemplates[0], // Hero
	defaultTemplates[2], // Features Grid
	defaultTemplates[4], // Two Column Content
	defaultTemplates[5], // Testimonial
	defaultTemplates[6], // Pricing
	defaultTemplates[3]  // CTA
];
let contentContainer: HTMLElement;

$: firstSelected = Array.from(selectedElements)[0];
$: selectedType = firstSelected?.dataset.editable || '';
$: multipleSelected = selectedElements.size > 1;
$: isEditing = mode === 'edit';

let historyInfo: HistoryInfo | null = null;
$: if (firstSelected && selectedType === 'text') {
	const elementId = historyManager.getElementId(firstSelected);
	historyInfo = elementId ? historyManager.getHistoryInfo(elementId) : null;
} else {
	historyInfo = null;
}

function handleHistoryAction(action: 'undo' | 'redo') {
	if (action === 'undo') {
		undo();
	} else {
		redo();
	}
}

function handleElementClick(e: MouseEvent) {
	const target = e.target as HTMLElement;
	const editable = target.closest('[data-editable]') as HTMLElement;

	if (editable) {
		e.stopPropagation();

		if (isEditing) {
			if (editable.dataset.editable === 'text' && editable !== firstSelected) {
				switchEditTarget(editable, e);
			}
			return;
		}

		if (e.shiftKey || e.metaKey || e.ctrlKey) {
			toggleSelection(editable);
		} else {
			if (selectedElements.has(editable) && selectedElements.size === 1) {
				startEdit(e);
			} else {
				deselectAll();
				selectElement(editable);
			}
		}
	}
}

function selectElement(element: HTMLElement) {
	selectedElements.add(element);
	if (isEditing) {
		element.style.outline = '3px solid #f59e0b';
		element.style.outlineOffset = '3px';
	} else {
		element.style.outline = '2px solid var(--color-accent)';
		element.style.outlineOffset = '2px';
	}
	
	// Update selected elements to trigger reactivity
	selectedElements = selectedElements;
	
	// Delay overlay position update to ensure DOM is ready
	requestAnimationFrame(() => {
		updateOverlayPosition();
	});
	
	if (element.dataset.editable === 'text') {
		const elementId = historyManager.registerElement(element, element.textContent || '');
		historyManager.onTextChange(elementId, (newText) => {
			if (element.textContent !== newText) {
				element.textContent = newText;
			}
		});
		updateHistoryState();
	}
}

function toggleSelection(element: HTMLElement) {
	if (selectedElements.has(element)) {
		selectedElements.delete(element);
		element.style.outline = '';
		element.style.outlineOffset = '';
	} else {
		selectElement(element);
	}
	selectedElements = selectedElements;
}

function deselectAll() {
	selectedElements.forEach(element => {
		element.style.outline = '';
		element.style.outlineOffset = '';
		// Remove contentEditable attribute completely
		if (element.hasAttribute('contenteditable')) {
			element.removeAttribute('contenteditable');
			element.removeEventListener('input', handleTextInput);
		}
	});
	selectedElements.clear();
	selectedElements = selectedElements;
	
	if (overlayElement) {
		overlayElement.style.display = 'none';
	}
}

function switchMode(newMode: Mode) {
	if (newMode === 'select' && isEditing) {
		stopEdit();
	}
	mode = newMode;
}

function startEdit(e?: MouseEvent) {
	if (!firstSelected || selectedType !== 'text') return;
	
	mode = 'edit';
	
	firstSelected.contentEditable = 'true';
	firstSelected.focus();
	
	// Position caret at click location if available
	if (e) {
		const range = document.caretRangeFromPoint(e.clientX, e.clientY);
		if (range) {
			const selection = window.getSelection();
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
	} else {
		// If no click event (e.g., Enter key), place caret at end
		const range = document.createRange();
		const selection = window.getSelection();
		range.selectNodeContents(firstSelected);
		range.collapse(false); // false = collapse to end
		selection?.removeAllRanges();
		selection?.addRange(range);
	}
	
	firstSelected.addEventListener('blur', stopEdit, { once: true });
	firstSelected.addEventListener('input', handleTextInput);
	
	if (overlayElement) {
		overlayElement.style.display = 'none';
	}
}

function stopEdit() {
	if (!firstSelected) return;
	
	// Remove contentEditable attribute completely instead of setting to 'false'
	firstSelected.removeAttribute('contenteditable');
	firstSelected.removeEventListener('input', handleTextInput);
	
	mode = 'select';
	
	// Clear selection when blur occurs
	deselectAll();
}

function handleTextInput(e: Event) {
	const element = e.target as HTMLElement;
	const elementId = historyManager.getElementId(element);
	if (elementId && element.textContent) {
		historyManager.updateText(elementId, element.textContent);
		updateHistoryState();
	}
}

function switchEditTarget(newElement: HTMLElement, e: MouseEvent) {
	if (firstSelected) {
		stopEdit();
	}
	
	deselectAll();
	selectElement(newElement);
	
	setTimeout(() => startEdit(e), 10);
}

function copySelected() {
	if (!firstSelected) return;
	
	const textToCopy = firstSelected.textContent || firstSelected.outerHTML;
	navigator.clipboard.writeText(textToCopy);
}

function deleteSelected() {
	selectedElements.forEach(element => {
		element.remove();
	});
	deselectAll();
}

function updateOverlayPosition() {
	if (!firstSelected || !overlayElement || isEditing || !contentContainer) return;

	// Wait for overlay to be rendered
	requestAnimationFrame(() => {
		if (!overlayElement || !contentContainer) return;
		
		// Get positions relative to the content container
		const containerRect = contentContainer.getBoundingClientRect();
		const elementRect = firstSelected.getBoundingClientRect();
		
		// Get overlay dimensions
		const overlayHeight = overlayElement.offsetHeight || 32; // fallback height
		
		// Calculate position relative to content container
		const relativeX = elementRect.left - containerRect.left;
		let relativeY = elementRect.top - containerRect.top - overlayHeight - 8; // 8px offset above
		
		// If overlay would be above container, position below element
		if (relativeY < 0) {
			relativeY = elementRect.bottom - containerRect.top + 8;
		}
		
		overlayElement.style.left = `${relativeX}px`;
		overlayElement.style.top = `${relativeY}px`;
		overlayElement.style.display = 'flex';
	});
}

function handleKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape') {
		if (isEditing) {
			stopEdit();
		} else {
			deselectAll();
		}
		// Clean up any stray contenteditable attributes
		cleanupContentEditable();
	} else if (e.key === 'Enter' && !isEditing && firstSelected && selectedType === 'text') {
		startEdit();
	} else if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
		e.preventDefault();
		undo();
	} else if ((e.metaKey || e.ctrlKey) && (e.key === 'Z' || (e.shiftKey && e.key === 'z'))) {
		e.preventDefault();
		redo();
	}
}

function cleanupContentEditable() {
	// Remove all contenteditable attributes from the page
	document.querySelectorAll('[contenteditable]').forEach(element => {
		(element as HTMLElement).removeAttribute('contenteditable');
	});
}

function undo() {
	if (canUndo) {
		const changedElementId = historyManager.undo();
		updateHistoryState();
		
		// Select the changed element
		if (changedElementId) {
			const element = historyManager.getElementById(changedElementId);
			if (element) {
				deselectAll();
				selectElement(element);
				// Flash effect to show what changed
				element.animate([
					{ backgroundColor: 'rgba(59, 130, 246, 0.3)' },
					{ backgroundColor: 'transparent' }
				], {
					duration: 600,
					easing: 'ease-out'
				});
			}
		}
	}
}

function redo() {
	if (canRedo) {
		const changedElementId = historyManager.redo();
		updateHistoryState();
		
		// Select the changed element
		if (changedElementId) {
			const element = historyManager.getElementById(changedElementId);
			if (element) {
				deselectAll();
				selectElement(element);
				// Flash effect to show what changed
				element.animate([
					{ backgroundColor: 'rgba(59, 130, 246, 0.3)' },
					{ backgroundColor: 'transparent' }
				], {
					duration: 600,
					easing: 'ease-out'
				});
			}
		}
	}
}

function updateHistoryState() {
	canUndo = historyManager.canUndo();
	canRedo = historyManager.canRedo();
}

function removeTemplate(index: number) {
	selectedTemplates = selectedTemplates.filter((_, i) => i !== index);
}

function handleSelectTemplate(template: Template) {
	selectedTemplates = [...selectedTemplates, template];
	templateSelectorOpen = false;
}

function handleDoubleClick(e: MouseEvent) {
	const target = e.target as HTMLElement;
	const editable = target.closest('[data-editable]') as HTMLElement;
	
	if (editable && editable.dataset.editable === 'text') {
		e.stopPropagation();
		if (!selectedElements.has(editable)) {
			deselectAll();
			selectElement(editable);
		}
		startEdit(e);
	}
}

onMount(() => {
	document.addEventListener('click', deselectAll);
	document.addEventListener('dblclick', handleDoubleClick);
	document.addEventListener('keydown', handleKeydown);
	
	updateHistoryState();

	return () => {
		// Clean up any remaining editable elements
		document.querySelectorAll('[contenteditable]').forEach(element => {
			(element as HTMLElement).removeAttribute('contenteditable');
		});
		
		document.removeEventListener('click', deselectAll);
		document.removeEventListener('dblclick', handleDoubleClick);
		document.removeEventListener('keydown', handleKeydown);
	};
});
</script>

<!-- Minimal Toolbar -->
<div class="fixed top-2 left-2 z-20 flex items-center gap-1 bg-white shadow-md">
	<!-- Mode Toggle -->
	<div class="flex">
		<button
			class="icon-btn {mode === 'select' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
			onclick={() => switchMode('select')}
			title="Select Mode"
		>
			<Mouse class="w-4 h-4" />
		</button>
		<button
			class="icon-btn {mode === 'edit' ? (isEditing ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white') : 'text-stone-600'}"
			onclick={() => switchMode('edit')}
			title="{isEditing ? 'Editing Text' : 'Edit Mode'}"
		>
			<Edit2 class="w-4 h-4" />
		</button>
	</div>
	
	<div class="w-px h-8 bg-stone-100"></div>
	
	<!-- History -->
	<div class="flex">
		<button
			class="icon-btn disabled:opacity-50 disabled:cursor-not-allowed"
			onclick={undo}
			disabled={!canUndo}
			title="Undo"
		>
			<Undo2 class="w-4 h-4" />
		</button>
		<button
			class="icon-btn disabled:opacity-50 disabled:cursor-not-allowed"
			onclick={redo}
			disabled={!canRedo}
			title="Redo"
		>
			<Redo2 class="w-4 h-4" />
		</button>
	</div>
	
	<div class="w-px h-8 bg-stone-100"></div>
	
	<!-- Tools -->
	<div class="flex">
		<button
			class="icon-btn"
			onclick={() => templateSelectorOpen = true}
			title="Add Template"
		>
			<Plus class="w-4 h-4" />
		</button>
		<button
			class="icon-btn {rightPanelOpen ? 'bg-blue-500 text-white' : 'text-stone-600'}"
			onclick={() => rightPanelOpen = !rightPanelOpen}
			title="Panel"
		>
			<Settings class="w-4 h-4" />
		</button>
	</div>
</div>

<!-- Main Content -->
<div class="flex h-screen">
	<div class="flex-1 overflow-auto pt-16 {rightPanelOpen ? 'mr-80' : ''}">
		<div bind:this={contentContainer} class="p-8 relative">
			<!-- Templates -->
			<div class="space-y-8">
				{#each selectedTemplates as template, index (template.id + index)}
					<div class="animate-fade-in" style="animation-delay: {index * 0.1}s">
						<TemplateRenderer
							{template}
							{handleElementClick}
							{handleTextInput}
							{stopEdit}
						/>
					</div>
				{/each}
				
				<!-- Empty State -->
				{#if selectedTemplates.length === 0}
					<div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
						<div class="w-16 h-16 border-2 border-dashed border-stone-300 flex items-center justify-center mb-4">
							<Grid3X3 class="w-8 h-8 text-stone-400" />
						</div>
						<button
							onclick={() => templateSelectorOpen = true}
							class="btn btn-primary"
						>
							<Plus class="w-4 h-4 mr-2" />
							Add Template
						</button>
					</div>
				{/if}
			</div>
			
			<!-- Selection Overlay - Inside content container -->
			{#if selectedElements.size > 0 && !isEditing}
				<div
					bind:this={overlayElement}
					class="absolute bg-stone-900 shadow-xl flex items-center gap-1 px-1 py-1 z-30 animate-fade-in floating-ui"
					style="display: none; border-radius: 8px;"
				>
					{#if selectedType === 'text'}
						<button
							class="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded transition-all"
							onclick={startEdit}
							title="Edit"
						>
							<Type class="w-4 h-4" />
						</button>
						<div class="w-px h-5 bg-white/20"></div>
					{/if}
					<button
						class="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded transition-all"
						onclick={copySelected}
						title="Copy"
					>
						<Copy class="w-4 h-4" />
					</button>
					<button
						class="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded transition-all"
						onclick={deleteSelected}
						title="Delete"
					>
						<Trash2 class="w-4 h-4" />
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Right Panel -->
<RightPanel 
	bind:isOpen={rightPanelOpen}
	selectedElement={firstSelected}
	{historyInfo}
	onHistoryAction={handleHistoryAction}
/>

<!-- Template Selector -->
<TemplateSelector 
	bind:isOpen={templateSelectorOpen}
	onSelectTemplate={handleSelectTemplate}
/>

<style>
	/* Minimal Editor Styles */
	:global([data-editable]) {
		cursor: pointer;
		transition: all var(--transition-fast);
		position: relative;
	}

	:global([data-editable]:hover) {
		outline: 1px solid var(--color-accent-light);
		outline-offset: 1px;
	}

	:global(*[contenteditable="true"]) {
		outline: 3px solid #f59e0b !important;
		outline-offset: 3px;
		background: rgba(245, 158, 11, 0.08);
		animation: editPulse 2s ease-in-out infinite;
		border-radius: 4px;
		position: relative;
	}
	
	:global(*[contenteditable="true"]::before) {
		content: '';
		position: absolute;
		top: -20px;
		left: 50%;
		transform: translateX(-50%);
		background: #f59e0b;
		color: white;
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 11px;
		font-weight: 600;
		white-space: nowrap;
		pointer-events: none;
	}
	
	/* Floating UI Arrow */
	.floating-ui::after {
		content: '';
		position: absolute;
		bottom: -6px;
		left: 20px;
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 6px solid #1c1917; /* stone-900 */
	}
</style>