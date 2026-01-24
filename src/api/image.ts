import { BUCKET_NAME } from "@/lib/supabase/bucket";
import supabaseClient from "@/lib/supabase/client";

export const uploadImage = async ({
	file,
	filePath,
}: {
	file: File;
	filePath: string;
}) => {
	// uploads 버킷
	const { data, error } = await supabaseClient.storage
		.from(BUCKET_NAME)
		// filePath: 저장할 경로
		// file: 저장할 파일
		.upload(filePath, file);

	if (error) throw error;

	const {
		data: { publicUrl },
	} = supabaseClient.storage.from(BUCKET_NAME).getPublicUrl(data.path);

	return publicUrl;
};

export const deleteImage = async (path: string) => {
	// 동일한 경로에 이미지가 존재하는지 먼저 확인을 하는 로직
	// 있다면 삭제 후 업로드하려는 목적이었으나
	// 덮어쓸 수 있으므로 딱히 필요한 작업은 아니어서 주석처리
	// const { data: isAlreadyImageExist, error: fetchError } =
	// 	await supabaseClient.storage.from(BUCKET_NAME).exists(path);

	// // 삭제할 대상이 없다면 return 처리
	// if (!isAlreadyImageExist) {
	// 	return;
	// }

	// if (fetchError) throw fetchError;

	const { error } = await supabaseClient.storage
		.from(BUCKET_NAME)
		.remove([path]);

	if (error) throw error;
};

export const deleteImagesInPath = async (path: string) => {
	const { data: files, error: fetchError } = await supabaseClient.storage
		.from(BUCKET_NAME)
		.list(path);

	// 삭제할 대상이 없다면 return 처리
	if (!files || files.length === 0) {
		return;
	}

	if (fetchError) throw fetchError;

	const stringFiles = files.map((file) => `${path}/${file.name}`);
	const { error: removeError } = await supabaseClient.storage
		.from(BUCKET_NAME)
		.remove(stringFiles);

	if (removeError) throw removeError;
};
