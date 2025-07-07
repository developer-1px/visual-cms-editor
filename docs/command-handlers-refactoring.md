# Command Handlers DOM API 제거 리팩토링

## 개요
Command Handler들에서 모든 DOM API 호출을 제거하고, 상태 기반 접근 방식으로 전환했습니다.

## 변경 사항

### 1. RepeatableCommandHandler.ts

#### 제거된 DOM API:
- `element.animate()` - 애니메이션 직접 호출
- `element.dispatchEvent()` - 이벤트 직접 발생
- `document.dispatchEvent()` - 문서 레벨 이벤트
- `parentElement.insertBefore()` - DOM 조작

#### 추가된 기능:
- `lastOperation` 상태 추적 - View 레이어가 어떤 작업이 수행되었는지 확인 가능
- `getLastOperation()` - 마지막 작업 정보 조회
- `getCopiedElementData()` - 복사된 요소 데이터 접근

#### View 레이어 책임:
- 애니메이션 적용 (copy: scale pulse, cut/delete: scale down + fade out, paste: scale up + fade in)
- DOM 요소 삽입/제거
- 히스토리 상태 관리
- 이벤트 리스너 연결 (hydration)

### 2. ImageCommandHandler.ts

#### 제거된 DOM API:
- `element.dispatchEvent()` - 이벤트 직접 발생
- `element.animate()` - 애니메이션 직접 호출

#### 추가된 기능:
- `lastOperation` 상태 추적 (이미지 URL 포함)
- `getLastOperation()` - 마지막 작업 정보 조회

#### View 레이어 책임:
- 이미지 변경 감지 (imagePlugin.setValue 호출 결과)
- 애니메이션 적용
- 히스토리 업데이트

### 3. ModelTextCommandHandler.ts

#### 제거된 DOM API:
- `element.dispatchEvent()` - Model 변경 이벤트
- `document.dispatchEvent()` - 히스토리 이벤트

#### 추가된 기능:
- `lastOperation` 상태 추적 (Model ID와 텍스트 내용 포함)
- `getLastOperation()` - 마지막 작업 정보 조회

#### View 레이어 책임:
- TextModel 변경 직접 관찰 (reactive state)
- 애니메이션 적용
- 히스토리 업데이트

## 애니메이션 사양

모든 핸들러에서 일관된 애니메이션 사양:

- **Copy**: scale(1) → scale(1.05) → scale(1), opacity pulse effect
- **Cut**: scale(1) → scale(0.95), opacity 1 → 0.5
- **Paste**: scale(0.9) → scale(1), opacity 0.5 → 1
- **Delete**: scale(1) → scale(0.9), opacity 1 → 0.3

모든 애니메이션: 300ms duration, ease-out timing

## View 레이어 구현 가이드

View 레이어는 다음과 같은 방법으로 Command Handler와 통합해야 합니다:

1. **상태 관찰**: 
   - Handler의 `getLastOperation()`을 주기적으로 확인
   - Model 변경사항 직접 관찰 (Svelte stores, React state 등)

2. **애니메이션 적용**:
   - 작업 타입에 따라 적절한 애니메이션 적용
   - Web Animations API 또는 CSS transitions 사용

3. **DOM 조작**:
   - RepeatableHandler의 paste 작업 시 DOM 요소 삽입
   - cut/delete 작업 시 애니메이션 후 요소 제거

4. **히스토리 관리**:
   - 작업 전후로 히스토리 상태 저장
   - Undo/Redo 지원

## 마이그레이션 체크리스트

- [x] RepeatableCommandHandler - DOM API 제거 완료
- [x] ImageCommandHandler - DOM API 제거 완료  
- [x] ModelTextCommandHandler - DOM API 제거 완료
- [ ] View 컴포넌트들이 새로운 상태 기반 접근 방식 사용하도록 업데이트
- [ ] 애니메이션 로직을 View 레이어로 이동
- [ ] 히스토리 관리를 상태 기반으로 전환