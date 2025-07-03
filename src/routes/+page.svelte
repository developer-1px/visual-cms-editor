<script lang="ts">
import { onMount } from 'svelte';
import { Edit2, Copy, Trash2, Type, Image, Link, Mouse, PenTool, X, Undo2, Redo2 } from 'lucide-svelte';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import { historyManager, type HistoryInfo } from '$lib/core/history';

type Mode = 'select' | 'edit';

let selectedElements: Set<HTMLElement> = new Set();
let overlayElement: HTMLElement;
let mode: Mode = 'select';
let inspectorOpen = true;
let canUndo = false;
let canRedo = false;

// 선택된 요소들
$: firstSelected = Array.from(selectedElements)[0];
$: selectedType = firstSelected?.dataset.editable || '';
$: multipleSelected = selectedElements.size > 1;
$: isEditing = mode === 'edit';

// History info for selected element
let historyInfo: HistoryInfo | null = null;
$: if (firstSelected && selectedType === 'text') {
	const elementId = historyManager.getElementId(firstSelected);
	historyInfo = elementId ? historyManager.getHistoryInfo(elementId) : null;
} else {
	historyInfo = null;
}

function handleElementClick(e: MouseEvent) {
	const target = e.target as HTMLElement;
	const editable = target.closest('[data-editable]') as HTMLElement;

	if (editable) {
		e.stopPropagation();

		if (isEditing) {
			// 편집 모드에서는 다른 텍스트 요소를 클릭해도 편집 계속
			if (editable.dataset.editable === 'text' && editable !== firstSelected) {
				// 다른 텍스트로 전환 - 편집 모드 유지
				switchEditTarget(editable, e);
			}
			// 같은 텍스트를 클릭하면 그냥 편집 유지
			return;
		}

		if (e.shiftKey || e.metaKey || e.ctrlKey) {
			// 다중 선택
			toggleSelection(editable);
		} else {
			// 이미 선택된 요소를 다시 클릭하면 바로 편집
			if (selectedElements.has(editable) && selectedElements.size === 1) {
				startEdit(e);
			} else {
				// 단일 선택
				deselectAll();
				selectElement(editable);
			}
		}
	}
}

function selectElement(element: HTMLElement) {
	selectedElements.add(element);
	element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
	updateOverlayPosition();
	
	// Register element for history tracking
	if (element.dataset.editable === 'text') {
		const elementId = historyManager.registerElement(element, element.textContent || '');
		historyManager.onTextChange(elementId, (newText) => {
			if (element.textContent !== newText) {
				element.textContent = newText;
			}
		});
		// Update history state when selecting a text element
		updateHistoryState();
	}
}

function toggleSelection(element: HTMLElement) {
	if (selectedElements.has(element)) {
		selectedElements.delete(element);
		element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
	} else {
		selectElement(element);
	}
	selectedElements = selectedElements; // 반응성 트리거
}

function deselectAll() {
	// 편집 모드에서는 빈 공간 클릭해도 선택 해제하지 않음
	if (!isEditing) {
		selectedElements.forEach(el => {
			el.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2', 'ring-green-500');
		});
		selectedElements.clear();
		selectedElements = selectedElements; // 반응성 트리거
	}
}

async function updateOverlayPosition() {
	if (!firstSelected || !overlayElement) return;

	const { x, y } = await computePosition(firstSelected, overlayElement, {
		placement: 'top',
		middleware: [
			offset(8),
			flip(),
			shift({ padding: 5 })
		]
	});

	overlayElement.style.left = `${x}px`;
	overlayElement.style.top = `${y}px`;
}

function startEdit(event?: MouseEvent) {
	if (!firstSelected || multipleSelected) return;

	mode = 'edit';
	firstSelected.classList.remove('ring-blue-500');
	firstSelected.classList.add('ring-green-500');

	if (firstSelected.dataset.editable === 'text') {
		firstSelected.contentEditable = 'plaintext-only';
		firstSelected.focus();

		// 클릭 이벤트가 있으면 클릭 위치에 커서 유지
		if (event) {
			// 브라우저가 자동으로 클릭 위치에 커서를 놓도록 함
			return;
		}

		// Enter 키로 편집 시작하면 끝에 커서 위치
		const range = document.createRange();
		const selection = window.getSelection();

		range.selectNodeContents(firstSelected);
		range.collapse(false);
		selection?.removeAllRanges();
		selection?.addRange(range);
	}
}

function stopEdit() {
	if (!firstSelected) return;

	// Commit any pending history changes before stopping edit
	const elementId = historyManager.getElementId(firstSelected);
	if (elementId) {
		historyManager.commitPendingChanges(elementId);
	}

	mode = 'select';
	firstSelected.classList.remove('ring-green-500');
	firstSelected.classList.add('ring-blue-500');
	firstSelected.contentEditable = 'false';
}

function switchEditTarget(newTarget: HTMLElement, event?: MouseEvent) {
	// 현재 편집 중인 요소 정리
	if (firstSelected) {
		firstSelected.classList.remove('ring-green-500');
		firstSelected.classList.add('ring-blue-500');
		firstSelected.contentEditable = 'false';
	}

	// 선택 상태 변경
	selectedElements.clear();
	selectedElements.add(newTarget);
	selectedElements = selectedElements; // 반응성 트리거

	// 새 요소 편집 시작
	newTarget.classList.remove('ring-blue-500');
	newTarget.classList.add('ring-green-500');
	newTarget.contentEditable = 'plaintext-only';

	// 다음 틱에서 포커스와 오버레이 업데이트
	setTimeout(() => {
		newTarget.focus();
		updateOverlayPosition();
	}, 0);

	// mode는 edit 상태 유지
}

function handleKeydown(e: KeyboardEvent) {
	// Undo/Redo shortcuts
	if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
		e.preventDefault();
		if (historyManager.canUndo()) {
			historyManager.undo();
			updateHistoryState();
		}
	} else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' && e.shiftKey || e.key === 'y')) {
		e.preventDefault();
		if (historyManager.canRedo()) {
			historyManager.redo();
			updateHistoryState();
		}
	} else if (e.key === 'Escape') {
		stopEdit();
		deselectAll();
	} else if (e.key === 'Enter' && firstSelected && !isEditing && !multipleSelected) {
		e.preventDefault();
		startEdit();
	} else if (e.key === 'Tab' && firstSelected && !isEditing) {
		e.preventDefault();
		navigateNext(!e.shiftKey);
	}

	if (isEditing && e.key === 'Enter') {
		return;
	}
}

function navigateNext(forward: boolean = true) {
	const allEditables = Array.from(document.querySelectorAll('[data-editable]')) as HTMLElement[];
	const currentIndex = allEditables.findIndex(el => selectedElements.has(el));

	let nextIndex = forward ? currentIndex + 1 : currentIndex - 1;
	if (nextIndex >= allEditables.length) nextIndex = 0;
	if (nextIndex < 0) nextIndex = allEditables.length - 1;

	deselectAll();
	selectElement(allEditables[nextIndex]);
}

function updateHistoryState() {
	canUndo = historyManager.canUndo();
	canRedo = historyManager.canRedo();
	
	// Update history info for selected element
	if (firstSelected && selectedType === 'text') {
		const elementId = historyManager.getElementId(firstSelected);
		historyInfo = elementId ? historyManager.getHistoryInfo(elementId) : null;
	}
}

function handleTextInput(element: HTMLElement) {
	if (element.dataset.editable === 'text') {
		historyManager.updateText(element, element.textContent || '');
		updateHistoryState();
	}
}

onMount(() => {
	document.addEventListener('click', deselectAll);
	document.addEventListener('keydown', handleKeydown);
	
	// Initialize history state
	updateHistoryState();

	return () => {
		document.removeEventListener('click', deselectAll);
		document.removeEventListener('keydown', handleKeydown);
	};
});
</script>

<style>
/* Remove outline from contenteditable elements */
[contenteditable="true"]:focus {
	outline: none;
}
</style>

<div class="min-h-screen flex items-center justify-center {inspectorOpen ? 'mr-80' : ''}">
	<div class="w-full max-w-4xl px-4 py-12">
		<!-- Hero Section -->
		<section class="text-center mb-16">
			<h1
				data-editable="text"
				data-max-length="50"
				class="text-5xl font-bold text-gray-900 mb-4 cursor-pointer hover:bg-gray-50 rounded-lg px-4 py-2 transition-colors"
				on:click={handleElementClick}
				on:blur={stopEdit}
				on:input={(e) => handleTextInput(e.currentTarget)}
			>
				Visual CMS Editor
			</h1>
			<p
				data-editable="text"
				data-max-length="200"
				class="text-xl text-gray-600 max-w-2xl mx-auto cursor-pointer hover:bg-gray-50 rounded-lg px-4 py-2 transition-colors"
				on:click={handleElementClick}
				on:blur={stopEdit}
				on:input={(e) => handleTextInput(e.currentTarget)}
			>
				디자인을 보호하면서 컨텐츠만 안전하게 편집할 수 있는 차세대 CMS 에디터
			</p>
		</section>

		<!-- Features Grid -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
			<div class="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
				<div
					data-editable="icon"
					class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-xl mb-6 cursor-pointer hover:bg-blue-200 transition-colors"
					on:click={handleElementClick}
				>
					<Type size={32} />
				</div>
				<h3
					data-editable="text"
					class="text-xl font-semibold text-gray-900 mb-3 cursor-pointer hover:bg-white rounded px-2 py-1 transition-colors"
					on:click={handleElementClick}
					on:blur={stopEdit}
					on:input={(e) => handleTextInput(e.currentTarget)}
				>
					안전한 편집
				</h3>
				<p
					data-editable="text"
					class="text-gray-600 leading-relaxed cursor-pointer hover:bg-white rounded px-2 py-1 transition-colors"
					on:click={handleElementClick}
					on:blur={stopEdit}
					on:input={(e) => handleTextInput(e.currentTarget)}
				>
					디자인 구조를 망칠 걱정 없이 텍스트와 이미지만 수정할 수 있습니다.
				</p>
			</div>

			<div class="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
				<div
					data-editable="icon"
					class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-xl mb-6 cursor-pointer hover:bg-blue-200 transition-colors"
					on:click={handleElementClick}
				>
					<Edit2 size={32} />
				</div>
				<h3
					data-editable="text"
					class="text-xl font-semibold text-gray-900 mb-3 cursor-pointer hover:bg-white rounded px-2 py-1 transition-colors"
					on:click={handleElementClick}
					on:blur={stopEdit}
					on:input={(e) => handleTextInput(e.currentTarget)}
				>
					키보드 중심
				</h3>
				<p
					data-editable="text"
					class="text-gray-600 leading-relaxed cursor-pointer hover:bg-white rounded px-2 py-1 transition-colors"
					on:click={handleElementClick}
					on:blur={stopEdit}
					on:input={(e) => handleTextInput(e.currentTarget)}
				>
					마우스 없이도 빠르게 편집할 수 있는 단축키를 제공합니다.
				</p>
			</div>

			<div class="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
				<div
					data-editable="icon"
					class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-xl mb-6 cursor-pointer hover:bg-blue-200 transition-colors"
					on:click={handleElementClick}
				>
					<Link size={32} />
				</div>
				<h3
					data-editable="text"
					class="text-xl font-semibold text-gray-900 mb-3 cursor-pointer hover:bg-white rounded px-2 py-1 transition-colors"
					on:click={handleElementClick}
					on:blur={stopEdit}
					on:input={(e) => handleTextInput(e.currentTarget)}
				>
					실시간 협업
				</h3>
				<p
					data-editable="text"
					class="text-gray-600 leading-relaxed cursor-pointer hover:bg-white rounded px-2 py-1 transition-colors"
					on:click={handleElementClick}
					on:blur={stopEdit}
					on:input={(e) => handleTextInput(e.currentTarget)}
				>
					여러 사람이 동시에 편집해도 충돌 없이 작업할 수 있습니다.
				</p>
			</div>
		</div>

		<!-- 사용 안내 -->
		<div class="bg-white rounded-xl border border-gray-200 p-6">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">사용 방법</h3>
			<div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
				<div class="flex items-center gap-2">
					<kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">클릭</kbd>
					<span class="text-gray-600">요소 선택</span>
				</div>
				<div class="flex items-center gap-2">
					<kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">재클릭</kbd>
					<span class="text-gray-600">편집 시작</span>
				</div>
				<div class="flex items-center gap-2">
					<kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Shift + 클릭</kbd>
					<span class="text-gray-600">다중 선택</span>
				</div>
				<div class="flex items-center gap-2">
					<kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Enter</kbd>
					<span class="text-gray-600">편집 시작</span>
				</div>
				<div class="flex items-center gap-2">
					<kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Esc</kbd>
					<span class="text-gray-600">편집 종료</span>
				</div>
				<div class="flex items-center gap-2">
					<kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Tab</kbd>
					<span class="text-gray-600">다음/이전</span>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Mode Indicator -->
<div class="fixed top-4 left-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-3">
	<div class="flex items-center gap-2">
		{#if mode === 'select'}
			<Mouse size={20} class="text-blue-600" />
			<span class="text-sm font-medium text-gray-700">선택 모드</span>
		{:else}
			<PenTool size={20} class="text-green-600" />
			<span class="text-sm font-medium text-gray-700">편집 모드</span>
		{/if}
	</div>
	<div class="h-6 w-px bg-gray-200"></div>
	<kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Esc</kbd>
	
	<!-- History controls -->
	{#if canUndo || canRedo}
		<div class="h-6 w-px bg-gray-200"></div>
		<div class="flex items-center gap-1">
			<button
				on:click={() => { historyManager.undo(); updateHistoryState(); }}
				disabled={!canUndo}
				class="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				title="실행 취소 (Cmd+Z)"
			>
				<Undo2 size={16} />
			</button>
			<button
				on:click={() => { historyManager.redo(); updateHistoryState(); }}
				disabled={!canRedo}
				class="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				title="다시 실행 (Cmd+Shift+Z)"
			>
				<Redo2 size={16} />
			</button>
		</div>
	{/if}
</div>

<!-- Inspector Panel -->
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
						{#each Array.from(selectedElements) as element, i}
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
										on:click={() => { historyManager.undo(); updateHistoryState(); }}
										disabled={!historyInfo.canUndo}
										class="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										<Undo2 size={12} />
										<span>실행 취소</span>
									</button>
									<button
										on:click={() => { historyManager.redo(); updateHistoryState(); }}
										disabled={!historyInfo.canRedo}
										class="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										<Redo2 size={12} />
										<span>다시 실행</span>
									</button>
								</div>
							</div>
						</div>
					{/if}

					<!-- Actions -->
					<div>
						<h3 class="text-sm font-semibold text-gray-700 mb-2">작업</h3>
						<div class="space-y-2">
							{#if selectedType === 'text' && mode === 'select'}
								<button
									on:click={() => startEdit()}
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

<!-- Selection Overlay -->
{#if firstSelected}
	<div
		bind:this={overlayElement}
		class="fixed z-50 bg-gray-900 text-white rounded-lg shadow-xl p-1 flex items-center gap-1"
	>
		{#if multipleSelected}
			<span class="px-3 py-1.5 text-xs font-medium">{selectedElements.size}개 선택</span>
		{:else if selectedType === 'text'}
			<button
				on:click={() => startEdit()}
				title="편집 (Enter)"
				class="p-1.5 hover:bg-white/20 rounded transition-colors"
			>
				<Type size={14} />
			</button>
		{:else if selectedType === 'icon'}
			<button
				title="아이콘 변경"
				class="p-1.5 hover:bg-white/20 rounded transition-colors"
			>
				<Edit2 size={14} />
			</button>
		{/if}

		<button
			title="복사 (Cmd+C)"
			class="p-1.5 hover:bg-white/20 rounded transition-colors"
		>
			<Copy size={14} />
		</button>

		<button
			title="삭제"
			class="p-1.5 hover:bg-white/20 rounded transition-colors"
		>
			<Trash2 size={14} />
		</button>
	</div>
{/if}