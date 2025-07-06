<script lang="ts">
  import { onMount } from "svelte"
  import { get } from "svelte/store"
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
  import { historyManager, type HistoryInfo } from "$lib/core/history"
  import RightPanel from "$lib/components/RightPanel.svelte"
  import LeftSidebar from "$lib/components/LeftSidebar.svelte"
  import TemplateSelector from "$lib/components/TemplateSelector.svelte"
  import TemplateRendererV3 from "$lib/components/TemplateRendererV3.svelte"
  import MockHeader from "$lib/components/MockHeader.svelte"
  import MockFooter from "$lib/components/MockFooter.svelte"
  import SelectionOverlay from "$lib/components/SelectionOverlay.svelte"
  import HotkeyProvider from "$lib/components/HotkeyProvider.svelte"
  import HotkeyHints from "$lib/components/HotkeyHints.svelte"
  import type { Template } from "$lib/core/templates/types"
  import { defaultTemplates } from "$lib/core/templates/templates"
  import {
    selectionManager,
    selectedElements,
    selectedSectionIndex,
    activeSelectionType,
    selectionCount,
    isSelectionEmpty,
    type SelectionType,
  } from "$lib/core/selection/SelectionManager"
  import { editablePluginManager } from "$lib/core/plugins"
  import { selectionActionManager, initializeActionHandlers } from "$lib/core/actions"

  // Mode is now handled by individual plugins
  let rightPanelOpen = true
  let leftSidebarOpen = true
  let canUndo = false
  let canRedo = false
  let templateSelectorOpen = false
  let selectedTemplates: Template[] = [
    defaultTemplates[0], // Hero
    // defaultTemplates[1], // Centered Hero - 제거 (Hero와 겹침)
    defaultTemplates[2], // Features Grid
    defaultTemplates[3], // CTA
    defaultTemplates[4], // Two Column Content
    defaultTemplates[5], // Testimonial
    defaultTemplates[6], // Pricing
    defaultTemplates[7], // Tabbed Showcase
  ]
  let contentContainer: HTMLElement
  let devicePreview: "mobile" | "tablet" | "desktop" | "full" = "full"

  $: firstSelected = Array.from($selectedElements)[0]
  $: selectedType = firstSelected?.dataset.editable || (firstSelected?.dataset.repeatable ? "repeatable" : "")
  $: isEditing = firstSelected?.hasAttribute("contenteditable") || firstSelected?.hasAttribute("data-editing") || false

  let historyInfo: HistoryInfo | null = null
  $: if (firstSelected && selectedType === "text") {
    const elementId = historyManager.getElementId(firstSelected)
    historyInfo = elementId ? historyManager.getHistoryInfo(elementId) : null
  } else {
    historyInfo = null
  }

  function handleHistoryAction(action: "undo" | "redo") {
    if (action === "undo") {
      undo()
    } else {
      redo()
    }
  }

  function handleElementClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    const currentTarget = e.currentTarget as HTMLElement

    console.log("🔵 Simple handleElementClick called:", {
      target: target?.tagName || "null",
      targetId: target?.id || "null",
      currentTarget: currentTarget?.tagName || "null",
      currentTargetId: currentTarget?.id || "null",
      hasCurrentTarget: !!currentTarget,
    })

    // Use currentTarget if available, otherwise use target
    const elementToCheck = currentTarget || target
    if (!elementToCheck) {
      console.log("🔴 No element to check")
      return
    }

    const editable =
      (elementToCheck.closest("[data-editable]") as HTMLElement) ||
      (elementToCheck.hasAttribute("data-editable") ? elementToCheck : null)
    const repeatable = elementToCheck.closest("[data-repeatable]") as HTMLElement

    console.log("🔍 Found elements:", {
      editable: editable
        ? {
            tag: editable.tagName,
            id: editable.id,
            classes: editable.className,
            editableType: editable.getAttribute("data-editable"),
          }
        : null,
      repeatable: repeatable
        ? {
            tag: repeatable.tagName,
            classes: repeatable.className,
          }
        : null,
    })

    // Clear previous selections
    selectionManager.clear()

    // Simple selection: add to store
    if (editable) {
      console.log("🟢 Selecting editable element", {
        id: editable.id,
        tag: editable.tagName,
        type: editable.getAttribute("data-editable"),
      })
      e.stopPropagation()

      // Add to selection store - this is what triggers the overlay!
      const editableType = (editable.getAttribute("data-editable") as SelectionType) || "text"
      const selectionId = selectionManager.select(editable, editableType, "canvas")
      console.log("✅ Selection result:", {
        selectionId,
        selectedCount: get(selectionCount),
        selectedElements: Array.from(get(selectedElements)),
        isSelectionEmpty: get(isSelectionEmpty),
        elementInStore: get(selectedElements).has(editable),
      })
    } else if (repeatable) {
      console.log("🟢 Selecting repeatable element")
      e.stopPropagation()

      // Add to selection store
      const selectionId = selectionManager.select(repeatable, "repeatable", "canvas")
      console.log("✅ Selection result (repeatable):", {
        selectionId,
        selectedCount: get(selectionCount),
        selectedElements: Array.from(get(selectedElements)),
        isSelectionEmpty: get(isSelectionEmpty),
      })
    } else {
      console.log("🔴 No editable or repeatable element found")
    }
  }


  function selectElement(element: HTMLElement, multi = false) {
    // Determine selection type
    let type: SelectionType = "text"
    if (element.hasAttribute("data-repeatable")) {
      type = "repeatable"
    } else if (element.dataset.editable) {
      type = element.dataset.editable as SelectionType
    }

    // Use the unified selection manager
    selectionManager.select(element, type, "canvas", undefined, { multi })

    // Initialize element with plugin system if it's editable
    if (element.dataset.editable) {
      editablePluginManager.initElement(element)
    }

    // Edit mode visual styles are now handled by the contenteditable CSS rules

    // Overlay position is now handled by the SelectionOverlay component

    // Register element for history tracking based on type
    if (element.dataset.editable === "text") {
      const elementId = historyManager.registerElement(element, element.textContent || "")
      historyManager.onTextChange(elementId, (newText) => {
        if (element.textContent !== newText) {
          element.textContent = newText
        }
      })
      updateHistoryState()
    } else if (element.dataset.editable === "image") {
      // Register image changes for history
      element.addEventListener("imageChanged", () => {
        if (contentContainer) {
          historyManager.saveStructuralState(contentContainer)
          updateHistoryState()
        }
      })
    }
  }


  function handleDocumentClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    console.log("🔵 handleDocumentClick:", {
      target: target.tagName,
      targetClass: target.className,
      isEditing,
      targetIsContentEditable: target.hasAttribute("contenteditable"),
      firstSelected: firstSelected?.tagName,
    })

    // Don't deselect if clicking on the editing element or if editing
    if (isEditing) {
      console.log("🟡 In edit mode - ignoring document click")
      return
    }

    // Don't deselect if clicking on selected element or its children
    if (firstSelected && (target === firstSelected || firstSelected.contains(target))) {
      console.log("🟡 Clicked on selected element - ignoring document click")
      return
    }

    // Don't deselect if clicking on editable/repeatable elements (they handle their own selection)
    if (target.closest("[data-editable], [data-repeatable]")) {
      console.log("🟡 Clicked on editable/repeatable - ignoring document click")
      return
    }

    console.log("🔴 Document click -> deselectAll")
    deselectAll()
  }

  function deselectAll() {
    console.log("🔴 deselectAll called:", {
      isEditing,
      selectedCount: $selectedElements.size,
      caller: new Error().stack?.split("\n").slice(1, 3).join(" -> "),
    })

    // Use the unified selection manager to clear
    selectionManager.clear()
  }

  // Mode switching is now handled by plugins

  // Text editing is now handled by textPlugin

  // Edit blur and stop edit are now handled by textPlugin

  // Text input is now handled by textPlugin through textChanged event

  // Edit target switching is now handled by textPlugin

  function hydrateNewElement(element: HTMLElement) {
    // Add event listeners to the new element and its children
    if (element.hasAttribute("data-repeatable")) {
      element.addEventListener("click", handleElementClick)
    }

    // Add event listeners to all editable elements within the new element
    const editableElements = element.querySelectorAll("[data-editable]")
    editableElements.forEach((editableEl) => {
      const htmlElement = editableEl as HTMLElement
      htmlElement.addEventListener("click", handleElementClick)
    })

    // Add event listeners to all repeatable elements within the new element
    const repeatableElements = element.querySelectorAll("[data-repeatable]")
    repeatableElements.forEach((repeatableEl) => {
      const htmlElement = repeatableEl as HTMLElement
      htmlElement.addEventListener("click", handleElementClick)
    })
  }

  function hydrateAllElements() {
    if (!contentContainer) return

    // Remove existing event listeners to avoid duplicates
    const allClickableElements = contentContainer.querySelectorAll("[data-editable], [data-repeatable]")
    allClickableElements.forEach((element) => {
      const htmlElement = element as HTMLElement
      htmlElement.removeEventListener("click", handleElementClick)
    })

    // Re-add event listeners to all elements
    allClickableElements.forEach((element) => {
      const htmlElement = element as HTMLElement
      htmlElement.addEventListener("click", handleElementClick)
    })
  }

  function handleOverlayAction(action: string) {
    switch (action) {
      case "edit":
        if (firstSelected) {
          editablePluginManager.handleDoubleClick(firstSelected, new MouseEvent("dblclick"))
        }
        break
      case "copy":
        handleCopyShortcut()
        break
      case "cut":
        handleCutShortcut()
        break
      case "delete":
        if ($activeSelectionType === "section") {
          // Handle section deletion
          const sectionIndex = $selectedSectionIndex
          if (sectionIndex !== null) {
            removeTemplate(sectionIndex)
          }
        } else {
          handleDeleteShortcut()
        }
        break
      case "moveUp":
        if ($activeSelectionType === "section" && $selectedSectionIndex !== null && $selectedSectionIndex > 0) {
          handleReorderSections($selectedSectionIndex, $selectedSectionIndex - 1)
        }
        break
      case "moveDown":
        if (
          $activeSelectionType === "section" &&
          $selectedSectionIndex !== null &&
          $selectedSectionIndex < selectedTemplates.length - 1
        ) {
          handleReorderSections($selectedSectionIndex, $selectedSectionIndex + 1)
        }
        break
      case "toggleVisibility":
        if ($activeSelectionType === "section" && $selectedSectionIndex !== null) {
          handleToggleVisibility($selectedSectionIndex)
        }
        break
      case "replace":
        // TODO: Implement image/icon replacement
        console.log("Replace action for", $activeSelectionType)
        break
      case "editLink":
        // TODO: Implement link editing
        console.log("Edit link action")
        break
    }
  }

  // 키보드 이벤트는 이제 HotkeyProvider에서 처리됨

  // 🚀 새로운 전략 패턴 기반 핸들러들 - 분기 로직 제거!
  async function handleCopyShortcut() {
    if (firstSelected) {
      try {
        await selectionActionManager.executeAction("copy", firstSelected, selectedType)
      } catch (error) {
        console.error("Copy action failed:", error)
      }
    }
  }

  async function handleCutShortcut() {
    if (firstSelected) {
      try {
        await selectionActionManager.executeAction("cut", firstSelected, selectedType)
      } catch (error) {
        console.error("Cut action failed:", error)
      }
    }
  }


  async function handleDeleteShortcut() {
    console.log("Delete shortcut triggered", { firstSelected, selectedType, isEditing })
    if (firstSelected) {
      try {
        await selectionActionManager.executeAction("delete", firstSelected, selectedType)
      } catch (error) {
        console.error("Delete action failed:", error)
      }
    }
  }


  function undo() {
    if (canUndo) {
      const changedElementId = historyManager.undo()
      updateHistoryState()

      // Re-hydrate all elements after DOM changes
      hydrateAllElements()

      // Select the changed element
      if (changedElementId) {
        const element = historyManager.getElementById(changedElementId)
        if (element) {
          deselectAll()
          selectElement(element, false)
          // Flash effect to show what changed
          element.animate([{ backgroundColor: "rgba(59, 130, 246, 0.3)" }, { backgroundColor: "transparent" }], {
            duration: 600,
            easing: "ease-out",
          })
        }
      }
    }
  }

  function redo() {
    if (canRedo) {
      const changedElementId = historyManager.redo()
      updateHistoryState()

      // Re-hydrate all elements after DOM changes
      hydrateAllElements()

      // Select the changed element
      if (changedElementId) {
        const element = historyManager.getElementById(changedElementId)
        if (element) {
          deselectAll()
          selectElement(element, false)
          // Flash effect to show what changed
          element.animate([{ backgroundColor: "rgba(59, 130, 246, 0.3)" }, { backgroundColor: "transparent" }], {
            duration: 600,
            easing: "ease-out",
          })
        }
      }
    }
  }

  function updateHistoryState() {
    canUndo = historyManager.canUndo()
    canRedo = historyManager.canRedo()
  }

  function removeTemplate(index: number) {
    selectedTemplates = selectedTemplates.filter((_, i) => i !== index)
  }

  function handleSelectTemplate(template: Template) {
    selectedTemplates = [...selectedTemplates, template]
    templateSelectorOpen = false
  }

  function handleSelectSection(index: number) {
    // Clear any canvas selections when selecting a section
    deselectAll()

    // Use the unified selection manager for section selection
    // This will be available to both sidebar and canvas
    selectionManager.select(index, "section", "canvas", selectedTemplates[index])
  }

  function handleReorderSections(fromIndex: number, toIndex: number) {
    const newTemplates = [...selectedTemplates]
    const [removed] = newTemplates.splice(fromIndex, 1)
    newTemplates.splice(toIndex, 0, removed)
    selectedTemplates = newTemplates
  }

  function handleToggleVisibility(index: number) {
    // This could be implemented to hide/show sections
    // For now, we'll just log it
    console.log("Toggle visibility for section", index)
  }

  function handleDoubleClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    const editable = target.closest("[data-editable]") as HTMLElement

    if (editable) {
      e.stopPropagation()

      // Use plugin system for handling double clicks
      editablePluginManager.handleDoubleClick(editable, e)

      // Select element if not already selected
      if (!$selectedElements.has(editable)) {
        deselectAll()
        selectElement(editable)
      }

      // Plugin system handles edit mode start
      // No additional action needed here as the plugin's onClick was called above
    }
  }

  // 🚀 RepeatableActionHandler 이벤트 핸들러들
  function handleSaveHistoryState() {
    if (contentContainer) {
      historyManager.saveStructuralState(contentContainer)
    }
  }

  function handleUpdateHistoryState() {
    updateHistoryState()
  }

  function handleElementPasted(e: Event) {
    const customEvent = e as CustomEvent
    const newElement = customEvent.detail?.newElement

    if (newElement) {
      // 새 요소 선택
      deselectAll()
      selectElement(newElement, false)
    }
  }

  function handleNeedsHydration(e: Event) {
    const customEvent = e as CustomEvent
    const element = customEvent.detail?.element

    if (element) {
      hydrateNewElement(element)
    }
  }

  function handleTextChanged(e: Event) {
    const customEvent = e as CustomEvent
    const element = customEvent.detail?.element
    const text = customEvent.detail?.text

    if (element && text !== undefined) {
      const elementId = historyManager.getElementId(element)
      if (elementId) {
        historyManager.updateText(elementId, text)
        updateHistoryState()
      }
    }
  }

  function handleImageChanged(e: Event) {
    console.log("🖼️ Image changed event received")
    const customEvent = e as CustomEvent
    const element = customEvent.detail?.element
    const src = customEvent.detail?.src
    const alt = customEvent.detail?.alt

    if (element && contentContainer) {
      // Update the image element
      const img = element.querySelector("img")
      if (img && src) {
        img.src = src
        if (alt) img.alt = alt
      }

      // Save structural state for history
      historyManager.saveStructuralState(contentContainer)
      updateHistoryState()
    }
  }

  function handleIconChanged(e: Event) {
    console.log("🎯 Icon changed event received")
    const customEvent = e as CustomEvent
    const element = customEvent.detail?.element
    const pathData = customEvent.detail?.pathData

    if (element && contentContainer && pathData) {
      // Update the icon element
      const path = element.querySelector("path")
      if (path) {
        path.setAttribute("d", pathData)
      }

      // Save structural state for history
      historyManager.saveStructuralState(contentContainer)
      updateHistoryState()
    }
  }

  function handleLinkChanged(e: Event) {
    console.log("🔗 Link changed event received")
    const customEvent = e as CustomEvent
    const element = customEvent.detail?.element
    const href = customEvent.detail?.href
    const text = customEvent.detail?.text

    if (element && contentContainer) {
      // Update the link element
      if (href !== undefined) element.href = href
      if (text !== undefined) element.textContent = text

      // Save structural state for history
      historyManager.saveStructuralState(contentContainer)
      updateHistoryState()
    }
  }

  onMount(() => {
    // 🚀 액션 핸들러 시스템 초기화
    initializeActionHandlers()

    document.addEventListener("click", handleDocumentClick)
    document.addEventListener("dblclick", handleDoubleClick)

    // RepeatableActionHandler 이벤트 리스너 추가
    document.addEventListener("saveHistoryState", handleSaveHistoryState)
    document.addEventListener("updateHistoryState", handleUpdateHistoryState)
    document.addEventListener("elementPasted", handleElementPasted)
    document.addEventListener("needsHydration", handleNeedsHydration)

    // Plugin 이벤트 리스너 추가
    document.addEventListener("textChanged", handleTextChanged)
    document.addEventListener("imageChanged", handleImageChanged)
    document.addEventListener("iconChanged", handleIconChanged)
    document.addEventListener("linkChanged", handleLinkChanged)

    updateHistoryState()

    // Wait for content container to be ready and save initial state
    setTimeout(() => {
      if (contentContainer) {
        historyManager.saveStructuralState(contentContainer)
      }
    }, 100)

    return () => {
      // Clean up any remaining editable elements
      document.querySelectorAll("[contenteditable]").forEach((element) => {
        ;(element as HTMLElement).removeAttribute("contenteditable")
      })

      document.removeEventListener("click", handleDocumentClick)
      document.removeEventListener("dblclick", handleDoubleClick)
      document.removeEventListener("saveHistoryState", handleSaveHistoryState)
      document.removeEventListener("updateHistoryState", handleUpdateHistoryState)
      document.removeEventListener("elementPasted", handleElementPasted)
      document.removeEventListener("needsHydration", handleNeedsHydration)
      document.removeEventListener("textChanged", handleTextChanged)
      document.removeEventListener("imageChanged", handleImageChanged)
      document.removeEventListener("iconChanged", handleIconChanged)
      document.removeEventListener("linkChanged", handleLinkChanged)
    }
  })
</script>

<HotkeyProvider>
  <!-- Top Bar -->
  <div class="fixed top-0 right-0 left-0 z-30 flex h-12 items-center border-b border-stone-200 bg-white px-2">
    <!-- Left Section -->
    <div class="flex items-center gap-2">
      <!-- Toggle Left Sidebar -->
      <button
        class="icon-btn {leftSidebarOpen ? 'bg-stone-200' : ''}"
        onclick={() => (leftSidebarOpen = !leftSidebarOpen)}
        title="{leftSidebarOpen ? 'Hide' : 'Show'} sections"
      >
        <svg
          class="h-4 w-4 text-stone-600 transition-transform {leftSidebarOpen ? '' : 'rotate-180'}"
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

    <!-- Center Section - All Controls -->
    <div
      class="flex flex-1 justify-center"
      style="margin-left: {leftSidebarOpen ? '140px' : '0'}; margin-right: {rightPanelOpen
        ? '304px'
        : '0'}; transition: margin 300ms;"
    >
      <div class="flex items-center gap-2">
        <!-- Mode Indicator -->
        <div class="flex items-center gap-0.5 rounded bg-stone-100 p-0.5">
          <button
            class="icon-btn {!isEditing ? 'bg-blue-500 text-white' : 'text-stone-600'}"
            onclick={() => {
              if (isEditing && firstSelected) {
                // Stop editing
                firstSelected.removeAttribute("contenteditable")
                firstSelected.removeAttribute("data-editing")
                firstSelected.blur()
              }
            }}
            title="Select Mode"
          >
            <Mouse class="h-4 w-4" />
          </button>
          <button
            class="icon-btn {isEditing ? 'bg-amber-500 text-white' : 'text-stone-600'}"
            onclick={() => {
              if (firstSelected && selectedType === "text" && !isEditing) {
                editablePluginManager.handleDoubleClick(firstSelected, new MouseEvent("dblclick"))
              }
            }}
            title={isEditing ? "Editing Text" : "Edit Mode"}
          >
            <Edit2 class="h-4 w-4" />
          </button>
        </div>

        <!-- Selection Indicator -->
        {#if !$isSelectionEmpty && $activeSelectionType}
          <div
            class="flex items-center gap-2 px-3 py-1 text-sm {$activeSelectionType === 'repeatable'
              ? 'bg-green-200 text-green-800'
              : 'bg-stone-200 text-stone-700'} rounded"
          >
            <span class="font-medium">Selection:</span>
            <span class="capitalize">
              {$activeSelectionType}
              {#if $selectionCount > 1}
                ({$selectionCount})
              {/if}
            </span>
          </div>
        {/if}

        <!-- History Group -->
        <div class="flex items-center gap-0.5 rounded bg-stone-100 p-0.5">
          <button
            class="icon-btn disabled:cursor-not-allowed disabled:opacity-50"
            onclick={undo}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 class="h-4 w-4" />
          </button>
          <button
            class="icon-btn disabled:cursor-not-allowed disabled:opacity-50"
            onclick={redo}
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
            onclick={() => (devicePreview = "mobile")}
            title="Mobile Preview (375px)"
          >
            <Smartphone class="h-4 w-4" />
          </button>
          <button
            class="icon-btn {devicePreview === 'tablet' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
            onclick={() => (devicePreview = "tablet")}
            title="Tablet Preview (768px)"
          >
            <Tablet class="h-4 w-4" />
          </button>
          <button
            class="icon-btn {devicePreview === 'desktop' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
            onclick={() => (devicePreview = "desktop")}
            title="Desktop Preview (1280px)"
          >
            <Monitor class="h-4 w-4" />
          </button>
          <button
            class="icon-btn {devicePreview === 'full' ? 'bg-blue-500 text-white' : 'text-stone-600'}"
            onclick={() => (devicePreview = "full")}
            title="Full Width"
          >
            <Expand class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Right Section -->
    <div class="absolute right-2 flex items-center gap-2">
      <!-- Settings Button -->
      <button
        class="icon-btn {rightPanelOpen ? 'bg-stone-200' : ''}"
        onclick={() => (rightPanelOpen = !rightPanelOpen)}
        title="Settings"
      >
        <Settings class="h-4 w-4" />
      </button>
    </div>
  </div>

  <!-- Left Sidebar -->
  <LeftSidebar
    bind:isOpen={leftSidebarOpen}
    templates={selectedTemplates}
    onSelectSection={handleSelectSection}
    onReorderSections={handleReorderSections}
    onToggleVisibility={handleToggleVisibility}
    onAddSection={() => (templateSelectorOpen = true)}
  />

  <!-- Main Content -->
  <div class="flex h-screen pt-12">
    <div
      class="flex-1 overflow-auto relative {rightPanelOpen ? 'mr-80' : ''} {leftSidebarOpen
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
          <MockHeader {devicePreview} />

          <div class="p-8">
            <!-- Templates -->
            <div class="space-y-8">
              {#each selectedTemplates as template, index (`${template.id}-${index}`)}
                <div
                  class="template-section animate-fade-in {$selectedSectionIndex === index ? 'selected-section' : ''}"
                  style="animation-delay: {index * 0.1}s"
                  data-section-index={index}
                  onclick={(e) => {
                    // Check if clicking on an editable element or its children
                    const target = e.target as HTMLElement
                    const editable = target.closest("[data-editable]")
                    const repeatable = target.closest("[data-repeatable]")

                    // Also check if target is inside a plugin component
                    const pluginPlaceholder = target.closest("[id^='placeholder-']")

                    // If not clicking on editable/repeatable content or plugin components, select the section
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
                    onclick={() => (templateSelectorOpen = true)}
                    class="btn btn-primary"
                  >
                    <Plus class="mr-2 h-4 w-4" />
                    Add Template
                  </button>
                </div>
              {/if}
            </div>

            <!-- Mock Footer -->
            <MockFooter {devicePreview} />
          </div>

          <!-- Unified Selection Overlay - Inside scroll container -->
          <SelectionOverlay
            container={contentContainer}
            onAction={handleOverlayAction}
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Right Panel -->
  <RightPanel
    bind:isOpen={rightPanelOpen}
    selectedElement={firstSelected}
    {historyInfo}
    onHistoryAction={handleHistoryAction}
  />

  <!-- Template Selector -->
  <TemplateSelector
    bind:isOpen={templateSelectorOpen}
    onSelectTemplate={handleSelectTemplate}
  />


  <!-- Hotkey Hints -->
  <HotkeyHints />
</HotkeyProvider>
