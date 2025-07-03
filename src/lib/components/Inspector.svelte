<script lang="ts">
import { X, Copy, Trash2, PenTool, Edit2 } from 'lucide-svelte';
import type { HistoryInfo } from '$lib/core/history';
import History from './History.svelte';

export let selectedElements: Set<HTMLElement>;
export let inspectorOpen: boolean;
export let historyInfo: HistoryInfo | null;
export let mode: 'select' | 'edit';
export let onStartEdit: () => void;
export let onHistoryAction: (action: 'undo' | 'redo') => void;

$: firstSelected = Array.from(selectedElements)[0];
$: selectedType = firstSelected?.dataset.editable || '';
$: multipleSelected = selectedElements.size > 1;
</script>

{#if inspectorOpen}
	<div class="fixed right-0 top-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 overflow-y-auto">
		<div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-gray-900">Inspector</h2>
			<button
				on:click={() => inspectorOpen = false}
				class="p-1 hover:bg-gray-100 rounded transition-colors"
			>
				<X size={20} />
			</button>
		</div>

		<div class="p-4">
			{#if selectedElements.size === 0}
				<p class="text-gray-500 text-sm">요소를 선택하세요</p>
			{:else if multipleSelected}
				<div class="space-y-4">
					<div class="bg-blue-50 rounded-lg p-3">
						<p class="text-sm font-medium text-blue-900">{selectedElements.size}개 요소 선택됨</p>
					</div>
					<div class="space-y-2">
						{#each Array.from(selectedElements) as element, i (element)}
							<div class="bg-gray-50 rounded p-2">
								<p class="text-xs font-medium text-gray-600">요소 {i + 1}</p>
								<p class="text-sm text-gray-800 truncate">{element.textContent}</p>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div class="space-y-6">
					<!-- Element Info -->
					<div>
						<h3 class="text-sm font-semibold text-gray-700 mb-2">요소 정보</h3>
						<div class="space-y-2">
							<div class="flex justify-between text-sm">
								<span class="text-gray-600">타입</span>
								<span class="font-medium">{selectedType}</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-gray-600">태그</span>
								<span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
									{firstSelected?.tagName.toLowerCase()}
								</span>
							</div>
							{#if firstSelected?.dataset.maxLength}
								<div class="flex justify-between text-sm">
									<span class="text-gray-600">최대 길이</span>
									<span class="font-medium">{firstSelected.dataset.maxLength}자</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Content Preview -->
					{#if selectedType === 'text'}
						<div>
							<h3 class="text-sm font-semibold text-gray-700 mb-2">내용</h3>
							<div class="bg-gray-50 rounded-lg p-3">
								<p class="text-sm text-gray-800 whitespace-pre-wrap">
									{firstSelected?.textContent || '(비어있음)'}
								</p>
								{#if firstSelected?.textContent}
									<p class="text-xs text-gray-500 mt-2">
										{firstSelected.textContent.length}자
									</p>
								{/if}
							</div>
						</div>
					{/if}

					<!-- History Info -->
					{#if historyInfo && selectedType === 'text'}
						<History {historyInfo} {onHistoryAction} />
					{/if}

					<!-- Actions -->
					<div>
						<h3 class="text-sm font-semibold text-gray-700 mb-2">작업</h3>
						<div class="space-y-2">
							{#if selectedType === 'text' && mode === 'select'}
								<button
									on:click={onStartEdit}
									class="w-full flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
								>
									<PenTool size={16} />
									편집 시작
								</button>
							{/if}
							<button class="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm">
								<Copy size={16} />
								복사
							</button>
							<button class="w-full flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm">
								<Trash2 size={16} />
								내용 삭제
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<!-- Inspector Toggle Button -->
	<button
		on:click={() => inspectorOpen = true}
		class="fixed right-4 top-4 bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors"
		title="Inspector 열기"
	>
		<Edit2 size={20} />
	</button>
{/if}