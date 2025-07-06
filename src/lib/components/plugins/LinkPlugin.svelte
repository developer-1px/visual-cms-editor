<script lang="ts">
  import type { LinkPluginModel } from "$lib/core/plugins/models/PluginModel.svelte"

  interface Props {
    model: LinkPluginModel
    class?: string
  }

  let { model, class: className = "" }: Props = $props()

  let showEditor = $state(false)
  let href = $state(model.state.value.href || "#")
  let text = $state(model.state.value.text || "Link")

  function handleClick(e: MouseEvent) {
    e.preventDefault() // 링크 기본 동작 방지
    model.handleClick?.()
    showEditor = model.state.isEditing

    // 현재 값으로 초기화
    href = model.state.value.href || "#"
    text = model.state.value.text || "Link"
  }

  function saveLink() {
    model.setValue({ href, text })
    model.stopEdit()
    showEditor = false
  }

  function cancelEdit() {
    model.stopEdit()
    showEditor = false
    // 원래 값으로 복원
    href = model.state.value.href || "#"
    text = model.state.value.text || "Link"
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      cancelEdit()
    } else if (e.key === "Enter" && showEditor) {
      e.preventDefault()
      saveLink()
    }
  }
</script>

<a
  bind:this={model.element}
  href={model.state.value.href || "#"}
  class={className}
  data-editable="link"
  data-selected={model.element?.hasAttribute("data-selected") ? "true" : null}
  data-editing={model.state.isEditing ? "true" : null}
  onclick={handleClick}
  onkeydown={handleKeydown}
>
  {model.state.value.text || "Link"}

  {#if showEditor}
    <div
      class="link-editor"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="editor-field">
        <label for="link-text">Text</label>
        <input
          id="link-text"
          type="text"
          bind:value={text}
          class="editor-input"
          placeholder="Link text"
        />
      </div>
      <div class="editor-field">
        <label for="link-href">URL</label>
        <input
          id="link-href"
          type="url"
          bind:value={href}
          class="editor-input"
          placeholder="https://example.com"
        />
      </div>
      <div class="editor-actions">
        <button
          class="btn-save"
          onclick={saveLink}>Save</button
        >
        <button
          class="btn-cancel"
          onclick={cancelEdit}>Cancel</button
        >
      </div>
    </div>
  {/if}
</a>

<style>
  a[data-editable="link"] {
    position: relative;
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: underline;
  }

  .link-editor {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 8px;
    background: white;
    border: 1px solid rgb(229 231 235);
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    padding: 16px;
    z-index: 50;
    min-width: 300px;
  }

  .editor-field {
    margin-bottom: 12px;
  }

  .editor-field label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
    color: rgb(55 65 81);
  }

  .editor-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid rgb(209 213 219);
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s;
  }

  .editor-input:focus {
    outline: none;
    border-color: rgb(59 130 246);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }

  .editor-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .btn-save,
  .btn-cancel {
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
  }

  .btn-save {
    background: rgb(59 130 246);
    color: white;
  }

  .btn-save:hover {
    background: rgb(37 99 235);
  }

  .btn-cancel {
    background: white;
    color: rgb(75 85 99);
    border: 1px solid rgb(209 213 219);
  }

  .btn-cancel:hover {
    background: rgb(249 250 251);
  }

  [data-editing="true"] {
    outline: 3px solid #f59e0b;
    outline-offset: 3px;
  }
</style>
