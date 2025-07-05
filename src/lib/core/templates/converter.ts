import type { Template, TemplateToComponentOptions } from "./types"

export class TemplateConverter {
  /**
   * HTML 템플릿을 편집 가능한 Svelte 컴포넌트로 변환
   */
  static htmlToEditableComponent(template: Template, options: TemplateToComponentOptions = {}): string {
    const { addEditableMarkers = true } = options

    // HTML을 파싱하여 DOM 생성
    const parser = new DOMParser()
    const doc = parser.parseFromString(template.html, "text/html")
    const body = doc.body

    // 편집 가능한 요소들에 data-editable 속성 추가
    if (addEditableMarkers) {
      template.editableElements.forEach((element) => {
        const targets = body.querySelectorAll(element.selector)
        targets.forEach((target) => {
          target.setAttribute("data-editable", element.type)

          // 제약사항 추가
          if (element.constraints?.maxLength) {
            target.setAttribute("data-max-length", element.constraints.maxLength.toString())
          }
        })
      })
    }

    // Svelte 컴포넌트 생성
    const componentCode = this.generateSvelteComponent(body.innerHTML, template, options)

    return componentCode
  }

  /**
   * Svelte 컴포넌트 코드 생성
   */
  private static generateSvelteComponent(
    processedHtml: string,
    template: Template,
    options: TemplateToComponentOptions,
  ): string {
    const props = options.generateProps ? this.generateProps(template) : ""

    return `<script lang="ts">
	import { getContext } from 'svelte';
	${props}

	// Editor context에서 핸들러 가져오기
	const { handleElementClick, handleTextInput, stopEdit } = getContext('editor') || {};
</script>

${this.processHtmlForSvelte(processedHtml)}

<style>
	/* 템플릿 스타일 */
	${options.preserveStyles ? this.extractStyles(template.html) : ""}
</style>`
  }

  /**
   * Props 생성
   */
  private static generateProps(template: Template): string {
    const props = template.editableElements
      .filter((el) => el.type === "text")
      .map((el) => {
        const propName = this.selectorToPropName(el.selector)
        return `export let ${propName} = '${el.defaultValue}';`
      })
      .join("\n\t")

    return props
  }

  /**
   * 이벤트 핸들러 생성
   */
  private static generateEventHandlers(): string {
    return `
	function onElementClick(e: MouseEvent) {
		handleElementClick?.(e);
	}

	function onTextInput(e: Event) {
		handleTextInput?.(e.currentTarget as HTMLElement);
	}

	function onBlur() {
		stopEdit?.();
	}`
  }

  /**
   * HTML을 Svelte 문법으로 변환
   */
  private static processHtmlForSvelte(html: string): string {
    // class 속성을 유지하면서 이벤트 핸들러 추가
    let processed = html

    // data-editable이 있는 요소에 이벤트 핸들러 추가
    processed = processed.replace(
      /(<[^>]+data-editable="text"[^>]*)(>)/g,
      "$1 on:click={handleElementClick} on:blur={stopEdit} on:input={handleTextInput}$2",
    )

    processed = processed.replace(
      /(<[^>]+data-editable="(?:icon|image|link)"[^>]*)(>)/g,
      "$1 on:click={handleElementClick}$2",
    )

    // 기본 클래스에 hover 효과 추가
    processed = processed.replace(
      /(data-editable="text"[^>]*class="[^"]*)/g,
      "$1 cursor-pointer hover:bg-gray-50 rounded-lg px-4 py-2 transition-colors",
    )

    return processed
  }

  /**
   * 스타일 추출
   */
  private static extractStyles(html: string): string {
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
    return styleMatch ? styleMatch[1] : ""
  }

  /**
   * 선택자를 prop 이름으로 변환
   */
  private static selectorToPropName(selector: string): string {
    // 예: "h1.hero-title" -> "heroTitle"
    return selector
      .replace(/[#.]/g, "")
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      .replace(/\s+/g, "")
  }
}
