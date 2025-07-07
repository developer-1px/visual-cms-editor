<script lang="ts">
  import { formatKeyCombo } from "$lib/core/keyboard/parser"

  interface Props {
    combo: string
    class?: string
  }

  let { combo, class: className = "" }: Props = $props()

  const formatted = $derived(formatKeyCombo(combo))
</script>

<kbd
  class="inline-flex items-center gap-0.5 rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-700 shadow-[0_1px_0_rgb(209,213,219)] {className}"
>
  {formatted}
</kbd>
