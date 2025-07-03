<script lang="ts">
import { Undo2, Redo2, Clock } from 'lucide-svelte';
import type { HistoryInfo } from '$lib/core/history';

export let historyInfo: HistoryInfo;
export let onHistoryAction: (action: 'undo' | 'redo') => void;
</script>

<div class="space-y-6 animate-fade-in">
	<!-- History Info -->
	<div class="card p-4">
		<h4 class="text-sm font-medium text-stone-900 mb-3 flex items-center gap-2">
			<Clock class="w-4 h-4" />
			History
		</h4>
		<div class="space-y-2 text-xs">
			<div class="flex justify-between">
				<span class="text-stone-600">Current Version</span>
				<code class="bg-stone-100 px-2 py-1 text-stone-800">v{historyInfo.currentVersion}</code>
			</div>
			<div class="flex justify-between">
				<span class="text-stone-600">Total Versions</span>
				<span class="text-stone-900">{historyInfo.totalVersions}</span>
			</div>
		</div>
	</div>

	<!-- History Actions -->
	<div class="space-y-2">
		<button
			onclick={() => onHistoryAction('undo')}
			disabled={!historyInfo.canUndo}
			class="btn w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
		>
			<Undo2 class="w-4 h-4 mr-2" />
			Undo
		</button>
		<button
			onclick={() => onHistoryAction('redo')}
			disabled={!historyInfo.canRedo}
			class="btn w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
		>
			<Redo2 class="w-4 h-4 mr-2" />
			Redo
		</button>
	</div>

	<!-- Content Preview -->
	{#if historyInfo.currentText}
		<div class="card p-4">
			<h4 class="text-sm font-medium text-stone-900 mb-3">Current Content</h4>
			<div class="bg-stone-50 p-3 text-xs text-stone-800 font-mono">
				{historyInfo.currentText}
			</div>
			<div class="text-xs text-stone-500 mt-2">
				{historyInfo.currentText.length} characters
			</div>
		</div>
	{/if}
</div>