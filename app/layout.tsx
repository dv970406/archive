import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "아카이브",
	description: "최성준의 아카이브",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
