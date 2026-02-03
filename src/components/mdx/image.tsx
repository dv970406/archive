import Image from "next/image";

const MdxImage = ({ src, alt }: { src: string; alt?: string }) => {
	if (!src) return null;
	return (
		<figure className="shrink-0">
			<Image
				src={src}
				alt={alt || ""}
				fill
				className="relative! w-full h-full object-cover rounded-lg my-6"
			/>
			{alt && <figcaption className="text-center">{alt}</figcaption>}
		</figure>
	);
};

export default MdxImage;
