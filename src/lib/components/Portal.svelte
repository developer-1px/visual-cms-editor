<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte"

  import type { Snippet } from "svelte"

  interface Props {
    target: string | HTMLElement
    children?: Snippet
  }

  let { target, children }: Props = $props()

  let targetElement: HTMLElement | null = null
  let portalElement: HTMLDivElement

  onMount(async () => {
    await tick() // DOM이 업데이트될 때까지 기다림

    // 타겟 요소 찾기
    if (typeof target === "string") {
      targetElement = document.querySelector(target)
    } else {
      targetElement = target
    }

    if (targetElement && portalElement) {
      targetElement.appendChild(portalElement)
    }
  })

  onDestroy(() => {
    if (portalElement && portalElement.parentNode) {
      portalElement.parentNode.removeChild(portalElement)
    }
  })
</script>

<div
  bind:this={portalElement}
  style="display: contents;"
>
  {@render children?.()}
</div>
