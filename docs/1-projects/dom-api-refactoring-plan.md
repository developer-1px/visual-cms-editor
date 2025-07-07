# DOM API 사용 현황 및 리팩토링 계획 보고서

## 1. 개요

이 보고서는 Visual CMS Editor 프로젝트 내에서 `getBoundingClientRect`, `contenteditable`, `Selection`/`Range` API를 제외한 직접적인 DOM API 사용 현황을 조사하고, 발견 시 이를 Svelte의 반응성 시스템 및 선언적 접근 방식으로 리팩토링하기 위한 구체적인 계획을 제시합니다.

## 2. 현재 DOM API 사용 현황 조사 결과

`src` 디렉토리 내의 `.ts` 및 `.svelte` 파일에서 `document.createElement`, `element.appendChild`, `element.innerHTML =`, `element.setAttribute`, `element.style.`, `element.classList.add` 등과 같은 일반적인 직접 DOM 조작 API 패턴을 대상으로 검색을 수행했습니다.

**조사 결과: 현재 코드베이스에서 명시된 DOM API 패턴이 발견되지 않았습니다.**

이는 프로젝트가 Svelte와 같은 프레임워크를 통해 DOM 조작을 추상화하고 있거나, DOM 조작이 최소화되어 있음을 시사합니다. Svelte는 컴포넌트의 상태 변화에 따라 DOM을 효율적으로 업데이트하므로, 개발자가 직접 DOM을 조작할 필요가 거의 없습니다.

## 3. 잠재적 DOM API 사용 시나리오 및 추가 조사 필요성

`search_file_content` 도구는 정규 표현식 기반의 패턴 매칭이므로, 모든 잠재적인 DOM 조작을 완벽하게 잡아내지 못할 수 있습니다. 다음과 같은 시나리오에서는 직접적인 DOM API 사용이 발생할 수 있으며, 추가적인 수동 검토가 필요할 수 있습니다.

-   **Svelte의 `bind:this`를 통한 요소 참조 후 직접 DOM API 호출**: Svelte 컴포넌트 내에서 특정 DOM 요소에 대한 참조를 얻은 후, 해당 참조를 통해 JavaScript의 DOM API를 직접 호출하는 경우.
    ```svelte
    <script>
      let myDiv;
      function focusDiv() {
        myDiv.focus(); // 직접 DOM API 호출
      }
    </script>
    <div bind:this={myDiv}>...</div>
    <button on:click={focusDiv}>Focus</button>
    ```
-   **외부 라이브러리 또는 유틸리티 함수 내부의 DOM 조작**: 프로젝트에서 사용하는 외부 JavaScript 라이브러리나, 별도로 작성된 유틸리티 함수 내에서 DOM을 직접 조작하는 경우. (예: 애니메이션 라이브러리, 드래그 앤 드롭 라이브러리 등)
-   **`onMount` 또는 `afterUpdate` 라이프사이클 훅 내의 DOM 조작**: Svelte 컴포넌트의 라이프사이클 훅 내에서 특정 시점에 DOM을 직접 조작해야 하는 경우.
-   **`dangerouslySetInnerHTML` 또는 유사 기능 사용**: Svelte에서는 `{@html ...}` 블록을 통해 HTML 문자열을 직접 렌더링할 수 있으며, 이 경우 내부의 DOM은 Svelte의 제어를 벗어날 수 있습니다.

## 4. 리팩토링 계획 (향후 발견 시)

만약 위에서 언급된 시나리오를 통해 직접적인 DOM API 사용이 발견된다면, 다음의 원칙과 구체적인 태스크를 통해 Svelte의 선언적이고 반응적인 접근 방식으로 리팩토링을 수행합니다.

### 4.1. 리팩토링 원칙

-   **Svelte의 반응성 시스템 활용**: 상태 변화에 따라 DOM이 자동으로 업데이트되도록 Svelte의 반응성 선언(`$:`), 스토어, `bind:` 디렉티브를 최대한 활용합니다.
-   **선언적 UI**: DOM을 직접 조작하는 대신, 데이터(상태)를 변경하여 UI가 자동으로 업데이트되도록 합니다.
-   **액션(Actions) 및 커스텀 디렉티브 활용**: 복잡한 DOM 조작 로직은 Svelte 액션이나 커스텀 디렉티브로 캡슐화하여 재사용성을 높이고 컴포넌트 로직을 간결하게 유지합니다.
-   **최소한의 DOM 접근**: 불가피하게 DOM에 직접 접근해야 하는 경우(예: 서드파티 라이브러리 연동), 해당 로직을 최소화하고 명확하게 분리합니다.

### 4.2. 구체적인 리팩토링 태스크 (예시)

**태스크 1: `element.focus()` / `element.blur()` 대체**

-   **문제 패턴**: 특정 조건에서 요소에 포커스를 주거나 해제하기 위해 `element.focus()` 또는 `element.blur()`를 직접 호출하는 경우.
-   **리팩토링 방안**: Svelte의 `use:action` 또는 커스텀 디렉티브를 사용하여 포커스 로직을 캡슐화합니다. 상태 변수를 통해 포커스 여부를 제어하고, 액션 내부에서 DOM API를 호출합니다.
-   **예시**: `src/lib/components/SomeComponent.svelte`
    ```svelte
    <!-- 수정 전 -->
    <script>
      let inputElement;
      let shouldFocus = false;
      $: if (shouldFocus) {
        inputElement.focus();
      }
    </script>
    <input bind:this={inputElement} type="text" />
    ```
    ```svelte
    <!-- 수정 후 -->
    <script>
      function focusAction(node, shouldFocus) {
        if (shouldFocus) {
          node.focus();
        }
        return {
          update(newShouldFocus) {
            if (newShouldFocus) {
              node.focus();
            }
          }
        };
      }
      let shouldFocus = false;
    </script>
    <input type="text" use:focusAction={shouldFocus} />
    ```

**태스크 2: `element.classList.add/remove/toggle` 대체**

-   **문제 패턴**: 조건에 따라 요소의 클래스를 동적으로 추가/제거/토글하기 위해 `classList` API를 직접 사용하는 경우.
-   **리팩토링 방안**: Svelte의 클래스 디렉티브(`class:name={condition}`)를 사용하여 상태 변수에 따라 클래스가 자동으로 적용되도록 합니다.
-   **예시**: `src/lib/components/AnotherComponent.svelte`
    ```svelte
    <!-- 수정 전 -->
    <script>
      let isActive = false;
      function toggleActive(node) {
        if (isActive) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      }
    </script>
    <div bind:this={myDiv} use:toggleActive={isActive}>...</div>
    ```
    ```svelte
    <!-- 수정 후 -->
    <script>
      let isActive = false;
    </script>
    <div class:active={isActive}>...</div>
    ```

**태스크 3: `element.setAttribute` / `element.removeAttribute` 대체**

-   **문제 패턴**: 요소의 속성을 동적으로 설정하거나 제거하기 위해 `setAttribute`/`removeAttribute`를 직접 사용하는 경우.
-   **리팩토링 방안**: Svelte의 속성 디렉티브(`attribute={value}`)를 사용하여 상태 변수에 따라 속성이 자동으로 적용되도록 합니다. `null` 또는 `undefined`를 할당하면 속성이 제거됩니다.
-   **예시**: `src/lib/components/ImageComponent.svelte`
    ```svelte
    <!-- 수정 전 -->
    <script>
      let imageUrl = '';
      let imageElement;
      $: if (imageUrl) {
        imageElement.setAttribute('src', imageUrl);
      } else {
        imageElement.removeAttribute('src');
      }
    </script>
    <img bind:this={imageElement} alt="" />
    ```
    ```svelte
    <!-- 수정 후 -->
    <script>
      let imageUrl = '';
    </script>
    <img src={imageUrl || undefined} alt="" />
    ```

**태스크 4: `element.appendChild` / `element.removeChild` 등 DOM 구조 변경 대체**

-   **문제 패턴**: JavaScript를 사용하여 DOM 트리에 요소를 직접 추가하거나 제거하는 경우.
-   **리팩토링 방안**: Svelte의 조건부 렌더링(`{#if ...}`), 반복 렌더링(`{#each ...}`), 컴포넌트 합성 등을 사용하여 데이터(상태) 변화에 따라 UI 구조가 자동으로 변경되도록 합니다.
-   **예시**: `src/lib/components/ItemList.svelte`
    ```svelte
    <!-- 수정 전 -->
    <script>
      let items = ['Item 1', 'Item 2'];
      let listContainer;
      function addItem(text) {
        const li = document.createElement('li');
        li.textContent = text;
        listContainer.appendChild(li);
      }
    </script>
    <ul bind:this={listContainer}></ul>
    <button on:click={() => addItem('New Item')}>Add Item</button>
    ```
    ```svelte
    <!-- 수정 후 -->
    <script>
      let items = ['Item 1', 'Item 2'];
      function addItem(text) {
        items = [...items, text];
      }
    </script>
    <ul>
      {#each items as item}
        <li>{item}</li>
      {/each}
    </ul>
    <button on:click={() => addItem('New Item')}>Add Item</button>
    ```

## 5. 결론

현재 코드베이스에서는 `getBoundingClientRect`, `contenteditable`, `Selection`/`Range` API를 제외한 직접적인 DOM API 사용 패턴이 명시적으로 발견되지 않았습니다. 이는 Svelte 프레임워크의 효과적인 활용 덕분으로 보입니다.

하지만, 잠재적인 직접 DOM 조작 시나리오를 인지하고 있으며, 향후 코드 검토나 기능 추가 시 이러한 패턴이 발견된다면, 위에 제시된 리팩토링 원칙과 구체적인 태스크를 적용하여 Svelte의 선언적이고 반응적인 패러다임을 유지할 것입니다. 이를 통해 코드의 가독성, 유지보수성, 그리고 Svelte의 성능 최적화 이점을 극대화할 수 있습니다.
