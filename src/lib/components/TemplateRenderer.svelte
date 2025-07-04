<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import type { Template } from '$lib/core/templates/templates';
	
	export let template: Template;
	export let handleElementClick: (e: MouseEvent) => void;
	export let handleTextInput: (element: HTMLElement) => void;
	export let stopEdit: () => void;
	
	let templateContainer: HTMLElement;
	
	// 템플릿 HTML 처리
	$: processedHtml = processTemplate(template);
	
	function processTemplate(template: Template): string {
		const parser = new DOMParser();
		const doc = parser.parseFromString(template.html, 'text/html');
		const body = doc.body;
		
		// 편집 가능한 요소에 속성 추가
		template.editableElements.forEach(element => {
			const targets = body.querySelectorAll(element.selector);
			targets.forEach(target => {
				target.setAttribute('data-editable', element.type);
				
				if (element.constraints?.maxLength) {
					target.setAttribute('data-max-length', element.constraints.maxLength.toString());
				}
				
				// 기본 스타일 추가
				if (element.type === 'text') {
					const currentClass = target.getAttribute('class') || '';
					target.setAttribute('class', `${currentClass} cursor-pointer hover:bg-gray-50 rounded-lg px-4 py-2 transition-colors`);
				}
			});
		});
		
		return body.innerHTML;
	}
	
	// 이벤트 리스너 설정
	function setupEventListeners() {
		if (!templateContainer) return;
		
		// 모든 편집 가능한 요소에 이벤트 리스너 추가
		const editableElements = templateContainer.querySelectorAll('[data-editable]');
		editableElements.forEach((element) => {
			const htmlElement = element as HTMLElement;
			
			// 텍스트 요소의 내용 정리 (처음 렌더링 시에만)
			if (htmlElement.dataset.editable === 'text' && htmlElement.textContent) {
				htmlElement.textContent = htmlElement.textContent.trim();
			}
			
			// 클릭 이벤트
			htmlElement.addEventListener('click', handleElementClick);
			
			// 텍스트 편집 관련 이벤트는 +page.svelte에서 처리
			// blur와 input 이벤트는 편집 모드 시작 시 동적으로 추가됨
		});
		
		// 모든 repeatable 요소에도 이벤트 리스너 추가
		const repeatableElements = templateContainer.querySelectorAll('[data-repeatable]');
		repeatableElements.forEach((element) => {
			const htmlElement = element as HTMLElement;
			
			// 클릭 이벤트
			htmlElement.addEventListener('click', handleElementClick);
		});
	}
	
	// 이벤트 리스너 정리
	function cleanupEventListeners() {
		if (!templateContainer) return;
		
		const editableElements = templateContainer.querySelectorAll('[data-editable]');
		editableElements.forEach((element) => {
			const htmlElement = element as HTMLElement;
			
			htmlElement.removeEventListener('click', handleElementClick);
		});
		
		const repeatableElements = templateContainer.querySelectorAll('[data-repeatable]');
		repeatableElements.forEach((element) => {
			const htmlElement = element as HTMLElement;
			
			htmlElement.removeEventListener('click', handleElementClick);
		});
	}
	
	// 컴포넌트가 마운트될 때 이벤트 리스너 설정
	onMount(() => {
		setupEventListeners();
		
		return () => {
			cleanupEventListeners();
		};
	});
	
	// HTML이 업데이트될 때마다 이벤트 리스너 재설정
	afterUpdate(() => {
		cleanupEventListeners();
		setupEventListeners();
	});
</script>

<!-- 동적으로 렌더링된 템플릿 -->
<div 
	bind:this={templateContainer}
	class="template-content"
>
	{@html processedHtml}
</div>

<style>
	.template-content {
		width: 100%;
	}
	
	/* 편집 가능한 요소 스타일 */
	:global(.template-content [data-editable]) {
		position: relative;
		transition: all 0.2s ease;
	}
	
	/* editable 요소는 repeatable 요소 밖에서만 hover 효과 표시 */
	:global(.template-content [data-editable]:hover) {
		outline: 2px dashed #3b82f6;
		outline-offset: 4px;
	}
	
	/* repeatable 요소 안에 있는 editable 요소는 hover 효과 없음 */
	:global(.template-content [data-repeatable] [data-editable]:hover) {
		outline: none;
		outline-offset: 0;
	}
	
	/* 반복 가능한 요소 스타일 */
	:global(.template-content [data-repeatable]) {
		position: relative;
		transition: all 0.2s ease;
		cursor: pointer;
	}
	
	:global(.template-content [data-repeatable]:hover) {
		outline: 2px dashed #10b981;
		outline-offset: 4px;
		background-color: rgba(16, 185, 129, 0.05);
	}
</style>