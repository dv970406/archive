/** 사이트 기준 절대 URL 로 변환한다. 이미 절대 URL 이면 그대로 반환한다 */
export const toAbsoluteUrl = (pathOrUrl: string): string => {
	if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;

	const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
	return `${siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
};
