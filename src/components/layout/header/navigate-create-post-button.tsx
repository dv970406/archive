import Link from "next/link";

const NavigateCreatePostButton = async () => {
	return (
		<Link
			href="/post/create"
			className="text-sm text-muted-foreground hover:text-foreground transition-colors"
		>
			글 작성
		</Link>
	);
};

export default NavigateCreatePostButton;
