<script lang="ts">
import { Settings, History as HistoryIcon, X, Bug } from 'lucide-svelte';
import Inspector from './Inspector.svelte';
import History from './History.svelte';
import type { HistoryInfo } from '$lib/core/history';
import { 
	selectedItems,
	selectedElements,
	selectedSectionIndex,
	activeSelectionType,
	activeSelectionContext,
	selectionCount,
	selectionManager
} from '$lib/core/selection/SelectionManager';
import { historyManager } from '$lib/core/history';

export let selectedElement: HTMLElement | null = null;
export let historyInfo: HistoryInfo | null = null;
export let onHistoryAction: (action: 'undo' | 'redo') => void;
export let isOpen = false;

type Tab = 'debug' | 'inspector' | 'history';
let activeTab: Tab = 'debug';

$: hasSelection = !!selectedElement;
$: hasHistory = !!historyInfo;
</script>

{#if isOpen}
	<div class="fixed right-0 top-12 bottom-0 w-80 bg-white shadow-lg overflow-y-auto z-10 animate-slide-in border-l border-stone-200">
		<div class="h-full flex flex-col">
			<!-- Header with Tabs -->
			<div class="bg-stone-50 p-4">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-lg font-semibold text-stone-900">Panel</h2>
					<button
						class="icon-btn"
						onclick={() => isOpen = false}
						title="Close Panel"
					>
						<X class="w-4 h-4" />
					</button>
				</div>
				
				<!-- Tabs -->
				<div class="flex gap-1">
					<button
						class="flex items-center gap-2 px-3 py-2 text-sm transition-colors {activeTab === 'debug' ? 'bg-blue-500 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100'}"
						onclick={() => activeTab = 'debug'}
					>
						<Bug class="w-4 h-4" />
						Debug
					</button>
					<button
						class="flex items-center gap-2 px-3 py-2 text-sm transition-colors {activeTab === 'inspector' ? 'bg-blue-500 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100'}"
						onclick={() => activeTab = 'inspector'}
					>
						<Settings class="w-4 h-4" />
						Inspector
					</button>
					<button
						class="flex items-center gap-2 px-3 py-2 text-sm transition-colors {activeTab === 'history' ? 'bg-blue-500 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100'}"
						onclick={() => activeTab = 'history'}
						disabled={!hasHistory}
					>
						<HistoryIcon class="w-4 h-4" />
						History
					</button>
				</div>
			</div>

			<!-- Tab Content -->
			<div class="flex-1 overflow-y-auto">
				{#if activeTab === 'debug'}
					<div class="p-4">
						<!-- Debug State Display -->
						<div class="space-y-4">
							<div>
								<h3 class="text-sm font-semibold text-stone-700 mb-2">Selection State</h3>
								<pre class="bg-stone-100 p-3 rounded text-xs overflow-x-auto">{JSON.stringify({
	selectedItems: Array.from($selectedItems).map(item => ({
		id: item.id,
		type: item.type,
		context: item.context,
		element: item.element instanceof HTMLElement ? {
			tagName: item.element.tagName,
			className: item.element.className,
			id: item.element.id || 'no-id',
			dataAttributes: Object.fromEntries(
				Object.entries(item.element.dataset)
			)
		} : item.element,
		data: item.data
	})),
	selectedSectionIndex: $selectedSectionIndex,
	activeType: $activeSelectionType,
	activeContext: $activeSelectionContext,
	selectionCount: $selectionCount
}, null, 2)}</pre>
							</div>
							
							<div>
								<h3 class="text-sm font-semibold text-stone-700 mb-2">History State</h3>
								<pre class="bg-stone-100 p-3 rounded text-xs overflow-x-auto">{JSON.stringify({
	canUndo: historyManager.canUndo(),
	canRedo: historyManager.canRedo(),
	historyLength: historyManager.getHistoryLength(),
	currentVersion: historyManager.getCurrentVersion()
}, null, 2)}</pre>
							</div>
							
							<div>
								<h3 class="text-sm font-semibold text-stone-700 mb-2">Selection Manager Config</h3>
								<pre class="bg-stone-100 p-3 rounded text-xs overflow-x-auto">{JSON.stringify({
	mode: selectionManager.getConfig().mode,
	allowCrossContext: selectionManager.getConfig().allowCrossContext,
	styles: Object.fromEntries(
			Object.entries(selectionManager.getConfig().styles).map(([key, style]) => [
				key,
				{
					color: style.color,
					outline: style.outline
				}
			])
		)
}, null, 2)}</pre>
							</div>
						</div>
					</div>
				{:else if activeTab === 'inspector'}
					<div class="p-4">
						{#if !hasSelection}
							<!-- Empty State -->
							<div class="flex flex-col items-center justify-center py-16 text-center">
								<div class="w-12 h-12 bg-stone-100 flex items-center justify-center mb-4">
									<Settings class="w-6 h-6 text-stone-400" />
								</div>
								<p class="text-sm text-stone-600">Select an element to inspect</p>
							</div>
						{:else}
							<Inspector {selectedElement} />
						{/if}
					</div>
				{:else if activeTab === 'history'}
					<div class="p-4">
						{#if !hasHistory}
							<!-- Empty State -->
							<div class="flex flex-col items-center justify-center py-16 text-center">
								<div class="w-12 h-12 bg-stone-100 flex items-center justify-center mb-4">
									<HistoryIcon class="w-6 h-6 text-stone-400" />
								</div>
								<p class="text-sm text-stone-600">No history available</p>
							</div>
						{:else if historyInfo}
							<History {historyInfo} {onHistoryAction} />
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}