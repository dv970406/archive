"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

const Giscus = () => {
	const ref = useRef<HTMLDivElement>(null);
	const { theme = "system" } = useTheme();

	useEffect(() => {
		if (!ref.current || ref.current.hasChildNodes()) return;
		if (!theme) return;

		const scriptElem = document.createElement("script");
		scriptElem.src = "https://giscus.app/client.js";
		scriptElem.defer = true;
		scriptElem.crossOrigin = "anonymous";

		scriptElem.setAttribute("data-repo", "dv970406/archive");
		scriptElem.setAttribute("data-repo-id", "R_kgDOQz31Mg");
		scriptElem.setAttribute("data-category", "Comments");
		scriptElem.setAttribute("data-category-id", "DIC_kwDOQz31Ms4C02iu");
		scriptElem.setAttribute("data-mapping", "pathname");
		scriptElem.setAttribute("data-strict", "0");
		scriptElem.setAttribute("data-reactions-enabled", "1");
		scriptElem.setAttribute("data-emit-metadata", "0");
		scriptElem.setAttribute("data-input-position", "top");
		scriptElem.setAttribute("data-theme", theme);
		scriptElem.setAttribute("data-lang", "ko");
		scriptElem.setAttribute("data-loading", "lazy");

		ref.current.appendChild(scriptElem);

		/* theme이 갱신되면 이전 script를 삭제하기 위함 */
		return () => {
			if (!ref.current) return;
			ref.current.removeChild(ref.current.firstChild as ChildNode);
		};
	}, [theme]);

	// https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#isetconfigmessage
	useEffect(() => {
		const iframe = document.querySelector<HTMLIFrameElement>(
			"iframe.giscus-frame",
		);
		iframe?.contentWindow?.postMessage(
			{ giscus: { setConfig: { theme } } },
			"https://giscus.app",
		);
	}, [theme]);

	return <div className="mt-60" ref={ref} />;
};
export default Giscus;
