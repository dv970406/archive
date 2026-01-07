import { BUCKET_NAME } from "@/lib/supabase/bucket";
import supabaseClient from "@/lib/supabase/client";

export const uploadImage = async ({
	file,
	filePath,
}: {
	file: File;
	filePath: string;
}) => {
	const supabase = await supabaseClient();

	// uploads 버킷
	const { data, error } = await supabase.storage
		.from(BUCKET_NAME)
		// filePath: 저장할 경로
		// file: 저장할 파일
		.upload(filePath, file);

	if (error) throw error;

	const {
		data: { publicUrl },
	} = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

	return publicUrl;
};
