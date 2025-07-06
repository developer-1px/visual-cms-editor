<script lang="ts">
  import { hotkeyManager } from "$lib/core/keyboard/HotkeyManager"
  import KeyboardShortcut from "./KeyboardShortcut.svelte"

  interface HotkeyHint {
    combo: string
    description: string
  }

  // 주요 단축키 목록
  const hints: Record<string, HotkeyHint[]> = {
    "General": [
      { combo: "cmd+z", description: "Undo" },
      { combo: "cmd+shift+z", description: "Redo" },
      { combo: "escape", description: "Cancel / Deselect" },
    ],
    "Selection Mode": [
      { combo: "enter", description: "Edit selected" },
      { combo: "delete", description: "Delete selected" },
      { combo: "cmd+c", description: "Copy" },
      { combo: "cmd+x", description: "Cut" },
      { combo: "cmd+v", description: "Paste" },
      { combo: "cmd+d", description: "Duplicate" },
    ],
    "Navigation": [
      { combo: "tab", description: "Next element" },
      { combo: "shift+tab", description: "Previous element" },
      { combo: "arrow keys", description: "Move selection" },
    ],
  }

  let showHints = $state(false)

  // Cmd+Shift+K로 토글
  $effect(() => {
    const unsubscribe = hotkeyManager.registerKeymap({
      condition: () => true,
      priority: 100,
      bindings: {
        "$mod+Shift+k": (e) => {
          e.preventDefault()
          showHints = !showHints
        },
      },
    })

    return unsubscribe
  })
</script>

{#if showHints}
  <div class="fixed bottom-5 right-5 w-80 bg-white border border-gray-300 rounded-xl shadow-2xl z-[1000] text-sm">
    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-300">
      <h3 class="text-base font-semibold text-gray-900">Keyboard Shortcuts</h3>
      <button
        onclick={() => (showHints = false)}
        class="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-all duration-200"
        aria-label="Close"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <div class="px-5 py-4 max-h-96 overflow-y-auto">
      {#each Object.entries(hints) as [category, items] (category)}
        <div class="mb-5 last:mb-0">
          <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{category}</h4>
          <div class="flex flex-col gap-1.5">
            {#each items as hint (hint.combo)}
              <div class="flex items-center gap-3">
                <KeyboardShortcut combo={hint.combo} />
                <span class="flex-1 text-gray-700">{hint.description}</span>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <div class="px-5 py-3 border-t border-gray-300 text-xs text-gray-500 text-center">
      Press <KeyboardShortcut combo="cmd+shift+k" /> to toggle this help
    </div>
  </div>
{/if}
