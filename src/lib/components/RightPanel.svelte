<script lang="ts">
import { Settings, History as HistoryIcon, X } from 'lucide-svelte';
import Inspector from './Inspector.svelte';
import History from './History.svelte';
import type { HistoryInfo } from '$lib/core/history';

export let selectedElement: HTMLElement | null = null;
export let historyInfo: HistoryInfo | null = null;
export let onHistoryAction: (action: 'undo' | 'redo') => void;
export let isOpen = false;

type Tab = 'inspector' | 'history';
let activeTab: Tab = 'inspector';

$: hasSelection = !!selectedElement;
$: hasHistory = !!historyInfo;
</script>

{#if isOpen}
	<div class="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg overflow-y-auto z-10 animate-slide-in">
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
				{#if activeTab === 'inspector'}
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
						{:else}
							<History {historyInfo} {onHistoryAction} />
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}