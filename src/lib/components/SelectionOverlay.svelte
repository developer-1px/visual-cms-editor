<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { computePosition, flip, shift, offset } from '@floating-ui/dom';
	import { Edit2, Copy, Trash2, Type, Scissors, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-svelte';
	import { 
		selectedItems,
		selectedElements,
		activeSelectionType,
		activeSelectionStyle,
		selectionCount,
		isSelectionEmpty,
		selectionManager
	} from '$lib/core/selection/SelectionManager';
	
	export let container: HTMLElement | null = null;
	export let onAction: (action: string, data?: any) => void = () => {};
	
	let overlayElement: HTMLElement;
	let visible = false;
	let position = { x: 0, y: 0 };
	
	// Overlay actions based on selection type
	$: actions = getActionsForType($activeSelectionType);
	$: overlayColor = $activeSelectionStyle?.overlayColor || 'rgb(31, 41, 55)'; // stone-900
	
	function getActionsForType(type: string | null) {
		if (!type) return [];
		
		const commonActions = [
			{ id: 'copy', icon: Copy, title: 'Copy', shortcut: 'Ctrl+C' },
			{ id: 'delete', icon: Trash2, title: 'Delete', shortcut: 'Delete', color: 'text-red-400' }
		];
		
		switch (type) {
			case 'text':
				return [
					{ id: 'edit', icon: Type, title: 'Edit', shortcut: 'Enter' },
					...commonActions
				];
			case 'repeatable':
				return [
					...commonActions,
					{ id: 'cut', icon: Scissors, title: 'Cut', shortcut: 'Ctrl+X' }
				];
			case 'section':
				return [
					{ id: 'moveUp', icon: ChevronUp, title: 'Move Up' },
					{ id: 'moveDown', icon: ChevronDown, title: 'Move Down' },
					{ id: 'toggleVisibility', icon: Eye, title: 'Toggle Visibility' },
					{ id: 'delete', icon: Trash2, title: 'Remove Section', color: 'text-red-400' }
				];
			case 'image':
			case 'icon':
				return [
					{ id: 'replace', icon: Edit2, title: 'Replace' },
					...commonActions
				];
			case 'link':
				return [
					{ id: 'editLink', icon: Edit2, title: 'Edit Link' },
					...commonActions
				];
			default:
				return commonActions;
		}
	}
	
	async function updatePosition() {
		if ($isSelectionEmpty || !container) {
			visible = false;
			return;
		}
		
		// Get the first selected element or section bounds
		const firstItem = Array.from($selectedItems)[0];
		if (!firstItem) {
			visible = false;
			return;
		}
		
		let referenceRect: DOMRect;
		
		if (firstItem.context === 'sidebar' && typeof firstItem.element === 'number') {
			// For section selections, position near the section in sidebar
			const sectionElements = document.querySelectorAll('.template-section');
			const sectionElement = sectionElements[firstItem.element];
			if (!sectionElement) {
				visible = false;
				return;
			}
			referenceRect = sectionElement.getBoundingClientRect();
		} else if (firstItem.element instanceof HTMLElement) {
			// For canvas elements
			referenceRect = firstItem.element.getBoundingClientRect();
		} else {
			visible = false;
			return;
		}
		
		// Calculate position relative to container
		const containerRect = container.getBoundingClientRect();
		const relativeRect = {
			top: referenceRect.top - containerRect.top,
			left: referenceRect.left - containerRect.left,
			bottom: referenceRect.bottom - containerRect.top,
			right: referenceRect.right - containerRect.left,
			width: referenceRect.width,
			height: referenceRect.height
		};
		
		// Use floating-ui for positioning
		const virtualEl = {
			getBoundingClientRect() {
				return {
					x: containerRect.left + relativeRect.left,
					y: containerRect.top + relativeRect.top,
					top: containerRect.top + relativeRect.top,
					left: containerRect.left + relativeRect.left,
					bottom: containerRect.top + relativeRect.bottom,
					right: containerRect.left + relativeRect.right,
					width: relativeRect.width,
					height: relativeRect.height
				};
			}
		};
		
		const { x, y } = await computePosition(virtualEl, overlayElement, {
			placement: 'top',
			middleware: [
				offset(8),
				flip(),
				shift({ padding: 8 })
			]
		});
		
		// Set position relative to container
		position = {
			x: x - containerRect.left,
			y: y - containerRect.top
		};
		
		visible = true;
	}
	
	function handleAction(actionId: string) {
		onAction(actionId, { 
			selection: $selectedItems,
			type: $activeSelectionType
		});
	}
	
	// Update position when selection changes
	$: if ($selectedItems.size > 0) {
		requestAnimationFrame(updatePosition);
	} else {
		visible = false;
	}
	
	// Handle window resize
	onMount(() => {
		window.addEventListener('resize', updatePosition);
		window.addEventListener('scroll', updatePosition, true);
		return () => {
			window.removeEventListener('resize', updatePosition);
			window.removeEventListener('scroll', updatePosition, true);
		};
	});
</script>

{#if visible && !$isSelectionEmpty && container}
	<div
		bind:this={overlayElement}
		class="absolute shadow-xl flex items-center gap-1 px-1 py-1 z-30 animate-fade-in floating-ui"
		style="
			left: {position.x}px; 
			top: {position.y}px; 
			background-color: {overlayColor};
			border-radius: 8px;
		"
	>
		{#each actions as action}
			{#if action.id === 'divider'}
				<div class="w-px h-5 bg-white/20"></div>
			{:else}
				<button
					class="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded transition-all {action.color || ''}"
					on:click={() => handleAction(action.id)}
					title="{action.title}{action.shortcut ? ` (${action.shortcut})` : ''}"
				>
					<svelte:component this={action.icon} class="w-4 h-4" />
				</button>
			{/if}
		{/each}
		
		{#if $selectionCount > 1}
			<div class="px-2 text-xs text-white/80">
				{$selectionCount}
			</div>
		{/if}
	</div>
{/if}

<style>
	.floating-ui {
		pointer-events: auto;
	}
	
	.animate-fade-in {
		animation: fadeIn 0.2s ease-out;
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>