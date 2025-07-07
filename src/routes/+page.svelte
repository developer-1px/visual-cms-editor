<script lang="ts">
  import { onMount } from "svelte"
  import {
    Edit2,
    Mouse,
    Undo2,
    Redo2,
    Settings,
    Grid3X3,
    Smartphone,
    Tablet,
    Monitor,
    Expand,
    Plus,
  } from "lucide-svelte"
  import { editorManager } from "$lib/core/EditorManager"
  import { selectElement } from "$lib/core/commands"
  import RightPanel from "$lib/components/RightPanel.svelte"
  import LeftSidebar from "$lib/components/LeftSidebar.svelte"
  import TemplateSelector from "$lib/components/TemplateSelector.svelte"
  import TemplateRendererV3 from "$lib/components/TemplateRendererV3.svelte"
  import MockHeader from "$lib/components/MockHeader.svelte"
  import MockFooter from "$lib/components/MockFooter.svelte"
  import SelectionOverlay from "$lib/components/SelectionOverlay.svelte"
  import SelectionUI from "$lib/components/SelectionUI.svelte"
  import SelectionDebugPanel from "$lib/components/SelectionDebugPanel.svelte"
  import HotkeyProvider from "$lib/components/HotkeyProvider.svelte"
  import HotkeyHints from "$lib/components/HotkeyHints.svelte"
  import type { Template } from "$lib/core/templates/types"

  // 모든 상태는 editorManager를 통해 관리
  let contentContainer: HTMLElement

  // EditorManager에서 스토어들 가져오기
  const selectedTemplatesStore = editorManager.selectedTemplates
  const showLeftSidebarStore = editorManager.showLeftSidebar
  const showRightPanelStore = editorManager.showRightPanel
  const showTemplateSelectorStore = editorManager.showTemplateSelector
  const devicePreviewStore = editorManager.devicePreview
  const canUndoStore = editorManager.canUndo
  const canRedoStore = editorManager.canRedo
  const isEditingStore = editorManager.isEditing
  const editingElementIdStore = editorManager.editingElementId
  const selectedElementsStore = editorManager.selectedElements
  const selectedSectionIndexStore = editorManager.selectedSectionIndex
  const activeSelectionTypeStore = editorManager.activeSelectionType
  const selectionCountStore = editorManager.selectionCount
  const isSelectionEmptyStore = editorManager.isSelectionEmpty

  // 스토어 구독하여 reactive 변수로 만들기
  $: selectedTemplates = $selectedTemplatesStore
  $: showLeftSidebar = $showLeftSidebarStore
  $: showRightPanel = $showRightPanelStore
  $: showTemplateSelector = $showTemplateSelectorStore
  $: devicePreview = $devicePreviewStore
  $: canUndo = $canUndoStore
  $: canRedo = $canRedoStore
  $: isEditing = $isEditingStore
  $: editingElementId = $editingElementIdStore
  $: selectedElements = $selectedElementsStore
  $: selectedSectionIndex = $selectedSectionIndexStore
  $: activeSelectionType = $activeSelectionTypeStore
  $: selectionCount = $selectionCountStore
  $: isSelectionEmpty = $isSelectionEmptyStore

  // 파생 상태들
  $: firstSelected = Array.from(selectedElements)[0]
  $: selectedType = firstSelected?.dataset.editable || (firstSelected?.dataset.repeatable ? "repeatable" : "")

  // 이벤트 핸들러들 - editorManager로 위임
  function handleSelectTemplate(template: Template) {
    editorManager.addTemplate(template)
    editorManager.toggleTemplateSelector()
  }

  function handleSelectSection(index: number) {
    editorManager.selectSection(index)
  }

  function handleReorderSections(fromIndex: number, toIndex: number) {
    editorManager.moveTemplate(fromIndex, toIndex)
  }

  function handleToggleVisibility(_index: number) {
    // TODO: editorManager에 구현
  }

  function handleOverlayAction(action: string) {
    // TODO: editorManager에 구현
    console.log("Overlay action:", action)
  }

  function handleElementClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    const editable = target.closest('[data-editable]') as HTMLElement
    
    if (!editable) return
    
    const editableType = editable.getAttribute('data-editable')
    const editableId = editable.id
    
    if (!editableId || !editableType) return
    
    // Dispatch selection command
    selectElement(
      editableId,
      editable,
      editableType as any,
      'canvas',
      e.shiftKey || e.metaKey || e.ctrlKey
    )
  }

  function handleHistoryAction(action: "undo" | "redo") {
    if (action === "undo") {
      editorManager.undo()
    } else {
      editorManager.redo()
    }
  }

  onMount(() => {
    // 키보드 이벤트 리스너
    document.addEventListener("keydown", editorManager.handleKeydown.bind(editorManager))
    
    // 캔버스 클릭 이벤트 리스너  
    document.addEventListener("click", editorManager.handleCanvasClick.bind(editorManager))

    return () => {
      document.removeEventListener("keydown", editorManager.handleKeydown.bind(editorManager))
      document.removeEventListener("click", editorManager.handleCanvasClick.bind(editorManager))
      editorManager.destroy()
    }
  })
</script>

<HotkeyProvider>
  <!-- Top Bar -->
  <div class="fixed top-0 right-0 left-0 z-30 flex h-12 items-center border-b border-stone-200 bg-white px-2">
    <!-- Left Section -->
    <div class="flex items-center gap-2">
      <button
        class="icon-btn {showLeftSidebar ? 'bg-stone-200' : ''}"
        onclick={editorManager.toggleLeftSidebar.bind(editorManager)}
        title="{showLeftSidebar ? 'Hide' : 'Show'} sections"
      >
        <svg
          class="h-4 w-4 text-stone-600 transition-transform {showLeftSidebar ? '' : 'rotate-180'}"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M15 19l-7-7 7-7"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <!-- Center Section -->
    <div
      class="flex flex-1 justify-center"
      style="margin-left: {showLeftSidebar ? '140px' : '0'}; margin-right: {showRightPanel ? '304px' : '0'}; transition: margin 300ms;"
    >
      <div class="flex items-center gap-2">
        <!-- Mode Indicator -->
        <div class="flex items-center gap-0.5 rounded bg-stone-100 p-0.5">
          <button
            class="icon-btn {!isEditing ? 'bg-blue-500 text-white' : 'text-stone-600'}"
            title="Select Mode"
          >
            <Mouse class="h-4 w-4" />
          </button>
          <button
            class="icon-btn {isEditing ? 'bg-amber-500 text-white' : 'text-stone-600'}"
            title={isEditing ? "Editing Text" : "Edit Mode"}
          >
            <Edit2 class="h-4 w-4" />
          </button>
        </div>

        <!-- Selection Indicator -->
        {#if !isSelectionEmpty && activeSelectionType}
          <div
            class="flex items-center gap-2 px-3 py-1 text-sm {activeSelectionType === 'repeatable'
              ? 'bg-green-200 text-green-800'
              : 'bg-stone-200 text-stone-700'} rounded"
          >
            <span class="font-medium">Selection:</span>
            <span class="capitalize">
              {activeSelectionType}
              {#if selectionCount > 1}
                ({selectionCount})
              {/if}
            </span>
          </div>
        {/if}

        <!-- Editing Status -->
        {#if isEditing}
          <div class="flex items-center gap-2 px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded animate-pulse">
            <Edit2 class="h-4 w-4" />
            <span class="font-medium">편집 중</span>
            {#if editingElementId}
              <span class="text-xs opacity-75">({editingElementId.slice(0, 8)}...)</span>
            {/if}
          </div>
        {/if}

        <!-- History Group -->
        <div class="flex items-center gap-0.5 rounded bg-stone-100 p-0.5">
          <button
            class="icon-btn disabled:cursor-not-allowed disabled:opacity-50"
            onclick={editorManager.undo.bind(editorManager)}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 class="h-4 w-4" />
          </button>
          <button
            class="icon-btn disabled:cursor-not-allowed disabled:opacity-50"
            onclick={editorManager.redo.bind(editorManager)}
            disabled={!canRedo}
            title="Redo"
          >
            <Redo2 class="h-4 w-4" />
          </button>
        </div>

        <!-- Device Preview Group -->
        <div class="flex items-center gap-0.5 rounded bg-stone-100 p-0.5">
          <button
            class="icon-btn {devicePreview === 'mobile' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
            onclick={() => editorManager.setDevicePreview('mobile')}
            title="Mobile Preview (375px)"
          >
            <Smartphone class="h-4 w-4" />
          </button>
          <button
            class="icon-btn {devicePreview === 'tablet' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
            onclick={() => editorManager.setDevicePreview('tablet')}
            title="Tablet Preview (768px)"
          >
            <Tablet class="h-4 w-4" />
          </button>
          <button
            class="icon-btn {devicePreview === 'desktop' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
            onclick={() => editorManager.setDevicePreview('desktop')}
            title="Desktop Preview (1280px)"
          >
            <Monitor class="h-4 w-4" />
          </button>
          <button
            class="icon-btn {devicePreview === 'full' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
            onclick={() => editorManager.setDevicePreview('full')}
            title="Full Width"
          >
            <Expand class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Right Section -->
    <div class="absolute right-2 flex items-center gap-2">
      <button
        class="icon-btn {showRightPanel ? 'bg-stone-200' : ''}"
        onclick={editorManager.toggleRightPanel.bind(editorManager)}
        title="Settings"
      >
        <Settings class="h-4 w-4" />
      </button>
    </div>
  </div>

  <!-- Left Sidebar -->
  <LeftSidebar
    bind:isOpen={$showLeftSidebarStore}
    templates={selectedTemplates}
    onSelectSection={handleSelectSection}
    onReorderSections={handleReorderSections}
    onToggleVisibility={handleToggleVisibility}
    onAddSection={editorManager.toggleTemplateSelector.bind(editorManager)}
  />

  <!-- Main Content -->
  <div class="flex h-screen pt-12">
    <div
      class="relative flex-1 overflow-auto {showRightPanel ? 'mr-80' : ''} {showLeftSidebar
        ? 'ml-40'
        : 'ml-0'} bg-stone-100 transition-all duration-300"
    >
      <div class="flex justify-center {devicePreview === 'full' ? 'p-0' : 'p-8'}">
        <div
          bind:this={contentContainer}
          class="relative bg-white transition-all duration-300 {devicePreview === 'full'
            ? 'w-full'
            : 'shadow-lg'} {devicePreview === 'mobile'
            ? 'max-w-[375px]'
            : devicePreview === 'tablet'
              ? 'max-w-[768px]'
              : devicePreview === 'desktop'
                ? 'max-w-[1280px]'
                : 'max-w-full'}"
          style="width: 100%;"
        >
          <!-- Mock Header -->
          <MockHeader devicePreview={devicePreview} />

          <div class="p-8">
            <!-- Templates -->
            <div class="space-y-8">
              {#each selectedTemplates as template, index (`${template.id}-${index}`)}
                <div
                  class="template-section animate-fade-in {selectedSectionIndex === index ? 'selected-section' : ''}"
                  style="animation-delay: {index * 0.1}s"
                  data-section-index={index}
                  onclick={(e) => {
                    const target = e.target as HTMLElement
                    const editable = target.closest("[data-editable]")
                    const repeatable = target.closest("[data-repeatable]")
                    const pluginPlaceholder = target.closest("[id^='placeholder-']")

                    if (!editable && !repeatable && !pluginPlaceholder) {
                      e.stopPropagation()
                      handleSelectSection(index)
                    }
                  }}
                  role="button"
                  tabindex="0"
                >
                  <TemplateRendererV3
                    {template}
                    onElementClick={handleElementClick}
                  />
                </div>
              {/each}

              <!-- Empty State -->
              {#if selectedTemplates.length === 0}
                <div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
                  <div class="mb-4 flex h-16 w-16 items-center justify-center border-2 border-dashed border-stone-300">
                    <Grid3X3 class="h-8 w-8 text-stone-400" />
                  </div>
                  <button
                    onclick={editorManager.toggleTemplateSelector.bind(editorManager)}
                    class="btn btn-primary"
                  >
                    <Plus class="mr-2 h-4 w-4" />
                    Add Template
                  </button>
                </div>
              {/if}
            </div>

            <!-- Mock Footer -->
            <MockFooter devicePreview={devicePreview} />
          </div>

          <!-- Selection Overlay -->
          <SelectionOverlay
            container={contentContainer}
            onAction={handleOverlayAction}
          />
          
          <!-- Selection UI (outlines and handles) -->
          <SelectionUI />
        </div>
      </div>
    </div>
  </div>

  <!-- Right Panel -->
  <RightPanel
    bind:isOpen={$showRightPanelStore}
    selectedElement={firstSelected}
    historyInfo={null}
    onHistoryAction={handleHistoryAction}
  />

  <!-- Template Selector -->
  <TemplateSelector
    bind:isOpen={$showTemplateSelectorStore}
    onSelectTemplate={handleSelectTemplate}
  />

  <!-- Hotkey Hints -->
  <HotkeyHints />
  
  <!-- Debug Panel -->
  <SelectionDebugPanel />
</HotkeyProvider>