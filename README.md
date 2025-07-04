# Visual CMS Editor

시각적으로 편집 가능한 CMS 에디터 - HTML 템플릿을 실시간으로 편집할 수 있는 웹 기반 에디터입니다.

## 주요 기능

- 📝 **실시간 편집**: 텍스트, 이미지, 링크를 클릭하여 즉시 편집
- 🎨 **템플릿 시스템**: 미리 만들어진 다양한 템플릿 제공
- 📱 **반응형 디자인**: 모든 기기에서 완벽하게 작동
- 🔄 **히스토리 관리**: Loro CRDT를 사용한 변경 내역 관리
- 🌐 **다국어 지원**: 한국어/영어 지원 (Paraglide.js)

## 시작하기

### 필요 사항

- Node.js 20+
- pnpm 8+

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 미리보기
pnpm preview
```

## 배포

### GitHub Pages 자동 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 배포됩니다:

1. GitHub 저장소의 Settings > Pages에서 Source를 "GitHub Actions"로 설정
2. `main` 브랜치에 푸시하면 자동으로 배포 시작
3. 배포 URL: `https://[username].github.io/[repository-name]/`

### 수동 배포

```bash
# 빌드 및 검증
pnpm deploy:check

# GitHub Pages에 직접 배포 (gh-pages 필요)
pnpm deploy
```

## 프로젝트 구조

```
src/
├── routes/              # SvelteKit 페이지
├── lib/                 # 재사용 가능한 컴포넌트
│   ├── components/      # UI 컴포넌트
│   └── core/           # 핵심 기능
│       └── templates/  # 템플릿 시스템
└── app.css             # 전역 스타일
```

## 기술 스택

- **Framework**: SvelteKit 2.16.0 + Svelte 5.0.0
- **언어**: TypeScript 5.0.0
- **스타일링**: Tailwind CSS 4.0.0
- **상태 관리**: Svelte Stores + Loro CRDT
- **빌드 도구**: Vite 6.2.6
- **배포**: GitHub Pages (정적 사이트)

## 개발 명령어

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm preview      # 빌드 미리보기
pnpm check        # 타입 체크
pnpm lint         # 린트 검사
pnpm format       # 코드 포맷팅
pnpm test         # 테스트 실행
```

## 라이선스

MIT License
