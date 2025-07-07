# 선택 기능 구현 가이드

## 개요

Visual CMS Editor의 선택 기능은 사용자가 편집 가능한 요소들을 직관적으로 선택하고 조작할 수 있도록 하는 핵심 기능입니다.

## 현재 구현 상태

### SelectionManager 기반 통합 구현

```typescript
// src/lib/core/selection/SelectionManager.ts
class SelectionManager {
  - 중앙 집중식 상태 관리
  - 단일/다중 선택 지원
  - 키보드 네비게이션
  - 모드 전환 (선택 → 편집)
}
```

### 주요 기능

1. **클릭 기반 선택**
   - 단일 클릭: 요소 선택
   - Shift+클릭: 범위 선택
   - Cmd/Ctrl+클릭: 다중 선택

2. **키보드 네비게이션**
   - Tab/Shift+Tab: 순차 이동
   - 화살표 키: 방향 이동
   - Enter: 편집 모드 진입
   - Escape: 선택 해제

3. **시각적 피드백**
   - SelectionOverlay 컴포넌트
   - 요소 타입별 색상 구분
   - 호버/선택 상태 표시

## 구현 아키텍처

### 1. 이벤트 처리 계층

```typescript
// 이벤트 위임 패턴
document.addEventListener("click", (e) => {
  const editable = e.target.closest("[data-editable]")
  if (editable) {
    selectionManager.select(editable)
  }
})
```

### 2. 상태 관리

```typescript
interface SelectionState {
  selectedElements: Set<HTMLElement>
  mode: "select" | "edit"
  focusedElement: HTMLElement | null
}
```

### 3. 플러그인 통합

```typescript
// 선택된 요소에 대한 플러그인 액션
const plugin = pluginManager.getPlugin(element.dataset.editable)
plugin.onSelect(element)
```

## 구현 방법론

### 1. DOM 기반 접근법

- **장점**: 직접적, 빠른 반응
- **단점**: 상태 동기화 복잡
- **사용 사례**: 간단한 인터랙션

### 2. Virtual DOM 접근법

- **장점**: 상태 관리 용이
- **단점**: 오버헤드 존재
- **사용 사례**: 복잡한 UI 상태

### 3. 하이브리드 접근법 (현재 채택)

- DOM 이벤트 + 중앙 상태 관리
- 최적의 성능과 유지보수성

## 고급 기능 구현

### 1. 다중 선택 그룹 작업

```typescript
class SelectionManager {
  groupAction(action: (element: HTMLElement) => void) {
    this.selectedElements.forEach((element) => {
      action(element)
    })
  }
}
```

### 2. 선택 영역 드래그 (Lasso)

```typescript
// 마우스 드래그로 여러 요소 선택
interface LassoSelection {
  startPoint: { x: number; y: number }
  endPoint: { x: number; y: number }
  selectedElements: HTMLElement[]
}
```

### 3. 선택 기록 (History)

```typescript
// Loro CRDT 통합
selectionManager.on("selectionChange", (selection) => {
  historyManager.recordSelection(selection)
})
```

## 성능 최적화

### 1. 이벤트 디바운싱

```typescript
const debouncedSelect = debounce((element) => {
  selectionManager.select(element)
}, 50)
```

### 2. 가상 스크롤 지원

```typescript
// 뷰포트 내 요소만 렌더링
const visibleElements = getElementsInViewport()
renderSelectionOverlay(visibleElements)
```

### 3. 메모리 관리

```typescript
// WeakMap으로 요소 메타데이터 관리
const elementMetadata = new WeakMap<HTMLElement, SelectionMetadata>()
```

## 접근성 (A11y)

### 1. ARIA 속성

```html
<div
  data-editable="text"
  role="button"
  aria-selected="true"
  aria-label="편집 가능한 텍스트"
></div>
```

### 2. 키보드 전용 사용

- 모든 기능 키보드로 접근 가능
- 포커스 표시 명확
- 스크린 리더 지원

### 3. 고대비 모드

```css
@media (prefers-contrast: high) {
  .selection-overlay {
    border-width: 3px;
    border-style: solid;
  }
}
```

## 모바일 지원

### 1. 터치 인터랙션

```typescript
// 롱프레스로 다중 선택 모드
let longPressTimer
element.addEventListener("touchstart", (e) => {
  longPressTimer = setTimeout(() => {
    enableMultiSelectMode()
  }, 500)
})
```

### 2. 제스처 지원

- 핀치: 줌
- 스와이프: 선택 이동
- 탭: 선택/해제

## 테스트 전략

### 1. 단위 테스트

```typescript
describe("SelectionManager", () => {
  it("should select single element", () => {
    const element = document.createElement("div")
    selectionManager.select(element)
    expect(selectionManager.isSelected(element)).toBe(true)
  })
})
```

### 2. E2E 테스트

```typescript
test("multi-selection workflow", async ({ page }) => {
  await page.click("[data-editable]")
  await page.keyboard.down("Shift")
  await page.click("[data-editable]:nth-child(3)")
  // 검증...
})
```

## 향후 개선 사항

1. **AI 기반 스마트 선택**
   - 유사 요소 자동 그룹핑
   - 컨텍스트 기반 선택 제안

2. **협업 선택**
   - 실시간 다중 사용자 선택 표시
   - 선택 충돌 해결

3. **선택 템플릿**
   - 자주 사용하는 선택 패턴 저장
   - 빠른 선택 매크로

4. **고급 시각화**
   - 3D 선택 효과
   - 애니메이션 피드백
   - 선택 미리보기
