# 텍스트 선택 및 편집 모드 전환 개선 계획 보고서

### 1. 문제 정의

현재 Visual CMS Editor에서 텍스트 요소를 클릭했을 때의 동작이 사용자 요구사항을 완전히 충족하지 못하고 있습니다.

*   **요구사항 1 (선택 모드)**: 텍스트가 선택된 상태에서 해당 텍스트를 **단일 클릭**하면, 편집 모드로 진입하는 대신 **선택 상태를 유지**해야 합니다.
*   **요구사항 2 (편집 모드)**: 이미 어떤 텍스트 요소가 편집 모드인 상태에서 **다른 텍스트 요소**를 **단일 클릭**하면, 즉시 해당 새 텍스트 요소로 편집 컨텍스트가 전환되고 커서가 활성화되어 바로 입력할 수 있어야 합니다.
*   **공통 요구사항**: 텍스트 요소를 **더블 클릭**하면, 선택 상태와 관계없이 항상 해당 요소의 편집 모드로 진입해야 합니다.

현재 구현은 단일 클릭 시 바로 편집 모드로 진입하거나, 선택 상태 유지가 명확하지 않아 사용자 경험에 혼란을 줄 수 있습니다.

### 2. 현재 동작 분석

`src/lib/core/selection/index.ts`의 `selectElement` 함수와 `src/lib/components/renderers/EditableRenderer.svelte` 또는 유사한 컴포넌트의 `on:click` 이벤트 핸들러, 그리고 `src/lib/core/keyboard/keymaps/editorKeymaps.ts`의 `Enter` 키맵이 주요 관련 코드입니다.

*   **`selectElement`**: 요소 선택 로직을 담당합니다. 현재는 선택 후 바로 편집 모드 진입 로직이 연결되어 있을 가능성이 있습니다.
*   **`EditableRenderer.svelte`**: 편집 가능한 요소에 대한 렌더링을 담당하며, 클릭 이벤트를 처리할 것입니다.
*   **`editorKeymaps.ts`**: `Enter` 키를 눌렀을 때 선택된 요소의 편집 모드를 시작하는 로직이 있습니다.

핵심은 "클릭" 이벤트가 "선택"과 "편집 시작" 중 어떤 의도를 가지는지 명확히 구분하는 것입니다.

### 3. 제안하는 해결책

클릭 이벤트를 `click`과 `dblclick`으로 분리하고, 애플리케이션의 현재 상태(선택 모드 vs. 편집 모드)에 따라 다르게 동작하도록 로직을 재구성합니다.

#### 3.1. 이벤트 핸들링 전략

1.  **모든 편집 가능한 요소에 `on:click` 및 `on:dblclick` 리스너 추가**:
    *   `EditableRenderer.svelte` 또는 각 플러그인 컴포넌트(`ModelTextPlugin.svelte` 등)에서 이벤트를 처리합니다.
    *   `contenteditable` 요소의 경우, 브라우저의 기본 동작을 방해하지 않도록 이벤트 전파를 신중하게 제어해야 합니다.

2.  **`on:click` 이벤트 핸들러 로직**:
    *   **현재 편집 모드인 경우 (`pluginStore.getEditingModel()`이 존재)**:
        *   클릭된 요소가 현재 편집 중인 요소와 **동일**한 경우: 아무것도 하지 않습니다. (커서가 이미 활성화되어 있으므로)
        *   클릭된 요소가 현재 편집 중인 요소와 **다른** 경우:
            1.  현재 편집 중인 요소의 편집 모드를 종료합니다 (`pluginStore.stopAllEditing()`).
            2.  클릭된 새 요소를 선택합니다 (`selectionManager.select(clickedElement)`).
            3.  새 요소의 편집 모드를 시작합니다 (`modelBasedPluginManager.getOrCreateModel(clickedElement, type).startEdit()`).
    *   **현재 편집 모드가 아닌 경우 (`pluginStore.getEditingModel()`이 null)**:
        *   클릭된 요소를 선택합니다 (`selectionManager.select(clickedElement)`).
        *   **중요**: 이 시점에서 `startEdit()`를 호출하지 않습니다. 사용자가 더블 클릭하거나 `Enter` 키를 눌러야 편집 모드로 진입합니다.

3.  **`on:dblclick` 이벤트 핸들러 로직**:
    *   클릭된 요소를 선택합니다 (`selectionManager.select(clickedElement)`).
    *   클릭된 요소의 편집 모드를 시작합니다 (`modelBasedPluginManager.getOrCreateModel(clickedElement, type).startEdit()`).
    *   `dblclick` 이벤트는 `click` 이벤트보다 먼저 발생하므로, `click` 이벤트 핸들러 내에서 `dblclick`이 발생했는지 여부를 추적하여 중복 동작을 방지할 수 있습니다. (예: `setTimeout`을 사용하여 단일 클릭과 더블 클릭을 구분)

#### 3.2. 상태 관리의 명확화

*   **`pluginStore.getEditingModel()`**: 현재 편집 중인 `PluginModel` 인스턴스를 정확히 반환해야 합니다.
*   **`selectionManager.selectedElements`**: 현재 선택된 DOM 요소를 정확히 추적해야 합니다.
*   이 두 상태가 항상 동기화되도록 관리하여 혼란을 방지합니다.

#### 3.3. `contenteditable` 속성 제어

*   `PluginModel.svelte.ts`의 `startEdit()` 메서드에서 해당 요소의 `contenteditable` 속성을 `true`로 설정합니다.
*   `PluginModel.svelte.ts`의 `stopEdit()` 메서드에서 해당 요소의 `contenteditable` 속성을 `false`로 설정합니다.
*   이렇게 하면 편집 모드 진입 시 브라우저의 네이티브 텍스트 편집 기능이 활성화됩니다.

### 4. 구체적인 코드 변경 제안 (파일별)

#### 4.1. `src/lib/components/renderers/EditableRenderer.svelte` (또는 유사한 편집 가능 요소 렌더링 컴포넌트)

이 컴포넌트가 `data-editable` 속성을 가진 요소들을 렌더링하고 클릭 이벤트를 처리하는 핵심 위치가 될 것입니다.

*   **`on:click` 핸들러 수정**:
    ```svelte
    <script lang="ts">
      import { selectionManager } from '$lib/core/selection';
      import { pluginStore } from '$lib/core/plugins/models/PluginStore.svelte';
      import { modelBasedPluginManager } from '$lib/core/plugins';
      import { get } from 'svelte/store';

      export let element: HTMLElement; // 렌더링되는 실제 DOM 요소
      export let type: string; // 'text', 'image' 등 editable 타입

      let clickTimeout: ReturnType<typeof setTimeout> | null = null;

      function handleClick(event: MouseEvent) {
        // 더블 클릭 이벤트가 발생할 경우 단일 클릭 이벤트는 무시
        if (clickTimeout) {
          clearTimeout(clickTimeout);
          clickTimeout = null;
          return;
        }

        clickTimeout = setTimeout(async () => {
          clickTimeout = null;
          const currentEditingModel = pluginStore.getEditingModel();

          if (currentEditingModel) {
            // 2. 편집 모드인 경우: 다른 텍스트 요소 클릭 시 편집 컨텍스트 전환
            const clickedModel = modelBasedPluginManager.getOrCreateModel(element, type);
            if (currentEditingModel.id !== clickedModel.id) {
              currentEditingModel.stopEdit(); // 현재 편집 모드 종료
              selectionManager.select(element); // 새 요소 선택
              clickedModel.startEdit(); // 새 요소 편집 모드 시작
            }
            // 동일한 요소 클릭 시 아무것도 하지 않음 (커서 유지)
          } else {
            // 1. 선택 모드인 경우: 단일 클릭 시 선택 유지 (편집 모드 진입 X)
            selectionManager.select(element);
            // 여기서 startEdit()를 호출하지 않음
          }
        }, 200); // 200ms 내에 더블 클릭이 없으면 단일 클릭으로 간주
      }

      function handleDoubleClick(event: MouseEvent) {
        if (clickTimeout) {
          clearTimeout(clickTimeout);
          clickTimeout = null;
        }
        // 더블 클릭 시 항상 편집 모드 진입
        selectionManager.select(element); // 요소 선택
        const model = modelBasedPluginManager.getOrCreateModel(element, type);
        model.startEdit(); // 편집 모드 시작
      }
    </script>

    <div
      on:click={handleClick}
      on:dblclick={handleDoubleClick}
      data-editable={type}
      bind:this={element}
    >
      <!-- 실제 편집 가능한 콘텐츠 슬롯 -->
      <slot />
    </div>
    ```

#### 4.2. `src/lib/core/plugins/models/PluginModel.svelte.ts`

`BasePluginModel` 또는 `TextPluginModel`의 `startEdit` 및 `stopEdit` 메서드에서 `contenteditable` 속성을 제어하는 로직을 확인하고 필요시 추가합니다.

*   **`startEdit()` 메서드**:
    ```typescript
    // src/lib/core/plugins/models/PluginModel.svelte.ts
    // ...
    startEdit() {
        // ... 기존 로직 ...
        const element = this.getElement(); // 해당 모델과 연결된 DOM 요소
        if (element) {
            element.setAttribute('contenteditable', 'true');
            element.focus(); // 편집 모드 진입 시 포커스
        }
        // ...
    }
    ```
*   **`stopEdit()` 메서드**:
    ```typescript
    // src/lib/core/plugins/models/PluginModel.svelte.ts
    // ...
    stopEdit() {
        // ... 기존 로직 ...
        const element = this.getElement();
        if (element) {
            element.removeAttribute('contenteditable');
            element.blur(); // 편집 모드 종료 시 포커스 해제
        }
        // ...
    }
    ```

#### 4.3. `src/lib/core/keyboard/keymaps/editorKeymaps.ts`

`Enter` 키맵의 동작을 재검토합니다. 현재 `Enter`는 선택된 요소의 편집 모드를 시작합니다. 이 동작은 유지하되, 클릭 이벤트와의 상호작용을 고려합니다.

*   `Enter` 키맵은 선택된 상태에서 편집 모드 진입을 위한 보조 수단으로 유지합니다.
*   `Escape` 키맵은 현재 편집 모드 종료 또는 선택 해제 로직을 그대로 유지합니다.

#### 4.4. `src/lib/core/selection/index.ts`

`selectElement` 함수가 직접적으로 `startEdit()`를 호출하는 로직이 있다면 제거합니다. `selectElement`는 오직 요소를 선택하는 역할만 수행하도록 분리합니다. 편집 모드 진입은 클릭/더블클릭 이벤트 핸들러 또는 `Enter` 키맵에서 명시적으로 호출하도록 합니다.

### 5. 테스트 계획

변경 사항을 검증하기 위한 테스트 시나리오:

1.  **단일 클릭 (편집 모드 아님)**:
    *   아무것도 선택되지 않은 상태에서 텍스트 요소 단일 클릭 -> 해당 텍스트 요소가 선택되고, 편집 모드에 진입하지 않음.
    *   텍스트 요소가 선택된 상태에서 해당 텍스트 요소 단일 클릭 -> 선택 상태가 유지되고, 편집 모드에 진입하지 않음.
    *   텍스트 요소가 선택된 상태에서 다른 텍스트 요소 단일 클릭 -> 새 텍스트 요소가 선택되고, 편집 모드에 진입하지 않음.

2.  **더블 클릭**:
    *   아무것도 선택되지 않은 상태에서 텍스트 요소 더블 클릭 -> 해당 텍스트 요소가 선택되고, 즉시 편집 모드에 진입하며 커서 활성화.
    *   텍스트 요소가 선택된 상태에서 해당 텍스트 요소 더블 클릭 -> 선택 상태가 유지되고, 즉시 편집 모드에 진입하며 커서 활성화.
    *   텍스트 요소가 선택된 상태에서 다른 텍스트 요소 더블 클릭 -> 새 텍스트 요소가 선택되고, 즉시 편집 모드에 진입하며 커서 활성화.

3.  **편집 모드 중 단일 클릭**:
    *   텍스트 요소 A가 편집 모드인 상태에서 텍스트 요소 A를 단일 클릭 -> 편집 모드 유지, 커서 위치 변경 없음.
    *   텍스트 요소 A가 편집 모드인 상태에서 텍스트 요소 B를 단일 클릭 -> 텍스트 요소 A의 편집 모드 종료, 텍스트 요소 B가 선택되고 즉시 편집 모드에 진입하며 커서 활성화.

4.  **키보드 상호작용**:
    *   텍스트 요소가 선택된 상태에서 `Enter` 키 누름 -> 해당 텍스트 요소가 편집 모드에 진입하며 커서 활성화.
    *   텍스트 편집 모드 중 `Escape` 키 누름 -> 편집 모드 종료, 텍스트 요소는 선택 상태 유지.

이 계획을 통해 사용자 요구사항을 충족하는 직관적인 텍스트 선택 및 편집 경험을 구현할 수 있을 것입니다.
