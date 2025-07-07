// Model-based plugin system (PRIMARY)
export { modelBasedPluginManager } from "./ModelBasedPluginManager"
export { pluginStore } from "./models/PluginStore.svelte"
export * from "./models/PluginModel.svelte"

// Core interfaces and utilities
export * from "./core/interfaces"
export * from "./utils/plugin-helpers"
export * from "./utils/plugin-factory"

// Plugin types exports (refactored)
export { textPlugin } from "./types/text"
export { imagePlugin } from "./types/image"
export { iconPlugin } from "./types/icon"
export { linkPlugin } from "./types/link"

// Legacy DOM-based exports removed - use model-based system instead
