<script lang="ts">
  import { onMount, tick } from "svelte"
  import type { Template } from "$lib/core/templates/templates"
  import PluginRenderer from "./plugins/PluginRenderer.svelte"
  import Portal from "./Portal.svelte"
  
  interface Props {
    template: Template
    onElementClick: (e: MouseEvent) => void
  }
  
  let { template, onElementClick }: Props = $props()
  
  let container: HTMLElement
  let processedElements = $state<Array<{
    id: string
    type: string
    initialValue: any
    placeholderId: string
    className: string
  }>>([])
  
  // 요소 ID 생성
  function getElementId(element: HTMLElement): string {
    if (!element.id) {
      element.id = `plugin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    return element.id
  }
  
  // 요소에서 초기값 추출
  function getInitialValue(element: HTMLElement, type: string): any {
    switch (type) {
      case "text":
        return element.textContent?.trim() || ""
      case "image":
        const img = element.querySelector("img")
        return img?.src || ""
      case "icon":
        const path = element.querySelector("path")
        return path?.getAttribute("d") || ""
      case "link":
        const linkElement = element as HTMLAnchorElement
        return {
          href: linkElement.href || "#",
          text: element.textContent?.trim() || "Link"
        }
      default:
        return null
    }
  }
  
  // 템플릿 처리
  async function processTemplate() {
    if (!container || !template?.html) return
    
    // HTML 삽입
    container.innerHTML = template.html
    await tick()
    
    // 편집 가능한 요소 찾기
    const editableElements = container.querySelectorAll("[data-editable]")
    const newProcessedElements: typeof processedElements = []
    
    editableElements.forEach((element) => {
      const htmlElement = element as HTMLElement
      const type = htmlElement.getAttribute("data-editable") || ""
      const id = getElementId(htmlElement)
      const initialValue = getInitialValue(htmlElement, type)
      const className = htmlElement.className
      
      // 플레이스홀더 생성
      const placeholder = document.createElement("div")
      const placeholderId = `placeholder-${id}`
      placeholder.id = placeholderId
      placeholder.style.display = "contents"
      
      // 요소를 플레이스홀더로 교체
      htmlElement.replaceWith(placeholder)
      
      // 요소 정보 저장
      newProcessedElements.push({
        id,
        type,
        initialValue,
        placeholderId,
        className
      })
    })
    
    processedElements = newProcessedElements
    
    // repeatable 요소에 이벤트 리스너 추가
    const repeatableElements = container.querySelectorAll("[data-repeatable]")
    repeatableElements.forEach((element) => {
      element.addEventListener("click", onElementClick)
    })
  }
  
  onMount(() => {
    processTemplate()
    
    return () => {
      // cleanup
      const repeatableElements = container?.querySelectorAll("[data-repeatable]")
      repeatableElements?.forEach((element) => {
        element.removeEventListener("click", onElementClick)
      })
    }
  })
  
  // 템플릿 변경 시 재처리
  $effect(() => {
    if (template) {
      processTemplate()
    }
  })
</script>

<div bind:this={container} class="template-content">
  <!-- 초기 HTML이 여기에 삽입됨 -->
</div>

<!-- 플러그인 컴포넌트들을 Portal을 통해 올바른 위치에 렌더링 -->
{#each processedElements as item (item.id)}
  <Portal target={`#${item.placeholderId}`}>
    <PluginRenderer
      elementId={item.id}
      type={item.type}
      initialValue={item.initialValue}
      class={item.className}
    />
  </Portal>
{/each}

<style>
  .template-content {
    width: 100%;
  }
  
  :global([data-plugin-placeholder]) {
    display: contents;
  }
</style>