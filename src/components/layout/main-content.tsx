import type { ReactNode } from "react";

interface IMainContentProps {
	children: ReactNode;
}

const MainContent = ({ children }: IMainContentProps) => {
	return (
		<main className="container mx-auto px-4 py-12 max-w-4xl">{children}</main>
	);
};

export default MainContent;
