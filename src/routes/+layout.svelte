<script lang="ts">
  import "../app.css"
  import CommandLogger from "$lib/components/CommandLogger.svelte"

  let { children } = $props()
</script>

{@render children()}

<!-- Command Logger (Dev Only) -->
<CommandLogger />
