/**
 * UI System Entity Types
 * 
 * UI 시스템과 관련된 모든 타입 정의
 */

export interface UIState {
  leftSidebarOpen: boolean
  rightPanelOpen: boolean
  devicePreview: "mobile" | "tablet" | "desktop" | "full"
  isEditing: boolean
  editingElementId: string | null
  templateSelectorOpen: boolean
  debugPanelOpen: boolean
  activeTab: "templates" | "inspector" | "history" | "debug"
  selectedSectionIndex: number | null
}

export interface DevicePreview {
  id: string
  name: string
  width: number
  height?: number
  icon: string
  breakpoint?: string
}

export interface Panel {
  id: string
  title: string
  component: any
  icon?: string
  isOpen: boolean
  position: "left" | "right" | "bottom" | "top"
  width?: number
  height?: number
  resizable?: boolean
  collapsible?: boolean
}

export interface Sidebar extends Panel {
  sections: SidebarSection[]
}

export interface SidebarSection {
  id: string
  title: string
  component: any
  icon?: string
  expanded: boolean
  order: number
}

export interface Modal {
  id: string
  title: string
  component: any
  size?: "sm" | "md" | "lg" | "xl" | "full"
  closable?: boolean
  backdrop?: boolean
  position?: "center" | "top" | "bottom"
}

export interface Toast {
  id: string
  type: "info" | "success" | "warning" | "error"
  title?: string
  message: string
  duration?: number
  actions?: ToastAction[]
  dismissible?: boolean
}

export interface ToastAction {
  id: string
  label: string
  handler: () => void
  style?: "primary" | "secondary" | "danger"
}

export interface Toolbar {
  id: string
  position: "top" | "bottom" | "left" | "right"
  groups: ToolbarGroup[]
  visible: boolean
  floating?: boolean
}

export interface ToolbarGroup {
  id: string
  items: ToolbarItem[]
  separator?: boolean
}

export interface ToolbarItem {
  id: string
  type: "button" | "dropdown" | "separator" | "input" | "select"
  label?: string
  icon?: string
  tooltip?: string
  disabled?: boolean
  handler?: () => void
  items?: ToolbarItem[] // for dropdown
  value?: unknown // for input/select
}

export interface StatusBar {
  id: string
  sections: StatusBarSection[]
  visible: boolean
}

export interface StatusBarSection {
  id: string
  position: "left" | "center" | "right"
  content: string | any
  priority: number
}

export interface UIManager {
  openPanel(panelId: string): void
  closePanel(panelId: string): void
  togglePanel(panelId: string): void
  showModal(modal: Modal): string
  hideModal(modalId: string): void
  showToast(toast: Toast): string
  hideToast(toastId: string): void
  setDevicePreview(device: DevicePreview["id"]): void
  getDevicePreview(): DevicePreview | null
  setActiveTab(tab: string): void
  getActiveTab(): string
}