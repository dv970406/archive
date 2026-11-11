# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

MDX 파일 기반 개인 기술 블로그. Next.js 16 App Router 로 모든 페이지를 빌드 시점에 정적 생성(SSG)한다.
DB·인증·런타임 API 가 없으며, 글은 `content/` 의 MDX 파일을 git 으로 관리한다.

## 개발 명령어

```bash
pnpm run dev              # 개발 서버 (http://localhost:3000) — content/drafts 의 초안도 함께 노출
pnpm run build            # 프로덕션 빌드 (정적 생성 + 타입 검사)
pnpm run start            # 빌드 결과 실행
pnpm run biome            # Biome lint + format (자동 수정)

pnpm new-post <slug> --category <pathname> [--title "제목"]  # content/drafts/<slug>.mdx 초안 생성
pnpm publish-post <slug> [--summarize]                        # 초안 → content/posts 로 공개 (+AI 요약)
pnpm summarize <slug>                                         # AI 요약을 프론트매터 summary 에 기록
```

## 코드 스타일 (Biome)

- **인덴트**: 탭 사용 (스페이스 아님)
- **따옴표**: 더블 쿼트 (`"`)
- **console 사용 금지**: `noConsole: "error"` — CLI 스크립트(`scripts/`)만 파일 상단 `biome-ignore-all` 로 예외
- **import 자동 정렬**: `organizeImports: "on"`
- **pre-commit**: Husky + lint-staged가 staged 파일에 `biome check --write` 자동 실행

## 경로 별칭

`@/` → `src/` (예: `import { cn } from "@/lib/style/tailwind"`)

## 아키텍처

### 콘텐츠 (`content/`, `public/posts/`)

- `content/categories.json` — 카테고리 목록 `{ pathname, title, order }`. 포스트의 `category` 는 이 중 하나의 `pathname`
- `content/posts/<slug>.mdx` — 공개 글. **파일명이 slug** (URL: `/post/<slug>`)
- `content/drafts/` — 초안. **gitignore 대상**이며 `pnpm dev` 에서만 미리보기로 노출되고 빌드에는 포함되지 않음
- `public/posts/<slug>/` — 글의 이미지·영상. 본문에서는 `/posts/<slug>/<파일명>` 으로 참조

프론트매터 필드: `title`, `category`, `thumbnail?`, `summary?`, `publishedAt`, `updatedAt` (ISO 8601).
공개된 글을 수정했으면 `updatedAt` 을 직접 갱신한다 (sitemap `lastModified`, JSON-LD `dateModified` 에 쓰임).

### 데이터 로딩 계층

- `src/lib/content/categories.ts`, `src/lib/content/posts.ts` — `fs` 로 읽고 `gray-matter` 로 파싱. React `cache` 로 한 렌더(요청) 안에서는 파일을 한 번만 읽는다
- **서버 컴포넌트·라우트 핸들러에서만 import** 한다 (`node:fs` 사용). 클라이언트 컴포넌트에는 `PostCard` 처럼 직렬화된 데이터만 props 로 넘긴다
- 프론트매터가 잘못되면 파일명을 담아 throw 하므로 빌드가 실패하며 바로 드러난다
- `/post/[slug]`, `/category/[slug]` 는 `generateStaticParams` + `dynamicParams = false` → 빌드 시 정적 생성, 없는 slug 는 404

### 라우트 그룹 (App Router)

- `app/(with-header)/` — 피드(`/`), 카테고리 피드(`/category/[slug]`), 글 상세(`/post/[slug]`), 3D 피드(`/3D`), 커리어(`/career`)
- `app/rss.xml/route.ts` — RSS (`dynamic = "force-static"`)
- `app/posts/[slug]/[...file]/route.dev.ts` — **개발 전용**. `content/drafts/<slug>/` 의 초안 미디어를 `/posts/<slug>/<파일>` 로 서빙한다. `next.config.ts` 가 개발 단계에서만 `dev.ts` 를 `pageExtensions` 에 추가하므로 프로덕션 빌드에는 포함되지 않는다
- `app/sitemap.ts` — 사이트맵

### 피드 무한 스크롤

전체 목록을 서버에서 props 로 받아 클라이언트(`PostsList`)가 10개씩 점진적으로 노출한다. 네트워크 요청은 없다.

### 상대 시간 표시 (`TimeAgo`)

페이지가 빌드 시점에 정적으로 생성되므로 서버가 계산한 "3일 전" 같은 라벨은 빌드 시각 기준이다.
`TimeAgo` 클라이언트 컴포넌트가 서버 라벨(`initialLabel`)로 먼저 그려 하이드레이션 불일치를 피하고, 마운트 후 현재 시각 기준으로 갱신한다.
3달 이상 지난 글의 `YYYY.MM.DD` 는 빌드 서버·브라우저 타임존과 무관하게 한국 시간(Asia/Seoul) 기준으로 고정한다 (`formatTimeAgo`).

### 스타일링

- **Tailwind CSS v4** + CSS 변수 기반 테마 (oklch 컬러)
- **Shadcn UI** (New York 스타일) — `src/components/ui/` (button, card, loader 등)
- **`cn()` 유틸리티**: `clsx` + `tailwind-merge` (`@/lib/style/tailwind`)
- **다크/라이트 테마**: `next-themes`, 기본값 `dark`

### MDX 렌더링

- `next-mdx-remote-client/rsc` 의 `MDXRemote` 로 서버에서 컴파일
- 커스텀 컴포넌트: `Callout`, `Image`, `Video`, `ImageGallery` — `src/components/mdx/`
- `<Image width={75} />` 처럼 `width` 는 퍼센트이며 `MediaWidthWrapper` 가 너비를 제한한다

## 환경변수

```env
NEXT_PUBLIC_SITE_URL=   # 절대 URL 생성용 (OG 이미지, RSS, sitemap, JSON-LD)
ANTHROPIC_API_KEY=      # 로컬 AI 요약 스크립트 전용. 배포 환경에는 불필요
```

## 주요 패턴

- **글 작성 흐름**: `pnpm new-post` → `content/drafts` 에서 작성(`pnpm dev` 로 미리보기) → `pnpm publish-post <slug> --summarize` → 커밋/푸시
- **이미지**: `public/posts/<slug>/` 의 정적 파일을 `next/image` 가 최적화. 원격 이미지 호스트 설정 없음
- **AI 요약**: 로컬 스크립트(`scripts/lib/ai-summary.ts`, Anthropic SDK)로 생성해 프론트매터에 저장. 서버 라우트 없음
- **댓글**: Giscus (GitHub Discussions)
- **캐싱**: 런타임 캐시 없음. 모든 페이지가 빌드 시 정적 HTML 로 생성되며 글이 바뀌면 다시 배포한다
