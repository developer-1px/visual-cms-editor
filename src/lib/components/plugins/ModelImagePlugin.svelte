<script lang="ts">
  import type { ImageModel } from "$lib/core/models/TemplateModels"

  interface Props {
    model: ImageModel
    isSelected?: boolean
    onElementClick?: (e: MouseEvent) => void
  }

  let { model, isSelected = false, onElementClick }: Props = $props()
  let fileInput: HTMLInputElement

  function handleClick(e: MouseEvent) {
    // Prevent event propagation to avoid document click handler
    e.stopPropagation()

    console.log("🖼️ ModelImagePlugin handleClick:", {
      isSelected,
      modelId: model.id,
      hasOnElementClick: !!onElementClick,
    })

    // Always call the parent click handler first (for selection)
    if (onElementClick) {
      console.log("🔄 Calling parent onElementClick from ModelImagePlugin")
      onElementClick(e)
    }

    // If already selected, also open file picker
    if (isSelected) {
      console.log("📁 Opening file picker since element is already selected")
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

      // Update model (would need proper state management in real implementation)
      console.log("🖼️ Image selected:", { file: file.name, url: objectUrl })

      // Dispatch history event
      const historyEvent = new CustomEvent("imageChanged", {
        detail: { element: document.getElementById(model.id), src: objectUrl, alt: file.name },
      })
      document.dispatchEvent(historyEvent)
    }
  }
</script>

<div
  id={model.id}
  class="image-container {model.className}"
  data-editable="image"
  data-selected={isSelected ? "true" : null}
  onclick={handleClick}
  {...model.attributes}
>
  <!-- Hidden file input -->
  <input
    bind:this={fileInput}
    type="file"
    accept="image/*"
    style="display: none"
    onchange={handleFileChange}
  />

  {#if model.src}
    <img
      src={model.src}
      alt={model.alt || ""}
    />
  {:else}
    <div class="image-placeholder">
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
</div>

<style>
  .image-container {
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
    overflow: hidden;
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
  }

  .image-container:hover .image-placeholder {
    color: #6b7280;
    background-color: #f3f4f6;
  }

  [data-selected="true"] {
    outline: 3px solid #f59e0b;
    outline-offset: 3px;
  }
</style>
