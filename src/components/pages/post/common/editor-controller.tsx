import type { MouseEventHandler } from "react";
import type { IUsePostEditorTabsReturn } from "@/hooks/post/use-post-editor-tabs";
import { cn } from "@/lib/style/tailwind";

type IEditorController = Pick<
	IUsePostEditorTabsReturn,
	"isPreviewTab" | "isSplitTab" | "isWriteTab" | "handleActiveTab"
>;
const EditorController = ({
	isPreviewTab,
	isSplitTab,
	isWriteTab,
	handleActiveTab,
}: IEditorController) => {
	return (
		<>
			{/* 탭 전환 */}
			<div className="flex rounded-lg p-1">
				<TabButton
					onClick={handleActiveTab("write")}
					text="작성"
					isActive={isWriteTab}
				/>
				<TabButton
					onClick={handleActiveTab("split")}
					text="분할"
					isActive={isSplitTab}
				/>
				<TabButton
					onClick={handleActiveTab("preview")}
					text="미리보기"
					isActive={isPreviewTab}
				/>
			</div>
		</>
	);
};

interface ITabButton {
	text: string;
	isActive: boolean;
	onClick: MouseEventHandler<HTMLButtonElement>;
}
const TabButton = ({ text, isActive, onClick }: ITabButton) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"px-4 py-2 rounded-md transition-colors text-gray-600 dark:text-gray-400",
				{
					shadow: isActive,
				},
			)}
		>
			{text}
		</button>
	);
};

export default EditorController;
