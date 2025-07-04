export interface SelectionManager {
  select(element: HTMLElement): void
  selectMultiple(elements: HTMLElement[]): void
  deselect(element?: HTMLElement): void
  deselectAll(): void
  getSelected(): HTMLElement[]
  isSelected(element: HTMLElement): boolean
}

export class Selection implements SelectionManager {
  private selected: Set<HTMLElement> = new Set()
  private overlay: HTMLElement | null = null

  constructor() {
    this.initializeEventListeners()
    this.createOverlay()
  }

  private initializeEventListeners(): void {
    // 클릭으로 선택
    document.addEventListener("click", this.handleClick.bind(this))

    // 키보드 네비게이션
    document.addEventListener("keydown", this.handleKeyboard.bind(this))
  }

  private createOverlay(): void {
    this.overlay = document.createElement("div")
    this.overlay.className = "selection-overlay"
    this.overlay.style.setProperty("--display", "none")
    this.overlay.innerHTML = `
            <button data-action="edit">편집</button>
            <button data-action="copy">복사</button>
            <button data-action="delete">삭제</button>
        `
    document.body.appendChild(this.overlay)

    // 오버레이 버튼 이벤트
    this.overlay.addEventListener("click", (e) => {
      const button = (e.target as HTMLElement).closest("button")
      if (button) {
        const action = button.dataset.action
        this.handleAction(action!)
      }
    })
  }

  private handleClick(e: MouseEvent): void {
    const target = e.target as HTMLElement
    const editable = target.closest("[data-editable]") as HTMLElement

    if (editable) {
      e.stopPropagation()

      if (e.shiftKey || e.metaKey || e.ctrlKey) {
        // 다중 선택
        if (this.isSelected(editable)) {
          this.deselect(editable)
        } else {
          this.selected.add(editable)
          editable.classList.add("selected")
        }
      } else {
        // 단일 선택
        this.deselectAll()
        this.select(editable)
      }

      this.updateOverlay()
    } else if (!target.closest(".selection-overlay")) {
      // 빈 공간 클릭 시 선택 해제
      this.deselectAll()
    }
  }

  private handleKeyboard(e: KeyboardEvent): void {
    const selectedElements = Array.from(this.selected)

    if (selectedElements.length === 0) return

    switch (e.key) {
      case "Enter":
        e.preventDefault()
        this.handleAction("edit")
        break

      case "Escape":
        e.preventDefault()
        this.deselectAll()
        break

      case "Tab":
        e.preventDefault()
        this.navigateNext(e.shiftKey)
        break

      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        e.preventDefault()
        this.navigateDirection(e.key)
        break
    }

    // 복사/붙여넣기
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case "c":
          e.preventDefault()
          this.handleAction("copy")
          break
        case "v":
          e.preventDefault()
          this.handleAction("paste")
          break
        case "x":
          e.preventDefault()
          this.handleAction("cut")
          break
      }
    }
  }

  private navigateNext(reverse: boolean = false): void {
    const allEditables = Array.from(document.querySelectorAll("[data-editable]")) as HTMLElement[]
    const current = Array.from(this.selected)[0]
    const currentIndex = allEditables.indexOf(current)

    let nextIndex = reverse ? currentIndex - 1 : currentIndex + 1
    if (nextIndex < 0) nextIndex = allEditables.length - 1
    if (nextIndex >= allEditables.length) nextIndex = 0

    this.deselectAll()
    this.select(allEditables[nextIndex])
  }

  private navigateDirection(direction: string): void {
    // 간단한 구현 - 나중에 공간적 네비게이션으로 개선
    const isVertical = direction === "ArrowUp" || direction === "ArrowDown"
    const isBackward = direction === "ArrowUp" || direction === "ArrowLeft"
    this.navigateNext(isBackward)
  }

  private updateOverlay(): void {
    if (!this.overlay) return

    const selectedElements = Array.from(this.selected)

    if (selectedElements.length === 0) {
      this.overlay.style.setProperty("--display", "none")
      return
    }

    // 첫 번째 선택된 요소 위에 오버레이 표시
    const first = selectedElements[0]
    const rect = first.getBoundingClientRect()

    // Use CSS custom properties for positioning
    this.overlay.style.setProperty("--display", "flex")
    this.overlay.style.setProperty("--top", `${rect.top - 36}px`)
    this.overlay.style.setProperty("--left", `${rect.left}px`)
  }

  private handleAction(action: string): void {
    const selectedElements = Array.from(this.selected)

    switch (action) {
      case "edit":
        if (selectedElements.length === 1) {
          const element = selectedElements[0]
          element.classList.add("editing")
          // 플러그인 시스템에 위임
          console.log("Edit:", element)
        }
        break

      case "copy":
        console.log("Copy:", selectedElements)
        break

      case "delete":
        selectedElements.forEach((el) => {
          // 컨텐츠만 삭제, 구조는 유지
          if (el.dataset.editable === "text") {
            el.textContent = ""
          }
        })
        break
    }
  }

  // Public API
  select(element: HTMLElement): void {
    this.selected.add(element)
    element.classList.add("selected")
    this.updateOverlay()
  }

  selectMultiple(elements: HTMLElement[]): void {
    elements.forEach((el) => {
      this.selected.add(el)
      el.classList.add("selected")
    })
    this.updateOverlay()
  }

  deselect(element?: HTMLElement): void {
    if (element) {
      this.selected.delete(element)
      element.classList.remove("selected", "editing")
    }
    this.updateOverlay()
  }

  deselectAll(): void {
    this.selected.forEach((el) => {
      el.classList.remove("selected", "editing")
    })
    this.selected.clear()
    this.updateOverlay()
  }

  getSelected(): HTMLElement[] {
    return Array.from(this.selected)
  }

  isSelected(element: HTMLElement): boolean {
    return this.selected.has(element)
  }
}
