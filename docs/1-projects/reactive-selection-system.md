# Reactive Selection System with Svelte 5 Runes

## 개요

기존의 직접적인 DOM 조작 방식을 Svelte 5의 rune 문법을 활용한 반응형 시스템으로 전환했습니다. 이를 통해 더 선언적이고 유지보수가 쉬운 코드를 작성할 수 있습니다.

## 주요 변경사항

### 1. Store → Rune 기반 상태 관리

**기존 방식 (Svelte 4 stores):**

```typescript
import { writable, derived } from 'svelte/store';
const selectionState = writable({...});
```

**새로운 방식 (Svelte 5 runes):**

```typescript
class SelectionStore {
  private state = $state<SelectionState>({
    selectedElements: new Set(),
    editingElement: null,
    selectionType: new Map(),
    overlayPosition: null,
  })

  selectedElements = $derived(Array.from(this.state.selectedElements))
  isAnySelected = $derived(this.state.selectedElements.size > 0)
}
```

### 2. DOM 조작 제거

**기존 방식:**

```typescript
element.setAttribute("data-selected", "true")
element.classList.add("selected")
element.style.outline = "2px solid blue"
```

**새로운 방식:**

```typescript
// Action에서 $effect 사용
$effect(() => {
  const state = selectionStore.getElementState(id)
  if (!state) return

  // 데이터 속성은 CSS 스타일링을 위해서만 사용
  node.setAttribute("data-selected", state.selected.toString())
  node.setAttribute("data-editing", state.editing.toString())
})
```

### 3. 반응형 플러그인 시스템

**TextPlugin.svelte.ts:**

```typescript
export class ReactiveTextPlugin {
  private states = $state<Map<string, TextPluginState>>(new Map())

  private setupEffects(element: HTMLElement, elementId: string): void {
    $effect(() => {
      const isEditing = selectionStore.isEditing(elementId)

      if (isEditing) {
        element.contentEditable = "true"
        element.focus()
      } else {
        element.contentEditable = "false"
      }
    })
  }
}
```

## 파일 구조

```
src/lib/
├── stores/
│   └── selection.svelte.ts      # Rune 기반 선택 상태 관리
├── actions/
│   └── selectable.svelte.ts     # 선택 가능한 요소를 위한 Svelte action
├── plugins/reactive/
│   ├── TextPlugin.svelte.ts     # 반응형 텍스트 플러그인
│   └── ImagePlugin.svelte.ts    # 반응형 이미지 플러그인
└── components/
    ├── SelectionOverlay.svelte   # 선택 오버레이 (rune 사용)
    ├── EditableText.svelte       # 편집 가능한 텍스트 컴포넌트
    └── EditableImage.svelte      # 편집 가능한 이미지 컴포넌트
```

## 사용 예시

### 1. 컴포넌트 사용

```svelte
<script lang="ts">
  import EditableText from "$lib/components/EditableText.svelte"
  import EditableImage from "$lib/components/EditableImage.svelte"
</script>

<EditableText
  id="my-text"
  content="클릭하여 편집"
  maxlength={100}
  class="text-lg"
/>

<EditableImage
  id="my-image"
  src="/image.jpg"
  alt="샘플 이미지"
  aspectratio="16/9"
/>
```

### 2. 선택 상태 접근

```typescript
import { selectionStore } from "$lib/stores/selection.svelte"

// 반응형 값 사용
let selectedCount = $derived(selectionStore.selectedElements.length)
let isEditing = $derived(selectionStore.editingElement !== null)

// 메서드 호출
selectionStore.selectElement("element-id", "text")
selectionStore.startEditing("element-id")
```

### 3. Custom Action 사용

```svelte
<script lang="ts">
  import { selectable } from "$lib/actions/selectable.svelte"
</script>

<div
  use:selectable={{
    id: "custom-element",
    type: "custom",
    onSelect: (element) => console.log("Selected!", element),
    onEdit: (element) => console.log("Editing!", element),
  }}
>
  커스텀 선택 가능한 요소
</div>
```

## CSS 스타일링

모든 스타일은 데이터 속성을 기반으로 적용됩니다:

```css
/* 선택된 상태 */
[data-selected="true"] {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 편집 중 상태 */
[data-editing="true"] {
  outline: 3px solid #f59e0b;
  background-color: #fef3c7;
}

/* 타입별 스타일 */
[data-selected="true"][data-selection-type="image"] {
  outline-color: #10b981;
}
```

## 장점

1. **선언적 코드**: DOM 조작 대신 상태 변경으로 UI 업데이트
2. **타입 안전성**: TypeScript와 Svelte 5의 향상된 타입 지원
3. **성능**: Svelte의 세밀한 반응성으로 필요한 부분만 업데이트
4. **유지보수성**: 상태와 뷰 로직이 명확히 분리
5. **테스트 용이성**: 상태 기반 테스트 가능

## 마이그레이션 가이드

1. **Store 교체**: 기존 writable store를 $state rune으로 변경
2. **Subscribe 제거**: $effect로 반응형 구독 처리
3. **DOM 조작 제거**: setAttribute, classList 등을 상태 기반으로 변경
4. **컴포넌트 props**: export let을 $props()로 변경

## 데모 페이지

- `/rune-demo`: 기본 Svelte 5 rune 데모
- `/components-demo`: 반응형 컴포넌트 데모

## 다음 단계

1. 기존 페이지들을 새로운 반응형 시스템으로 마이그레이션
2. 더 많은 플러그인 타입 지원 (link, video 등)
3. 애니메이션 및 트랜지션 추가
4. 접근성 개선
