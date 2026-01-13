import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

import type React from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import PortalProvider from "@/provider/portal-provider";
import RTKProvider from "@/provider/rtk-provider";

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
			<body className={"font-sans antialiased"}>
				<RTKProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{children}
						<div id="modal-root" />
						<PortalProvider />
					</ThemeProvider>
				</RTKProvider>
				<Toaster />
				<Analytics />
			</body>
		</html>
	);
};

export default RootLayout;
