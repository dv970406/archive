import { useState } from "react";
import type { EditorTab } from "@/types/post";

export const usePostEditorTabs = () => {
	const [activeTab, setActiveTab] = useState<EditorTab>("split");
	const handleActiveTab = (selectedTab: EditorTab) => () => {
		setActiveTab(selectedTab);
	};

	const isPreviewTab = activeTab === "preview";
	const isWriteTab = activeTab === "write";
	const isSplitTab = activeTab === "split";

	return {
		handleActiveTab,
		isPreviewTab,
		isWriteTab,
		isSplitTab,
	};
};

export type IUsePostEditorTabsReturn = ReturnType<typeof usePostEditorTabs>;
