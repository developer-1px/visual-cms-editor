<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Edit2,
		Mouse,
		Undo2,
		Redo2,
		Settings,
		Grid3X3,
		Smartphone,
		Tablet,
		Monitor,
		Expand,
		Plus
	} from 'lucide-svelte';
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
		selectedElements,
		selectedSectionIndex,
		activeSelectionType,
		activeSelectionStyle,
		selectionCount,
		isSelectionEmpty,
		type SelectionType
	} from '$lib/core/selection/SelectionManager';
	import { editablePluginManager } from '$lib/core/plugins/editable';
	import { selectionActionManager, initializeActionHandlers } from '$lib/core/actions';

	type Mode = 'select' | 'edit';

	let mode: Mode = 'select';
	let rightPanelOpen = true;
	let leftSidebarOpen = true;
	let canUndo = false;
	let canRedo = false;
	let templateSelectorOpen = false;
	let selectedTemplates: Template[] = [
		defaultTemplates[0], // Hero
		defaultTemplates[2], // Features Grid
		defaultTemplates[7], // Tabbed Showcase (new)
		defaultTemplates[4], // Two Column Content
		defaultTemplates[5], // Testimonial
		defaultTemplates[6], // Pricing
		defaultTemplates[3] // CTA
	];
	let contentContainer: HTMLElement;
	let devicePreview: 'mobile' | 'tablet' | 'desktop' | 'full' = 'full';

	$: firstSelected = Array.from($selectedElements)[0];
	$: selectedType =
		firstSelected?.dataset.editable || (firstSelected?.dataset.repeatable ? 'repeatable' : '');
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

			// Use plugin system for handling clicks
			editablePluginManager.handleClick(editable, e);

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
					// For text elements, start edit mode
					if (editable.dataset.editable === 'text') {
						startEdit(e);
					}
					// For other elements (image, icon, etc.), the plugin has already handled the click
					// No additional action needed here as the plugin's onClick was called above
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

		// Initialize element with plugin system if it's editable
		if (element.dataset.editable) {
			editablePluginManager.initElement(element);
			editablePluginManager.applyStyles(element, true);
		}

		// Edit mode visual styles are now handled by the contenteditable CSS rules

		// Overlay position is now handled by the SelectionOverlay component

		// Register element for history tracking based on type
		if (element.dataset.editable === 'text') {
			const elementId = historyManager.registerElement(element, element.textContent || '');
			historyManager.onTextChange(elementId, (newText) => {
				if (element.textContent !== newText) {
					element.textContent = newText;
				}
			});
			updateHistoryState();
		} else if (element.dataset.editable === 'image') {
			// Register image changes for history
			element.addEventListener('imageChanged', (e) => {
				const customEvent = e as CustomEvent;
				if (contentContainer) {
					historyManager.saveStructuralState(contentContainer);
					updateHistoryState();
				}
			});
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
		$selectedElements.forEach((element) => {
			// Remove contentEditable attribute completely
			if (element.hasAttribute('contenteditable')) {
				element.removeAttribute('contenteditable');
				element.removeEventListener('input', handleTextInput);
			}

			// Remove plugin styles if it's an editable element
			if (element.dataset.editable) {
				editablePluginManager.removeStyles(element);
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
		const allClickableElements = contentContainer.querySelectorAll(
			'[data-editable], [data-repeatable]'
		);
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

	function handleOverlayAction(action: string, data: any) {
		switch (action) {
			case 'edit':
				startEdit();
				break;
			case 'copy':
				handleCopyShortcut();
				break;
			case 'cut':
				handleCutShortcut();
				break;
			case 'delete':
				if ($activeSelectionType === 'section') {
					// Handle section deletion
					const sectionIndex = $selectedSectionIndex;
					if (sectionIndex !== null) {
						removeTemplate(sectionIndex);
					}
				} else {
					handleDeleteShortcut();
				}
				break;
			case 'moveUp':
				if (
					$activeSelectionType === 'section' &&
					$selectedSectionIndex !== null &&
					$selectedSectionIndex > 0
				) {
					handleReorderSections($selectedSectionIndex, $selectedSectionIndex - 1);
				}
				break;
			case 'moveDown':
				if (
					$activeSelectionType === 'section' &&
					$selectedSectionIndex !== null &&
					$selectedSectionIndex < selectedTemplates.length - 1
				) {
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
		console.log('Key pressed:', e.key, { isEditing, firstSelected, selectedType });

		// In edit mode, prevent space bar from triggering button clicks or blur
		if (isEditing && e.key === ' ') {
			// Only prevent default if the target is not the contenteditable element itself
			const target = e.target as HTMLElement;
			if (!target.hasAttribute('contenteditable')) {
				e.preventDefault();
				e.stopPropagation();
			}
			return; // Let the space be typed normally in the contenteditable element
		}

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
			handleCopyShortcut();
		} else if ((e.metaKey || e.ctrlKey) && e.key === 'x' && !isEditing) {
			e.preventDefault();
			handleCutShortcut();
		} else if ((e.metaKey || e.ctrlKey) && e.key === 'v' && !isEditing) {
			e.preventDefault();
			handlePasteShortcut();
		} else if ((e.key === 'Delete' || e.key === 'Backspace') && !isEditing) {
			e.preventDefault();
			handleDeleteShortcut();
		}
	}

	// 🚀 새로운 전략 패턴 기반 핸들러들 - 분기 로직 제거!
	async function handleCopyShortcut() {
		if (firstSelected) {
			try {
				await selectionActionManager.executeAction('copy', firstSelected, selectedType);
			} catch (error) {
				console.error('Copy action failed:', error);
			}
		}
	}

	async function handleCutShortcut() {
		if (firstSelected) {
			try {
				await selectionActionManager.executeAction('cut', firstSelected, selectedType);
			} catch (error) {
				console.error('Cut action failed:', error);
			}
		}
	}

	async function handlePasteShortcut() {
		if (firstSelected) {
			try {
				await selectionActionManager.executeAction('paste', firstSelected, selectedType);
			} catch (error) {
				console.error('Paste action failed:', error);
			}
		}
	}

	async function handleDeleteShortcut() {
		console.log('Delete shortcut triggered', { firstSelected, selectedType, isEditing });
		if (firstSelected) {
			try {
				await selectionActionManager.executeAction('delete', firstSelected, selectedType);
			} catch (error) {
				console.error('Delete action failed:', error);
			}
		}
	}

	function cleanupContentEditable() {
		// Remove all contenteditable attributes from the page
		document.querySelectorAll('[contenteditable]').forEach((element) => {
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
					element.animate(
						[{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }, { backgroundColor: 'transparent' }],
						{
							duration: 600,
							easing: 'ease-out'
						}
					);
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
					element.animate(
						[{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }, { backgroundColor: 'transparent' }],
						{
							duration: 600,
							easing: 'ease-out'
						}
					);
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
		// This will be available to both sidebar and canvas
		selectionManager.select(index, 'section', 'canvas', selectedTemplates[index]);

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

		if (editable) {
			e.stopPropagation();

			// Use plugin system for handling double clicks
			editablePluginManager.handleDoubleClick(editable, e);

			// Select element if not already selected
			if (!$selectedElements.has(editable)) {
				deselectAll();
				selectElement(editable);
			}

			// Only start edit mode for text elements
			if (editable.dataset.editable === 'text') {
				startEdit(e);
			}
		}
	}

	// 🚀 RepeatableActionHandler 이벤트 핸들러들
	function handleSaveHistoryState(e: Event) {
		if (contentContainer) {
			historyManager.saveStructuralState(contentContainer);
		}
	}

	function handleUpdateHistoryState(e: Event) {
		updateHistoryState();
	}

	function handleElementPasted(e: Event) {
		const customEvent = e as CustomEvent;
		const newElement = customEvent.detail?.newElement;

		if (newElement) {
			// 새 요소 선택
			deselectAll();
			selectElement(newElement, false);
		}
	}

	function handleNeedsHydration(e: Event) {
		const customEvent = e as CustomEvent;
		const element = customEvent.detail?.element;

		if (element) {
			hydrateNewElement(element);
		}
	}

	onMount(() => {
		// 🚀 액션 핸들러 시스템 초기화
		initializeActionHandlers();

		document.addEventListener('click', deselectAll);
		document.addEventListener('dblclick', handleDoubleClick);
		document.addEventListener('keydown', handleKeydown);

		// RepeatableActionHandler 이벤트 리스너 추가
		document.addEventListener('saveHistoryState', handleSaveHistoryState);
		document.addEventListener('updateHistoryState', handleUpdateHistoryState);
		document.addEventListener('elementPasted', handleElementPasted);
		document.addEventListener('needsHydration', handleNeedsHydration);

		updateHistoryState();

		// Wait for content container to be ready and save initial state
		setTimeout(() => {
			if (contentContainer) {
				historyManager.saveStructuralState(contentContainer);
			}
		}, 100);

		return () => {
			// Clean up any remaining editable elements
			document.querySelectorAll('[contenteditable]').forEach((element) => {
				(element as HTMLElement).removeAttribute('contenteditable');
			});

			document.removeEventListener('click', deselectAll);
			document.removeEventListener('dblclick', handleDoubleClick);
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('saveHistoryState', handleSaveHistoryState);
			document.removeEventListener('updateHistoryState', handleUpdateHistoryState);
			document.removeEventListener('elementPasted', handleElementPasted);
			document.removeEventListener('needsHydration', handleNeedsHydration);
		};
	});
</script>

<!-- Top Bar -->
<div
	class="fixed top-0 right-0 left-0 z-30 flex h-12 items-center border-b border-stone-200 bg-white px-2"
>
	<!-- Left Section -->
	<div class="flex items-center gap-2">
		<!-- Toggle Left Sidebar -->
		<button
			class="icon-btn {leftSidebarOpen ? 'bg-stone-200' : ''}"
			onclick={() => (leftSidebarOpen = !leftSidebarOpen)}
			title="{leftSidebarOpen ? 'Hide' : 'Show'} sections"
		>
			<svg
				class="h-4 w-4 text-stone-600 transition-transform {leftSidebarOpen ? '' : 'rotate-180'}"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
			>
				<path d="M15 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
	</div>

	<!-- Center Section - All Controls -->
	<div
		class="flex flex-1 justify-center"
		style="margin-left: {leftSidebarOpen ? '140px' : '0'}; margin-right: {rightPanelOpen
			? '304px'
			: '0'}; transition: margin 300ms;"
	>
		<div class="flex items-center gap-2">
			<!-- Mode Toggle Group -->
			<div class="flex items-center gap-0.5 rounded bg-stone-100 p-0.5">
				<button
					class="icon-btn {mode === 'select' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
					onclick={() => switchMode('select')}
					title="Select Mode"
				>
					<Mouse class="h-4 w-4" />
				</button>
				<button
					class="icon-btn {mode === 'edit'
						? isEditing
							? 'bg-amber-500 text-white'
							: 'bg-blue-500 text-white'
						: 'text-stone-600'}"
					onclick={() => switchMode('edit')}
					title={isEditing ? 'Editing Text' : 'Edit Mode'}
				>
					<Edit2 class="h-4 w-4" />
				</button>
			</div>

			<!-- Selection Indicator -->
			{#if !$isSelectionEmpty && $activeSelectionType}
				<div
					class="flex items-center gap-2 px-3 py-1 text-sm {$activeSelectionType === 'repeatable'
						? 'bg-green-200 text-green-800'
						: 'bg-stone-200 text-stone-700'} rounded"
				>
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
			<div class="flex items-center gap-0.5 rounded bg-stone-100 p-0.5">
				<button
					class="icon-btn disabled:cursor-not-allowed disabled:opacity-50"
					onclick={undo}
					disabled={!canUndo}
					title="Undo"
				>
					<Undo2 class="h-4 w-4" />
				</button>
				<button
					class="icon-btn disabled:cursor-not-allowed disabled:opacity-50"
					onclick={redo}
					disabled={!canRedo}
					title="Redo"
				>
					<Redo2 class="h-4 w-4" />
				</button>
			</div>

			<!-- Device Preview Group -->
			<div class="flex items-center gap-0.5 rounded bg-stone-100 p-0.5">
				<button
					class="icon-btn {devicePreview === 'mobile'
						? 'bg-blue-500 text-white'
						: 'text-stone-600'}"
					onclick={() => (devicePreview = 'mobile')}
					title="Mobile Preview (375px)"
				>
					<Smartphone class="h-4 w-4" />
				</button>
				<button
					class="icon-btn {devicePreview === 'tablet'
						? 'bg-blue-500 text-white'
						: 'text-stone-600'}"
					onclick={() => (devicePreview = 'tablet')}
					title="Tablet Preview (768px)"
				>
					<Tablet class="h-4 w-4" />
				</button>
				<button
					class="icon-btn {devicePreview === 'desktop'
						? 'bg-blue-500 text-white'
						: 'text-stone-600'}"
					onclick={() => (devicePreview = 'desktop')}
					title="Desktop Preview (1280px)"
				>
					<Monitor class="h-4 w-4" />
				</button>
				<button
					class="icon-btn {devicePreview === 'full' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
					onclick={() => (devicePreview = 'full')}
					title="Full Width"
				>
					<Expand class="h-4 w-4" />
				</button>
			</div>
		</div>
	</div>

	<!-- Right Section -->
	<div class="absolute right-2 flex items-center gap-2">
		<!-- Settings Button -->
		<button
			class="icon-btn {rightPanelOpen ? 'bg-stone-200' : ''}"
			onclick={() => (rightPanelOpen = !rightPanelOpen)}
			title="Settings"
		>
			<Settings class="h-4 w-4" />
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
	onAddSection={() => (templateSelectorOpen = true)}
/>

<!-- Main Content -->
<div class="flex h-screen pt-12">
	<div
		class="flex-1 overflow-auto {rightPanelOpen ? 'mr-80' : ''} {leftSidebarOpen
			? 'ml-40'
			: 'ml-0'} bg-stone-100 transition-all duration-300"
	>
		<div class="flex justify-center {devicePreview === 'full' ? 'p-0' : 'p-8'}">
			<div
				bind:this={contentContainer}
				class="relative bg-white transition-all duration-300 {devicePreview === 'full'
					? 'w-full'
					: 'shadow-lg'} {devicePreview === 'mobile'
					? 'max-w-[375px]'
					: devicePreview === 'tablet'
						? 'max-w-[768px]'
						: devicePreview === 'desktop'
							? 'max-w-[1280px]'
							: 'max-w-full'}"
				style="width: 100%;"
			>
				<!-- Mock Header -->
				<MockHeader {devicePreview} />

				<div class="p-8">
					<!-- Templates -->
					<div class="space-y-8">
						{#each selectedTemplates as template, index (template.id + index)}
							<div
								class="template-section animate-fade-in {$selectedSectionIndex === index
									? 'selected-section'
									: ''}"
								style="animation-delay: {index * 0.1}s"
								data-section-index={index}
								onclick={(e) => {
									// Check if clicking on an editable element
									const target = e.target as HTMLElement;
									const editable = target.closest('[data-editable]');
									const repeatable = target.closest('[data-repeatable]');

									// If not clicking on editable/repeatable content, select the section
									if (!editable && !repeatable) {
										e.stopPropagation();
										handleSelectSection(index);
									}
								}}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleSelectSection(index);
									}
								}}
								role="button"
								tabindex="0"
							>
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
							<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
								<div
									class="mb-4 flex h-16 w-16 items-center justify-center border-2 border-dashed border-stone-300"
								>
									<Grid3X3 class="h-8 w-8 text-stone-400" />
								</div>
								<button onclick={() => (templateSelectorOpen = true)} class="btn btn-primary">
									<Plus class="mr-2 h-4 w-4" />
									Add Template
								</button>
							</div>
						{/if}
					</div>

					<!-- Mock Footer -->
					<MockFooter {devicePreview} />
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
<TemplateSelector bind:isOpen={templateSelectorOpen} onSelectTemplate={handleSelectTemplate} />

<!-- Unified Selection Overlay -->
<SelectionOverlay container={contentContainer} onAction={handleOverlayAction} />

<style>
	/* Import selection styles */
	@import '$lib/styles/selection.css';

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

	/* Edit mode styles are now handled by [data-editing="true"] in selection.css */

	:global(*[contenteditable='true']::before) {
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

	/* Section styles */
	.template-section {
		position: relative;
		cursor: pointer;
		transition: all 0.2s ease;
		border-radius: 8px;
		padding: 2px;
		margin: -2px;
	}

	.template-section:hover {
		outline: 2px dashed #6366f1;
		outline-offset: 4px;
		background-color: rgba(99, 102, 241, 0.02);
	}

	/* Only show focus outline when actually selected */
	.template-section.selected-section:focus {
		outline: 2px solid #6366f1;
		outline-offset: 4px;
	}

	.template-section.selected-section:focus-visible {
		outline: 2px solid #6366f1;
		outline-offset: 4px;
	}

	/* Selected section styles */
	.template-section.selected-section {
		outline: 2px solid #6366f1;
		outline-offset: 4px;
		background-color: rgba(99, 102, 241, 0.05);
		box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.1);
	}

	/* Prevent section hover when hovering on child elements */
	.template-section:has([data-editable]:hover),
	.template-section:has([data-repeatable]:hover) {
		outline: none;
		background-color: transparent;
	}

	/* Don't show section hover styles when a section is selected and hovering over elements */
	.template-section.selected-section:has([data-editable]:hover),
	.template-section.selected-section:has([data-repeatable]:hover) {
		outline: 2px solid #6366f1;
		background-color: rgba(99, 102, 241, 0.05);
	}
</style>
