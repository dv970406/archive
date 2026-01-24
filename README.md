# Archive

MDX 기반 개인 블로그 플랫폼. Claude AI를 활용한 글 자동 요약 기능을 포함합니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| State | TanStack React Query 5, Zustand 5 |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude API |
| UI | Shadcn |
| Content | MDX (next-mdx-remote-client) |
| Linting | Biome 2 |
| Deployment | Vercel |

## 주요 기능

- MDX 마크다운 에디터 (Write / Preview / Split 모드) only Admin
- Claude AI 기반 글 자동 요약
- 카테고리별 글 분류
- 다크/라이트 테마
- Supabase Storage 이미지 업로드 (붙여넣기, WebP 변환)
- Giscus 댓글 시스템
- ISR 캐싱 (5분)
- 조회수 추적
- SEO 메타데이터 및 Sitemap

## 프로젝트 구조

```
src/
├── api/          # 데이터 페칭 함수 (post, category, auth, image, AI)
├── components/   # React 컴포넌트
│   ├── ui/       # 재사용 UI 컴포넌트
│   ├── layout/   # Header, Layout
│   ├── pages/    # 페이지별 컴포넌트
│   ├── modal/    # 모달 컴포넌트
│   └── mdx/      # MDX 렌더링 컴포넌트
├── hooks/        # Custom hooks(queries, mutations, etc...)
├── provider/     # Context providers (Query, Portal)
├── store/        # Zustand 스토어
├── types/        # TypeScript 타입 정의
└── lib/          # 유틸리티, Supabase 클라이언트, 상수

app/
├── api/              # API Route Handlers
├── (with-header)/    # 공개 페이지 (피드, 글 상세, 카테고리)
├── (with-auth)/      # 인증 필요 페이지 (글 작성/수정)
└── (with-no-auth)/   # 인증 페이지 (로그인)
```

## 시작하기

### 사전 요구사항

- Node.js 20+
- [Bun](https://bun.sh/) (패키지 매니저)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (로컬 개발 시)

### 1. 의존성 설치

```bash
bun install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_API_URL=your_supabase_api_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_STORAGE_URL=your_supabase_storage_url

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI (Claude API)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. Supabase 로컬 환경 실행 (선택)

```bash
supabase start
```

로컬 DB를 리모트와 동기화하려면:

```bash
bun run supabase:db-sync
```

DB 타입을 재생성하려면:

```bash
bun run supabase:type-gen
```

### 4. 개발 서버 실행

```bash
bun run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 5. 빌드

```bash
bun run build
```

## Git Hooks

Husky + lint-staged가 설정되어 있습니다.

- **pre-commit**: staged 파일에 `biome check --write` 자동 실행
