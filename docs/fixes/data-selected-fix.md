# data-selected 속성 수정 사항

## 문제점
`data-selected` 속성이 항상 "true"로 표시되는 문제가 있었습니다. 이는 CSS 선택자 `[data-selected="true"]`가 의도하지 않은 요소들에도 적용되는 원인이었습니다.

## 원인 분석

### 1. Svelte 5 $derived 문법 오류
`FrameRenderer.svelte`에서:
```svelte
// 잘못된 코드
let isSelected = $derived(() => {
  if (!elementRef) return false
  return $selectedElements.has(elementRef)
})
```

이는 함수를 반환하므로 항상 truthy 값이 됩니다.

### 2. 잘못된 속성 값 설정
여러 컴포넌트에서:
```svelte
// 잘못된 코드
data-selected={isSelected || null}
```

이 패턴은 `isSelected`가 false일 때 `data-selected="null"` 문자열을 생성하며, CSS에서는 이를 truthy로 인식합니다.

### 3. selectable 액션의 문자열 변환
`selectable.svelte.ts`에서:
```typescript
// 잘못된 코드
node.setAttribute("data-selected", state.selected.toString())
```

이는 `data-selected="false"` 문자열을 생성하며, 역시 CSS에서 truthy로 인식됩니다.

## 수정 사항

### 1. $derived 문법 수정
```svelte
// 수정된 코드
let isSelected = $derived(
  elementRef ? $selectedElements.has(elementRef) : false
)
```

### 2. 조건부 속성 설정
```svelte
// 수정된 코드
data-selected={isSelected ? "true" : null}
```

### 3. 속성 제거 방식 사용
```typescript
// 수정된 코드
if (state.selected) {
  node.setAttribute("data-selected", "true")
} else {
  node.removeAttribute("data-selected")
}
```

## 영향받은 파일
- `/src/lib/components/renderers/FrameRenderer.svelte`
- `/src/lib/components/renderers/EditableRenderer.svelte`
- `/src/lib/components/plugins/ModelTextPlugin.svelte`
- `/src/lib/components/plugins/ModelIconPlugin.svelte`
- `/src/lib/components/plugins/ModelImagePlugin.svelte`
- `/src/lib/components/plugins/ModelLinkPlugin.svelte`
- `/src/lib/components/plugins/TextPlugin.svelte`
- `/src/lib/components/plugins/ImagePlugin.svelte`
- `/src/lib/components/plugins/IconPlugin.svelte`
- `/src/lib/components/plugins/LinkPlugin.svelte`
- `/src/lib/actions/selectable.svelte.ts`

## 결과
이제 `data-selected` 속성은:
- 선택된 요소: `data-selected="true"`
- 선택되지 않은 요소: 속성 자체가 없음

이로써 CSS 선택자 `[data-selected="true"]`가 정확히 선택된 요소에만 적용됩니다.