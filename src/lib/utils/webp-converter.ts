// 이미지를 webp로 변환하는 함수
export const convertToWebp = async (file: File): Promise<File> => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const reader = new FileReader();

		reader.onload = (e) => {
			const result = e.target?.result;
			if (typeof result !== "string") {
				reject(new Error("Failed to read file"));
				return;
			}

			img.onload = () => {
				const canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;

				const ctx = canvas.getContext("2d");
				if (!ctx) {
					reject(new Error("Canvas context not available"));
					return;
				}

				ctx.drawImage(img, 0, 0);

				canvas.toBlob(
					(blob) => {
						if (!blob) {
							reject(new Error("Blob conversion failed"));
							return;
						}

						const originalName = file.name.replace(/\.[^/.]+$/, "") || "image";
						const webpFile = new File([blob], `${originalName}.webp`, {
							type: "image/webp",
						});
						resolve(webpFile);
					},
					"image/webp",
					0.9,
				);
			};

			img.onerror = () => reject(new Error("Image load failed"));
			img.src = result;
		};

		reader.onerror = () => reject(new Error("File read failed"));
		reader.readAsDataURL(file);
	});
};
