<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  
  interface Props {
    target: string | HTMLElement
    children?: any
  }
  
  let { target, children }: Props = $props()
  
  let targetElement: HTMLElement | null = null
  let portalElement: HTMLDivElement
  
  onMount(() => {
    // 타겟 요소 찾기
    if (typeof target === 'string') {
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

<div bind:this={portalElement} style="display: contents;">
  {@render children?.()}
</div>