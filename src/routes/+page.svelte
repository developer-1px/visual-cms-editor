<script lang="ts">
import { onMount } from 'svelte';
import { Edit2, Copy, Trash2, Type, Mouse, Undo2, Redo2, Settings, Grid3X3, Smartphone, Tablet, Monitor, Expand, Plus } from 'lucide-svelte';
import { historyManager, type HistoryInfo } from '$lib/core/history';
import RightPanel from '$lib/components/RightPanel.svelte';
import LeftSidebar from '$lib/components/LeftSidebar.svelte';
import TemplateSelector from '$lib/components/TemplateSelector.svelte';
import TemplateRenderer from '$lib/components/TemplateRenderer.svelte';
import MockHeader from '$lib/components/MockHeader.svelte';
import MockFooter from '$lib/components/MockFooter.svelte';
import SelectionOverlay from '$lib/components/SelectionOverlay.svelte';
import type { Template } from '$lib/core/templates/types';
import { defaultTemplates } from '$lib/core/templates/templates';
import { 
	selectionManager,
	selectedItems,
	selectedElements,
	selectedSectionIndex,
	activeSelectionType,
	activeSelectionStyle,
	selectionCount,
	isSelectionEmpty,
	type SelectionType
} from '$lib/core/selection/SelectionManager';

type Mode = 'select' | 'edit';

let mode: Mode = 'select';
let rightPanelOpen = false;
let leftSidebarOpen = true;
let canUndo = false;
let canRedo = false;
let templateSelectorOpen = false;
let copiedElement: HTMLElement | null = null;
let selectedTemplates: Template[] = [
	defaultTemplates[0], // Hero
	defaultTemplates[2], // Features Grid
	defaultTemplates[4], // Two Column Content
	defaultTemplates[5], // Testimonial
	defaultTemplates[6], // Pricing
	defaultTemplates[3]  // CTA
];
let contentContainer: HTMLElement;
let devicePreview: 'mobile' | 'tablet' | 'desktop' | 'full' = 'full';

$: firstSelected = Array.from($selectedElements)[0];
$: selectedType = firstSelected?.dataset.editable || (firstSelected?.dataset.repeatable ? 'repeatable' : '');
$: multipleSelected = $selectedElements.size > 1;
$: isEditing = mode === 'edit';
$: currentSelectionStyles = $activeSelectionStyle;

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
	const repeatable = target.closest('[data-repeatable]') as HTMLElement;

	// Handle repeatable elements first
	if (repeatable && !editable) {
		e.stopPropagation();
		
		if (e.shiftKey || e.metaKey || e.ctrlKey) {
			toggleSelection(repeatable);
		} else {
			deselectAll();
			selectElement(repeatable, false);
		}
		return;
	}

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
			if ($selectedElements.has(editable) && $selectedElements.size === 1) {
				startEdit(e);
			} else {
				deselectAll();
				selectElement(editable, false);
			}
		}
	}
}

function selectElement(element: HTMLElement, multi = false) {
	// Determine selection type
	let type: SelectionType = 'text';
	if (element.hasAttribute('data-repeatable')) {
		type = 'repeatable';
	} else if (element.dataset.editable) {
		type = element.dataset.editable as SelectionType;
	}
	
	// Use the unified selection manager
	selectionManager.select(element, type, 'canvas', undefined, { multi });
	
	// Apply edit mode visual styles if needed
	if (isEditing) {
		element.style.outline = '3px solid #f59e0b';
		element.style.outlineOffset = '3px';
	}
	
	// Overlay position is now handled by the SelectionOverlay component
	
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
	// Determine selection type
	let type: SelectionType = 'text';
	if (element.hasAttribute('data-repeatable')) {
		type = 'repeatable';
	} else if (element.dataset.editable) {
		type = element.dataset.editable as SelectionType;
	}
	
	// Use the unified selection manager's toggle method
	selectionManager.toggle(element, type, 'canvas');
	
	// Overlay position is now handled by the SelectionOverlay component
}

function deselectAll() {
	// Clear visual styles from all selected elements
	$selectedElements.forEach(element => {
		// Remove contentEditable attribute completely
		if (element.hasAttribute('contenteditable')) {
			element.removeAttribute('contenteditable');
			element.removeEventListener('input', handleTextInput);
		}
	});
	
	// Use the unified selection manager to clear
	selectionManager.clear();
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
	$selectedElements.forEach(element => {
		element.remove();
	});
	deselectAll();
}

function copySelectedRepeatable() {
	// Find the first selected repeatable element
	const selectedRepeatable = Array.from($selectedElements).find(el => el.hasAttribute('data-repeatable'));
	
	if (selectedRepeatable) {
		copiedElement = selectedRepeatable.cloneNode(true) as HTMLElement;
		
		// Visual feedback
		selectedRepeatable.animate([
			{ transform: 'scale(1)', opacity: 1 },
			{ transform: 'scale(1.05)', opacity: 0.8 },
			{ transform: 'scale(1)', opacity: 1 }
		], {
			duration: 300,
			easing: 'ease-out'
		});
	}
}

function cutSelectedRepeatable() {
	// Find the first selected repeatable element
	const selectedRepeatable = Array.from($selectedElements).find(el => el.hasAttribute('data-repeatable'));
	
	if (selectedRepeatable) {
		// First copy the element
		copiedElement = selectedRepeatable.cloneNode(true) as HTMLElement;
		
		// Save state for undo
		if (contentContainer) {
			historyManager.saveStructuralState(contentContainer);
		}
		
		// Animate and delete
		selectedRepeatable.animate([
			{ transform: 'scale(1)', opacity: 1 },
			{ transform: 'scale(0.95)', opacity: 0.5 }
		], {
			duration: 200,
			easing: 'ease-out'
		}).onfinish = () => {
			selectedRepeatable.remove();
			updateHistoryState();
		};
		
		// Clear selection
		deselectAll();
	}
}

function hydrateNewElement(element: HTMLElement) {
	// Add event listeners to the new element and its children
	if (element.hasAttribute('data-repeatable')) {
		element.addEventListener('click', handleElementClick);
	}
	
	// Add event listeners to all editable elements within the new element
	const editableElements = element.querySelectorAll('[data-editable]');
	editableElements.forEach((editableEl) => {
		const htmlElement = editableEl as HTMLElement;
		htmlElement.addEventListener('click', handleElementClick);
	});
	
	// Add event listeners to all repeatable elements within the new element
	const repeatableElements = element.querySelectorAll('[data-repeatable]');
	repeatableElements.forEach((repeatableEl) => {
		const htmlElement = repeatableEl as HTMLElement;
		htmlElement.addEventListener('click', handleElementClick);
	});
}

function hydrateAllElements() {
	if (!contentContainer) return;
	
	// Remove existing event listeners to avoid duplicates
	const allClickableElements = contentContainer.querySelectorAll('[data-editable], [data-repeatable]');
	allClickableElements.forEach((element) => {
		const htmlElement = element as HTMLElement;
		htmlElement.removeEventListener('click', handleElementClick);
	});
	
	// Re-add event listeners to all elements
	allClickableElements.forEach((element) => {
		const htmlElement = element as HTMLElement;
		htmlElement.addEventListener('click', handleElementClick);
	});
}

function pasteRepeatable() {
	if (!copiedElement) return;
	
	// Find the selected repeatable element to determine where to paste
	const selectedRepeatable = Array.from($selectedElements).find(el => el.hasAttribute('data-repeatable'));
	
	if (selectedRepeatable && selectedRepeatable.parentElement) {
		// Save state for undo
		if (contentContainer) {
			historyManager.saveStructuralState(contentContainer);
		}
		
		// Clone the copied element
		const newElement = copiedElement.cloneNode(true) as HTMLElement;
		
		// Insert after the selected element
		selectedRepeatable.parentElement.insertBefore(newElement, selectedRepeatable.nextSibling);
		
		// Hydrate the new element with event listeners
		hydrateNewElement(newElement);
		
		// Update history state
		updateHistoryState();
		
		// Select the new element
		deselectAll();
		selectElement(newElement, false);
		
		// Animate the new element
		newElement.animate([
			{ transform: 'scale(0.9)', opacity: 0 },
			{ transform: 'scale(1)', opacity: 1 }
		], {
			duration: 300,
			easing: 'ease-out'
		});
	}
}

function deleteSelectedRepeatable() {
	// Filter only repeatable elements
	const repeatablesToDelete = Array.from($selectedElements).filter(el => el.hasAttribute('data-repeatable'));
	
	if (repeatablesToDelete.length > 0) {
		// Save state for undo
		if (contentContainer) {
			historyManager.saveStructuralState(contentContainer);
		}
		
		// Animate before deletion
		repeatablesToDelete.forEach((element, index) => {
			element.animate([
				{ transform: 'scale(1)', opacity: 1 },
				{ transform: 'scale(0.9)', opacity: 0 }
			], {
				duration: 200,
				easing: 'ease-out'
			}).onfinish = () => {
				element.remove();
				// Update history state after last element is deleted
				if (index === repeatablesToDelete.length - 1) {
					updateHistoryState();
				}
			};
		});
		
		// Clear selection
		deselectAll();
	}
}

function handleOverlayAction(action: string, data: any) {
	switch (action) {
		case 'edit':
			startEdit();
			break;
		case 'copy':
			if ($activeSelectionType === 'repeatable') {
				copySelectedRepeatable();
			} else {
				copySelected();
			}
			break;
		case 'cut':
			cutSelectedRepeatable();
			break;
		case 'delete':
			if ($activeSelectionType === 'repeatable') {
				deleteSelectedRepeatable();
			} else if ($activeSelectionType === 'section') {
				// Handle section deletion
				const sectionIndex = $selectedSectionIndex;
				if (sectionIndex !== null) {
					removeTemplate(sectionIndex);
				}
			} else {
				deleteSelected();
			}
			break;
		case 'moveUp':
			if ($activeSelectionType === 'section' && $selectedSectionIndex !== null && $selectedSectionIndex > 0) {
				handleReorderSections($selectedSectionIndex, $selectedSectionIndex - 1);
			}
			break;
		case 'moveDown':
			if ($activeSelectionType === 'section' && $selectedSectionIndex !== null && $selectedSectionIndex < selectedTemplates.length - 1) {
				handleReorderSections($selectedSectionIndex, $selectedSectionIndex + 1);
			}
			break;
		case 'toggleVisibility':
			if ($activeSelectionType === 'section' && $selectedSectionIndex !== null) {
				handleToggleVisibility($selectedSectionIndex);
			}
			break;
		case 'replace':
			// TODO: Implement image/icon replacement
			console.log('Replace action for', $activeSelectionType);
			break;
		case 'editLink':
			// TODO: Implement link editing
			console.log('Edit link action');
			break;
	}
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
	} else if ((e.metaKey || e.ctrlKey) && e.key === 'c' && !isEditing) {
		e.preventDefault();
		copySelectedRepeatable();
	} else if ((e.metaKey || e.ctrlKey) && e.key === 'x' && !isEditing) {
		e.preventDefault();
		cutSelectedRepeatable();
	} else if ((e.metaKey || e.ctrlKey) && e.key === 'v' && !isEditing && copiedElement) {
		e.preventDefault();
		pasteRepeatable();
	} else if (e.key === 'Delete' && !isEditing) {
		e.preventDefault();
		deleteSelectedRepeatable();
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
		
		// Re-hydrate all elements after DOM changes
		hydrateAllElements();
		
		// Select the changed element
		if (changedElementId) {
			const element = historyManager.getElementById(changedElementId);
			if (element) {
				deselectAll();
				selectElement(element, false);
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
		
		// Re-hydrate all elements after DOM changes
		hydrateAllElements();
		
		// Select the changed element
		if (changedElementId) {
			const element = historyManager.getElementById(changedElementId);
			if (element) {
				deselectAll();
				selectElement(element, false);
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

function handleSelectSection(index: number) {
	// Clear any canvas selections when selecting a section
	deselectAll();
	
	// Use the unified selection manager for section selection
	selectionManager.select(index, 'section', 'sidebar', selectedTemplates[index]);
	
	// Scroll to the selected section
	const sectionElements = contentContainer?.querySelectorAll('.template-section');
	if (sectionElements && sectionElements[index]) {
		sectionElements[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
}

function handleReorderSections(fromIndex: number, toIndex: number) {
	const newTemplates = [...selectedTemplates];
	const [removed] = newTemplates.splice(fromIndex, 1);
	newTemplates.splice(toIndex, 0, removed);
	selectedTemplates = newTemplates;
}

function handleToggleVisibility(index: number) {
	// This could be implemented to hide/show sections
	// For now, we'll just log it
	console.log('Toggle visibility for section', index);
}

function handleDoubleClick(e: MouseEvent) {
	const target = e.target as HTMLElement;
	const editable = target.closest('[data-editable]') as HTMLElement;
	
	if (editable && editable.dataset.editable === 'text') {
		e.stopPropagation();
		if (!$selectedElements.has(editable)) {
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
	
	// Wait for content container to be ready and save initial state
	setTimeout(() => {
		if (contentContainer) {
			historyManager.saveStructuralState(contentContainer);
		}
	}, 100);

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

<!-- Top Bar -->
<div class="fixed top-0 left-0 right-0 h-12 bg-white border-b border-stone-200 z-30 flex items-center px-2">
	<!-- Left Section -->
	<div class="flex items-center gap-2">
		<!-- Toggle Left Sidebar -->
		<button
			class="icon-btn {leftSidebarOpen ? 'bg-stone-200' : ''}"
			onclick={() => leftSidebarOpen = !leftSidebarOpen}
			title="{leftSidebarOpen ? 'Hide' : 'Show'} sections"
		>
			<svg class="w-4 h-4 text-stone-600 transition-transform {leftSidebarOpen ? '' : 'rotate-180'}" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path d="M15 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
	</div>

	<!-- Center Section - All Controls -->
	<div class="flex-1 flex justify-center" style="margin-left: {leftSidebarOpen ? '140px' : '0'}; margin-right: {rightPanelOpen ? '304px' : '0'}; transition: margin 300ms;">
		<div class="flex items-center gap-2">
			<!-- Mode Toggle Group -->
			<div class="flex items-center gap-0.5 p-0.5 bg-stone-100 rounded">
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
			
			<!-- Selection Indicator -->
			{#if !$isSelectionEmpty && $activeSelectionType}
				<div class="flex items-center gap-2 px-3 py-1 text-sm {$activeSelectionType === 'repeatable' ? 'bg-green-200 text-green-800' : 'bg-stone-200 text-stone-700'} rounded">
					<span class="font-medium">Selection:</span>
					<span class="capitalize">
						{$activeSelectionType}
						{#if $selectionCount > 1}
							({$selectionCount})
						{/if}
					</span>
				</div>
			{/if}
			
			<!-- History Group -->
			<div class="flex items-center gap-0.5 p-0.5 bg-stone-100 rounded">
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
			
			<!-- Device Preview Group -->
			<div class="flex items-center gap-0.5 p-0.5 bg-stone-100 rounded">
				<button
					class="icon-btn {devicePreview === 'mobile' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
					onclick={() => devicePreview = 'mobile'}
					title="Mobile Preview (375px)"
				>
					<Smartphone class="w-4 h-4" />
				</button>
				<button
					class="icon-btn {devicePreview === 'tablet' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
					onclick={() => devicePreview = 'tablet'}
					title="Tablet Preview (768px)"
				>
					<Tablet class="w-4 h-4" />
				</button>
				<button
					class="icon-btn {devicePreview === 'desktop' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
					onclick={() => devicePreview = 'desktop'}
					title="Desktop Preview (1280px)"
				>
					<Monitor class="w-4 h-4" />
				</button>
				<button
					class="icon-btn {devicePreview === 'full' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
					onclick={() => devicePreview = 'full'}
					title="Full Width"
				>
					<Expand class="w-4 h-4" />
				</button>
			</div>
		</div>
	</div>
	
	<!-- Right Section -->
	<div class="flex items-center gap-2 absolute right-2">
		<!-- Settings Button -->
		<button
			class="icon-btn {rightPanelOpen ? 'bg-stone-200' : ''}"
			onclick={() => rightPanelOpen = !rightPanelOpen}
			title="Settings"
		>
			<Settings class="w-4 h-4" />
		</button>
	</div>
</div>

<!-- Left Sidebar -->
<LeftSidebar 
	bind:isOpen={leftSidebarOpen}
	templates={selectedTemplates}
	onSelectSection={handleSelectSection}
	onReorderSections={handleReorderSections}
	onToggleVisibility={handleToggleVisibility}
	onAddSection={() => templateSelectorOpen = true}
/>

<!-- Main Content -->
<div class="flex h-screen pt-12">
	<div class="flex-1 overflow-auto {rightPanelOpen ? 'mr-80' : ''} {leftSidebarOpen ? 'ml-40' : 'ml-0'} transition-all duration-300 bg-stone-100">
		<div class="flex justify-center {devicePreview === 'full' ? 'p-0' : 'p-8'}">
			<div 
				bind:this={contentContainer} 
				class="relative bg-white transition-all duration-300 {devicePreview === 'full' ? 'w-full' : 'shadow-lg'} {devicePreview === 'mobile' ? 'max-w-[375px]' : devicePreview === 'tablet' ? 'max-w-[768px]' : devicePreview === 'desktop' ? 'max-w-[1280px]' : 'max-w-full'}"
				style="width: 100%;"
			>
				<!-- Mock Header -->
				<MockHeader {devicePreview} />
				
				<div class="p-8">
					<!-- Templates -->
					<div class="space-y-8">
				{#each selectedTemplates as template, index (template.id + index)}
					<div class="template-section animate-fade-in {$selectedSectionIndex === index ? 'ring-2 ring-blue-500 ring-offset-4' : ''}" style="animation-delay: {index * 0.1}s">
						<TemplateRenderer
							{template}
							{handleElementClick}
							handleTextInput={(element) => {
								// This prop is not used in current implementation
							}}
							stopEdit={() => {
								// This prop is not used in current implementation
							}}
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
				
				<!-- Mock Footer -->
				<MockFooter {devicePreview} />
					
					<!-- Unified Selection Overlay -->
					<SelectionOverlay 
						container={contentContainer}
						onAction={handleOverlayAction}
					/>
				</div>
			</div>
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
	
	:global([data-repeatable]) {
		cursor: pointer;
		transition: all var(--transition-fast);
		position: relative;
	}
	
	:global([data-repeatable]:hover) {
		outline: 2px dashed #22c55e;
		outline-offset: 4px;
		background-color: rgba(34, 197, 94, 0.05);
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
	
</style>