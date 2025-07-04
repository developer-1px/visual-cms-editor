<script lang="ts">
	import { onMount } from 'svelte';
	import { computePosition, flip, shift, offset } from '@floating-ui/dom';
	import {
		Edit2,
		Copy,
		Trash2,
		Type,
		Scissors,
		Eye,
		ChevronUp,
		ChevronDown,
		Upload,
		RotateCw,
		Settings
	} from 'lucide-svelte';
	import {
		selectedItems,
		selectedElements,
		activeSelectionType,
		activeSelectionStyle,
		selectionCount,
		isSelectionEmpty
	} from '$lib/core/selection/SelectionManager';
	import { editablePluginManager } from '$lib/core/plugins/editable';

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

		// Get plugin-specific actions if available
		const firstElement = Array.from($selectedElements)[0];
		if (firstElement && firstElement.dataset.editable) {
			const pluginActions = editablePluginManager.getActions(firstElement);
			if (pluginActions.length > 0) {
				return pluginActions.map((action) => ({
					id: action.id,
					icon: getIconForAction(action.icon || action.id),
					title: action.label,
					color: action.isDestructive ? 'text-red-400' : undefined,
					handler: action.handler
				}));
			}
		}

		const commonActions = [
			{ id: 'copy', icon: Copy, title: 'Copy', shortcut: 'Ctrl+C' },
			{ id: 'delete', icon: Trash2, title: 'Delete', shortcut: 'Delete', color: 'text-red-400' }
		];

		switch (type) {
			case 'text':
				return [{ id: 'edit', icon: Type, title: 'Edit', shortcut: 'Enter' }, ...commonActions];
			case 'image':
				return [
					{ id: 'upload', icon: Upload, title: 'Upload Image' },
					{ id: 'replace', icon: RotateCw, title: 'Replace Image' },
					{ id: 'delete', icon: Trash2, title: 'Remove Image', color: 'text-red-400' }
				];
			case 'icon':
				return [
					{ id: 'change-icon', icon: Edit2, title: 'Change Icon' },
					{ id: 'customize', icon: Settings, title: 'Customize' },
					{ id: 'remove', icon: Trash2, title: 'Remove Icon', color: 'text-red-400' }
				];
			case 'repeatable':
				return [...commonActions, { id: 'cut', icon: Scissors, title: 'Cut', shortcut: 'Ctrl+X' }];
			case 'section':
				return [
					{ id: 'moveUp', icon: ChevronUp, title: 'Move Up' },
					{ id: 'moveDown', icon: ChevronDown, title: 'Move Down' },
					{ id: 'toggleVisibility', icon: Eye, title: 'Toggle Visibility' },
					{ id: 'delete', icon: Trash2, title: 'Remove Section', color: 'text-red-400' }
				];
			case 'link':
				return [{ id: 'editLink', icon: Edit2, title: 'Edit Link' }, ...commonActions];
			default:
				return commonActions;
		}
	}

	function getIconForAction(iconName: string) {
		const iconMap: Record<string, any> = {
			edit: Edit2,
			upload: Upload,
			refresh: RotateCw,
			settings: Settings,
			trash: Trash2,
			copy: Copy,
			cut: Scissors
		};
		return iconMap[iconName] || Edit2;
	}

	async function updatePosition() {
		if ($isSelectionEmpty || !container || !overlayElement) {
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
			const sectionElement = sectionElements[firstItem.element] as HTMLElement;
			if (!sectionElement || !(sectionElement instanceof HTMLElement)) {
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
			middleware: [offset(8), flip(), shift({ padding: 8 })]
		});

		// Set position relative to container
		position = {
			x: x - containerRect.left,
			y: y - containerRect.top
		};

		visible = true;
	}

	function handleAction(actionId: string, customHandler?: Function) {
		// If there's a custom handler (from plugin), use it
		if (customHandler) {
			customHandler();
			return;
		}

		// Otherwise, use the default action handler
		onAction(actionId, {
			selection: $selectedItems,
			type: $activeSelectionType
		});
	}

	// Update position when selection changes
	$: if ($selectedItems.size > 0) {
		// Add a small delay to ensure overlayElement is bound
		setTimeout(() => {
			if (overlayElement) {
				updatePosition();
			}
		}, 10);
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
		class="animate-fade-in floating-ui absolute z-30 flex items-center gap-1 px-1 py-1 shadow-xl"
		style="
			left: {position.x}px; 
			top: {position.y}px; 
			background-color: {overlayColor};
			border-radius: 8px;
		"
	>
		{#each actions as action}
			{#if action.id === 'divider'}
				<div class="h-5 w-px bg-white/20"></div>
			{:else}
				<button
					class="flex h-8 w-8 items-center justify-center rounded text-white transition-all hover:bg-white/20 {action.color ||
						''}"
					on:click={() => handleAction(action.id, action.handler)}
					title="{action.title}{action.shortcut ? ` (${action.shortcut})` : ''}"
				>
					<svelte:component this={action.icon} class="h-4 w-4" />
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
