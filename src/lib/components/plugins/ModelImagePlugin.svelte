<script lang="ts">
  import type { ImageModel } from "$lib/core/models/TemplateModels"
  import { onMount } from "svelte"

  interface Props {
    model: ImageModel
    isSelected?: boolean
    onElementClick?: (e: MouseEvent) => void
  }

  let { model, isSelected = false, onElementClick }: Props = $props()
  let fileInput: HTMLInputElement

  function handleClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (onElementClick) {
      onElementClick(e)
    }

    // If already selected, open file picker (edit mode)
    if (isSelected && fileInput) {
      fileInput.click()
    }
  }

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]

    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, WebP, or GIF)")
        return
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        alert("File size must be less than 5MB")
        return
      }

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file)

      // Update model
      model.src = objectUrl
      model.alt = file.name

      // Dispatch history event
      const historyEvent = new CustomEvent("imageChanged", {
        detail: { element: document.getElementById(model.id), src: objectUrl, alt: file.name },
      })
      document.dispatchEvent(historyEvent)
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    const element = e.currentTarget as HTMLElement
    element.setAttribute("data-drag-over", "true")
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault()
    const element = e.currentTarget as HTMLElement
    element.removeAttribute("data-drag-over")
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    const element = e.currentTarget as HTMLElement
    element.removeAttribute("data-drag-over")

    const file = e.dataTransfer?.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newSrc = e.target?.result as string
        model.src = newSrc
        
        // Dispatch history event
        const historyEvent = new CustomEvent("imageChanged", {
          detail: { element: element, src: newSrc },
        })
        document.dispatchEvent(historyEvent)
      }
      reader.readAsDataURL(file)
    }
  }

  onMount(() => {
    const element = document.getElementById(model.id)
    if (element) {
      element.addEventListener('click', handleClick)
      if (!model.src) {
        // Only add drag/drop listeners to placeholder
        element.addEventListener('dragover', handleDragOver)
        element.addEventListener('dragleave', handleDragLeave)
        element.addEventListener('drop', handleDrop)
      }
      
      return () => {
        element.removeEventListener('click', handleClick)
        element.removeEventListener('dragover', handleDragOver)
        element.removeEventListener('dragleave', handleDragLeave)
        element.removeEventListener('drop', handleDrop)
      }
    }
  })
</script>

<!-- Hidden file input -->
<input
  bind:this={fileInput}
  type="file"
  accept="image/*"
  style="display: none"
  onchange={handleFileChange}
/>

{#if model.src}
  <!-- 이미지 직접 렌더링 -->
  <img
    id={model.id}
    class="image-element {model.className}"
    src={model.src}
    alt={model.alt || ""}
    data-editable="image"
    data-selected={isSelected ? "true" : "false"}
    {...model.attributes}
  />
{:else}
  <!-- 플레이스홀더 (이미지가 없을 때) -->
  <div
    id={model.id}
    class="image-placeholder {model.className}"
    data-editable="image"
    data-selected={isSelected ? "true" : "false"}
    {...model.attributes}
  >
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
      />
    </svg>
    <p>Click to add image</p>
  </div>
{/if}

<style>
  :global(.image-element) {
    cursor: pointer;
    transition: all 0.2s ease;
    display: block;
    max-width: 100%;
    height: auto;
  }

  :global(.image-element[data-selected="true"]) {
    box-shadow: 0 0 0 3px #f59e0b;
  }

  :global(.image-element[data-drag-over="true"]) {
    opacity: 0.7;
    box-shadow: 0 0 0 3px #3b82f6;
  }

  .image-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #9ca3af;
    background-color: #f9fafb;
    transition: all 0.2s;
    cursor: pointer;
    border: 2px dashed #e5e7eb;
    border-radius: 0.375rem;
  }
  
  .image-placeholder:hover {
    color: #6b7280;
    background-color: #f3f4f6;
    border-color: #d1d5db;
  }

  .image-placeholder[data-selected="true"] {
    box-shadow: 0 0 0 3px #f59e0b;
  }

  .image-placeholder[data-drag-over="true"] {
    background-color: #eff6ff;
    border-color: #3b82f6;
  }
</style>