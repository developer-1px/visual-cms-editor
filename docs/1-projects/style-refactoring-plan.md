# 스타일 리팩토링 계획

## 목표

모든 직접적인 스타일 조작(`element.style.*`)을 제거하고 모델 기반 접근 방식으로 대체

## 리팩토링 대상

### 1. SelectionManager의 스타일 적용

**현재 문제:**

```typescript
element.style.outline = style.outline
element.style.outlineOffset = "2px"
element.style.backgroundColor = style.backgroundColor
```

**해결 방안:**

- CSS 클래스 기반 접근
- 선택 상태를 data attribute로 표현
- CSS에서 스타일 정의

### 2. 플러그인 시스템의 스타일 적용

**현재 문제:**

- text.ts, image.ts, icon.ts에서 직접 스타일 적용

**해결 방안:**

- 플러그인별 CSS 클래스 정의
- 선택/편집 상태를 data attribute로 표현

### 3. 오버레이 위치 지정

**현재 문제:**

```typescript
this.overlay.style.position = "fixed"
this.overlay.style.top = `${rect.top - 36}px`
this.overlay.style.left = `${rect.left}px`
```

**해결 방안:**

- CSS custom properties 사용
- 위치 값만 업데이트

## 구현 계획

### Phase 1: CSS 클래스 정의

1. 선택 상태별 CSS 클래스 생성
2. 플러그인별 CSS 클래스 생성
3. 편집 모드 CSS 클래스 생성

### Phase 2: Data Attribute 기반 상태 관리

1. `data-selected="true"` - 선택 상태
2. `data-editing="true"` - 편집 상태
3. `data-selection-type="text|image|icon"` - 선택 타입

### Phase 3: 코드 리팩토링

1. SelectionManager 수정
2. 각 플러그인 수정
3. 오버레이 컴포넌트 수정

### Phase 4: 정리

1. 불필요한 스타일 코드 제거
2. 테스트 및 검증
