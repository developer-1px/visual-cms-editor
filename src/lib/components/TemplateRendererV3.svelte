<script lang="ts">
  import type { Template } from "$lib/core/templates/templates"
  import type { TemplateModel } from "$lib/core/models/TemplateModels"
  import { TemplateParser } from "$lib/core/parsers/TemplateParser"
  import FrameRenderer from "./renderers/FrameRenderer.svelte"

  interface Props {
    template: Template
    onElementClick?: (e: MouseEvent) => void
  }

  let { template, onElementClick }: Props = $props()

  // Parser 인스턴스
  const parser = new TemplateParser()

  // Template을 Model로 변환 (비동기)
  let templateModel = $state<TemplateModel | null>(null)

  // Template이 변경될 때마다 파싱
  $effect(async () => {
    if (!template?.html) {
      templateModel = null
      return
    }

    try {
      templateModel = await parser.parse(template.html, template.id, template.name)
    } catch (error) {
      console.error("Template parsing failed:", error)
      templateModel = null
    }
  })

  // 디버깅용 로그
  $effect(() => {
    if (templateModel && templateModel.root) {
      console.log("📋 TemplateModel generated:", {
        id: templateModel.id,
        name: templateModel.name,
        root: templateModel.root,
        childCount: templateModel.root.children?.length || 0,
      })
    }
  })
</script>

{#if templateModel && templateModel.root}
  <div class="template-v3-content">
    <FrameRenderer
      element={templateModel.root}
      {onElementClick}
    />
  </div>
{:else}
  <div class="template-v3-error">
    <p>Failed to parse template</p>
    {#if template?.html}
      <details>
        <summary>Raw HTML</summary>
        <pre>{template.html}</pre>
      </details>
    {/if}
  </div>
{/if}

<style>
  .template-v3-content {
    width: 100%;
  }

  .template-v3-error {
    padding: 16px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #dc2626;
  }

  .template-v3-error details {
    margin-top: 8px;
  }

  .template-v3-error pre {
    background: #fff;
    padding: 8px;
    border-radius: 4px;
    overflow: auto;
    font-size: 12px;
    color: #374151;
  }
</style>
