<script lang="ts">
  import { state, getHistory, getDebugInfo, clearHistory } from "$lib/core/commands/stores"
  import type { AppState } from "$lib/core/commands/types"
  import { logger } from "$lib/core/commands/logger"
  import { currentSelectionSize, selectedItems, selectionBounds } from "$lib/core/selection"
  import { onMount } from "svelte"
  
  let expandedSections = new Set<string>(['overview', 'selection', 'ui', 'history', 'logs', 'raw'])
  let refreshInterval: number
  let autoRefresh = true
  let refreshRate = 1000 // 1초
  
  // State 변수들
  $: currentState = $state
  $: history = getHistory()
  $: debugInfo = getDebugInfo()
  $: logEntries = logger.getEntries()
  
  onMount(() => {
    // 자동 새로고침 설정
    if (autoRefresh) {
      refreshInterval = setInterval(() => {
        // Svelte의 reactive statement가 자동으로 처리
      }, refreshRate)
    }
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  })
  
  function toggleSection(section: string) {
    if (expandedSections.has(section)) {
      expandedSections.delete(section)
    } else {
      expandedSections.add(section)
    }
    expandedSections = expandedSections
  }
  
  function formatValue(value: any, depth = 0): string {
    if (depth > 3) return "[Deep Object]"
    
    if (value === null) return "null"
    if (value === undefined) return "undefined"
    if (typeof value === "string") return `"${value}"`
    if (typeof value === "number" || typeof value === "boolean") return String(value)
    if (value instanceof Map) {
      const entries = Array.from(value.entries()).slice(0, 5)
      const preview = entries.map(([k, v]) => `${k}: ${formatValue(v, depth + 1)}`).join(", ")
      return `Map(${value.size}) { ${preview}${value.size > 5 ? "..." : ""} }`
    }
    if (value instanceof Set) {
      const entries = Array.from(value).slice(0, 5)
      const preview = entries.map(v => formatValue(v, depth + 1)).join(", ")
      return `Set(${value.size}) { ${preview}${value.size > 5 ? "..." : ""} }`
    }
    if (Array.isArray(value)) {
      const preview = value.slice(0, 3).map(v => formatValue(v, depth + 1)).join(", ")
      return `[${preview}${value.length > 3 ? "..." : ""}] (${value.length})`
    }
    if (typeof value === "object") {
      const keys = Object.keys(value).slice(0, 3)
      const preview = keys.map(k => `${k}: ${formatValue(value[k], depth + 1)}`).join(", ")
      return `{ ${preview}${Object.keys(value).length > 3 ? "..." : ""} }`
    }
    return String(value)
  }
  
  function getStateValue(path: string): any {
    const parts = path.split(".")
    let current = currentState
    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = (current as any)[part]
      } else {
        return undefined
      }
    }
    return current
  }
  
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Show a brief success indicator
      alert("Copied to clipboard!")
    }).catch(() => {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      alert("Copied to clipboard!")
    })
  }
  
  function exportState() {
    const stateJson = JSON.stringify(currentState, (key, value) => {
      if (value instanceof Map) {
        return { __type: "Map", entries: Array.from(value.entries()) }
      }
      if (value instanceof Set) {
        return { __type: "Set", values: Array.from(value) }
      }
      return value
    }, 2)
    copyToClipboard(stateJson)
  }
  
  function clearDebugHistory() {
    clearHistory()
  }
</script>

<div class="debug-panel h-full overflow-hidden bg-gray-50 flex flex-col">
  <!-- Header -->
  <div class="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2">
    <h3 class="text-sm font-semibold text-gray-900">State Debug Panel</h3>
    <div class="flex items-center gap-2">
      <label class="flex items-center gap-1 text-xs">
        <input 
          type="checkbox" 
          bind:checked={autoRefresh}
          class="w-3 h-3"
        />
        Auto refresh
      </label>
      <button 
        onclick={exportState}
        class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >
        Export
      </button>
      <button 
        onclick={clearDebugHistory}
        class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      >
        Clear History
      </button>
    </div>
  </div>
  
  <!-- Content -->
  <div class="flex-1 overflow-y-auto p-4 space-y-4">
    
    <!-- State Overview -->
    <div class="bg-white rounded-lg border border-gray-200">
      <button 
        onclick={() => toggleSection("overview")}
        class="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
      >
        <span class="font-medium text-gray-900">State Overview</span>
        <svg 
          class="w-4 h-4 transform transition-transform {expandedSections.has('overview') ? 'rotate-90' : ''}"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      {#if expandedSections.has("overview")}
        <div class="px-3 pb-3 space-y-2 text-xs">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="font-medium text-gray-700 mb-1">Selection</div>
              <div class="text-gray-600">Elements: {currentState.selection.selectedElements.size}</div>
              <div class="text-gray-600">Type: {currentState.selection.activeType || "None"}</div>
              <div class="text-gray-600">Context: {currentState.selection.activeContext || "None"}</div>
            </div>
            <div>
              <div class="font-medium text-gray-700 mb-1">UI State</div>
              <div class="text-gray-600 flex items-center gap-2">
                <span>Editing:</span> 
                <span class="px-2 py-1 rounded text-xs font-medium {currentState.ui.isEditing ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}">
                  {currentState.ui.isEditing ? "YES" : "NO"}
                </span>
              </div>
              {#if currentState.ui.isEditing && currentState.ui.editingElementId}
                <div class="text-gray-500 text-xs mt-1">
                  ID: {currentState.ui.editingElementId.slice(0, 12)}...
                </div>
              {/if}
              <div class="text-gray-600">Left Sidebar: {currentState.ui.leftSidebarOpen ? "Open" : "Closed"}</div>
              <div class="text-gray-600">Right Panel: {currentState.ui.rightPanelOpen ? "Open" : "Closed"}</div>
              <div class="text-gray-600">Device: {currentState.ui.devicePreview}</div>
            </div>
          </div>
          <div>
            <div class="font-medium text-gray-700 mb-1">Data</div>
            <div class="text-gray-600">Templates: {currentState.templates.length}</div>
            <div class="text-gray-600">Elements: {currentState.elements.size}</div>
          </div>
        </div>
      {/if}
    </div>
    
    <!-- Selection State -->
    <div class="bg-white rounded-lg border border-gray-200">
      <button 
        onclick={() => toggleSection("selection")}
        class="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
      >
        <span class="font-medium text-gray-900">Selection State</span>
        <svg 
          class="w-4 h-4 transform transition-transform {expandedSections.has('selection') ? 'rotate-90' : ''}"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      {#if expandedSections.has("selection")}
        <div class="px-3 pb-3 space-y-2 text-xs font-mono">
          <div>
            <span class="text-gray-500">selectedElements:</span>
            <span class="text-blue-600">{formatValue(currentState.selection.selectedElements)}</span>
          </div>
          <div>
            <span class="text-gray-500">activeType:</span>
            <span class="text-green-600">{formatValue(currentState.selection.activeType)}</span>
          </div>
          <div>
            <span class="text-gray-500">activeContext:</span>
            <span class="text-green-600">{formatValue(currentState.selection.activeContext)}</span>
          </div>
          <div>
            <span class="text-gray-500">currentSelectionSize:</span>
            <span class="text-purple-600">{formatValue($currentSelectionSize)}</span>
          </div>
          <div>
            <span class="text-gray-500">selectedItems:</span>
            <span class="text-orange-600">{formatValue($selectedItems)}</span>
          </div>
          <div>
            <span class="text-gray-500">selectionBounds:</span>
            <span class="text-teal-600">{formatValue($selectionBounds)}</span>
          </div>
        </div>
      {/if}
    </div>
    
    <!-- UI State -->
    <div class="bg-white rounded-lg border border-gray-200">
      <button 
        onclick={() => toggleSection("ui")}
        class="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
      >
        <span class="font-medium text-gray-900">UI State</span>
        <svg 
          class="w-4 h-4 transform transition-transform {expandedSections.has('ui') ? 'rotate-90' : ''}"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      {#if expandedSections.has("ui")}
        <div class="px-3 pb-3 space-y-1 text-xs font-mono">
          {#each Object.entries(currentState.ui) as [key, value]}
            <div>
              <span class="text-gray-500">{key}:</span>
              <span class="text-purple-600">{formatValue(value)}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
    
    <!-- Command History -->
    <div class="bg-white rounded-lg border border-gray-200">
      <button 
        onclick={() => toggleSection("history")}
        class="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
      >
        <span class="font-medium text-gray-900">Command History ({history.length})</span>
        <svg 
          class="w-4 h-4 transform transition-transform {expandedSections.has('history') ? 'rotate-90' : ''}"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      {#if expandedSections.has("history")}
        <div class="px-3 pb-3 max-h-64 overflow-y-auto">
          {#each history.slice(-10) as command, index}
            <div class="text-xs border-b border-gray-100 py-2 last:border-b-0">
              <div class="flex items-center justify-between">
                <span class="font-medium text-blue-600">{command.type}</span>
                <span class="text-gray-400">{new Date(command.timestamp).toLocaleTimeString()}</span>
              </div>
              {#if command.meta?.description}
                <div class="text-gray-600 mt-1">{command.meta.description}</div>
              {/if}
              <div class="text-gray-500 font-mono mt-1 break-all">
                {JSON.stringify(command.payload).slice(0, 100)}
                {#if JSON.stringify(command.payload).length > 100}...{/if}
              </div>
            </div>
          {/each}
          
          {#if history.length === 0}
            <div class="text-xs text-gray-500 py-4 text-center">No commands in history</div>
          {/if}
        </div>
      {/if}
    </div>
    
    <!-- Command Logs -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="w-full flex items-center justify-between p-3 hover:bg-gray-50">
        <button 
          onclick={() => toggleSection("logs")}
          class="flex items-center gap-2 text-left flex-1"
        >
          <span class="font-medium text-gray-900">Command Logs ({$logEntries.length})</span>
          <svg 
            class="w-4 h-4 transform transition-transform {expandedSections.has('logs') ? 'rotate-90' : ''}"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        <button
          onclick={(e) => {
            e.stopPropagation()
            logger.clear()
          }}
          class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>
      
      {#if expandedSections.has("logs")}
        <div class="px-3 pb-3 max-h-64 overflow-y-auto">
          {#each $logEntries.slice(-20) as entry (entry.id)}
            <div class="text-xs border-b border-gray-100 py-2 last:border-b-0">
              <div class="flex items-center justify-between">
                <span class="font-medium {
                  entry.level === 'error' ? 'text-red-600' :
                  entry.level === 'warn' ? 'text-yellow-600' :
                  entry.level === 'info' ? 'text-blue-600' :
                  'text-gray-600'
                }">
                  [{entry.level.toUpperCase()}]
                </span>
                <span class="text-gray-400">{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
              
              {#if entry.command}
                <div class="text-purple-600 font-mono mt-1">
                  {entry.command.type}
                </div>
              {/if}
              
              <div class="text-gray-700 mt-1">
                {entry.message}
              </div>
              
              {#if entry.data && typeof entry.data === 'object'}
                <details class="mt-1">
                  <summary class="text-gray-500 cursor-pointer text-xs">Data</summary>
                  <pre class="text-xs bg-gray-50 p-1 rounded mt-1 overflow-x-auto">{JSON.stringify(entry.data, null, 2)}</pre>
                </details>
              {/if}
              
              {#if entry.stack}
                <details class="mt-1">
                  <summary class="text-red-500 cursor-pointer text-xs">Stack Trace</summary>
                  <pre class="text-xs bg-red-50 p-1 rounded mt-1 overflow-x-auto text-red-700">{entry.stack}</pre>
                </details>
              {/if}
            </div>
          {/each}
          
          {#if $logEntries.length === 0}
            <div class="text-xs text-gray-500 py-4 text-center">No log entries</div>
          {/if}
        </div>
      {/if}
    </div>
    
    <!-- Raw State -->
    <div class="bg-white rounded-lg border border-gray-200">
      <button 
        onclick={() => toggleSection("raw")}
        class="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
      >
        <span class="font-medium text-gray-900">Raw State</span>
        <svg 
          class="w-4 h-4 transform transition-transform {expandedSections.has('raw') ? 'rotate-90' : ''}"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      {#if expandedSections.has("raw")}
        <div class="px-3 pb-3">
          <pre class="text-xs bg-gray-50 p-2 rounded overflow-x-auto max-h-96 overflow-y-auto">{JSON.stringify(currentState, (key, value) => {
            if (value instanceof Map) return { __type: "Map", size: value.size, entries: Array.from(value.entries()).slice(0, 3) }
            if (value instanceof Set) return { __type: "Set", size: value.size, values: Array.from(value).slice(0, 3) }
            return value
          }, 2)}</pre>
        </div>
      {/if}
    </div>
    
  </div>
</div>

<style>
  .debug-panel {
    font-family: 'SF Mono', Monaco, 'Inconsolata', 'Roboto Mono', monospace;
  }
</style>