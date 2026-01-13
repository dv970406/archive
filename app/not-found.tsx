import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound = () => {
	return (
		<div className="mt-80 flex flex-col gap-4 items-center">
			<h1 className="text-2xl text-primary font-semibold">404 - Not Found</h1>
			<p className="text-md ">찾으시는 페이지가 존재하지 않습니다!</p>

			<Button variant={"outline"} asChild className="mt-4">
				<Link href={"/"}>홈으로 가기</Link>
			</Button>
		</div>
	);
};

export default NotFound;
