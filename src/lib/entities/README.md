# Visual CMS Editor - Entity Types

프로젝트에서 사용되는 모든 데이터 스키마와 타입 정의를 체계적으로 정리한 엔티티 폴더입니다.

## 📁 폴더 구조

```
src/entities/
├── selection/          # 선택 시스템 관련 타입
├── command/           # 명령 패턴 관련 타입
├── template/          # 템플릿 시스템 관련 타입
├── plugin/            # 플러그인 시스템 관련 타입
├── history/           # 히스토리 관리 관련 타입
├── keyboard/          # 키보드/단축키 관련 타입
├── logger/            # 로거 시스템 관련 타입
├── ui/                # UI 상태 관리 관련 타입
└── index.ts           # 통합 export 파일
```

## 🎯 각 엔티티 설명

### 1. Selection (`/selection/types.ts`)
**선택 시스템 관련 타입**
- `SelectionType`: 선택 가능한 요소 타입 ("text" | "image" | "icon" | "link" | "repeatable" | "section")
- `SelectedItem`: 선택된 아이템의 구조
- `SelectionManager`: 선택 관리자 인터페이스
- `SelectionStyle`: 선택 스타일 설정

### 2. Command (`/command/types.ts`)
**명령 패턴 및 상태 관리 관련 타입**
- `Command`: 기본 명령 인터페이스
- `CommandExecutor`: 명령 실행자 인터페이스
- `AppState`: 애플리케이션 전체 상태 구조
- `StateStore`: 상태 스토어 인터페이스
- 각종 구체적인 명령 타입들 (SELECT_ELEMENT, UPDATE_TEXT 등)

### 3. Template (`/template/`)
**템플릿 시스템 관련 타입**
- `types.ts`: 템플릿 정의 및 편집 가능 요소
- `models.ts`: 템플릿 모델 구조 (FrameModel, TextModel, ImageModel 등)
- Type guards 함수들 포함

### 4. Plugin (`/plugin/types.ts`)
**플러그인 시스템 관련 타입**
- `EditablePlugin`: 편집 가능 요소 플러그인 인터페이스
- `PluginModel`: 플러그인 모델 구조
- `EditableAction`: 플러그인 액션 정의
- `PluginManager`: 플러그인 관리자 인터페이스

### 5. History (`/history/types.ts`)
**히스토리 관리 관련 타입**
- `HistoryManager`: 히스토리 관리자 인터페이스
- `HistoryInfo`: 히스토리 정보 구조
- `HistoryEntry`: 히스토리 엔트리 구조
- `HistoryBranch`: 히스토리 분기 관리

### 6. Keyboard (`/keyboard/types.ts`)
**키보드/단축키 시스템 관련 타입**
- `KeyBinding`: 키 바인딩 정의
- `Keymap`: 키맵 구조
- `HotkeyManager`: 단축키 관리자 인터페이스
- `ParsedKeyCombo`: 파싱된 키 조합 구조

### 7. Logger (`/logger/types.ts`)
**로거 시스템 관련 타입**
- `LogLevel`: 로그 레벨 정의
- `LogEntry`: 로그 엔트리 구조
- `Logger`: 로거 인터페이스
- `LogExporter`: 로그 내보내기 인터페이스

### 8. UI (`/ui/types.ts`)
**UI 상태 관리 관련 타입**
- `UIState`: UI 상태 구조
- `Panel`: 패널 컴포넌트 구조
- `Modal`: 모달 컴포넌트 구조
- `Toolbar`: 툴바 구조
- `UIManager`: UI 관리자 인터페이스

## 🔄 마이그레이션 전략

기존 코드와의 호환성을 위해 다음과 같은 전략을 사용합니다:

1. **Re-export 패턴**: 기존 파일들은 entities에서 타입을 re-export
2. **점진적 마이그레이션**: 기존 import 경로는 유지하면서 점진적으로 entities 직접 사용
3. **중앙 집중식 export**: `src/entities/index.ts`에서 모든 타입을 한 번에 import 가능

## 📦 사용 방법

### 개별 엔티티에서 import
```typescript
import type { SelectionType, SelectedItem } from '../entities/selection/types'
import type { Command, AppState } from '../entities/command/types'
```

### 통합 index에서 import
```typescript
import type { 
  SelectionType, 
  Command, 
  AppState,
  Template,
  EditablePlugin 
} from '../entities'
```

### 기존 경로 (호환성 유지)
```typescript
import type { SelectionType } from '../lib/core/selection'
import type { Command } from '../lib/core/commands/types'
```

## 🎯 이점

1. **타입 안정성**: 모든 데이터 구조가 명확하게 정의됨
2. **코드 가독성**: 도메인별로 타입이 체계적으로 정리됨
3. **재사용성**: 중복 타입 정의 제거
4. **유지보수성**: 타입 변경 시 영향 범위를 쉽게 파악
5. **협업 효율성**: 새로운 개발자가 타입 구조를 쉽게 이해

## 🔧 앞으로의 계획

1. 기존 파일들을 점진적으로 entities 직접 사용으로 마이그레이션
2. 새로운 기능 개발 시 entities 우선 사용
3. 타입 검증 및 문서화 자동화
4. 런타임 타입 검증 추가 고려