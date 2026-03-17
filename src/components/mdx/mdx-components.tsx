import Link from "next/link";
import { Children, isValidElement, type ReactNode } from "react";
import { extractText, slugify } from "@/lib/utils/text";
import Callout from "./callout";
import MdxImage from "./image";
import ImageGallery from "./image-gallery";
import MdxVideo from "./video";

const createHeading = (type: "h1" | "h2" | "h3") => {
	const Heading = ({ children }: { children: ReactNode }) => {
		const HeadingTag = type;

		const extractedText = extractText(children);
		const id = slugify(extractedText);

		return (
			<HeadingTag id={id} className="group scroll-mt-20">
				{children}
				<a
					href={`#${id}`}
					className="ml-2 no-underline opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground select-none"
					aria-label={`${extractedText} 섹션 링크`}
				>
					#
				</a>
			</HeadingTag>
		);
	};
	return Heading;
};

export const mdxComponents = {
	Callout,
	ImageGallery,
	Image: MdxImage,
	Video: MdxVideo,
	a: ({ href, children }: { href?: string; children: ReactNode }) => (
		<Link href={href || "#"} rel="noopener noreferrer" target="_blank">
			{children}
		</Link>
	),
	p: ({ children }: { children: ReactNode }) => {
		// <p> 태그 안에 <figcaption> 태그가 들어가는 경우 invalid 에러가 나서 <p>로 감싸지 않는다
		const hasBlockChild = Children.toArray(children).some(
			(child) =>
				isValidElement(child) &&
				(child.type === MdxImage || child.type === MdxVideo),
		);
		if (hasBlockChild) return <>{children}</>;
		return <p>{children}</p>;
	},
	img: MdxImage,
	h1: createHeading("h1"),
	h2: createHeading("h2"),
	h3: createHeading("h3"),
};
