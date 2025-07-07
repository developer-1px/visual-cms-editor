# 코드 라인 수 감소를 위한 상세 리팩토링 계획 및 태스크

이 문서는 Visual CMS Editor 프로젝트의 코드 라인 수(LOC)를 실질적으로 감소시키기 위한 매우 구체적인 리팩토링 태스크를 제시합니다. 각 태스크는 특정 파일, 코드 패턴, 그리고 적용할 수 있는 구체적인 리팩토링 기법을 명시하여 개발자가 즉시 실행할 수 있도록 돕습니다.

## 1. `any` 및 `as` 키워드 사용 최소화 (Task 1)

**목표**: `src` 디렉토리 내의 모든 `.ts` 파일에서 `any` 및 `as` 키워드 사용을 검토하고, 가능한 한 구체적인 타입으로 대체하거나 타입 가드를 적용하여 불필요한 코드 라인을 줄입니다.

**세부 태스크:**

### 1.1. `src/lib/core/commands/CommandStore.ts` 내 `as Error` 제거

-   **문제 패턴**: `error as Error`와 같이 `error` 객체를 `Error` 타입으로 단언하는 부분.
-   **해결 방안**: `catch` 블록의 `error`는 기본적으로 `unknown` 타입이므로, `instanceof Error`를 사용하여 타입을 좁히거나, `isError`와 같은 유틸리티 타입 가드 함수를 생성하여 사용합니다.
-   **예시 코드 (수정 전):**
    ```typescript
    logger.logCommandError(command, error as Error)
    logger.error("Error undoing command", { command, error: (error as Error).message }, error as Error)
    ```
-   **예시 코드 (수정 후):**
    ```typescript
    function isError(e: unknown): e is Error {
        return e instanceof Error;
    }
    // ...
    if (isError(error)) {
        logger.logCommandError(command, error);
        logger.error("Error undoing command", { command, error: error.message }, error);
    } else {
        // handle non-Error cases or log as unknown
        logger.logCommandError(command, new Error(String(error)));
        logger.error("Error undoing command", { command, error: String(error) }, String(error));
    }
    ```
-   **영향 파일**: `src/lib/core/commands/CommandStore.ts` (L125, L166, L167, L193, L194, L251, L327, L389)

### 1.2. `src/lib/core/commands/executors/UIExecutor.ts` 내 `as Command` 제거

-   **문제 패턴**: `const cmd = command as ToggleSidebarCommand`와 같이 특정 커맨드 타입으로 단언하는 부분.
-   **해결 방안**: 각 `Executor`는 특정 `Command` 타입만 처리하도록 설계되어야 합니다. 만약 여러 타입의 `Command`를 처리해야 한다면, 타입 가드를 사용하여 안전하게 타입을 좁히거나, 제네릭을 활용하여 `Executor` 자체를 타입화합니다.
-   **예시 코드 (수정 전):**
    ```typescript
    const cmd = command as ToggleSidebarCommand
    ```
-   **예시 코드 (수정 후 - 타입 가드 활용):**
    ```typescript
    import { isToggleSidebarCommand } from '../../entities/command/types'; // 가정
    // ...
    if (isToggleSidebarCommand(command)) {
        // command는 이제 ToggleSidebarCommand 타입으로 추론됨
        // ...
    }
    ```
-   **영향 파일**: `src/lib/core/commands/executors/UIExecutor.ts` (L25, L41, L66, L90, L142, L155, L177, L190, L212, L237)

### 1.3. `src/lib/core/commands/handlers/*.ts` 내 `as` 및 `any` 제거

-   **문제 패턴**: `const plugin = imagePlugin as typeof imagePlugin & { imageClipboard?: string }`, `model as TextModel` 등.
-   **해결 방안**: 인터페이스 또는 타입 정의를 확장하여 필요한 속성을 포함시키거나, 유틸리티 함수를 통해 안전하게 속성에 접근합니다. `model`의 경우, `instanceof` 또는 사용자 정의 타입 가드를 사용하여 타입을 좁힙니다.
-   **영향 파일**: `src/lib/core/commands/handlers/ImageCommandHandler.ts` (L38, L80, L128), `src/lib/core/commands/handlers/ModelTextCommandHandler.ts` (L38, L78, L123, L176), `src/lib/core/commands/handlers/RepeatableCommandHandler.ts` (L32, L60, L113)

### 1.4. `src/lib/core/parsers/TemplateParser.ts` 내 `as` 제거

-   **문제 패턴**: `this.parseElement(rootElement) as FrameModel`, `element as HTMLImageElement` 등 DOM 요소에 대한 과도한 타입 단언.
-   **해결 방안**: `instanceof HTMLElement`, `instanceof HTMLImageElement` 등 구체적인 DOM 타입 가드를 사용하여 안전하게 타입을 좁힙니다. 파싱 로직을 더 추상화하여 DOM 의존성을 줄입니다.
-   **영향 파일**: `src/lib/core/parsers/TemplateParser.ts` (L38, L192, L209, L227, L245)

### 1.5. `src/lib/core/plugins/models/PluginModel.svelte.ts` 내 `as T` 제거

-   **문제 패턴**: `value: null as T`, `this.state.value as string` 등 제네릭 타입 `T`에 대한 `as` 단언.
-   **해결 방안**: `value`의 초기값을 `null` 대신 `T` 타입의 적절한 기본값으로 설정하거나, `T | null` 또는 `T | undefined`로 타입을 명시하고 사용 시점에 `null` 체크를 수행합니다.
-   **영향 파일**: `src/lib/core/plugins/models/PluginModel.svelte.ts` (L36, L110, L138)

## 2. 명령(Command) 시스템 리팩토링 (Task 2)

**목표**: `src/lib/core/commands` 디렉토리의 복잡성을 줄이고, `SelectionCommandManager`와 `CommandHandler` 간의 결합도를 낮춰 LOC를 줄입니다.

**세부 태스크:**

### 2.1. `SelectionCommandManager.ts`의 `executeCommand` 단순화

-   **문제 패턴**: `executeCommand` 내의 `switch` 문이 `CommandType`에 따라 분기하고 각 `handler`의 특정 메서드를 호출하는 방식.
-   **해결 방안**: `CommandHandler` 인터페이스를 확장하여 `execute(commandType: CommandType, element: HTMLElement): Promise<void>`와 같은 단일 실행 메서드를 갖도록 하고, 각 핸들러가 자신의 `commandType`을 내부적으로 처리하도록 합니다. 또는, 커맨드 레지스트리에서 `CommandType`과 `CommandHandler`의 특정 메서드를 직접 맵핑하도록 변경합니다.
-   **예상 코드 (수정 후 - 레지스트리 맵핑):**
    ```typescript
    // src/lib/core/commands/commandRegistry.ts (새 파일)
    const commandMethodMap = new Map<CommandType, (handler: CommandHandler, element: HTMLElement) => Promise<void>>([
        ["copy", (h, el) => h.copy(el)],
        ["cut", (h, el) => h.cut(el)],
        ["paste", (h, el) => h.paste(el)],
        ["delete", (h, el) => h.delete(el)],
    ]);

    // src/lib/core/commands/SelectionCommandManager.ts
    async executeCommand(commandType: CommandType, element: HTMLElement, selectionType: string): Promise<void> {
        const handler = this.handlers.get(selectionType);
        if (!handler) {
            throw new Error(`No handler registered for selection type: ${selectionType}`);
        }
        const method = commandMethodMap.get(commandType);
        if (method) {
            await method(handler, element);
        } else {
            throw new Error(`Unsupported command type: ${commandType}`);
        }
    }
    ```
-   **영향 파일**: `src/lib/core/commands/SelectionCommandManager.ts`, `src/lib/core/commands/action-interfaces.ts` (필요시 새 파일 추가)

## 3. 플러그인(Plugin) 시스템 리팩토링 및 중복 제거 (Task 3)

**목표**: `src/lib/core/plugins` 디렉토리의 코드 중복을 제거하고, 레거시 코드를 정리하며, 타입 안전성을 강화하여 LOC를 줄입니다.

**세부 태스크:**

### 3.1. `plugins/types/*.ts` 내 공통 로직 추출

-   **문제 패턴**: `selectionManager.isSelected(element, "image", "canvas")`와 같이 `plugins/types/icon.ts`, `image.ts`, `link.ts`, `text.ts`에서 반복되는 `isSelected` 호출 및 유사한 로직.
-   **해결 방안**: `isSelected` 호출을 캡슐화하는 헬퍼 함수를 만들거나, 플러그인 인터페이스에 `isApplicable(element: HTMLElement, context: SelectionContext): boolean`과 같은 메서드를 추가하여 각 플러그인이 자신의 적용 가능 여부를 판단하도록 합니다.
-   **예상 코드 (수정 후 - 헬퍼 함수):**
    ```typescript
    // src/lib/core/plugins/pluginUtils.ts (새 파일)
    import { selectionManager } from '../selection';
    import type { SelectionContext } from '../../entities/selection/types';

    export function isSelectedPluginElement(element: HTMLElement, type: string, context: SelectionContext): boolean {
        return selectionManager.isSelected(element, type, context);
    }

    // src/lib/core/plugins/types/image.ts
    import { isSelectedPluginElement } from '../pluginUtils';
    // ...
    isAvailable: (element) => isSelectedPluginElement(element, "image", "canvas"),
    ```
-   **영향 파일**: `src/lib/core/plugins/types/icon.ts`, `image.ts`, `link.ts`, `text.ts` (필요시 새 파일 추가)

### 3.2. 레거시 `EditablePluginManager` 제거 또는 마이그레이션

-   **문제 패턴**: `src/lib/core/plugins/core/manager.ts`의 `EditablePluginManager`가 `ModelBasedPluginManager`와 유사한 기능을 제공하며 레거시로 남아있음.
-   **해결 방안**: `ModelBasedPluginManager`가 모든 플러그인 관리 기능을 담당하도록 `EditablePluginManager`의 기능을 `ModelBasedPluginManager`로 완전히 통합하고, `EditablePluginManager` 관련 파일을 삭제합니다. 이 과정에서 중복되는 로직을 제거하고, `ModelBasedPluginManager`의 인터페이스를 명확히 합니다.
-   **영향 파일**: `src/lib/core/plugins/core/manager.ts`, `src/lib/core/plugins/core/registry.ts`, `src/lib/core/plugins/index.ts` (레거시 export 제거), `src/lib/core/plugins/ModelBasedPluginManager.ts` (기능 통합)

## 4. 키보드 단축키 핸들러 로직 간소화 (Task 4)

**목표**: `src/lib/keyboard/keymaps/editorKeymaps.ts` 파일 내의 반복적인 요소 타입 판단 및 명령 실행 로직을 간소화하여 LOC를 줄입니다.

**세부 태스크:**

### 4.1. 요소 타입 기반 명령 실행 헬퍼 함수 도입

-   **문제 패턴**: `Delete`, `Backspace`, `$mod+c`, `$mod+x`, `$mod+v`, `$mod+d` 핸들러 내에서 `element.hasAttribute("data-repeatable")` 또는 `element.hasAttribute("data-editable")`를 통해 타입을 판단하고 `selectionCommandManager.executeCommand`를 호출하는 반복적인 로직.
-   **해결 방안**: 요소의 `dataset` 속성을 기반으로 `selectionType`을 결정하고, 이를 사용하여 `selectionCommandManager.executeCommand`를 호출하는 단일 헬퍼 함수를 생성합니다.
-   **예상 코드 (수정 후):**
    ```typescript
    // src/lib/keyboard/keymaps/editorKeymaps.ts
    import { selectionCommandManager } from '../../core/commands/SelectionCommandManager';

    async function executeSelectionCommand(e: KeyboardEvent, command: CommandType) {
        const element = selectionManager.selectedElement.get(); // 현재 선택된 요소 가져오기
        if (!element) return;

        let selectionType: string | undefined;
        if (element.hasAttribute("data-repeatable")) {
            selectionType = "repeatable";
        } else if (element.hasAttribute("data-editable")) {
            selectionType = element.dataset.editable; // data-editable="text", "image" 등
        }

        if (selectionType) {
            await selectionCommandManager.executeCommand(command, element, selectionType);
        }
    }

    // ... 각 단축키 핸들러 내에서
    "Delete": async (e) => {
        await executeSelectionCommand(e, "delete");
    },
    "$mod+c": async (e) => {
        await executeSelectionCommand(e, "copy");
    },
    // ...
    ```
-   **영향 파일**: `src/lib/keyboard/keymaps/editorKeymaps.ts`

## 5. `TemplateParser.ts` 개선 (Task 5)

**목표**: `TemplateParser.ts`의 DOM 의존성을 줄이고, 타입 단언을 최소화하며, 파싱 로직을 간결하게 만들어 LOC를 줄입니다.

**세부 태스크:**

### 5.1. DOM 요소 타입 가드 활용 및 파싱 로직 추상화

-   **문제 패턴**: `element as HTMLImageElement`와 같은 직접적인 타입 단언.
-   **해결 방안**: `instanceof` 연산자를 사용하여 DOM 요소의 타입을 안전하게 확인하고, 각 요소 타입에 대한 파싱 로직을 별도의 함수로 분리하여 가독성을 높이고 중복을 줄입니다.
-   **예상 코드 (수정 후):**
    ```typescript
    // src/lib/core/parsers/TemplateParser.ts
    private parseImageElement(element: HTMLElement): ImageModel | null {
        if (!(element instanceof HTMLImageElement)) return null;
        // ... 이미지 파싱 로직
        return { /* ImageModel 객체 */ };
    }

    private parseLinkElement(element: HTMLElement): LinkModel | null {
        if (!(element instanceof HTMLAnchorElement)) return null;
        // ... 링크 파싱 로직
        return { /* LinkModel 객체 */ };
    }

    private parseElement(element: HTMLElement): BaseModel | null {
        // ...
        if (element.tagName.toLowerCase() === "img") {
            return this.parseImageElement(element);
        } else if (element.tagName.toLowerCase() === "a") {
            return this.parseLinkElement(element);
        }
        // ...
    }
    ```
-   **영향 파일**: `src/lib/core/parsers/TemplateParser.ts`

## 6. 전반적인 코드 중복 제거 및 유틸리티화 (Task 6)

**목표**: 프로젝트 전반에서 발견되는 작은 코드 중복을 제거하고, 재사용 가능한 유틸리티 함수로 추출하여 LOC를 줄입니다.

**세부 태스크:**

### 6.1. `src/lib/utils` 디렉토리 활용 강화

-   **문제 패턴**: 여러 파일에서 반복적으로 사용되는 작은 로직 조각들 (예: 문자열 조작, 배열 필터링, 객체 속성 접근 등).
-   **해결 방안**: 이러한 로직들을 식별하여 `src/lib/utils` 내에 적절한 이름의 유틸리티 함수로 추출하고, 기존 코드에서 해당 함수를 임포트하여 사용하도록 변경합니다.
-   **예상 영향 파일**: 프로젝트 전반

### 6.2. 설정 기반 로직으로 전환

-   **문제 패턴**: 복잡한 `if/else if` 체인 또는 `switch` 문으로 구현된 로직이 특정 값에 따라 다른 동작을 수행하는 경우.
-   **해결 방안**: 이러한 로직을 설정 객체나 맵으로 전환하여 데이터 기반으로 동작하도록 변경합니다. 이는 코드 라인을 줄이고 가독성을 높입니다.
-   **예시 코드 (수정 전):**
    ```typescript
    if (type === "text") {
        // ...
    } else if (type === "image") {
        // ...
    }
    ```
-   **예시 코드 (수정 후):**
    ```typescript
    const handlers = {
        "text": () => { /* ... */ },
        "image": () => { /* ... */ },
    };
    handlers[type]?.();
    ```
-   **예상 영향 파일**: `src/lib/core/plugins/ModelBasedPluginManager.ts`, `src/lib/core/commands/SelectionCommandManager.ts` 등

## 7. 리팩토링 진행 시 고려사항

-   **테스트 주도 리팩토링**: 각 태스크를 시작하기 전에 해당 코드에 대한 단위 테스트 또는 통합 테스트가 충분한지 확인합니다. 테스트가 없다면, 리팩토링 전에 테스트를 먼저 작성하여 변경으로 인한 회귀를 방지합니다.
-   **작은 단위로 커밋**: 각 세부 태스크를 완료할 때마다 작은 단위로 커밋하여 변경 이력을 명확히 하고, 문제 발생 시 롤백을 용이하게 합니다.
-   **성능 프로파일링**: LOC 감소가 항상 성능 향상으로 이어지는 것은 아닙니다. 중요한 성능 경로에 대한 변경 후에는 성능 프로파일링을 수행하여 의도치 않은 성능 저하가 없는지 확인합니다.
-   **코드 리뷰**: 변경된 코드에 대해 동료 개발자와 코드 리뷰를 진행하여 더 나은 개선 방안을 찾고, 잠재적인 문제를 조기에 발견합니다.

이 상세 계획을 통해 프로젝트의 코드 라인 수를 효과적으로 줄이고, 전반적인 코드 품질을 향상시킬 수 있을 것입니다.
