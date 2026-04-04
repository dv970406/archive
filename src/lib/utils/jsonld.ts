import type { CollectionPage, WebSite, WithContext } from "schema-dts";

/** 공통 WebSite JSON-LD 구조화 데이터 생성 */
export function createWebsiteJsonLd(
	siteUrl: string | undefined,
): WithContext<WebSite> {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${siteUrl}/#website`,
		url: siteUrl,
		name: "최성준 아카이브",
		description:
			"프론트엔드 개발자 최성준의 기술 블로그입니다. 웹 개발, React, Next.js, TypeScript 등 다양한 기술 주제를 다룹니다.",
		publisher: {
			"@type": "Person",
			name: "최성준",
			url: siteUrl,
		},
		inLanguage: "ko-KR",
	};
}

/** 공통 CollectionPage JSON-LD 구조화 데이터 생성 */
export function createCollectionPageJsonLd(params: {
	siteUrl: string | undefined;
	title: string;
	description: string;
}): WithContext<CollectionPage> {
	const { siteUrl, title, description } = params;

	return {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"@id": `${siteUrl}/#collectionpage`,
		url: siteUrl,
		name: title,
		description,
		isPartOf: {
			"@type": "WebSite",
			"@id": `${siteUrl}/#website`,
		},
		about: {
			"@type": "Thing",
			name: "웹 개발",
		},
		author: {
			"@type": "Person",
			name: "최성준",
			url: siteUrl,
		},
		inLanguage: "ko-KR",
	};
}
