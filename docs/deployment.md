# 배포 가이드

## GitHub Pages 배포

Visual CMS Editor는 GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다.

### 설정 단계

1. **GitHub 저장소 설정**
   - 저장소의 Settings > Pages로 이동
   - Source를 "GitHub Actions"로 변경

2. **자동 배포 활성화**
   - `main` 브랜치에 푸시하면 자동으로 배포가 시작됩니다
   - GitHub Actions 탭에서 배포 진행 상황을 확인할 수 있습니다

3. **배포 URL**
   - 배포가 완료되면 `https://[username].github.io/[repository-name]/`에서 확인할 수 있습니다

### 수동 배포

Actions 탭에서 "Deploy to GitHub Pages" 워크플로우를 선택하고 "Run workflow"를 클릭하여 수동으로 배포할 수 있습니다.

### 빌드 확인

로컬에서 빌드를 테스트하려면:

```bash
# 의존성 설치
pnpm install

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

### 커스텀 도메인

커스텀 도메인을 사용하려면:
1. 저장소 루트에 `static/CNAME` 파일 생성
2. 파일에 도메인 이름 입력 (예: `editor.example.com`)
3. DNS 설정에서 CNAME 레코드 추가

### 환경 변수

배포 시 필요한 환경 변수는 GitHub Secrets에 추가할 수 있습니다:
- Settings > Secrets and variables > Actions
- 필요한 시크릿 추가 후 워크플로우에서 사용

### 문제 해결

- **404 오류**: `fallback: 'index.html'` 설정 확인
- **경로 오류**: BASE_PATH 환경 변수 확인
- **빌드 실패**: Node.js 버전 및 의존성 확인