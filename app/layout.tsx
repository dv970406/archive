import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

import type React from "react";
import "./globals.css";
import GlobalHeader from "@/components/layout/header/global-header";
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
		<html lang="ko">
			<body className={`font-sans antialiased`}>
				<RTKProvider>
					{/* <GlobalHeader /> */}
					{children}
					<div id="modal-root" />
					<PortalProvider />
				</RTKProvider>
				<Analytics />
			</body>
		</html>
	);
};

export default RootLayout;
