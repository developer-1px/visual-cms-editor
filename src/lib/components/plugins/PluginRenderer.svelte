<script lang="ts">
  import { pluginStore } from "$lib/core/plugins/models/PluginStore.svelte"
  import TextPlugin from "./TextPlugin.svelte"
  import ImagePlugin from "./ImagePlugin.svelte"
  import IconPlugin from "./IconPlugin.svelte"
  import LinkPlugin from "./LinkPlugin.svelte"

  interface Props {
    elementId: string
    type: string
    initialValue?: unknown
    class?: string
    onElementClick?: (e: MouseEvent) => void
    isSelected?: boolean
    [key: string]: unknown // 추가 props 허용
  }

  let {
    elementId,
    type,
    initialValue,
    class: className = "",
    onElementClick,
    isSelected = false,
    ...restProps
  }: Props = $props()

  // 플러그인 모델 가져오기 또는 생성
  const model = $derived(pluginStore.getOrCreate(elementId, type, initialValue))
</script>

{#if type === "text"}
  <TextPlugin
    {model}
    class={className}
    {onElementClick}
    {isSelected}
    {...restProps}
  />
{:else if type === "image"}
  <ImagePlugin
    {model}
    class={className}
    {onElementClick}
    {isSelected}
    {...restProps}
  />
{:else if type === "icon"}
  <IconPlugin
    {model}
    class={className}
    {onElementClick}
    {isSelected}
    {...restProps}
  />
{:else if type === "link"}
  <LinkPlugin
    {model}
    class={className}
    {onElementClick}
    {isSelected}
    {...restProps}
  />
{:else}
  <span
    class={className}
    data-editable={type}
  >
    Unsupported plugin type: {type}
  </span>
{/if}
