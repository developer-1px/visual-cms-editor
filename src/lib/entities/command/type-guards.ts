/**
 * Type guards for Command types
 */

import type {
  Command,
  ToggleSidebarCommand,
  SetDevicePreviewCommand,
  StartEditingCommand,
  StopEditingCommand,
  ToggleTemplateSelectorCommand,
  ToggleDebugPanelCommand,
  SetActiveTabCommand,
  SetSelectedSectionIndexCommand,
  SelectElementCommand,
  DeselectElementCommand,
  ClearSelectionCommand,
  UpdateTextCommand,
  UpdateImageCommand,
  UpdateIconCommand,
  UpdateLinkCommand,
} from './types'

// UI Commands
export function isToggleSidebarCommand(command: Command): command is ToggleSidebarCommand {
  return command.type === 'toggleSidebar'
}

export function isSetDevicePreviewCommand(command: Command): command is SetDevicePreviewCommand {
  return command.type === 'setDevicePreview'
}

export function isStartEditingCommand(command: Command): command is StartEditingCommand {
  return command.type === 'startEditing'
}

export function isStopEditingCommand(command: Command): command is StopEditingCommand {
  return command.type === 'stopEditing'
}

export function isToggleTemplateSelectorCommand(command: Command): command is ToggleTemplateSelectorCommand {
  return command.type === 'toggleTemplateSelector'
}

export function isToggleDebugPanelCommand(command: Command): command is ToggleDebugPanelCommand {
  return command.type === 'toggleDebugPanel'
}

export function isSetActiveTabCommand(command: Command): command is SetActiveTabCommand {
  return command.type === 'setActiveTab'
}

export function isSetSelectedSectionIndexCommand(command: Command): command is SetSelectedSectionIndexCommand {
  return command.type === 'setSelectedSectionIndex'
}

// Selection Commands
export function isSelectElementCommand(command: Command): command is SelectElementCommand {
  return command.type === 'selectElement'
}

export function isDeselectElementCommand(command: Command): command is DeselectElementCommand {
  return command.type === 'deselectElement'
}

export function isClearSelectionCommand(command: Command): command is ClearSelectionCommand {
  return command.type === 'clearSelection'
}

// Update Commands
export function isUpdateTextCommand(command: Command): command is UpdateTextCommand {
  return command.type === 'updateText'
}

export function isUpdateImageCommand(command: Command): command is UpdateImageCommand {
  return command.type === 'updateImage'
}

export function isUpdateIconCommand(command: Command): command is UpdateIconCommand {
  return command.type === 'updateIcon'
}

export function isUpdateLinkCommand(command: Command): command is UpdateLinkCommand {
  return command.type === 'updateLink'
}