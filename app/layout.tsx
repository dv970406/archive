import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

import type React from "react";
import "./globals.css";
import { Toaster } from "sonner";
import PortalProvider from "@/provider/portal-provider";
import RTKProvider from "@/provider/rtk-provider";
import { themeInitScript } from "@/scripts/theme-init";

export const metadata: Metadata = {
	title: "아카이브",
	description: "최성준의 아카이브",
};

const RootLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		// 서버로부터 받은 페이지에 곧바로 다크모드 적용 시 html tag에 class가 붙는데 하이드레이션 이슈가 있어 suppressHydrationWarning를 추가
		<html lang="ko" suppressHydrationWarning>
			{/* 서버로부터 페이지를 받은 후 클라이언트 렌더링 전에 theme를 파악하여 모드 적용을 위함 - Next가 제공하는 <Script>는 body 로드 후 실행되어 사용불가 */}
			<head>
				<script>{themeInitScript}</script>
			</head>
			<body className={`font-sans antialiased`}>
				<RTKProvider>
					{children}
					<div id="modal-root" />
					<PortalProvider />
				</RTKProvider>
				<Toaster />
				<Analytics />
			</body>
		</html>
	);
};

export default RootLayout;
