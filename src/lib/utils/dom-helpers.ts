/**
 * DOM manipulation helper functions
 */

/**
 * Clone an HTMLElement safely
 */
export function cloneHTMLElement(element: HTMLElement, deep: boolean = true): HTMLElement {
  const cloned = element.cloneNode(deep)
  if (!(cloned instanceof HTMLElement)) {
    throw new Error('Failed to clone element as HTMLElement')
  }
  return cloned
}

/**
 * Check if a node is an HTMLElement
 */
export function isHTMLElement(node: Node): node is HTMLElement {
  return node instanceof HTMLElement
}

/**
 * Check if a node is an HTMLImageElement
 */
export function isHTMLImageElement(node: Node): node is HTMLImageElement {
  return node instanceof HTMLImageElement
}

/**
 * Check if a node is an HTMLAnchorElement
 */
export function isHTMLAnchorElement(node: Node): node is HTMLAnchorElement {
  return node instanceof HTMLAnchorElement
}

/**
 * Check if a node is an SVGElement
 */
export function isSVGElement(node: Node): node is SVGElement {
  return node instanceof SVGElement
}

/**
 * Query selector that returns HTMLElement or null
 */
export function querySelector<T extends HTMLElement = HTMLElement>(
  parent: Element | Document,
  selector: string
): T | null {
  const element = parent.querySelector(selector)
  return element instanceof HTMLElement ? (element as T) : null
}

/**
 * Query selector all that returns HTMLElement array
 */
export function querySelectorAll<T extends HTMLElement = HTMLElement>(
  parent: Element | Document,
  selector: string
): T[] {
  const elements = parent.querySelectorAll(selector)
  return Array.from(elements).filter((el): el is T => el instanceof HTMLElement)
}