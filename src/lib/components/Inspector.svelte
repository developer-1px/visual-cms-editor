<script lang="ts">
  import { Copy, Trash2, Edit2, Type, FileText } from "lucide-svelte"

  export let selectedElement: HTMLElement | null = null

  $: selectedType = selectedElement?.dataset.editable || ""
  $: hasSelection = !!selectedElement
  $: elementInfo = selectedElement
    ? {
        tag: selectedElement.tagName.toLowerCase(),
        content: selectedElement.textContent || "",
        maxLength: selectedElement.dataset.maxLength,
        classes: Array.from(selectedElement.classList).join(" "),
        type: selectedType,
      }
    : null

  function copyElement() {
    if (!selectedElement) return
    const textToCopy = selectedElement.textContent || selectedElement.outerHTML
    navigator.clipboard.writeText(textToCopy)
  }

  function deleteElement() {
    if (!selectedElement) return
    selectedElement.remove()
  }

  function editElement() {
    if (!selectedElement || selectedType !== "text") return
    selectedElement.focus()
  }
</script>

<!-- Inspector Content (used within RightPanel) -->
<div>
  {#if hasSelection}
    <div class="animate-fade-in space-y-6">
      <!-- Element Type -->
      <div>
        <div class="mb-3 flex items-center gap-2">
          {#if selectedType === "text"}
            <Type class="h-4 w-4 text-stone-600" />
          {:else}
            <FileText class="h-4 w-4 text-stone-600" />
          {/if}
          <span class="text-sm font-medium text-stone-900 capitalize">{selectedType}</span>
        </div>
      </div>

      <!-- Element Info -->
      <div class="card p-4">
        <h4 class="mb-3 text-sm font-medium text-stone-900">Element</h4>
        <div class="space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-stone-600">Tag</span>
            <code class="bg-stone-100 px-2 py-1 text-stone-800">{elementInfo?.tag}</code>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-600">Type</span>
            <span class="text-stone-900 capitalize">{selectedType}</span>
          </div>
          {#if elementInfo?.maxLength}
            <div class="flex justify-between">
              <span class="text-stone-600">Max Length</span>
              <span class="text-stone-900">{elementInfo.maxLength}</span>
            </div>
          {/if}
        </div>
      </div>

      <!-- Content Preview -->
      {#if selectedType === "text" && elementInfo?.content}
        <div class="card p-4">
          <h4 class="mb-3 text-sm font-medium text-stone-900">Content</h4>
          <div class="border border-stone-200 bg-stone-50 p-3 font-mono text-xs text-stone-800">
            {elementInfo.content}
          </div>
          <div class="mt-2 flex justify-between text-xs text-stone-500">
            <span>{elementInfo.content.length} chars</span>
            {#if elementInfo.maxLength}
              <span>/ {elementInfo.maxLength} max</span>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Actions -->
      <div class="space-y-2">
        {#if selectedType === "text"}
          <button
            onclick={editElement}
            class="btn btn-primary w-full text-sm"
          >
            <Edit2 class="mr-2 h-4 w-4" />
            Edit Text
          </button>
        {/if}
        <button
          onclick={copyElement}
          class="btn w-full text-sm"
        >
          <Copy class="mr-2 h-4 w-4" />
          Copy
        </button>
        <button
          onclick={deleteElement}
          class="btn w-full text-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 class="mr-2 h-4 w-4" />
          Delete
        </button>
      </div>

      <!-- CSS Classes -->
      {#if elementInfo?.classes}
        <div class="card p-4">
          <h4 class="mb-3 text-sm font-medium text-stone-900">Classes</h4>
          <code class="block border border-stone-200 bg-stone-50 p-3 text-xs break-all text-stone-800">
            {elementInfo.classes}
          </code>
        </div>
      {/if}
    </div>
  {/if}
</div>
