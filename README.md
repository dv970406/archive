# Archive

MDX 파일 기반 개인 기술 블로그. 모든 페이지를 빌드 시점에 정적으로 생성하며, DB·서버 없이 Vercel 에 배포됩니다.
글은 `content/` 의 MDX 파일로 git 에서 함께 관리하고, Claude AI 로 만든 요약을 프론트매터에 저장합니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router, 정적 생성) |
| Styling | Tailwind CSS 4 |
| Content | MDX 파일 (gray-matter + next-mdx-remote-client) |
| AI | Anthropic Claude API (로컬 요약 스크립트) |
| UI | Shadcn |
| Comments | Giscus |
| Linting | Biome 2 |
| Deployment | Vercel |

## 주요 기능

- `content/posts` 의 MDX 글을 빌드 시점에 정적 페이지로 생성
- Claude AI 기반 글 요약 (메타 description, RSS, JSON-LD 에 사용)
- 카테고리별 글 분류 및 이전/다음 글 내비게이션
- 다크/라이트 테마
- 이미지·영상 라이트박스, 이미지 갤러리 (MDX 커스텀 컴포넌트)
- 3D 피드 뷰 (three.js)
- Giscus 댓글 시스템
- SEO 메타데이터, JSON-LD, Sitemap, RSS

## 프로젝트 구조

```
content/
├── categories.json   # 카테고리 목록 { pathname, title, order }
├── posts/            # 공개 글 (<slug>.mdx — 파일명이 URL slug)
└── drafts/           # 초안 (git 제외, 개발 서버에서만 미리보기)

public/posts/<slug>/  # 글의 이미지·영상 (본문에서 /posts/<slug>/<파일명> 으로 참조)

scripts/
├── new-post.ts       # 초안 생성
├── publish-post.ts   # 초안 공개 (+AI 요약)
└── summarize-post.ts # AI 요약 생성

src/
├── api/          # 정적 데이터 (career)
├── components/   # React 컴포넌트
│   ├── ui/       # 재사용 UI 컴포넌트
│   ├── layout/   # Header, Layout
│   ├── pages/    # 페이지별 컴포넌트
│   └── mdx/      # MDX 렌더링 컴포넌트
├── hooks/        # Custom hooks
├── lib/
│   └── content/  # MDX 파일 로더 (categories, posts)
├── provider/     # JSON-LD provider
└── types/        # TypeScript 타입 정의

app/
├── (with-header)/    # 피드, 카테고리 피드, 글 상세, 3D 피드, 커리어
├── rss.xml/          # RSS
└── sitemap.ts        # 사이트맵
```

## 시작하기

### 사전 요구사항

- Node.js 20+
- [pnpm](https://pnpm.io/) (패키지 매니저)
- [Bun](https://bun.sh/) (글 작성 스크립트 실행용)

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
# 절대 URL 생성용 (OG 이미지, RSS, Sitemap, JSON-LD)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI 요약 스크립트 전용 (pnpm summarize / publish-post --summarize). 배포 환경에는 불필요
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다. 개발 서버에서는 `content/drafts` 의 초안도 함께 노출됩니다.

### 4. 빌드

```bash
pnpm build
pnpm start
```

## 글 작성

### 1. 초안 생성

```bash
pnpm new-post my-post --category blog --title "글 제목"
```

`content/drafts/my-post.mdx` 가 만들어집니다. `--category` 는 `content/categories.json` 의 `pathname` 중 하나입니다.

### 2. 작성 및 미리보기

- 본문은 MDX 로 작성합니다.
- 이미지·영상은 `public/posts/my-post/` 에 넣고 `<Image src="/posts/my-post/a.webp" width={100} />` 처럼 참조합니다.
  초안 단계에서 git 에 올리고 싶지 않다면 `content/drafts/my-post/` 에 두어도 됩니다. 개발 서버가 같은 `/posts/my-post/…` 경로로 서빙해 주고(개발 전용 라우트), 공개 시 `public/posts/my-post/` 로 자동으로 옮겨집니다.
- 썸네일은 프론트매터 `thumbnail: /posts/my-post/thumbnail.webp` 로 지정합니다. (없으면 기본 이미지 사용)
- `pnpm dev` 로 실행하면 초안도 피드와 상세 페이지에 노출되어 미리볼 수 있습니다.

### 3. 공개

```bash
pnpm publish-post my-post --summarize
```

- `content/drafts/my-post.mdx` → `content/posts/my-post.mdx` 로 이동
- `content/drafts/my-post/` 가 있으면 `public/posts/my-post/` 로 이동
- `publishedAt`, `updatedAt` 을 현재 시각으로 갱신
- `--summarize` 를 주면 Claude AI 요약을 생성해 `summary` 에 기록

이후 커밋·푸시하면 Vercel 이 다시 빌드해 배포합니다. 공개한 글을 수정했다면 `updatedAt` 을 직접 갱신하고, 요약을 다시 만들고 싶다면 `pnpm summarize my-post` 를 실행합니다.

### 프론트매터

```yaml
---
title: 글 제목
category: blog                              # content/categories.json 의 pathname
thumbnail: /posts/my-post/thumbnail.webp    # 선택
summary: AI 요약 (선택)
publishedAt: '2026-01-19T15:15:51.062Z'     # ISO 8601
updatedAt: '2026-01-19T15:16:14.497Z'       # 수정 시 직접 갱신
---
```

### MDX 커스텀 컴포넌트

```mdx
<Callout type="info">정보 · warning · success · error</Callout>

<Image src="/posts/my-post/a.webp" alt="캡션" width={75} />

<Video src="/posts/my-post/demo.webm" width={100} />

<ImageGallery>
	<ImageGallery.Image src="/posts/my-post/a.webp" alt="첫 번째" />
	<ImageGallery.Image src="/posts/my-post/b.webp" alt="두 번째" />
</ImageGallery>
```

`width` 는 본문 너비 대비 퍼센트입니다.

### 글 숨기기

`content/posts/<slug>.mdx` 를 `content/drafts/` 로, `public/posts/<slug>/` 를 `content/drafts/<slug>/` 로 옮기면 사이트와 git 에서 모두 사라집니다. (`content/drafts` 는 gitignore 대상)

## Git Hooks

Husky + lint-staged가 설정되어 있습니다.

- **pre-commit**: staged 파일에 `biome check --write` 자동 실행
