import type { EditablePlugin, EditablePluginRegistry } from './interfaces';

class EditablePluginRegistryImpl implements EditablePluginRegistry {
  private plugins = new Map<string, EditablePlugin>();

  register(plugin: EditablePlugin): void {
    this.plugins.set(plugin.config.type, plugin);
    console.log(`[EditablePlugin] Registered plugin: ${plugin.config.type}`);
  }

  unregister(type: string): void {
    if (this.plugins.has(type)) {
      this.plugins.delete(type);
      console.log(`[EditablePlugin] Unregistered plugin: ${type}`);
    }
  }

  get(type: string): EditablePlugin | undefined {
    return this.plugins.get(type);
  }

  getAll(): Map<string, EditablePlugin> {
    return new Map(this.plugins);
  }

  hasType(type: string): boolean {
    return this.plugins.has(type);
  }

  // Debug method
  listRegistered(): string[] {
    return Array.from(this.plugins.keys());
  }
}

// Singleton instance
export const editablePluginRegistry = new EditablePluginRegistryImpl();