import fs from "node:fs";
import path from "node:path";
import { DRAFTS_DIR } from "@/lib/content/posts";

/**
 * 개발 서버 전용 라우트.
 * 파일명이 `route.dev.ts` 라서 `next.config.ts` 가 개발 단계에서만 추가하는 `dev.ts` 확장자로만 인식되며,
 * 프로덕션 빌드에는 포함되지 않는다 (초안은 빌드 대상이 아니므로 서빙할 것도 없다).
 *
 * `content/drafts/<slug>/` 에 둔 초안 미디어를 공개 글과 같은 `/posts/<slug>/<파일>` 경로로 서빙해
 * 초안 본문에서도 공개 후와 동일한 경로를 그대로 쓸 수 있게 한다.
 * `public/posts/` 에 실제 파일이 있으면 Next 가 그것을 먼저 서빙하므로 이 핸들러는 초안 미디어에만 닿는다.
 */

const CONTENT_TYPES: Record<string, string> = {
	".webp": "image/webp",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".avif": "image/avif",
	".mp4": "video/mp4",
	".webm": "video/webm",
};

interface IRouteContext {
	params: Promise<{ slug: string; file: string[] }>;
}

export const GET = async (_request: Request, { params }: IRouteContext) => {
	const { slug, file } = await params;
	const draftMediaDir = path.join(DRAFTS_DIR, slug);
	const filePath = path.resolve(draftMediaDir, ...file);

	// 초안 폴더 밖으로 벗어나는 경로(`..` 등)와 없는 파일은 404
	const isInsideDraftDir = filePath.startsWith(draftMediaDir + path.sep);
	if (
		!isInsideDraftDir ||
		!fs.existsSync(filePath) ||
		!fs.statSync(filePath).isFile()
	) {
		return new Response(null, { status: 404 });
	}

	return new Response(new Uint8Array(fs.readFileSync(filePath)), {
		headers: {
			"Content-Type":
				CONTENT_TYPES[path.extname(filePath).toLowerCase()] ??
				"application/octet-stream",
			"Cache-Control": "no-store",
		},
	});
};
