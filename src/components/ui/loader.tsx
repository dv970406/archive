import { LoaderCircleIcon } from "lucide-react";

const Loader = () => {
	return (
		<div className="flex flex-col items-center justify-center gap-2 mt-16">
			<LoaderCircleIcon className="w-6 h-6 animate-spin" />
			<span className="text-sm text-muted-foreground">
				데이터를 불러오는 중 입니다
			</span>
		</div>
	);
};

export default Loader;
