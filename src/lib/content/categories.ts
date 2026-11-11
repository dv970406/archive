import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { Category } from "@/types/post";

/** 카테고리 정의 파일. 포스트 프론트매터의 category 는 이 파일의 pathname 중 하나여야 한다 */
const CATEGORIES_FILE = path.join(process.cwd(), "content", "categories.json");

const assertCategory = (value: unknown, index: number): Category => {
	if (typeof value !== "object" || value === null) {
		throw new Error(`[content] categories.json[${index}] 는 객체여야 합니다.`);
	}

	const { pathname, title, order } = value as Record<string, unknown>;

	if (typeof pathname !== "string" || !/^[a-z0-9-]+$/.test(pathname)) {
		throw new Error(
			`[content] categories.json[${index}].pathname 은 소문자 영문·숫자·하이픈(-)으로만 이루어진 문자열이어야 합니다.`,
		);
	}
	if (typeof title !== "string" || title.trim() === "") {
		throw new Error(
			`[content] categories.json[${index}].title 이 비어 있습니다.`,
		);
	}
	if (typeof order !== "number" || !Number.isFinite(order)) {
		throw new Error(
			`[content] categories.json[${index}].order 는 숫자여야 합니다.`,
		);
	}

	return { pathname, title, order };
};

/**
 * 모든 카테고리를 order 오름차순으로 반환한다.
 * React cache 로 감싸 한 번의 렌더(요청) 안에서는 파일을 한 번만 읽는다.
 */
export const getAllCategories = cache((): Category[] => {
	const raw: unknown = JSON.parse(fs.readFileSync(CATEGORIES_FILE, "utf8"));
	if (!Array.isArray(raw)) {
		throw new Error("[content] categories.json 은 배열이어야 합니다.");
	}

	const categories = raw.map(assertCategory);

	const pathnames = new Set<string>();
	for (const category of categories) {
		if (pathnames.has(category.pathname)) {
			throw new Error(
				`[content] categories.json 에 pathname "${category.pathname}" 이 중복됩니다.`,
			);
		}
		pathnames.add(category.pathname);
	}

	return categories.sort((a, b) => a.order - b.order);
});

export const getCategoryByPathname = (pathname: string): Category | null =>
	getAllCategories().find((category) => category.pathname === pathname) ?? null;
