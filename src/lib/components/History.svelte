<script lang="ts">
import { Undo2, Redo2 } from 'lucide-svelte';
import type { HistoryInfo } from '$lib/core/history';

export let historyInfo: HistoryInfo;
export let onHistoryAction: (action: 'undo' | 'redo') => void;
</script>

<div>
	<h3 class="text-sm font-semibold text-gray-700 mb-2">변경 기록</h3>
	<div class="bg-gray-50 rounded-lg p-3 space-y-2">
		<div class="flex justify-between text-sm">
			<span class="text-gray-600">현재 버전</span>
			<span class="font-mono text-xs bg-gray-200 px-2 py-0.5 rounded">
				v{historyInfo.currentVersion}
			</span>
		</div>
		<div class="flex justify-between text-sm">
			<span class="text-gray-600">전체 변경 횟수</span>
			<span class="font-medium">{historyInfo.totalVersions}회</span>
		</div>
		<div class="flex items-center gap-2 pt-2 border-t border-gray-200">
			<button
				on:click={() => onHistoryAction('undo')}
				disabled={!historyInfo.canUndo}
				class="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				<Undo2 size={12} />
				<span>실행 취소</span>
			</button>
			<button
				on:click={() => onHistoryAction('redo')}
				disabled={!historyInfo.canRedo}
				class="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				<Redo2 size={12} />
				<span>다시 실행</span>
			</button>
		</div>
	</div>
</div>