# Visual CMS Editor - 플러그인 시스템 가이드

## 개요

Visual CMS Editor의 플러그인 시스템은 Strategy Pattern을 기반으로 구현되어 있으며, 각 편집 가능한 요소 타입별로 독립적인 동작을 정의할 수 있습니다. 이를 통해 새로운 편집 타입을 쉽게 추가하고 기존 기능을 확장할 수 있습니다.

## 플러그인 인터페이스

```typescript
interface EditablePlugin {
  type: string // 플러그인 타입 식별자
  init?: (element: HTMLElement) => void // 요소 초기화
  onClick?: (element: HTMLElement, event: MouseEvent) => void // 클릭 이벤트
  onDoubleClick?: (element: HTMLElement, event: MouseEvent) => void // 더블클릭 이벤트
  onKeydown?: (element: HTMLElement, event: KeyboardEvent) => void // 키보드 이벤트
  getValue?: (element: HTMLElement) => any // 현재 값 조회
  setValue?: (element: HTMLElement, value: any) => void // 값 설정
  isEmpty?: (element: HTMLElement) => boolean // 빈 값 여부 확인
  clear?: (element: HTMLElement) => void // 값 초기화
  validate?: (element: HTMLElement, value: any) => ValidationResult // 유효성 검증
  getConstraints?: (element: HTMLElement) => any // 제약사항 조회
  applyStyles?: (element: HTMLElement, isSelected: boolean) => void // 스타일 적용
  removeStyles?: (element: HTMLElement) => void // 스타일 제거
  getActions?: (element: HTMLElement) => Action[] // 액션 목록 제공
}
```

## 기본 제공 플러그인

### 1. Text Plugin (텍스트 플러그인)

**파일**: `/src/lib/core/plugins/editable/plugins/text.ts`

**기능**:

- contentEditable을 사용한 인라인 텍스트 편집
- 최대 길이 제한 지원
- Enter 키로 편집 모드 진입
- Escape 키로 편집 모드 종료

**사용 예시**:

```html
<p
  data-editable="text"
  data-max-length="100"
>
  편집 가능한 텍스트입니다.
</p>
```

**주요 메서드**:

```typescript
onClick(element: HTMLElement): void {
  // 이미 선택된 경우에만 편집 모드로 진입
  const isSelected = selectionManager.isSelected(element, 'text', 'canvas');
  if (isSelected) {
    element.setAttribute('contenteditable', 'true');
    element.focus();
  }
}
```

### 2. Image Plugin (이미지 플러그인)

**파일**: `/src/lib/core/plugins/editable/plugins/image.ts`

**기능**:

- 파일 업로드 지원
- 드래그 앤 드롭 지원
- 파일 크기 제한
- 이미지 타입 검증
- 복사/붙여넣기 지원

**사용 예시**:

```html
<img
  data-editable="image"
  data-max-size="5MB"
  data-accept="image/jpeg,image/png,image/gif"
  src="/placeholder.jpg"
  alt="편집 가능한 이미지"
/>
```

**주요 기능**:

- 클릭 시 선택, 재클릭 시 파일 선택 다이얼로그
- 드래그 앤 드롭으로 이미지 교체
- 클립보드에서 이미지 붙여넣기

### 3. Icon Plugin (아이콘 플러그인)

**파일**: `/src/lib/core/plugins/editable/plugins/icon.ts`

**기능**:

- SVG 아이콘 선택 팝업
- 아이콘 라이브러리 통합
- 색상 변경 지원

**사용 예시**:

```html
<div
  data-editable="icon"
  class="h-12 w-12"
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
</div>
```

**아이콘 선택기**:

```typescript
openIconPicker(element: HTMLElement): void {
  const icons = [
    { name: 'Lightning', path: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'Lock', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10...' },
    { name: 'Heart', path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28...' },
    // ... 더 많은 아이콘
  ];
  // 팝업 UI 표시
}
```

### 4. Link Plugin (링크 플러그인)

**파일**: `/src/lib/core/plugins/editable/plugins/link.ts`

**기능**:

- URL 편집 모달
- 링크 텍스트 편집
- 새 탭에서 열기 옵션
- URL 유효성 검증

**사용 예시**:

```html
<a
  data-editable="link"
  href="https://example.com"
  target="_blank"
>
  편집 가능한 링크
</a>
```

## 플러그인 개발 가이드

### 1. 새 플러그인 생성

**단계 1**: 플러그인 파일 생성

```typescript
// /src/lib/core/plugins/editable/plugins/video.ts
import type { EditablePlugin } from "../types"
import { selectionManager } from "$lib/core/selection/selectionManager"

export const videoPlugin: EditablePlugin = {
  type: "video",

  init(element: HTMLElement): void {
    // 비디오 플레이어 초기화
    this.setupVideoContainer(element)
  },

  onClick(element: HTMLElement, event: MouseEvent): void {
    const isSelected = this.isElementSelected(element)
    if (isSelected) {
      this.openVideoSettings(element)
    }
  },

  getValue(element: HTMLElement): string {
    const video = element.querySelector("video")
    return video?.src || ""
  },

  setValue(element: HTMLElement, value: string): void {
    const video = element.querySelector("video")
    if (video) {
      video.src = value
    }
  },

  isEmpty(element: HTMLElement): boolean {
    return !this.getValue(element)
  },

  getActions(element: HTMLElement): Action[] {
    return [
      {
        id: "upload",
        label: "비디오 업로드",
        icon: "upload",
        handler: () => this.openFileDialog(element),
      },
      {
        id: "settings",
        label: "설정",
        icon: "settings",
        handler: () => this.openVideoSettings(element),
      },
    ]
  },

  setupVideoContainer(element: HTMLElement): void {
    // 비디오 컨테이너 설정
  },

  openVideoSettings(element: HTMLElement): void {
    // 비디오 설정 모달 열기
  },

  isElementSelected(element: HTMLElement): boolean {
    return selectionManager.isSelected(element, "video", "canvas")
  },
}
```

**단계 2**: 플러그인 등록

```typescript
// /src/lib/core/plugins/editable/EditablePluginManager.ts
import { videoPlugin } from "./plugins/video"

class EditablePluginManager {
  constructor() {
    // 기존 플러그인들...
    this.plugins.set("video", videoPlugin)
  }
}
```

**단계 3**: HTML에서 사용

```html
<div
  data-editable="video"
  data-autoplay="false"
  data-controls="true"
>
  <video
    src="/sample.mp4"
    controls
  ></video>
</div>
```

### 2. 플러그인 스타일링

플러그인별 커스텀 스타일 적용:

```typescript
applyStyles(element: HTMLElement, isSelected: boolean): void {
  if (isSelected) {
    element.style.outline = '2px solid #8b5cf6';
    element.style.outlineOffset = '2px';
    element.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
  }
},

removeStyles(element: HTMLElement): void {
  element.style.outline = '';
  element.style.outlineOffset = '';
  element.style.backgroundColor = '';
}
```

### 3. 플러그인 액션

SelectionOverlay에 표시될 액션 정의:

```typescript
getActions(element: HTMLElement): Action[] {
  return [
    {
      id: 'edit',
      label: '편집',
      icon: 'edit',
      handler: () => this.startEdit(element),
      isDefault: true  // Enter 키로 실행
    },
    {
      id: 'duplicate',
      label: '복제',
      icon: 'copy',
      handler: () => this.duplicate(element)
    },
    {
      id: 'delete',
      label: '삭제',
      icon: 'trash',
      handler: () => this.delete(element),
      className: 'text-red-600'  // 커스텀 스타일
    }
  ];
}
```

### 4. 플러그인 유효성 검증

```typescript
validate(element: HTMLElement, value: any): ValidationResult {
  const constraints = this.getConstraints(element);

  // 필수 항목 검증
  if (constraints.required && !value) {
    return {
      valid: false,
      message: '필수 항목입니다.'
    };
  }

  // 패턴 검증
  if (constraints.pattern && !constraints.pattern.test(value)) {
    return {
      valid: false,
      message: '올바른 형식이 아닙니다.'
    };
  }

  return { valid: true };
}

getConstraints(element: HTMLElement): any {
  return {
    required: element.dataset.required === 'true',
    pattern: element.dataset.pattern ? new RegExp(element.dataset.pattern) : null,
    minLength: parseInt(element.dataset.minLength || '0'),
    maxLength: parseInt(element.dataset.maxLength || '999999')
  };
}
```

## 플러그인 간 통신

플러그인 간 통신은 이벤트를 통해 이루어집니다:

```typescript
// 이벤트 발생
element.dispatchEvent(
  new CustomEvent("pluginUpdate", {
    detail: {
      plugin: "video",
      action: "uploaded",
      value: videoUrl,
    },
    bubbles: true,
  }),
)

// 이벤트 수신
document.addEventListener("pluginUpdate", (event: CustomEvent) => {
  if (event.detail.plugin === "image" && event.detail.action === "uploaded") {
    // 이미지 업로드 완료 시 처리
  }
})
```

## 플러그인 테스트

### 단위 테스트 예시

```typescript
// /src/lib/core/plugins/editable/plugins/video.test.ts
import { describe, it, expect, beforeEach } from "vitest"
import { videoPlugin } from "./video"

describe("Video Plugin", () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement("div")
    element.setAttribute("data-editable", "video")
    element.innerHTML = "<video></video>"
  })

  it("should get video source", () => {
    const video = element.querySelector("video")
    video.src = "https://example.com/video.mp4"

    expect(videoPlugin.getValue(element)).toBe("https://example.com/video.mp4")
  })

  it("should set video source", () => {
    videoPlugin.setValue(element, "https://example.com/new-video.mp4")
    const video = element.querySelector("video")

    expect(video.src).toBe("https://example.com/new-video.mp4")
  })

  it("should validate required constraint", () => {
    element.setAttribute("data-required", "true")

    const result = videoPlugin.validate(element, "")
    expect(result.valid).toBe(false)
    expect(result.message).toBe("필수 항목입니다.")
  })
})
```

## 플러그인 모범 사례

### 1. 단일 책임 원칙

각 플러그인은 하나의 편집 타입만 담당해야 합니다.

### 2. 의존성 주입

플러그인은 외부 의존성을 최소화하고, 필요한 경우 생성자나 init 메서드를 통해 주입받습니다.

### 3. 에러 처리

```typescript
onClick(element: HTMLElement, event: MouseEvent): void {
  try {
    // 플러그인 로직
  } catch (error) {
    console.error(`[${this.type} Plugin Error]:`, error);
    // 사용자에게 에러 메시지 표시
  }
}
```

### 4. 성능 최적화

- 무거운 작업은 디바운싱 또는 쓰로틀링 적용
- DOM 조작 최소화
- 이벤트 리스너는 필요할 때만 추가

### 5. 접근성

- ARIA 속성 적절히 사용
- 키보드 네비게이션 지원
- 스크린 리더 호환성 고려

## 플러그인 설정

플러그인별 전역 설정:

```typescript
// /src/lib/core/plugins/config.ts
export const pluginConfig = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    compressionQuality: 0.8,
  },
  video: {
    maxSize: 50 * 1024 * 1024, // 50MB
    acceptedTypes: ["video/mp4", "video/webm"],
    maxDuration: 300, // 5분
  },
  text: {
    defaultMaxLength: 500,
    allowedTags: ["b", "i", "u", "a", "br"],
  },
}
```

## 향후 계획

### 예정된 플러그인

- **Table Plugin**: 표 편집 기능
- **Code Plugin**: 코드 블록 편집 (신택스 하이라이팅)
- **Map Plugin**: 지도 임베드 및 편집
- **Form Plugin**: 폼 요소 편집
- **Chart Plugin**: 차트 데이터 편집

### 플러그인 마켓플레이스

- 서드파티 플러그인 지원
- 플러그인 검증 시스템
- 자동 업데이트 기능
