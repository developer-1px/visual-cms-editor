<script lang="ts">
  import { logger, type LogLevel } from "$lib/core/commands"
  import { Filter, X, Download, Trash2, ChevronDown, ChevronRight } from "lucide-svelte"

  let showLogger = false
  let searchText = ""
  let selectedLevels: Set<LogLevel> = new Set(["info", "warn", "error"])
  let expandedEntries = new Set<string>()

  // Subscribe to logger entries
  const filteredEntries = logger.filteredEntries

  function toggleLevel(level: LogLevel) {
    if (selectedLevels.has(level)) {
      selectedLevels.delete(level)
    } else {
      selectedLevels.add(level)
    }
    selectedLevels = selectedLevels
    logger.setEnabledLevels(Array.from(selectedLevels))
  }

  function clearLogs() {
    if (confirm("Clear all logs?")) {
      logger.clear()
    }
  }

  function exportLogs() {
    const data = logger.export()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `command-logs-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function toggleEntry(id: string) {
    if (expandedEntries.has(id)) {
      expandedEntries.delete(id)
    } else {
      expandedEntries.add(id)
    }
    expandedEntries = expandedEntries
  }

  function formatTimestamp(ts: number): string {
    return new Date(ts).toLocaleTimeString()
  }

  function getLevelClass(level: LogLevel): string {
    switch (level) {
      case "debug":
        return "text-gray-500"
      case "info":
        return "text-blue-500"
      case "warn":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
    }
  }

  // Keyboard shortcut
  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "L") {
      e.preventDefault()
      showLogger = !showLogger
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if import.meta.env.DEV}
  <!-- Toggle Button -->
  <button
    on:click={() => (showLogger = !showLogger)}
    class="fixed right-4 bottom-4 z-50 rounded-full bg-gray-800 p-3 text-white shadow-lg transition-colors hover:bg-gray-700"
    title="Toggle Command Logger (Cmd/Ctrl+Shift+L)"
  >
    <Filter class="h-5 w-5" />
  </button>

  <!-- Logger Panel -->
  {#if showLogger}
    <div class="fixed inset-x-0 bottom-0 z-50 flex h-96 flex-col border-t border-gray-200 bg-white shadow-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
        <h3 class="font-semibold text-gray-800">Command Logger</h3>

        <div class="flex items-center gap-4">
          <!-- Search -->
          <input
            type="text"
            bind:value={searchText}
            on:input={() => logger.setFilters({ searchText })}
            placeholder="Search logs..."
            class="rounded border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <!-- Level Filters -->
          <div class="flex gap-2">
            {#each ["debug", "info", "warn", "error"] as level (level)}
              <button
                on:click={() => toggleLevel(level)}
                class="rounded px-2 py-1 text-xs font-medium transition-colors {selectedLevels.has(level)
                  ? getLevelClass(level) + ' bg-opacity-10'
                  : 'text-gray-400 hover:text-gray-600'}"
              >
                {level.toUpperCase()}
              </button>
            {/each}
          </div>

          <!-- Actions -->
          <button
            on:click={exportLogs}
            class="p-1 text-gray-600 hover:text-gray-800"
            title="Export logs"
          >
            <Download class="h-4 w-4" />
          </button>

          <button
            on:click={clearLogs}
            class="p-1 text-gray-600 hover:text-gray-800"
            title="Clear logs"
          >
            <Trash2 class="h-4 w-4" />
          </button>

          <button
            on:click={() => (showLogger = false)}
            class="p-1 text-gray-600 hover:text-gray-800"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Log Entries -->
      <div class="flex-1 overflow-y-auto">
        {#if $filteredEntries.length === 0}
          <div class="flex h-full items-center justify-center text-gray-400">No logs to display</div>
        {:else}
          <div class="divide-y divide-gray-100">
            {#each $filteredEntries as entry (entry.id)}
              <div class="hover:bg-gray-50">
                <div
                  class="flex cursor-pointer items-start gap-2 px-4 py-2"
                  on:click={() => toggleEntry(entry.id)}
                >
                  <button class="mt-0.5">
                    {#if expandedEntries.has(entry.id)}
                      <ChevronDown class="h-4 w-4 text-gray-400" />
                    {:else}
                      <ChevronRight class="h-4 w-4 text-gray-400" />
                    {/if}
                  </button>

                  <span class="font-mono text-xs text-gray-500">
                    {formatTimestamp(entry.timestamp)}
                  </span>

                  <span class="text-xs font-medium {getLevelClass(entry.level)}">
                    [{entry.level.toUpperCase()}]
                  </span>

                  {#if entry.command}
                    <span class="font-mono text-xs text-purple-600">
                      {entry.command.type}
                    </span>
                  {/if}

                  <span class="flex-1 text-sm text-gray-700">
                    {entry.message}
                  </span>
                </div>

                {#if expandedEntries.has(entry.id)}
                  <div class="px-12 pb-2">
                    {#if entry.data}
                      <pre class="overflow-x-auto rounded bg-gray-100 p-2 text-xs text-gray-600">
{JSON.stringify(entry.data, null, 2)}
                      </pre>
                    {/if}

                    {#if entry.stack}
                      <pre class="mt-2 overflow-x-auto rounded bg-red-50 p-2 text-xs text-red-600">
{entry.stack}
                      </pre>
                    {/if}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
{/if}
