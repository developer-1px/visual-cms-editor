<script lang="ts">
  import type { Template } from "$lib/core/templates/templates"

  interface Props {
    template: Template
    onElementClick: (e: MouseEvent) => void
  }

  let { template, onElementClick }: Props = $props()

  // 선택 상태 추적
  // let selectedPluginElements = $state<Set<string>>(new Set())

  // $effect(() => {
  //   const newSelectedPlugins = new Set<string>()
  //   $selectedElements.forEach((element) => {
  //     const pluginId = element.id
  //     if (pluginId && pluginId.startsWith("plugin-")) {
  //       newSelectedPlugins.add(pluginId)
  //     }
  //   })
  //   selectedPluginElements = newSelectedPlugins
  // })
</script>

<div
  class="template-content"
  onclick={onElementClick}
>
  <!-- 임시로 원본 HTML 표시 -->
  {#if template?.html}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html template.html}
  {/if}
</div>

<style>
  .template-content {
    width: 100%;
  }

  :global([data-plugin-placeholder]) {
    display: contents;
  }
</style>
