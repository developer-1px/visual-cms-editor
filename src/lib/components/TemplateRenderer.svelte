<script lang="ts">
  import { onMount, afterUpdate } from "svelte"
  import type { Template } from "$lib/core/templates/templates"

  export let template: Template
  export let handleElementClick: (e: MouseEvent) => void

  let templateContainer: HTMLElement

  // 템플릿 HTML 처리
  $: processedHtml = processTemplate(template)

  function processTemplate(template: Template): string {
    if (!template?.html) {
      return ""
    }
    
    const parser = new DOMParser()
    const doc = parser.parseFromString(template.html, "text/html")
    const body = doc.body

    // 편집 가능한 요소에 속성 추가
    template.editableElements?.forEach((element) => {
      const targets = body.querySelectorAll(element.selector)
      targets.forEach((target) => {
        if (element.type === "text") {
          // 텍스트 타입 자동 래핑 시스템
          wrapTextContent(target, element, doc)
        } else {
          // 다른 타입은 기존대로 전체 요소에 속성 추가
          target.setAttribute("data-editable", element.type)

          if (element.constraints?.maxLength) {
            target.setAttribute("data-max-length", element.constraints.maxLength.toString())
          }
        }
      })
    })

    return body.innerHTML
  }

  /**
   * 텍스트 요소를 편집 가능한 span으로 자동 래핑
   * 다양한 텍스트 구조를 지능적으로 처리
   */
  function wrapTextContent(
    target: Element,
    element: { type: string; defaultValue?: string; constraints?: { maxLength?: number } },
    doc: Document,
  ) {
    // 이미 래핑된 경우 스킵
    if (target.querySelector('[data-editable="text"]')) {
      return
    }

    // 텍스트 노드들을 찾아서 span으로 래핑
    const walker = doc.createTreeWalker(target, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        // 빈 텍스트나 공백만 있는 노드는 제외
        return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
      },
    })

    const textNodes: Text[] = []
    let node: Text | null
    while ((node = walker.nextNode() as Text)) {
      textNodes.push(node)
    }

    // 텍스트 노드가 하나인 경우 (가장 일반적)
    if (textNodes.length === 1) {
      const textNode = textNodes[0]
      const span = doc.createElement("span")
      span.textContent = textNode.textContent || ""
      span.setAttribute("data-editable", element.type)

      if (element.constraints?.maxLength) {
        span.setAttribute("data-max-length", element.constraints.maxLength.toString())
      }

      // 편집 가능 스타일 적용
      span.setAttribute("class", "editable-text-inline")

      // 텍스트 노드를 span으로 교체
      textNode.parentNode?.replaceChild(span, textNode)
    }
    // 여러 텍스트 노드가 있는 경우 (복잡한 구조)
    else if (textNodes.length > 1) {
      // 모든 텍스트를 하나의 span으로 통합
      const combinedText = textNodes.map((node) => node.textContent || "").join(" ")
      const span = doc.createElement("span")
      span.textContent = combinedText
      span.setAttribute("data-editable", element.type)

      if (element.constraints?.maxLength) {
        span.setAttribute("data-max-length", element.constraints.maxLength.toString())
      }

      span.setAttribute("class", "editable-text-inline")

      // 기존 내용을 지우고 span으로 교체
      target.innerHTML = ""
      target.appendChild(span)
    }
    // 텍스트가 없는 경우 기본값 사용
    else {
      const span = doc.createElement("span")
      span.textContent = element.defaultValue || ""
      span.setAttribute("data-editable", element.type)

      if (element.constraints?.maxLength) {
        span.setAttribute("data-max-length", element.constraints.maxLength.toString())
      }

      span.setAttribute("class", "editable-text-inline")
      target.appendChild(span)
    }
  }

  // 이벤트 리스너 설정
  function setupEventListeners() {
    if (!templateContainer) return

    // 모든 편집 가능한 요소에 이벤트 리스너 추가
    const editableElements = templateContainer.querySelectorAll("[data-editable]")
    editableElements.forEach((element) => {
      const htmlElement = element as HTMLElement

      // 텍스트 요소의 내용 정리 (처음 렌더링 시에만)
      if (htmlElement.dataset.editable === "text" && htmlElement.textContent) {
        htmlElement.textContent = htmlElement.textContent.trim()
      }

      // 클릭 이벤트
      htmlElement.addEventListener("click", handleElementClick)

      // 텍스트 편집 관련 이벤트는 +page.svelte에서 처리
      // blur와 input 이벤트는 편집 모드 시작 시 동적으로 추가됨
    })

    // 모든 repeatable 요소에도 이벤트 리스너 추가
    const repeatableElements = templateContainer.querySelectorAll("[data-repeatable]")
    repeatableElements.forEach((element) => {
      const htmlElement = element as HTMLElement

      // 클릭 이벤트
      htmlElement.addEventListener("click", handleElementClick)
    })
  }

  // 이벤트 리스너 정리
  function cleanupEventListeners() {
    if (!templateContainer) return

    const editableElements = templateContainer.querySelectorAll("[data-editable]")
    editableElements.forEach((element) => {
      const htmlElement = element as HTMLElement

      htmlElement.removeEventListener("click", handleElementClick)
    })

    const repeatableElements = templateContainer.querySelectorAll("[data-repeatable]")
    repeatableElements.forEach((element) => {
      const htmlElement = element as HTMLElement

      htmlElement.removeEventListener("click", handleElementClick)
    })
  }

  // 컴포넌트가 마운트될 때 이벤트 리스너 설정
  onMount(() => {
    setupEventListeners()

    return () => {
      cleanupEventListeners()
    }
  })

  // HTML이 업데이트될 때마다 이벤트 리스너 재설정
  afterUpdate(() => {
    cleanupEventListeners()
    setupEventListeners()
  })
</script>

<!-- 동적으로 렌더링된 템플릿 -->
<div
  bind:this={templateContainer}
  class="template-content"
>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html processedHtml}
</div>

<style>
  .template-content {
    width: 100%;
  }

  /* 편집 가능한 요소 스타일 */
  :global(.template-content [data-editable]) {
    position: relative;
    transition: all 0.2s ease;
  }

  /* editable 요소는 repeatable 요소 밖에서만 hover 효과 표시 */
  :global(.template-content [data-editable]:hover) {
    outline: 2px dashed #3b82f6;
    outline-offset: 4px;
  }

  /* repeatable 요소 안에 있는 editable 요소는 hover 효과 없음 */
  :global(.template-content [data-repeatable] [data-editable]:hover) {
    outline: none;
    outline-offset: 0;
  }

  /* 반복 가능한 요소 스타일 */
  :global(.template-content [data-repeatable]) {
    position: relative;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  :global(.template-content [data-repeatable]:hover) {
    outline: 2px dashed #10b981;
    outline-offset: 4px;
    background-color: rgba(16, 185, 129, 0.05);
  }
</style>
