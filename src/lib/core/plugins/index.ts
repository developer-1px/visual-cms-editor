// Model-based plugin system (NEW)
export { modelBasedPluginManager } from "./ModelBasedPluginManager"
export { pluginStore } from "./models/PluginStore.svelte"
export * from "./models/PluginModel.svelte"

// Legacy DOM-based exports (will be deprecated)
export * from "./core/interfaces"
export { editablePluginRegistry } from "./core/registry"
export { EditablePluginManager, editablePluginManager } from "./core/manager"

// Plugin types exports (legacy)
export { textPlugin } from "./types/text"
export { imagePlugin } from "./types/image"
export { iconPlugin } from "./types/icon"
export { linkPlugin } from "./types/link"
