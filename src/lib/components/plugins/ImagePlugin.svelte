<script lang="ts">
  import type { ImagePluginModel } from "$lib/core/plugins/models/PluginModel.svelte"
  
  interface Props {
    model: ImagePluginModel
    class?: string
    alt?: string
  }
  
  let { model, class: className = "", alt = "Image" }: Props = $props()
  
  let fileInputRef: HTMLInputElement
  
  function handleClick(e: MouseEvent) {
    model.handleClick?.()
    // 파일 선택 다이얼로그 열기
    if (model.state.isEditing) {
      fileInputRef?.click()
    }
  }
  
  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        model.setValue(dataUrl)
        model.stopEdit()
        
        // 이미지 변경 이벤트 발생
        const imageEvent = new CustomEvent("imageChanged", {
          detail: { element: model.element, src: dataUrl },
        })
        document.dispatchEvent(imageEvent)
      }
      reader.readAsDataURL(file)
    }
  }
  
  function handlePaste(e: ClipboardEvent) {
    const items = e.clipboardData?.items
    if (!items) return
    
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string
            model.setValue(dataUrl)
            
            // 이미지 변경 이벤트 발생
            const imageEvent = new CustomEvent("imageChanged", {
              detail: { element: model.element, src: dataUrl },
            })
            document.dispatchEvent(imageEvent)
          }
          reader.readAsDataURL(file)
        }
        break
      }
    }
  }
</script>

<div
  bind:this={model.element}
  class="image-container {className}"
  data-editable="image"
  data-selected={model.element?.hasAttribute("data-selected") || null}
  data-editing={model.state.isEditing || null}
  onclick={handleClick}
  onpaste={handlePaste}
>
  {#if model.state.value}
    <img src={model.state.value} {alt} class="w-full h-full object-cover" />
  {:else}
    <div class="image-placeholder">
      <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="mt-2 text-sm">Click to upload</p>
    </div>
  {/if}
  
  <input
    bind:this={fileInputRef}
    type="file"
    accept="image/*"
    onchange={handleFileChange}
    class="hidden"
  />
</div>

<style>
  .image-container {
    position: relative;
    cursor: pointer;
    transition: all var(--transition-fast);
    overflow: hidden;
  }
  
  .image-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: rgb(156 163 175);
    background-color: rgb(249 250 251);
    transition: all 0.2s;
  }
  
  .image-container:hover .image-placeholder {
    color: rgb(107 114 128);
    background-color: rgb(243 244 246);
  }
  
  [data-editing="true"] {
    outline: 3px solid #f59e0b;
    outline-offset: 3px;
  }
</style>