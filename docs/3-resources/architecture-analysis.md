# 프로젝트 구조 및 아키텍처 분석

이 문서는 Visual CMS Editor 프로젝트의 현재 구조와 아키텍처를 분석하고 설명합니다.

## 1. 프로젝트 개요

Visual CMS Editor는 시각적인 방법으로 콘텐츠를 편집할 수 있는 CMS 에디터입니다.

## 2. 최상위 디렉토리 구조

```
visual-cms-editor/
├── docs/               # 프로젝트 문서 (PARA 방법론)
├── src/                # 주요 소스 코드
├── e2e/                # End-to-End 테스트
├── static/             # 정적 파일
├── node_modules/       # Node.js 모듈
├── .git/               # Git 버전 관리
├── .svelte-kit/        # SvelteKit 빌드 관련 파일
├── build/              # 빌드 결과물
├── package.json        # 프로젝트 의존성 및 스크립트
├── tsconfig.json       # TypeScript 설정
├── vite.config.ts      # Vite 설정
├── svelte.config.js    # SvelteKit 설정
└── ... (기타 설정 파일 및 테스트 파일)
```

## 3. `src` 디렉토리 상세 분석

`src` 디렉토리는 애플리케이션의 핵심 로직과 UI 컴포넌트를 포함합니다.

```
src/
├── app.css             # 전역 CSS 스타일
├── app.d.ts            # 전역 타입 정의
├── app.html            # SvelteKit 앱의 기본 HTML 템플릿
├── hooks.server.ts     # 서버 사이드 훅
├── hooks.ts            # 클라이언트/서버 공통 훅
├── lib/                # 재사용 가능한 라이브러리 코드
│   ├── actions/        # Svelte 액션
│   ├── components/     # Svelte 컴포넌트
│   │   ├── plugins/    # 플러그인 관련 컴포넌트
│   │   └── renderers/  # 렌더러 컴포넌트
│   ├── core/           # 핵심 비즈니스 로직 및 시스템
│   │   ├── commands/   # 명령 패턴 구현 (Command, Executor, Handler)
│   │   ├── history/    # 변경 이력 관리
│   │   ├── keyboard/   # 키보드 단축키 관리
│   │   ├── models/     # 데이터 모델 정의
│   │   ├── parsers/    # 템플릿 파서
│   │   ├── plugins/    # 플러그인 시스템 코어
│   │   ├── selection/  # 선택 시스템 코어
│   │   ├── state/      # 전역 상태 관리
│   │   ├── templates/  # 템플릿 관련 로직
│   │   └── utils/      # 유틸리티 함수
│   ├── entities/       # 모든 엔티티(데이터 스키마 및 타입) 정의
│   ├── paraglide/      # 국제화(i18n) 관련 파일
│   ├── stores/         # Svelte 스토어 (상태 관리)
│   └── styles/         # 공통 스타일 정의
└── routes/             # SvelteKit 라우팅 정의
    ├── +layout.svelte  # 전역 레이아웃
    ├── +layout.ts      # 전역 레이아웃 로직
    ├── +page.svelte    # 메인 페이지
    └── ...
```

### 3.1. `src/lib/core` - 핵심 비즈니스 로직

`src/lib/core` 디렉토리는 애플리케이션의 핵심 기능을 담당하는 모듈들을 포함합니다. 각 서브디렉토리는 특정 도메인 또는 시스템의 로직을 캡슐화합니다.

-   **`commands/`**: 명령 패턴(Command Pattern)을 구현하여 사용자 액션(예: 텍스트 변경, 요소 선택)을 추상화하고 실행합니다. `CommandStore`, `SelectionCommandManager`, `executors`, `handlers` 등을 포함합니다.
-   **`history/`**: 애플리케이션 상태 변경 이력을 관리하여 실행 취소/다시 실행 기능을 제공합니다.
-   **`keyboard/`**: 키보드 이벤트 및 단축키를 관리하는 로직을 포함합니다. `HotkeyManager` 및 키맵 정의가 있습니다.
-   **`models/`**: 애플리케이션 내에서 사용되는 주요 데이터 모델(예: `TemplateModels`)을 정의합니다.
-   **`parsers/`**: 템플릿 데이터를 파싱하고 처리하는 로직을 포함합니다.
-   **`plugins/`**: 플러그인 시스템의 핵심 로직을 구현합니다. `ModelBasedPluginManager` 및 플러그인 등록/관리 로직이 포함됩니다.
-   **`selection/`**: 에디터 내에서 요소 선택과 관련된 모든 로직을 처리합니다.
-   **`state/`**: 애플리케이션의 전역 상태를 관리하는 로직을 포함합니다.
-   **`templates/`**: 템플릿 생성, 변환(`converter`), 정의(`templates.ts`)와 관련된 로직을 담당합니다.
-   **`utils/`**: 재사용 가능한 일반 유틸리티 함수들을 모아놓은 곳입니다.

### 3.2. `src/lib/entities` - 중앙 집중식 타입 정의

`src/lib/entities` 디렉토리는 프로젝트 전반에 걸쳐 사용되는 모든 데이터 스키마와 타입 정의를 중앙 집중화합니다. 이는 타입 안정성을 높이고 코드 가독성을 개선하며, 유지보수성을 향상시키는 데 기여합니다. 각 서브디렉토리는 `src/lib/core`의 해당 모듈과 연관된 타입들을 정의합니다.

-   **`command/`**: 명령 패턴 관련 타입 (`Command`, `AppState` 등)
-   **`history/`**: 변경 이력 관리 관련 타입
-   **`keyboard/`**: 키보드/단축키 관련 타입
-   **`logger/`**: 로깅 시스템 관련 타입
-   **`plugin/`**: 플러그인 시스템 관련 타입
-   **`selection/`**: 선택 시스템 관련 타입
-   **`template/`**: 템플릿 시스템 관련 타입 (`Template`, `FrameModel` 등)
-   **`ui/`**: UI 상태 관리 관련 타입

### 3.3. `src/lib/components` - UI 컴포넌트

`src/lib/components` 디렉토리는 재사용 가능한 Svelte UI 컴포넌트들을 포함합니다. 이 컴포넌트들은 `src/lib/core`의 로직과 `src/lib/entities`의 타입을 활용하여 사용자 인터페이스를 구성합니다.

### 3.4. `src/routes` - 라우팅 및 페이지

`src/routes` 디렉토리는 SvelteKit의 파일 기반 라우팅 시스템을 따릅니다. 각 `.svelte` 파일은 특정 경로에 대한 페이지 또는 레이아웃을 정의합니다.

## 4. 아키텍처 주요 특징

-   **모듈화된 코어**: `src/lib/core` 내의 각 모듈은 특정 기능 영역을 담당하며, 높은 응집도와 낮은 결합도를 유지합니다.
-   **명령 패턴 활용**: 사용자 액션을 명령 객체로 추상화하여 유연한 확장성과 실행 취소/다시 실행 기능을 지원합니다.
-   **중앙 집중식 타입 관리**: `src/lib/entities`를 통해 모든 데이터 구조의 타입을 명확하게 정의하고 관리하여 개발 효율성과 코드 품질을 높입니다.
-   **SvelteKit 기반**: SvelteKit의 강력한 기능을 활용하여 SSR(Server-Side Rendering), 라우팅, 상태 관리 등을 효율적으로 처리합니다.
-   **플러그인 아키텍처**: 핵심 기능을 플러그인 형태로 확장할 수 있는 구조를 제공하여 유연성과 재사용성을 확보합니다.

## 5. 결론

Visual CMS Editor 프로젝트는 명확하게 분리된 모듈과 중앙 집중식 타입 관리를 통해 견고하고 확장 가능한 아키텍처를 구축하고 있습니다. 이는 복잡한 CMS 에디터의 기능을 효율적으로 개발하고 유지보수하는 데 기여합니다.
