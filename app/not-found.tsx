import Link from "next/link";
import GlobalHeader from "@/components/layout/header/global-header";
import MainContent from "@/components/layout/main-content";
import { Button } from "@/components/ui/button";

/**
 * 전역 404 페이지.
 * `/post/[slug]`, `/category/[slug]` 는 `dynamicParams = false` 라서 없는 slug 는 세그먼트 레이아웃을 거치지 않고
 * 이 페이지로 바로 떨어진다. 글·카테고리 404 에서도 기존처럼 헤더가 보이도록 (with-header) 레이아웃과 같은 뼈대를 직접 그린다.
 */
const NotFound = () => {
	return (
		<>
			<GlobalHeader />
			<MainContent>
				<div className="mt-80 flex flex-col gap-4 items-center">
					<h1 className="text-2xl text-primary font-semibold">
						404 - Not Found
					</h1>
					<p className="text-md ">찾으시는 페이지가 존재하지 않습니다!</p>

					<Button variant={"outline"} asChild className="mt-4">
						<Link href={"/"}>홈으로 가기</Link>
					</Button>
				</div>
			</MainContent>
		</>
	);
};

export default NotFound;
