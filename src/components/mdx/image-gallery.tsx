import type { ReactNode } from "react";
import MdxImage from "./image";
import ImageGalleryClient from "./image-gallery-client";

interface ImageGalleryProps {
	children: ReactNode;
}

// 서버 컴포넌트로 유지 — RSC 컨텍스트에서 static property(.Image)가 보존됨
const ImageGallery = ({ children }: ImageGalleryProps) => {
	return <ImageGalleryClient>{children}</ImageGalleryClient>;
};

ImageGallery.Image = MdxImage;

export default ImageGallery;
