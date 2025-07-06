<script lang="ts">
  import type { IconPluginModel } from "$lib/core/plugins/models/PluginModel.svelte"

  interface Props {
    model: IconPluginModel
    class?: string
    isSelected?: boolean
  }

  let { model, class: className = "", isSelected = false }: Props = $props()

  // 사용 가능한 아이콘 목록 (Lucide 아이콘 예시)
  const icons = [
    { name: "zap", path: "M13 10V3L4 14h7v7l9-11h-7z" },
    {
      name: "shield",
      path: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    },
    {
      name: "heart",
      path: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    },
    {
      name: "star",
      path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    },
    { name: "check", path: "M20 6L9 17l-5-5" },
    { name: "x", path: "M18 6L6 18M6 6l12 12" },
  ]

  let showPicker = $state(false)

  function handleClick() {
    model.handleClick?.()
    showPicker = model.state.isEditing
  }

  function selectIcon(iconPath: string) {
    model.setValue(iconPath)
    model.stopEdit()
    showPicker = false
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      model.stopEdit()
      showPicker = false
    }
  }
</script>

<div
  bind:this={model.element}
  class="icon-container {className}"
  data-editable="icon"
  data-selected={isSelected ? "true" : null}
  data-editing={model.state.isEditing || null}
  onclick={handleClick}
  onkeydown={handleKeydown}
>
  <svg
    class="h-full w-full"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    {#if model.state.value}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d={model.state.value}
      />
    {:else}
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    {/if}
  </svg>

  {#if showPicker}
    <div class="icon-picker">
      <div class="icon-grid">
        {#each icons as icon (icon.name)}
          <button
            class="icon-option"
            onclick={() => selectIcon(icon.path)}
            title={icon.name}
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d={icon.path}
              />
            </svg>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .icon-container {
    position: relative;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .icon-picker {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
    background: white;
    border: 1px solid rgb(229 231 235);
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    padding: 8px;
    z-index: 50;
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
  }

  .icon-option {
    padding: 8px;
    background: white;
    border: 1px solid rgb(229 231 235);
    border-radius: 4px;
    transition: all 0.2s;
    cursor: pointer;
  }

  .icon-option:hover {
    background: rgb(249 250 251);
    border-color: rgb(59 130 246);
  }

  [data-editing="true"] {
    outline: 3px solid #f59e0b;
    outline-offset: 3px;
  }
</style>
