<script lang="ts">
	import { X, Plus, Code2, Eye } from 'lucide-svelte';
	import { defaultTemplates, type Template } from '$lib/core/templates/templates';
	import { TemplateConverter } from '$lib/core/templates/converter';
	
	export let isOpen = false;
	export let onSelectTemplate: (template: Template) => void;
	
	let selectedCategory: Template['category'] | 'all' = 'all';
	let previewTemplate: Template | null = null;
	let showCode = false;
	
	$: filteredTemplates = selectedCategory === 'all' 
		? defaultTemplates 
		: defaultTemplates.filter(t => t.category === selectedCategory);
	
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
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
			<div class="border-b border-gray-200 p-6 flex items-center justify-between">
				<h2 class="text-2xl font-bold text-gray-900">템플릿 선택</h2>
				<button
					on:click={() => isOpen = false}
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<X size={20} />
				</button>
			</div>
			
			<div class="flex h-[calc(90vh-88px)]">
				<!-- 카테고리 필터 -->
				<div class="w-48 border-r border-gray-200 p-4">
					<h3 class="text-sm font-semibold text-gray-700 mb-3">카테고리</h3>
					<nav class="space-y-1">
						<button
							on:click={() => selectedCategory = 'all'}
							class="w-full text-left px-3 py-2 rounded-lg text-sm {selectedCategory === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}"
						>
							전체
						</button>
						<button
							on:click={() => selectedCategory = 'hero'}
							class="w-full text-left px-3 py-2 rounded-lg text-sm {selectedCategory === 'hero' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}"
						>
							히어로
						</button>
						<button
							on:click={() => selectedCategory = 'features'}
							class="w-full text-left px-3 py-2 rounded-lg text-sm {selectedCategory === 'features' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}"
						>
							기능 소개
						</button>
						<button
							on:click={() => selectedCategory = 'cta'}
							class="w-full text-left px-3 py-2 rounded-lg text-sm {selectedCategory === 'cta' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}"
						>
							CTA
						</button>
						<button
							on:click={() => selectedCategory = 'content'}
							class="w-full text-left px-3 py-2 rounded-lg text-sm {selectedCategory === 'content' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}"
						>
							콘텐츠
						</button>
					</nav>
				</div>
				
				<!-- 템플릿 그리드 -->
				<div class="flex-1 p-6 overflow-y-auto">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each filteredTemplates as template}
							<div class="group relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
								<!-- 템플릿 미리보기 -->
								<div class="aspect-video bg-gray-50 p-4 overflow-hidden">
									<div class="scale-50 origin-top-left w-[200%] h-[200%]">
										{@html template.html}
									</div>
								</div>
								
								<!-- 템플릿 정보 -->
								<div class="p-4 border-t border-gray-200">
									<h3 class="font-semibold text-gray-900 mb-1">{template.name}</h3>
									<p class="text-sm text-gray-600 mb-3">{template.description}</p>
									
									<div class="flex gap-2">
										<button
											on:click={() => selectTemplate(template)}
											class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
										>
											<Plus size={16} />
											사용하기
										</button>
										<button
											on:click={() => previewCode(template)}
											class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
											title="코드 보기"
										>
											<Code2 size={16} />
										</button>
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

<!-- 코드 미리보기 모달 -->
{#if showCode && previewTemplate}
	<div class="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
		<div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
			<div class="border-b border-gray-200 p-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold text-gray-900">생성된 Svelte 컴포넌트</h3>
				<button
					on:click={() => { showCode = false; previewTemplate = null; }}
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<X size={20} />
				</button>
			</div>
			
			<div class="p-4 overflow-y-auto max-h-[calc(80vh-64px)]">
				<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{convertedCode}</code></pre>
			</div>
		</div>
	</div>
{/if}

<style>
	/* 템플릿 미리보기 스타일 제거 */
	:global(.aspect-video *) {
		pointer-events: none;
	}
</style>