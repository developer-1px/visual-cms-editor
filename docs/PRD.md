# Visual CMS Editor Library - 제품 요구사항 문서 (PRD)

## 1. 프로젝트 개요

### 1.1 비전

Visual CMS Editor는 **디자인과 컨텐츠를 완전히 분리**한 차세대 헤드리스 비주얼 CMS 라이브러리입니다. 기존 WYSIWYG 에디터의 가장 큰 문제점인 "컨텐츠 편집자가 디자인을 망칠 수 있다"는 우려를 근본적으로 해결합니다.

### 1.2 핵심 가치

- **역할 기반 분리**: 디자이너와 컨텐츠 편집자의 작업 영역을 명확히 구분
- **안전한 편집**: 컨텐츠 편집자는 지정된 영역만 수정 가능
- **실시간 협업**: Loro CRDT 기반의 충돌 없는 동시 편집
- **버전 관리**: 모든 변경사항의 완벽한 추적과 롤백
- **프레임워크 독립성**: React, Vue, Svelte 등 모든 프레임워크 지원

### 1.3 타겟 사용자

1. **개발자**: 라이브러리를 통합하여 CMS 기능 구현
2. **디자이너**: 디자인 모드에서 레이아웃과 스타일 정의
3. **컨텐츠 편집자**: 컨텐츠 모드에서 안전하게 콘텐츠만 편집
4. **관리자**: 버전 관리 및 배포 관리

## 2. 핵심 기능

### 2.1 이중 모드 시스템

#### 디자인 모드 (Design Mode)

- **대상**: 개발자, 디자이너
- **기능**:
  - 컴포넌트 구조 정의 및 배치
  - 레이아웃 시스템 설정
  - 스타일 및 반응형 규칙 정의
  - 편집 가능 영역(Editable Zones) 지정
  - 컴포넌트 속성 스키마 정의
  - 템플릿 생성 및 관리

#### 컨텐츠 모드 (Content Mode)

- **대상**: 컨텐츠 편집자, 마케터
- **기능**:
  - 지정된 편집 영역에서만 작업
  - 텍스트, 이미지, 링크 수정
  - 리스트 아이템 추가/삭제 (허용된 범위 내)
  - 메타데이터 편집
  - 디자인 구조는 읽기 전용으로 보호

### 2.2 Loro CRDT 기반 상태 관리

- **실시간 동기화**: 여러 사용자의 동시 편집 지원
- **충돌 해결**: CRDT 알고리즘으로 자동 병합
- **오프라인 지원**: 로컬 우선 아키텍처
- **히스토리 추적**: 모든 변경사항의 완벽한 기록

### 2.3 컴포넌트 레지스트리

- **컴포넌트 정의**: 재사용 가능한 컴포넌트 등록
- **스키마 검증**: TypeScript 기반 타입 안전성
- **플러그인 시스템**: 커스텀 컴포넌트 확장
- **프리셋 라이브러리**: 자주 사용하는 레이아웃 템플릿

## 3. 기술 아키텍처

### 3.1 데이터 구조

```typescript
// 디자인 스키마 (Design Schema) - 불변
interface DesignSchema {
	id: string;
	version: string;
	components: ComponentTree; // 컴포넌트 계층 구조
	styles: StyleDefinitions; // 스타일 정의
	editableZones: EditableZone[]; // 편집 가능 영역
	constraints: Constraints; // 편집 제약사항
}

// 컨텐츠 데이터 (Content Data) - Loro로 관리
interface ContentData {
	texts: LoroText; // 텍스트 컨텐츠
	media: LoroMap; // 이미지, 비디오 등
	lists: LoroList; // 반복 가능한 항목
	metadata: LoroMap; // SEO, 설정 등
}

// 편집 가능 영역 정의
interface EditableZone {
	id: string;
	type: 'text' | 'image' | 'list' | 'custom';
	constraints?: {
		maxLength?: number;
		allowedFormats?: string[];
		validation?: ValidationRule[];
	};
}
```

### 3.2 핵심 모듈

1. **Editor Core**
   - Loro Doc 기반 상태 관리
   - 이벤트 시스템
   - Undo/Redo 관리
   - 변경사항 추적

2. **Component System**
   - 컴포넌트 등록 및 관리
   - 속성 스키마 정의
   - 렌더링 파이프라인
   - 라이프사이클 관리

3. **Visual Editor**
   - 드래그 앤 드롭 인터페이스
   - 인라인 편집
   - 실시간 미리보기
   - 반응형 뷰포트

4. **Storage Adapter**
   - API 연동
   - 로컬 스토리지
   - 파일 시스템
   - 클라우드 스토리지

5. **Sync Engine**
   - P2P 동기화
   - 서버 동기화
   - 충돌 해결
   - 네트워크 최적화

## 4. API 설계

### 4.1 초기화

```typescript
import { createVisualCMS } from '@visual-cms/core';
import { LoroDoc } from 'loro-crdt';

const cms = createVisualCMS({
	// Loro 문서 인스턴스
	loro: new LoroDoc(),

	// 사용 모드
	mode: 'design' | 'content',

	// 컴포넌트 레지스트리
	components: [HeroComponent, CardComponent, AccordionComponent],

	// 스토리지 어댑터
	storage: {
		adapter: 'api',
		endpoint: 'https://api.example.com/cms'
	},

	// 플러그인
	plugins: [validationPlugin, mediaPlugin, seoPlugin]
});
```

### 4.2 디자인 모드 API

```typescript
// 컴포넌트 추가
cms.design.addComponent({
	type: 'hero',
	props: { title: '', subtitle: '' },
	editableZones: ['title', 'subtitle']
});

// 레이아웃 설정
cms.design.setLayout({
	grid: { columns: 12, gap: 20 },
	breakpoints: {
		mobile: 768,
		tablet: 1024,
		desktop: 1440
	}
});

// 편집 영역 정의
cms.design.defineEditableZone('hero-title', {
	type: 'text',
	constraints: {
		maxLength: 100,
		allowedTags: ['strong', 'em']
	}
});
```

### 4.3 컨텐츠 모드 API

```typescript
// 텍스트 편집
cms.content.updateText('hero-title', 'Welcome to Our Service');

// 이미지 변경
cms.content.updateMedia('hero-image', {
	src: '/images/hero-new.jpg',
	alt: 'Hero Image'
});

// 리스트 항목 추가
cms.content.addListItem('features', {
	title: 'New Feature',
	description: 'Feature description'
});
```

### 4.4 동기화 및 협업

```typescript
// 실시간 동기화 시작
cms.sync.connect({
	url: 'wss://sync.example.com',
	room: 'project-123'
});

// 변경사항 구독
cms.on('change', (changes) => {
	console.log('Content updated:', changes);
});

// 히스토리 접근
const history = await cms.getHistory();
cms.revertTo(history[0].version);
```

## 5. 기술 스택

### 5.1 핵심 의존성

- **Loro CRDT**: 상태 관리 및 동기화
- **TypeScript**: 타입 안전성
- **Vite**: 빌드 도구
- **Vitest**: 테스트 프레임워크

### 5.2 프레임워크 어댑터

- **@visual-cms/svelte**: Svelte/SvelteKit 통합
- **@visual-cms/react**: React/Next.js 통합
- **@visual-cms/vue**: Vue/Nuxt 통합

### 5.3 선택적 의존성

- **Tiptap**: 리치 텍스트 편집 (선택사항)
- **Floating UI**: 팝오버 및 툴팁
- **Zod**: 스키마 검증

## 6. 로드맵

### Phase 1 (MVP) - 3개월

- [ ] 코어 라이브러리 구조 설계
- [ ] Loro 통합 및 기본 CRDT 구현
- [ ] 디자인/컨텐츠 모드 분리
- [ ] 기본 컴포넌트 시스템
- [ ] Svelte 어댑터

### Phase 2 (확장) - 2개월

- [ ] React/Vue 어댑터
- [ ] 플러그인 시스템
- [ ] 고급 편집 기능
- [ ] 실시간 협업 기능

### Phase 3 (최적화) - 2개월

- [ ] 성능 최적화
- [ ] 엔터프라이즈 기능
- [ ] 클라우드 서비스 연동
- [ ] 상용화 준비

## 7. 성공 지표

### 7.1 기술적 지표

- 초당 1000개 이상의 동시 편집 작업 처리
- 100ms 이하의 동기화 지연시간
- 99.9% 이상의 충돌 자동 해결률
- 10MB 이하의 번들 크기

### 7.2 사용성 지표

- 컨텐츠 편집자의 실수로 인한 디자인 파손: 0건
- 5분 이내 학습 가능한 인터페이스
- 3줄 이하의 코드로 기본 통합 가능

### 7.3 비즈니스 지표

- 1년 내 100개 이상의 프로젝트 채택
- 활발한 오픈소스 커뮤니티 형성
- 엔터프라이즈 라이선스 판매

## 8. 리스크 및 대응 방안

### 8.1 기술적 리스크

- **CRDT 성능**: 대규모 문서에서의 성능 저하
  - 대응: 청크 기반 로딩, 가상화
- **브라우저 호환성**: 구형 브라우저 지원
  - 대응: 폴리필 제공, 점진적 기능 저하

### 8.2 사용성 리스크

- **학습 곡선**: 새로운 패러다임 적응
  - 대응: 상세한 문서화, 인터랙티브 튜토리얼
- **마이그레이션**: 기존 CMS에서의 전환
  - 대응: 마이그레이션 도구 제공

## 9. 경쟁 우위

1. **유일한 모드 분리**: 디자인과 컨텐츠를 완전히 분리한 유일한 솔루션
2. **CRDT 기반**: 실시간 협업에서 최고의 사용자 경험
3. **개발자 친화적**: 간단한 API와 뛰어난 DX
4. **확장 가능**: 플러그인 시스템으로 무한 확장
5. **프레임워크 독립적**: 어떤 스택에서도 사용 가능
