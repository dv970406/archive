import { Children, type ReactNode } from "react";
import { cn } from "@/lib/style/tailwind";
import MdxImage from "./image";

interface ImageGalleryProps {
	children: ReactNode;
}

const ImageGallery = ({ children }: ImageGalleryProps) => {
	const childCount = Children.count(children);
	const isScrollable = childCount > 2;
	return (
		<div
			className={cn("gap-4 my-6 pb-2 w-full", {
				"grid grid-cols-2": !isScrollable,
				"flex [&>figure]:w-1/2 overflow-x-scroll [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-track]:bg-muted":
					isScrollable,
			})}
		>
			{children}
		</div>
	);
};

ImageGallery.Image = MdxImage;

export default ImageGallery;
