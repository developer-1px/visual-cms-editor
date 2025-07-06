<script lang="ts">
  import { onMount } from "svelte"
  import { hotkeyManager } from "$lib/core/keyboard/HotkeyManager"
  import { allKeymaps } from "$lib/core/keyboard/keymaps/editorKeymaps"
  import { selectedElements, activeSelectionType, isSelectionEmpty } from "$lib/core/selection/SelectionManager"

  interface Props {
    children?: import("svelte").Snippet
  }

  let { children }: Props = $props()

  // 컨텍스트 업데이트
  $effect(() => {
    const hasSelection = !$isSelectionEmpty

    // contenteditable 요소가 있는지 확인
    const editingElement = document.querySelector('[contenteditable="true"], [contenteditable="plaintext-only"]')
    const isEditing = !!editingElement

    // 선택된 요소의 타입 확인
    let selectedType = $activeSelectionType
    if (isEditing && editingElement) {
      selectedType = editingElement.getAttribute("data-editable") || "text"
    }

    hotkeyManager.updateContext({
      mode: isEditing ? "edit" : "select",
      hasSelection,
      isEditing,
      selectedType: selectedType || undefined,
      selectionCount: $selectedElements.size,
    })
  })

  onMount(() => {
    // 모든 키맵 등록
    const unregisters = allKeymaps.map((keymap) => hotkeyManager.registerKeymap(keymap))

    return () => {
      // 모든 키맵 해제
      unregisters.forEach((unregister) => unregister())
    }
  })
</script>

<div class="hotkey-provider">
  {@render children?.()}
</div>

<style>
  .hotkey-provider {
    display: contents;
  }
</style>
