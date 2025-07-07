# 코드 정돈 및 개선 보고서

이 보고서는 Visual CMS Editor 프로젝트의 코드베이스에서 더 단순하고 견고한 구조를 위해 정돈이 필요한 부분을 분석하고 제안합니다.

## 1. `any` 및 `as` 키워드 남용

`src` 디렉토리 전반에서 `any` 타입과 `as`를 사용한 타입 단언(type assertion)이 과도하게 사용되고 있습니다. 이는 TypeScript의 타입 안정성 이점을 약화시키고 런타임 오류의 잠재적 원인이 될 수 있습니다.

**문제점:**
-   **타입 안정성 저해**: 컴파일 시점에 오류를 발견하기 어렵게 만들어 런타임에 예기치 않은 동작을 유발할 수 있습니다.
-   **코드 가독성 저하**: 변수나 함수의 실제 타입 추론을 어렵게 하여 코드 이해도를 떨어뜨립니다.
-   **유지보수 어려움**: 타입 변경 시 관련 코드의 영향을 파적하기 어렵게 만듭니다.

**개선 방안:**
-   **명시적인 타입 정의**: 가능한 한 구체적인 타입을 정의하고 사용합니다.
-   **제네릭 활용**: 다양한 타입에 유연하게 동작하는 함수나 클래스에는 제네릭을 적극적으로 활용합니다.
-   **타입 가드(Type Guards)**: 런타임에 타입을 좁히기 위해 `instanceof`, `typeof`, 사용자 정의 타입 가드 함수를 사용합니다.
-   **타입 단언 최소화**: `as` 키워드 사용을 최소화하고, 불가피한 경우에만 사용하며 그 이유를 명확히 주석으로 남깁니다.

**영향을 받는 주요 파일 (예시):**
-   `src/lib/core/commands/CommandStore.ts`
-   `src/lib/core/commands/executors/UIExecutor.ts`
-   `src/lib/core/commands/handlers/ImageCommandHandler.ts`
-   `src/lib/core/commands/handlers/ModelTextCommandHandler.ts`
-   `src/lib/core/commands/handlers/RepeatableCommandHandler.ts`
-   `src/lib/core/keyboard/keymaps/editorKeymaps.ts`
-   `src/lib/core/parsers/TemplateParser.ts`
-   `src/lib/core/plugins/ModelBasedPluginManager.ts`
-   `src/lib/core/plugins/models/PluginModel.svelte.ts`
-   `src/lib/core/plugins/types/image.ts`
-   `src/lib/core/plugins/types/link.ts`
-   `src/lib/core/selection/index.ts`
-   `src/lib/core/templates/convention.ts`

## 2. `src/lib/core/commands` 디렉토리의 복잡성

`commands` 디렉토리는 명령 패턴을 구현하고 있지만, `SelectionCommandManager`와 여러 `CommandHandler`들 간의 상호작용이 복잡해 보입니다. 특히 `executeCommand` 내의 `switch` 문과 `CommandHandler`의 `hasHandler` 및 `executeCommand` 로직이 중복되거나 과도하게 일반화되어 있을 가능성이 있습니다.

**문제점:**
-   **높은 결합도**: `SelectionCommandManager`가 모든 `CommandHandler`의 세부 구현을 알아야 하므로 결합도가 높아집니다.
-   **확장성 저해**: 새로운 명령 타입이나 핸들러 추가 시 `SelectionCommandManager`를 수정해야 할 가능성이 높습니다.
-   **테스트 용이성 저하**: 복잡한 의존성으로 인해 단위 테스트 작성이 어려워집니다.

**개선 방안:**
-   **커맨드 레지스트리 패턴 도입**: `SelectionCommandManager`가 직접 핸들러를 관리하기보다는, 커맨드 타입에 따라 적절한 핸들러를 찾아주는 레지스트리 패턴을 도입하여 결합도를 낮춥니다.
-   **핸들러 인터페이스 명확화**: `CommandHandler` 인터페이스를 더욱 명확히 정의하고, 각 핸들러가 자신의 책임만을 수행하도록 합니다.
-   **전략 패턴 고려**: 특정 명령 실행 로직이 복잡하다면, 전략 패턴을 적용하여 실행 로직을 분리하고 유연성을 높일 수 있습니다.

## 3. `src/lib/core/plugins` 디렉토리의 이중 구조 및 타입 문제

`plugins` 디렉토리에는 `ModelBasedPluginManager`와 `EditablePluginManager` (legacy)가 공존하고 있으며, `types` 서브디렉토리 내의 파일들(`icon.ts`, `image.ts`, `link.ts`, `text.ts`)에서 `selectionManager.isSelected`와 같은 로직이 반복적으로 나타납니다. 또한, `PluginModel.svelte.ts`에서 `BasePluginModel`의 제네릭 타입 `T`가 `any`로 사용되는 경우가 있습니다.

**문제점:**
-   **코드 중복**: 유사한 로직이 여러 플러그인 타입에서 반복됩니다.
-   **레거시 코드**: `EditablePluginManager`와 같은 레거시 코드가 남아있어 코드베이스를 복잡하게 만듭니다.
-   **타입 불명확성**: `BasePluginModel`의 `value` 속성이 `null as T`로 초기화되거나 `as T`로 타입 단언되는 등 타입 추론이 어렵습니다.

**개선 방안:**
-   **플러그인 공통 로직 추상화**: `selectionManager.isSelected`와 같이 반복되는 로직을 공통 유틸리티 함수나 추상 클래스로 분리하여 재사용성을 높입니다.
-   **레거시 코드 제거**: `EditablePluginManager`와 같은 레거시 코드를 점진적으로 제거하거나, 새로운 아키텍처로 완전히 마이그레이션합니다.
-   **타입 안전성 강화**: `PluginModel.svelte.ts`에서 `BasePluginModel`의 제네릭 `T`를 더 엄격하게 관리하고, `value` 속성 초기화 시 `null` 대신 적절한 기본값을 사용하거나 `undefined`를 허용하도록 타입을 변경합니다.

## 4. `src/lib/keyboard/keymaps/editorKeymaps.ts`의 로직 중복

`editorKeymaps.ts` 파일에서 `Delete`, `Backspace`, `$mod+c`, `$mod+x`, `$mod+v`, `$mod+d` 등의 단축키 핸들러 내부에 `element.hasAttribute("data-repeatable")` 또는 `element.hasAttribute("data-editable")`를 통해 요소 타입을 판단하고 `selectionCommandManager.executeCommand`를 호출하는 로직이 반복됩니다.

**문제점:**
-   **코드 중복**: 유사한 조건문과 함수 호출이 여러 곳에서 반복됩니다.
-   **유지보수 어려움**: 요소 타입 판단 로직이 변경될 경우 여러 곳을 수정해야 합니다.

**개선 방안:**
-   **헬퍼 함수 또는 맵핑**: 요소 타입을 기반으로 적절한 명령을 실행하는 헬퍼 함수를 만들거나, 타입과 명령을 맵핑하는 구조를 도입하여 중복을 제거합니다.
-   **단축키 핸들러 추상화**: 단축키 핸들러가 직접 요소 타입을 판단하기보다는, 추상화된 `executeAction`과 같은 함수를 통해 명령을 전달하도록 합니다.

## 5. `src/lib/parsers/TemplateParser.ts`의 타입 단언 및 DOM 의존성

`TemplateParser.ts`에서 `as FrameModel`, `as HTMLImageElement`, `as SVGElement`, `as HTMLAnchorElement`, `as HTMLElement` 등 DOM 요소에 대한 타입 단언이 빈번하게 사용됩니다. 이는 파서가 DOM 구조에 강하게 의존하고 있음을 나타냅니다.

**문제점:**
-   **강한 결합도**: 파서가 특정 DOM 구조에 강하게 결합되어 있어, HTML 구조 변경 시 파서도 함께 변경되어야 합니다.
-   **테스트 어려움**: 실제 DOM 환경 없이 단위 테스트를 수행하기 어렵습니다.

**개선 방안:**
-   **DOM 추상화**: DOM 파싱 로직을 별도의 모듈로 분리하거나, 가상 DOM 또는 JSDOM과 같은 도구를 활용하여 테스트 용이성을 높입니다.
-   **타입 가드 활용**: `instanceof HTMLElement`와 같은 타입 가드를 사용하여 안전하게 DOM 요소를 처리합니다.
-   **데이터 모델 우선**: 파싱된 데이터를 직접 DOM 요소로 변환하기보다는, 먼저 정의된 데이터 모델(`FrameModel`, `TextModel` 등)로 변환한 후 이를 기반으로 UI를 렌더링하는 방식을 고려합니다.

## 결론 및 제안

현재 프로젝트는 견고한 아키텍처를 가지고 있지만, 위에서 언급된 `any`/`as` 키워드 남용, 특정 디렉토리의 복잡성, 코드 중복 등의 문제점은 장기적인 유지보수성과 확장성에 부정적인 영향을 미칠 수 있습니다.

이러한 문제점들을 해결하기 위해 다음과 같은 단계적인 코드 정돈을 제안합니다:

1.  **타입 안전성 강화**: `any` 및 `as` 사용을 줄이고, 명시적인 타입 정의와 타입 가드를 적극적으로 활용합니다.
2.  **모듈 간 결합도 낮추기**: `commands` 및 `plugins` 디렉토리에서 레지스트리 패턴, 전략 패턴 등을 도입하여 모듈 간의 의존성을 줄입니다.
3.  **코드 중복 제거**: 공통 로직을 유틸리티 함수나 추상 클래스로 분리하여 재사용성을 높입니다.
4.  **레거시 코드 정리**: 점진적으로 레거시 코드를 제거하거나 새로운 아키텍처로 완전히 마이그레이션합니다.
5.  **테스트 코드 강화**: 리팩토링 과정에서 회귀를 방지하기 위해 관련 테스트 코드를 보강합니다.

이러한 개선을 통해 프로젝트의 코드 품질을 향상시키고, 향후 기능 추가 및 유지보수를 더욱 용이하게 할 수 있을 것입니다.
