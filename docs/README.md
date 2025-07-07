# Visual CMS Editor 문서

이 문서는 PARA(Projects, Areas, Resources, Archives) 방법론에 따라 구성되어 있습니다.

## 📁 문서 구조

### 1️⃣ Projects (활성 프로젝트)

현재 진행 중인 개발 작업과 관련된 문서들입니다.

- **[아키텍처 리팩토링 보고서](1-projects/architecture-refactoring-report.md)** - 전략 패턴을 활용한 리팩토링 보고서
- **[반응형 선택 시스템](1-projects/reactive-selection-system.md)** - Svelte 5 runes 기반 선택 시스템 구현
- **[스타일 리팩토링 계획](1-projects/style-refactoring-plan.md)** - CSS 및 스타일링 개선 계획

### 2️⃣ Areas (지속적 관리 영역)

지속적으로 유지보수하고 업데이트해야 하는 문서들입니다.

#### 🚀 Deployment (배포)

- **[배포 가이드](2-areas/deployment/deployment.md)** - 배포 프로세스 및 설정
- **[배포 체크리스트](2-areas/deployment/deployment-checklist.md)** - 배포 전 확인 사항

#### ✨ Features (기능)

- **[기능 명세](2-areas/features/features.md)** - 구현된 기능 목록 및 상세 설명

#### 🔌 Plugins (플러그인)

- **[플러그인 시스템 가이드](2-areas/plugins/plugins.md)** - 플러그인 개발 및 사용 방법

#### 🎯 Selection (선택 기능)

- **[선택 기능 구현 가이드](2-areas/selection/implementation-guide.md)** - 선택 시스템 구현 방법
- **[상용 앱 벤치마크](2-areas/selection/commercial-benchmarks.md)** - 업계 표준 선택 기능 분석

### 3️⃣ Resources (참고 자료)

프로젝트의 핵심 참고 문서들입니다.

- **[PRD (제품 요구사항 문서)](3-resources/PRD.md)** - 제품 비전 및 요구사항 정의
- **[핵심 요구사항](3-resources/requirements.md)** - 기술적 요구사항 명세
- **[아키텍처 문서](3-resources/architecture.md)** - 시스템 아키텍처 설계 (한글)
- **[아키텍처 분석 보고서](3-resources/architecture-report.md)** - 종합적인 아키텍처 분석 (영문)

### 4️⃣ Archives (보관)

완료되었거나 더 이상 사용하지 않는 문서들을 보관하는 공간입니다.
(현재 비어있음)

## 🎯 PARA 방법론이란?

PARA는 Tiago Forte가 개발한 정보 조직 방법론으로, 모든 정보를 다음 네 가지 카테고리로 분류합니다:

- **Projects**: 명확한 결과물과 마감일이 있는 활성 프로젝트
- **Areas**: 지속적으로 유지해야 하는 책임 영역
- **Resources**: 미래에 유용할 수 있는 참고 자료
- **Archives**: 비활성화된 프로젝트나 더 이상 관련 없는 항목

이 구조를 통해 현재 진행 중인 작업에 집중하면서도 중요한 참고 자료에 쉽게 접근할 수 있습니다.

## 📝 문서 작성 가이드

1. **새로운 개발 작업 시작 시**: `1-projects` 폴더에 문서 생성
2. **지속적인 프로세스 문서화**: `2-areas`의 적절한 하위 폴더에 작성
3. **참고 자료 추가**: `3-resources` 폴더에 저장
4. **프로젝트 완료 또는 문서 폐기**: `4-archives` 폴더로 이동

## 🔄 문서 업데이트 규칙

- 모든 새로운 기능은 `2-areas/features/features.md`에 기록
- 배포 관련 변경사항은 `2-areas/deployment/` 내 문서 업데이트
- 완료된 프로젝트는 `1-projects`에서 `4-archives`로 이동
- 한글 문서 작성을 기본으로 함
