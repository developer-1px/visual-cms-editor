<script lang="ts">
	import { X, Plus, Code2, Square, Circle, Triangle } from 'lucide-svelte';
	import { defaultTemplates, type Template } from '$lib/core/templates/templates';
	import { TemplateConverter } from '$lib/core/templates/converter';

	export let isOpen = false;
	export let onSelectTemplate: (template: Template) => void;

	let selectedCategory: Template['category'] | 'all' = 'all';
	let previewTemplate: Template | null = null;
	let showCode = false;

	$: filteredTemplates =
		selectedCategory === 'all'
			? defaultTemplates
			: defaultTemplates.filter((t) => t.category === selectedCategory);

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
	<div
		class="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4 backdrop-blur-sm"
	>
		<div class="animate-slide-in max-h-[90vh] w-full max-w-6xl overflow-hidden bg-white shadow-lg">
			<!-- Header -->
			<div class="flex items-center justify-between bg-stone-50 p-4">
				<h2 class="text-lg font-semibold text-stone-900">Templates</h2>
				<button on:click={() => (isOpen = false)} class="icon-btn">
					<X class="h-4 w-4" />
				</button>
			</div>

			<div class="flex h-[calc(90vh-80px)]">
				<!-- Categories -->
				<div class="w-32 bg-stone-50 p-4">
					<div class="space-y-1">
						{#each categories as category}
							<button
								on:click={() => (selectedCategory = category.id)}
								class="flex w-full flex-col items-center gap-2 p-3 text-xs transition-colors hover:bg-stone-50 {selectedCategory ===
								category.id
									? 'bg-stone-900 text-white'
									: 'text-stone-600'}"
							>
								<svelte:component this={category.icon} class="h-4 w-4" />
								{category.name}
							</button>
						{/each}
					</div>
				</div>

				<!-- Templates -->
				<div class="flex-1 overflow-y-auto p-6">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{#each filteredTemplates as template, index}
							<div
								class="animate-fade-in bg-white shadow-sm transition-all hover:shadow-md"
								style="animation-delay: {index * 0.05}s"
							>
								<div class="relative aspect-video overflow-hidden bg-stone-50">
									<div
										class="pointer-events-none h-[940px] w-[1250px] origin-top-left scale-[0.08]"
									>
										{@html template.html}
									</div>
									<div
										class="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors hover:bg-black/5 hover:opacity-100"
									>
										<div class="flex gap-2">
											<button
												on:click={() => previewCode(template)}
												class="icon-btn bg-white/90"
												title="View Code"
											>
												<Code2 class="h-4 w-4" />
											</button>
											<button
												on:click={() => selectTemplate(template)}
												class="icon-btn bg-stone-900 text-white"
												title="Add Template"
											>
												<Plus class="h-4 w-4" />
											</button>
										</div>
									</div>
								</div>
								<div class="p-3">
									<h3 class="text-sm font-medium text-stone-900">{template.name}</h3>
									<p class="mt-1 text-xs text-stone-600">{template.description}</p>
									<div class="mt-2 flex items-center justify-between">
										<span class="text-xs text-stone-400 capitalize">{template.category}</span>
										<span class="text-xs text-stone-400"
											>{template.editableElements.length} elements</span
										>
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
	<div
		class="animate-fade-in fixed inset-0 z-[60] flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
	>
		<div class="animate-slide-in max-h-[80vh] w-full max-w-4xl overflow-hidden bg-white shadow-lg">
			<div class="flex items-center justify-between bg-stone-50 p-4">
				<h3 class="text-lg font-semibold text-stone-900">{previewTemplate.name} Code</h3>
				<button
					on:click={() => {
						showCode = false;
						previewTemplate = null;
					}}
					class="icon-btn"
				>
					<X class="h-4 w-4" />
				</button>
			</div>
			<div class="max-h-[calc(80vh-80px)] overflow-y-auto p-4">
				<pre class="overflow-x-auto bg-stone-50 p-4 text-xs text-stone-800"><code
						>{convertedCode}</code
					></pre>
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
