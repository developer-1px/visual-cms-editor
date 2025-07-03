<script lang="ts">
	import { X, Plus, Code2, Square, Circle, Triangle } from 'lucide-svelte';
	import { defaultTemplates, type Template } from '$lib/core/templates/templates';
	import { TemplateConverter } from '$lib/core/templates/converter';
	
	export let isOpen = false;
	export let onSelectTemplate: (template: Template) => void;
	
	let selectedCategory: Template['category'] | 'all' = 'all';
	let previewTemplate: Template | null = null;
	let showCode = false;
	
	$: filteredTemplates = selectedCategory === 'all' 
		? defaultTemplates 
		: defaultTemplates.filter(t => t.category === selectedCategory);
	
	function selectTemplate(template: Template) {
		onSelectTemplate(template);
		isOpen = false;
	}
	
	function previewCode(template: Template) {
		previewTemplate = template;
		showCode = true;
	}
	
	$: convertedCode = previewTemplate 
		? TemplateConverter.htmlToEditableComponent(previewTemplate, {
			preserveStyles: true,
			addEditableMarkers: true,
			generateProps: false
		})
		: '';

	const categories = [
		{ id: 'all', name: 'All', icon: Square },
		{ id: 'hero', name: 'Hero', icon: Square },
		{ id: 'features', name: 'Features', icon: Circle },
		{ id: 'cta', name: 'CTA', icon: Triangle },
		{ id: 'content', name: 'Content', icon: Square },
		{ id: 'testimonial', name: 'Testimonial', icon: Circle },
		{ id: 'pricing', name: 'Pricing', icon: Square }
	];
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
		<div class="bg-white shadow-lg max-w-6xl w-full max-h-[90vh] overflow-hidden animate-slide-in">
			<!-- Header -->
			<div class="bg-stone-50 p-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-stone-900">Templates</h2>
				<button
					on:click={() => isOpen = false}
					class="icon-btn"
				>
					<X class="w-4 h-4" />
				</button>
			</div>
			
			<div class="flex h-[calc(90vh-80px)]">
				<!-- Categories -->
				<div class="w-32 bg-stone-50 p-4">
					<div class="space-y-1">
						{#each categories as category}
							<button
								on:click={() => selectedCategory = category.id}
								class="w-full flex flex-col items-center gap-2 p-3 text-xs hover:bg-stone-50 transition-colors {selectedCategory === category.id ? 'bg-stone-900 text-white' : 'text-stone-600'}"
							>
								<svelte:component this={category.icon} class="w-4 h-4" />
								{category.name}
							</button>
						{/each}
					</div>
				</div>
				
				<!-- Templates -->
				<div class="flex-1 p-6 overflow-y-auto">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each filteredTemplates as template, index}
							<div class="bg-white shadow-sm hover:shadow-md transition-all animate-fade-in" style="animation-delay: {index * 0.05}s">
								<div class="aspect-video bg-stone-50 relative overflow-hidden">
									<div class="scale-[0.08] origin-top-left w-[1250px] h-[940px] pointer-events-none">
										{@html template.html}
									</div>
									<div class="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
										<div class="flex gap-2">
											<button
												on:click={() => previewCode(template)}
												class="icon-btn bg-white/90"
												title="View Code"
											>
												<Code2 class="w-4 h-4" />
											</button>
											<button
												on:click={() => selectTemplate(template)}
												class="icon-btn bg-stone-900 text-white"
												title="Add Template"
											>
												<Plus class="w-4 h-4" />
											</button>
										</div>
									</div>
								</div>
								<div class="p-3">
									<h3 class="font-medium text-stone-900 text-sm">{template.name}</h3>
									<p class="text-xs text-stone-600 mt-1">{template.description}</p>
									<div class="flex justify-between items-center mt-2">
										<span class="text-xs text-stone-400 capitalize">{template.category}</span>
										<span class="text-xs text-stone-400">{template.editableElements.length} elements</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Code Preview -->
{#if showCode && previewTemplate}
	<div class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
		<div class="bg-white shadow-lg max-w-4xl w-full max-h-[80vh] overflow-hidden animate-slide-in">
			<div class="bg-stone-50 p-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold text-stone-900">{previewTemplate.name} Code</h3>
				<button
					on:click={() => { showCode = false; previewTemplate = null; }}
					class="icon-btn"
				>
					<X class="w-4 h-4" />
				</button>
			</div>
			<div class="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
				<pre class="bg-stone-50 text-stone-800 p-4 text-xs overflow-x-auto"><code>{convertedCode}</code></pre>
			</div>
		</div>
	</div>
{/if}

<style>
	pre code {
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
		font-size: 0.75rem;
		line-height: 1.4;
	}
</style>