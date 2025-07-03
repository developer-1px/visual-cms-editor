<script lang="ts">
import { onMount } from 'svelte';
import { Edit2, Copy, Trash2, Type, Mouse, PenTool, Undo2, Redo2, FileText, Plus } from 'lucide-svelte';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import { historyManager, type HistoryInfo } from '$lib/core/history';
import Inspector from '$lib/components/Inspector.svelte';
import TemplateSelector from '$lib/components/TemplateSelector.svelte';
import TemplateRenderer from '$lib/components/TemplateRenderer.svelte';
import type { Template } from '$lib/core/templates/templates';
import { defaultTemplates } from '$lib/core/templates/templates';

type Mode = 'select' | 'edit';

let selectedElements: Set<HTMLElement> = new Set();
let overlayElement: HTMLElement;
let mode: Mode = 'select';
let inspectorOpen = true;
let canUndo = false;
let canRedo = false;
let templateSelectorOpen = false;
// 샘플 템플릿으로 시작
let selectedTemplates: Template[] = [defaultTemplates[0], defaultTemplates[1]];
let contentContainer: HTMLElement;

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

function handleSelectTemplate(template: Template) {
	selectedTemplates = [...selectedTemplates, template];
	// 템플릿이 추가되면 자동으로 스크롤
	setTimeout(() => {
		const newSection = contentContainer?.lastElementChild;
		if (newSection) {
			newSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, 100);
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


<div class="min-h-screen flex items-center justify-center {inspectorOpen ? 'mr-80' : ''}">
	<div bind:this={contentContainer} class="w-full max-w-4xl px-4 py-12">
		<!-- 템플릿들 렌더링 -->
		{#each selectedTemplates as template, index (template.id + index)}
			<div class="mb-16 template-section">
				<TemplateRenderer 
					{template}
					{handleElementClick}
					{handleTextInput}
					{stopEdit}
				/>
			</div>
		{/each}
		
		<!-- 템플릿이 없을 때 안내 메시지 -->
		{#if selectedTemplates.length === 0}
		<div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
			<div class="mb-8">
				<FileText size={64} class="text-gray-300 mx-auto mb-4" />
				<h2 class="text-2xl font-semibold text-gray-700 mb-2">템플릿을 추가해주세요</h2>
				<p class="text-gray-500">상단의 템플릿 버튼을 클릭하여 원하는 레이아웃을 선택하세요</p>
			</div>
			<button
				on:click={() => templateSelectorOpen = true}
				class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
			>
				<Plus size={20} />
				템플릿 추가하기
			</button>
		</div>
		{/if}
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
	
	<!-- Template button -->
	<div class="h-6 w-px bg-gray-200"></div>
	<button
		on:click={() => templateSelectorOpen = true}
		class="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
		title="템플릿 추가"
	>
		<Plus size={16} />
		템플릿
	</button>
</div>

<!-- Inspector Panel -->
<Inspector
	{selectedElements}
	bind:inspectorOpen
	{historyInfo}
	{mode}
	onStartEdit={startEdit}
	onHistoryAction={(action) => {
		if (action === 'undo') {
			historyManager.undo();
		} else {
			historyManager.redo();
		}
		updateHistoryState();
	}}
/>

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

<!-- Template Selector Modal -->
<TemplateSelector 
	bind:isOpen={templateSelectorOpen}
	onSelectTemplate={handleSelectTemplate}
/>

<style>
  :global(*[contenteditable]) {
    outline: none;
  }
  
  /* 템플릿 섹션 스타일 */
  .template-section {
    position: relative;
  }
  
  .template-section::before {
    content: '';
    position: absolute;
    top: -2rem;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #e5e7eb, transparent);
  }
  
  .template-section:first-child::before {
    display: none;
  }
</style>
