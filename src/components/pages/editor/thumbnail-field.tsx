import { XIcon } from "lucide-react";
import { type ChangeEventHandler, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { IUsePostEditorReturn } from "@/hooks/editor/use-post-editor";
import { convertToWebp } from "@/lib/utils/webp-converter";

type IThumbnailFieldProps = Pick<IUsePostEditorReturn, "upload"> & {
	thumbnail: string | null;
	onChange: (thumbnail: string | null) => void;
	disabled: boolean;
};

/** 썸네일 업로드·제거. 바뀐 썸네일의 이전 파일은 저장할 때 서버가 지운다 */
const ThumbnailField = ({
	thumbnail,
	onChange,
	upload,
	disabled,
}: IThumbnailFieldProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
		const file = event.target.files?.[0];
		// 같은 파일을 다시 골라도 change 이벤트가 나도록 비운다
		event.target.value = "";
		if (!file) return;

		setIsUploading(true);
		try {
			const src = await upload(await convertToWebp(file), "thumbnail");
			if (src) onChange(src);
		} finally {
			setIsUploading(false);
		}
	};

	if (thumbnail) {
		return (
			<div className="flex gap-1.5 items-center text-sm">
				<a
					href={thumbnail}
					target="_blank"
					rel="noreferrer"
					className="text-primary"
				>
					썸네일 보기
				</a>
				<button
					type="button"
					aria-label="썸네일 제거"
					onClick={() => onChange(null)}
					disabled={disabled}
					className="text-muted-foreground hover:text-foreground"
				>
					<XIcon className="w-4 h-4" />
				</button>
			</div>
		);
	}

	return (
		<>
			<input
				type="file"
				className="hidden"
				ref={inputRef}
				accept="image/*"
				onChange={handleChange}
			/>
			<Button
				type="button"
				variant="outline"
				onClick={() => inputRef.current?.click()}
				disabled={disabled || isUploading}
			>
				{isUploading ? "업로드 중..." : "썸네일 업로드"}
			</Button>
		</>
	);
};

export default ThumbnailField;
