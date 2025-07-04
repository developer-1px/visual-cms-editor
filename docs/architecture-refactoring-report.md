# 아키텍처 고도화 보고서: 전략 패턴을 활용한 복사/붙여넣기 시스템 리팩토링

## 현재 문제점 분석

### 1. 분기 로직의 문제점
```typescript
// 현재 구조 - 분기가 많고 응집도가 낮음
function handleCopyShortcut() {
    if (firstSelected) {
        if (selectedType === 'image') {
            editablePluginManager.handleAction(firstSelected, 'copy');
        } else if (selectedType === 'repeatable') {
            copySelectedRepeatable();
        } else {
            copySelected();
        }
    }
}
```

**문제점:**
- **낮은 응집도**: 다양한 타입의 로직이 하나의 함수에 섞여 있음
- **높은 결합도**: 새로운 타입 추가 시 기존 함수 수정 필요
- **확장성 부족**: 새로운 editable 타입 추가가 어려움
- **중복 코드**: cut, paste, delete에서 동일한 분기 로직 반복
- **단일 책임 원칙 위반**: 하나의 함수가 여러 타입을 처리

### 2. 현재 아키텍처의 한계
- 플러그인 시스템과 기존 함수들이 혼재
- 일관성 없는 처리 방식 (plugin vs 직접 호출)
- 타입별 특수 로직의 분산

## 제안하는 해결책: 통합 전략 패턴

### 1. 핵심 아이디어
모든 editable 요소를 플러그인으로 통합하고, 공통 인터페이스를 통해 일관된 처리

### 2. 새로운 아키텍처 설계

#### 2.1 통합 Action 인터페이스
```typescript
interface ActionHandler {
    canHandle(element: HTMLElement, selectionType: string): boolean;
    copy(element: HTMLElement): Promise<void>;
    cut(element: HTMLElement): Promise<void>;
    paste(element: HTMLElement): Promise<void>;
    delete(element: HTMLElement): Promise<void>;
}

interface SelectionActionManager {
    registerHandler(handler: ActionHandler): void;
    executeAction(action: string, selection: Selection): Promise<void>;
}
```

#### 2.2 타입별 Action Handler 구현
```typescript
// 이미지 액션 핸들러
class ImageActionHandler implements ActionHandler {
    canHandle(element: HTMLElement, selectionType: string): boolean {
        return selectionType === 'image' && element.dataset.editable === 'image';
    }
    
    async copy(element: HTMLElement): Promise<void> {
        // 이미지 플러그인의 copy 로직
    }
    
    async cut(element: HTMLElement): Promise<void> {
        // 이미지 플러그인의 cut 로직
    }
    
    // ... 다른 액션들
}

// Repeatable 액션 핸들러
class RepeatableActionHandler implements ActionHandler {
    canHandle(element: HTMLElement, selectionType: string): boolean {
        return selectionType === 'repeatable';
    }
    
    async copy(element: HTMLElement): Promise<void> {
        // 기존 copySelectedRepeatable 로직
    }
    
    // ... 다른 액션들
}

// 텍스트 액션 핸들러
class TextActionHandler implements ActionHandler {
    canHandle(element: HTMLElement, selectionType: string): boolean {
        return selectionType === 'text';
    }
    
    async copy(element: HTMLElement): Promise<void> {
        // 기존 copySelected 로직
    }
    
    // ... 다른 액션들
}
```

#### 2.3 중앙 집중식 Action Manager
```typescript
class SelectionActionManager {
    private handlers: ActionHandler[] = [];
    
    registerHandler(handler: ActionHandler): void {
        this.handlers.push(handler);
    }
    
    private findHandler(element: HTMLElement, selectionType: string): ActionHandler | null {
        return this.handlers.find(handler => 
            handler.canHandle(element, selectionType)
        ) || null;
    }
    
    async executeAction(action: string, element: HTMLElement, selectionType: string): Promise<void> {
        const handler = this.findHandler(element, selectionType);
        if (!handler) {
            throw new Error(`No handler found for type: ${selectionType}`);
        }
        
        switch (action) {
            case 'copy':
                await handler.copy(element);
                break;
            case 'cut':
                await handler.cut(element);
                break;
            case 'paste':
                await handler.paste(element);
                break;
            case 'delete':
                await handler.delete(element);
                break;
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }
}
```

#### 2.4 단순화된 단축키 핸들러
```typescript
// 리팩토링 후 - 깔끔한 단일 책임
async function handleCopyShortcut() {
    if (firstSelected) {
        await selectionActionManager.executeAction('copy', firstSelected, selectedType);
    }
}

async function handleCutShortcut() {
    if (firstSelected) {
        await selectionActionManager.executeAction('cut', firstSelected, selectedType);
    }
}

async function handlePasteShortcut() {
    if (firstSelected) {
        await selectionActionManager.executeAction('paste', firstSelected, selectedType);
    }
}

async function handleDeleteShortcut() {
    if (firstSelected) {
        await selectionActionManager.executeAction('delete', firstSelected, selectedType);
    }
}
```

### 3. 구현 계획

#### Phase 1: 인터페이스 및 매니저 구현
1. `ActionHandler` 인터페이스 정의
2. `SelectionActionManager` 클래스 구현
3. 기본 에러 처리 및 로깅 추가

#### Phase 2: 핸들러 구현 및 마이그레이션
1. `ImageActionHandler` 구현 (기존 이미지 플러그인 로직 이전)
2. `RepeatableActionHandler` 구현 (기존 함수들 이전)
3. `TextActionHandler` 구현 (기본 텍스트 처리 로직)

#### Phase 3: 통합 및 정리
1. 기존 분기 로직 제거
2. 단축키 핸들러 단순화
3. 테스트 및 검증

### 4. 예상 효과

#### 4.1 코드 품질 향상
- **단일 책임 원칙**: 각 핸들러가 특정 타입만 처리
- **개방-폐쇄 원칙**: 새로운 타입 추가 시 기존 코드 수정 불필요
- **의존성 역전**: 고수준 모듈이 저수준 구현에 의존하지 않음

#### 4.2 유지보수성 개선
- 새로운 editable 타입 추가가 간단
- 타입별 로직이 분리되어 디버깅 용이
- 일관된 처리 방식으로 예측 가능한 동작

#### 4.3 확장성 강화
- 플러그인 방식으로 무한 확장 가능
- 동적 핸들러 등록/해제 지원
- 타입별 특수 기능 쉽게 추가

### 5. 추가 개선 사항

#### 5.1 Command Pattern 도입
```typescript
interface Command {
    execute(): Promise<void>;
    undo(): Promise<void>;
}

class CopyCommand implements Command {
    constructor(
        private handler: ActionHandler,
        private element: HTMLElement
    ) {}
    
    async execute(): Promise<void> {
        await this.handler.copy(this.element);
    }
    
    async undo(): Promise<void> {
        // 복사는 undo 불필요
    }
}
```

#### 5.2 Decorator Pattern으로 기능 확장
```typescript
class LoggingActionHandler implements ActionHandler {
    constructor(private baseHandler: ActionHandler) {}
    
    async copy(element: HTMLElement): Promise<void> {
        console.log(`Copying ${element.dataset.editable} element`);
        await this.baseHandler.copy(element);
        console.log('Copy completed');
    }
    
    // ... 다른 메서드들도 동일하게 래핑
}
```

#### 5.3 비동기 처리 및 에러 핸들링
```typescript
class SafeActionManager extends SelectionActionManager {
    async executeAction(action: string, element: HTMLElement, selectionType: string): Promise<void> {
        try {
            await super.executeAction(action, element, selectionType);
        } catch (error) {
            console.error(`Action failed: ${action} on ${selectionType}`, error);
            // 사용자에게 알림 표시
            this.showErrorNotification(`${action} 작업에 실패했습니다.`);
        }
    }
    
    private showErrorNotification(message: string): void {
        // 토스트 알림 등으로 사용자에게 피드백
    }
}
```

## 결론

현재의 분기 기반 처리 방식을 전략 패턴으로 리팩토링하면:

1. **코드의 응집도 향상**: 타입별 로직이 각각의 핸들러로 분리
2. **확장성 증대**: 새로운 타입 추가가 기존 코드 수정 없이 가능
3. **유지보수성 개선**: 일관된 인터페이스로 예측 가능한 동작
4. **테스트 용이성**: 각 핸들러를 독립적으로 테스트 가능

이러한 아키텍처 개선을 통해 더욱 견고하고 확장 가능한 Visual CMS Editor를 구축할 수 있습니다.

## 다음 단계

1. **POC 구현**: 작은 범위에서 새로운 아키텍처 검증
2. **점진적 마이그레이션**: 기존 기능을 단계적으로 이전
3. **성능 측정**: 리팩토링 전후 성능 비교
4. **문서화**: 새로운 아키텍처 가이드 작성

이 아키텍처 고도화를 통해 더욱 전문적이고 확장 가능한 코드베이스를 구축할 수 있을 것입니다.