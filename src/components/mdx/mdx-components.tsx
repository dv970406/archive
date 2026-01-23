import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Callout from "./callout";

export const mdxComponents = {
	Callout,
	a: ({ href, children }: { href?: string; children: ReactNode }) => (
		<Link href={href || "#"} rel="noopener noreferrer" target="_blank">
			{children}
		</Link>
	),
	img: ({ src, alt }: { src: string; alt?: string }) => (
		<figure>
			<Image
				src={src || ""}
				alt={alt || ""}
				fill
				className="relative! rounded-lg my-6"
			/>
			{alt && <figcaption className="text-center">{alt}</figcaption>}
		</figure>
	),
	// h1: ({ children }: { children: ReactNode }) => (
	// 	<h1 className="text-4xl font-bold mt-8 mb-4 text-foreground text-balance">
	// 		{children}
	// 	</h1>
	// ),
	// h2: ({ children }: { children: ReactNode }) => (
	// 	<h2 className="text-3xl font-semibold mt-12 mb-4 text-foreground text-balance">
	// 		{children}
	// 	</h2>
	// ),
	// h3: ({ children }: { children: ReactNode }) => (
	// 	<h3 className="text-2xl font-semibold mt-8 mb-3 text-foreground text-balance">
	// 		{children}
	// 	</h3>
	// ),
	// p: ({ children }: { children: ReactNode }) => (
	// 	<p className="mb-4 text-muted-foreground leading-relaxed text-pretty">
	// 		{children}
	// 	</p>
	// ),
	// ul: ({ children }: { children: ReactNode }) => (
	// 	<ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
	// ),
	// ol: ({ children }: { children: ReactNode }) => (
	// 	<ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
	// ),
	// li: ({ children }: { children: ReactNode }) => (
	// 	<li className="text-muted-foreground">{children}</li>
	// ),
	// code: ({ children }: { children: ReactNode }) => (
	// 	<code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
	// 		{children}
	// 	</code>
	// ),
	// pre: ({ children }: { children: ReactNode }) => (
	// 	<pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
	// 		<code className="font-mono text-foreground">{children}</code>
	// 	</pre>
	// ),
	// blockquote: ({ children }: { children: ReactNode }) => (
	// 	<blockquote className="border-l-4 border-primary pl-4 py-2 mb-4 italic text-muted-foreground">
	// 		{children}
	// 	</blockquote>
	// ),
};
