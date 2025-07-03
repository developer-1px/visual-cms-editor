<script lang="ts">
import { Copy, Trash2, PenTool, Edit2, Type, Hash, FileText } from 'lucide-svelte';

export let selectedElement: HTMLElement | null = null;

$: selectedType = selectedElement?.dataset.editable || '';
$: hasSelection = !!selectedElement;
$: elementInfo = selectedElement ? {
	tag: selectedElement.tagName.toLowerCase(),
	content: selectedElement.textContent || '',
	maxLength: selectedElement.dataset.maxLength,
	classes: Array.from(selectedElement.classList).join(' '),
	type: selectedType
} : null;

function copyElement() {
	if (!selectedElement) return;
	const textToCopy = selectedElement.textContent || selectedElement.outerHTML;
	navigator.clipboard.writeText(textToCopy);
}

function deleteElement() {
	if (!selectedElement) return;
	selectedElement.remove();
}

function editElement() {
	if (!selectedElement || selectedType !== 'text') return;
	selectedElement.focus();
}
</script>

<!-- Inspector Content (used within RightPanel) -->
<div>
	{#if hasSelection}
				<div class="space-y-6 animate-fade-in">
					<!-- Element Type -->
					<div>
						<div class="flex items-center gap-2 mb-3">
							{#if selectedType === 'text'}
								<Type class="w-4 h-4 text-stone-600" />
							{:else}
								<FileText class="w-4 h-4 text-stone-600" />
							{/if}
							<span class="text-sm font-medium text-stone-900 capitalize">{selectedType}</span>
						</div>
					</div>

					<!-- Element Info -->
					<div class="card p-4">
						<h4 class="text-sm font-medium text-stone-900 mb-3">Element</h4>
						<div class="space-y-2 text-xs">
							<div class="flex justify-between">
								<span class="text-stone-600">Tag</span>
								<code class="bg-stone-100 px-2 py-1 text-stone-800">{elementInfo?.tag}</code>
							</div>
							<div class="flex justify-between">
								<span class="text-stone-600">Type</span>
								<span class="text-stone-900 capitalize">{selectedType}</span>
							</div>
							{#if elementInfo?.maxLength}
								<div class="flex justify-between">
									<span class="text-stone-600">Max Length</span>
									<span class="text-stone-900">{elementInfo.maxLength}</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Content Preview -->
					{#if selectedType === 'text' && elementInfo?.content}
						<div class="card p-4">
							<h4 class="text-sm font-medium text-stone-900 mb-3">Content</h4>
							<div class="bg-stone-50 p-3 text-xs text-stone-800 font-mono border border-stone-200">
								{elementInfo.content}
							</div>
							<div class="flex justify-between text-xs text-stone-500 mt-2">
								<span>{elementInfo.content.length} chars</span>
								{#if elementInfo.maxLength}
									<span>/ {elementInfo.maxLength} max</span>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Actions -->
					<div class="space-y-2">
						{#if selectedType === 'text'}
							<button
								onclick={editElement}
								class="btn btn-primary w-full text-sm"
							>
								<Edit2 class="w-4 h-4 mr-2" />
								Edit Text
							</button>
						{/if}
						<button
							onclick={copyElement}
							class="btn w-full text-sm"
						>
							<Copy class="w-4 h-4 mr-2" />
							Copy
						</button>
						<button
							onclick={deleteElement}
							class="btn w-full text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200"
						>
							<Trash2 class="w-4 h-4 mr-2" />
							Delete
						</button>
					</div>

					<!-- CSS Classes -->
					{#if elementInfo?.classes}
						<div class="card p-4">
							<h4 class="text-sm font-medium text-stone-900 mb-3">Classes</h4>
							<code class="bg-stone-50 p-3 text-xs text-stone-800 block break-all border border-stone-200">
								{elementInfo.classes}
							</code>
						</div>
					{/if}
		</div>
	{/if}
</div>