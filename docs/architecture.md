# Visual CMS Editor - 아키텍처 문서

## 개요

Visual CMS Editor는 디자인과 콘텐츠를 완전히 분리하여 안전한 비주얼 편집을 가능하게 하는 차세대 헤드리스 CMS 라이브러리입니다. SvelteKit 기반으로 구축되었으며, 플러그인 아키텍처와 CRDT 기반 협업을 지원합니다.

## 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        Application Layer                      │
├─────────────────────────────────────────────────────────────┤
│  Routes           │  Components        │  Templates          │
│  (/+page.svelte) │  (Inspector,       │  (30+ templates)    │
│                   │   LeftSidebar,     │                     │
│                   │   SelectionOverlay)│                     │
├─────────────────────────────────────────────────────────────┤
│                         Core Layer                            │
├─────────────────────────────────────────────────────────────┤
│  Selection        │  Plugins           │  History            │
│  Manager          │  Manager           │  Manager            │
│  (선택 상태)      │  (편집 동작)       │  (Loro CRDT)        │
├─────────────────────────────────────────────────────────────┤
│                      Infrastructure                           │
├─────────────────────────────────────────────────────────────┤
│  Stores           │  Actions           │  Utils              │
│  (Svelte stores)  │  (RepeatableAction)│  (Helpers)          │
└─────────────────────────────────────────────────────────────┘
```

## 핵심 컴포넌트

### 1. Selection System (선택 시스템)

**SelectionManager** (`/src/lib/core/selection/SelectionManager.ts`)

- 중앙 집중식 선택 상태 관리
- 다중 선택 지원
- 선택 타입별 처리 (text, image, icon, link, repeatable, section)
- 키보드 네비게이션 지원

```typescript
interface SelectionState {
  selectedElements: Set<HTMLElement>
  activeSelectionType: SelectionType | null
  activeContainer: string
  selectionBounds: DOMRect | null
  metadata: Map<HTMLElement, any>
}
```

### 2. Plugin System (플러그인 시스템)

**EditablePluginManager** (`/src/lib/core/plugins/editable/EditablePluginManager.ts`)

- Strategy Pattern 기반 구현
- 각 편집 타입별 독립적인 플러그인
- 확장 가능한 구조

```typescript
interface EditablePlugin {
  type: string
  init?: (element: HTMLElement) => void
  onClick?: (element: HTMLElement, event: MouseEvent) => void
  onDoubleClick?: (element: HTMLElement, event: MouseEvent) => void
  onKeydown?: (element: HTMLElement, event: KeyboardEvent) => void
  getValue?: (element: HTMLElement) => any
  setValue?: (element: HTMLElement, value: any) => void
  isEmpty?: (element: HTMLElement) => boolean
  clear?: (element: HTMLElement) => void
  validate?: (element: HTMLElement, value: any) => ValidationResult
  getConstraints?: (element: HTMLElement) => any
  applyStyles?: (element: HTMLElement, isSelected: boolean) => void
  removeStyles?: (element: HTMLElement) => void
  getActions?: (element: HTMLElement) => Action[]
}
```

**구현된 플러그인:**

- **TextPlugin**: contentEditable 기반 텍스트 편집
- **ImagePlugin**: 파일 업로드, 드래그 앤 드롭
- **IconPlugin**: SVG 아이콘 선택 및 교체
- **LinkPlugin**: URL 편집 모달

### 3. History System (히스토리 시스템)

**HistoryManager** (`/src/lib/core/history/index.ts`)

- Loro CRDT 기반 구현
- 충돌 없는 협업 지원
- Undo/Redo 기능
- 구조적 변경 및 콘텐츠 변경 추적

```typescript
interface HistoryState {
  canUndo: boolean
  canRedo: boolean
  version: number
  totalChanges: number
}
```

### 4. Template System (템플릿 시스템)

**템플릿 구조** (`/src/lib/core/templates/templates.ts`)

- 7개 카테고리 (Hero, Features, CTA, Testimonials, Stats, Pricing, Contact)
- HTML 문자열 기반 템플릿
- 편집 가능 영역 자동 감지 (data-editable 속성)
- 제약사항 자동 적용 (data-max-length, data-min/max)

```typescript
interface Template {
  id: string
  name: string
  category: TemplateCategory
  html: string
  thumbnail?: string
  description?: string
  editableElements: EditableElement[]
}
```

### 5. UI Components

**SelectionOverlay** (`/src/lib/components/SelectionOverlay.svelte`)

- floating-ui 기반 위치 계산
- 선택된 요소 위에 떠있는 액션 버튼
- 컨텍스트별 액션 표시

**Inspector** (`/src/lib/components/Inspector.svelte`)

- 선택된 요소의 속성 편집
- 히스토리 상태 표시
- 실시간 업데이트

**LeftSidebar** (`/src/lib/components/LeftSidebar.svelte`)

- 섹션 썸네일 표시
- 드래그 앤 드롭으로 순서 변경
- 섹션 가시성 토글

## 이벤트 흐름

### 선택 이벤트 흐름

```
1. 사용자 클릭
   ↓
2. handleElementClick (이벤트 위임)
   ↓
3. EditablePluginManager.handleClick (플러그인별 처리)
   ↓
4. SelectionManager.select (선택 상태 업데이트)
   ↓
5. Store 업데이트 → UI 리렌더링
```

### 편집 이벤트 흐름

```
1. 선택된 요소에서 Enter/더블클릭
   ↓
2. startEdit 함수 호출
   ↓
3. contentEditable 활성화 또는 플러그인별 편집 UI
   ↓
4. 사용자 입력
   ↓
5. HistoryManager.updateText (변경사항 추적)
   ↓
6. Escape/Blur로 편집 종료
```

## 데이터 속성 규칙

### 편집 가능 요소

```html
<!-- 텍스트 편집 -->
<p
  data-editable="text"
  data-max-length="100"
>
  텍스트
</p>

<!-- 이미지 편집 -->
<img
  data-editable="image"
  data-max-size="5MB"
  src="..."
/>

<!-- 아이콘 편집 -->
<div data-editable="icon">
  <svg>...</svg>
</div>

<!-- 링크 편집 -->
<a
  data-editable="link"
  href="..."
  >링크</a
>

<!-- 반복 가능 컨테이너 -->
<div
  data-repeatable="features"
  data-min="1"
  data-max="6"
>
  <div class="feature">...</div>
</div>
```

### 선택 상태 표시

```html
<!-- 선택된 요소 -->
<p
  data-selected="true"
  data-selection-type="text"
>
  ...
</p>

<!-- 편집 중인 요소 -->
<p
  data-editing="true"
  contenteditable="true"
>
  ...
</p>
```

## 상태 관리

### Svelte Stores

- `selectedElements`: 선택된 요소들의 Set
- `activeSelectionType`: 현재 선택 타입
- `selectedSectionIndex`: 선택된 섹션 인덱스
- `editMode`: 현재 편집 모드 (design/content)
- `historyState`: 히스토리 상태 정보

### 반응형 업데이트

```typescript
// Store 구독 예시
$: firstSelected = $selectedElements.size > 0 ? Array.from($selectedElements)[0] : null

$: isEditing = mode === "edit" && firstSelected?.hasAttribute("contenteditable")
```

## 플러그인 확장 가이드

새로운 편집 타입을 추가하려면:

1. **플러그인 생성**

```typescript
// /src/lib/core/plugins/editable/plugins/custom.ts
export const customPlugin: EditablePlugin = {
  type: "custom",

  init(element: HTMLElement) {
    // 초기화 로직
  },

  onClick(element: HTMLElement, event: MouseEvent) {
    // 클릭 처리
  },

  getValue(element: HTMLElement) {
    // 값 가져오기
  },

  setValue(element: HTMLElement, value: any) {
    // 값 설정하기
  },
}
```

2. **플러그인 등록**

```typescript
// EditablePluginManager에 플러그인 추가
this.plugins.set("custom", customPlugin)
```

3. **HTML 마크업**

```html
<div data-editable="custom">커스텀 콘텐츠</div>
```

## 성능 최적화

### 현재 적용된 최적화

- 이벤트 위임을 통한 리스너 최소화
- 디바운싱을 통한 히스토리 업데이트 최적화
- 정적 사이트 생성 (SSG) with CSR-only
- WASM 지원으로 Loro CRDT 성능 향상

### 향후 계획

- 가상 스크롤링 (대규모 문서)
- 레이지 로딩 (템플릿, 이미지)
- 웹 워커 활용 (CRDT 연산)
- 증분 렌더링

## 보안 고려사항

### 현재 구현

- contentEditable 사용 시 XSS 방지
- 파일 업로드 검증 (타입, 크기)
- 데이터 속성 기반 권한 체크

### 향후 계획

- CSP (Content Security Policy) 지원
- 역할 기반 접근 제어 (RBAC)
- 감사 로그 (Audit Trail)
- 암호화된 콘텐츠 저장

## 테스트 전략

### 단위 테스트 (Vitest)

- 플러그인 개별 기능
- 선택 시스템 로직
- 히스토리 관리

### E2E 테스트 (Playwright)

- 사용자 시나리오
- 키보드 네비게이션
- 드래그 앤 드롭

### 테스트 커버리지 목표

- 핵심 기능: 90% 이상
- 전체: 80% 이상
