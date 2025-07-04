<script lang="ts">
	import { onMount } from 'svelte';
	import { Layers, Eye, EyeOff, GripVertical, Plus } from 'lucide-svelte';
	import type { Template } from '$lib/core/templates/templates';
	
	export let isOpen: boolean = true;
	export let templates: Template[] = [];
	export let onSelectSection: (index: number) => void = () => {};
	export let onReorderSections: (fromIndex: number, toIndex: number) => void = () => {};
	export let onToggleVisibility: (index: number) => void = () => {};
	export let onAddSection: () => void = () => {};
	
	let sectionPreviews: HTMLElement[] = [];
	let draggedIndex: number | null = null;
	let dragOverIndex: number | null = null;
	
	// Generate preview HTML with scaled styles
	function generatePreviewHtml(template: Template): string {
		// Simple HTML processing without DOM API for SSR compatibility
		let html = template.html;
		
		// Add inline styles for preview scaling
		html = html.replace(/<section([^>]*)>/gi, '<section$1 style="padding: 12px; margin: 0;">');
		
		return html;
	}
	
	function handleDragStart(e: DragEvent, index: number) {
		draggedIndex = index;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
		}
	}
	
	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		dragOverIndex = index;
	}
	
	function handleDragEnd() {
		if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
			onReorderSections(draggedIndex, dragOverIndex);
		}
		draggedIndex = null;
		dragOverIndex = null;
	}
	
	function handleDrop(e: DragEvent) {
		e.preventDefault();
	}
	
	onMount(() => {
		// Initialize section observers if needed
		return () => {
			// Cleanup
		};
	});
</script>

<div class="fixed left-0 top-12 bottom-0 z-20 flex">
	<!-- Sidebar -->
	<div class="bg-white border-r border-stone-200 shadow-sm transition-all duration-300 overflow-hidden {isOpen ? 'w-40' : 'w-0'}">
		<div class="h-full flex flex-col">
			<!-- Header -->
			<div class="flex items-center justify-between px-2 py-2 border-b border-stone-200">
				<div class="flex items-center gap-1">
					<Layers class="w-3 h-3 text-stone-600" />
					<h3 class="text-[11px] font-medium text-stone-900">Sections</h3>
					<span class="text-[11px] text-stone-500">{templates.length}</span>
				</div>
				<button
					on:click={onAddSection}
					class="w-5 h-5 flex items-center justify-center hover:bg-stone-100 rounded transition-colors"
					title="Add Section"
				>
					<Plus class="w-3 h-3 text-stone-600" />
				</button>
			</div>
			
			<!-- Section List -->
			<div class="flex-1 overflow-y-auto p-1.5 space-y-1">
				{#each templates as template, index (template.id + index)}
					<div
						class="group relative bg-stone-50 border border-stone-200 rounded overflow-hidden transition-all hover:border-stone-300 hover:shadow-sm cursor-pointer {dragOverIndex === index ? 'border-blue-500' : ''}"
						on:click={() => onSelectSection(index)}
						draggable={true}
						on:dragstart={(e) => handleDragStart(e, index)}
						on:dragover={(e) => handleDragOver(e, index)}
						on:dragend={handleDragEnd}
						on:drop={handleDrop}
					>
						<!-- Drag Handle -->
						<div class="absolute left-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-move z-10">
							<GripVertical class="w-3 h-3 text-stone-400" />
						</div>
						
						<!-- Visibility Toggle -->
						<button
							class="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
							on:click|stopPropagation={() => onToggleVisibility(index)}
							title="Toggle visibility"
						>
							<Eye class="w-3 h-3 text-stone-600" />
						</button>
						
						<!-- Section Info - Single Line -->
						<div class="flex items-center gap-1.5 px-2 py-1 bg-white">
							<span class="text-[9px] text-stone-500 font-medium">{index + 1}</span>
							<span class="text-[10px] font-medium text-stone-700 truncate flex-1">{template.name}</span>
						</div>
						
						<!-- Preview Container -->
						<div class="relative overflow-hidden bg-stone-50" style="height: 50px;">
							<div class="preview-wrapper transform scale-[0.08] origin-top" style="width: 1250%; transform-origin: top center; position: absolute; left: 50%; transform: translateX(-50%) scale(0.08);">
								<div bind:this={sectionPreviews[index]} class="mx-auto" style="width: 1200px;">
									{@html generatePreviewHtml(template)}
								</div>
							</div>
						</div>
					</div>
				{/each}
				
				{#if templates.length === 0}
					<div class="text-center py-6">
						<Layers class="w-6 h-6 text-stone-300 mx-auto mb-1" />
						<p class="text-xs text-stone-500">No sections</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.preview-wrapper {
		height: auto;
		pointer-events: none;
		user-select: none;
	}
	
	/* Hide scrollbars in preview */
	.preview-wrapper :global(*) {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	
	.preview-wrapper :global(*::-webkit-scrollbar) {
		display: none;
	}
	
	/* Ensure images in preview scale properly */
	.preview-wrapper :global(img) {
		max-width: 100%;
		height: auto;
	}
	
	/* Override any fixed heights in preview */
	.preview-wrapper :global([class*="h-"]),
	.preview-wrapper :global([class*="min-h-"]) {
		height: auto !important;
		min-height: auto !important;
	}
	
	/* Smaller text in preview */
	.preview-wrapper :global(*) {
		font-size: 6px !important;
		line-height: 1.1 !important;
	}
	
	/* Even smaller section cards */
	.group {
		transition: all 0.2s ease;
	}
	
	.group:hover {
		transform: scale(1.02);
	}
</style>