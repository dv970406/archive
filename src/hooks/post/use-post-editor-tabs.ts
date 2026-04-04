import { useCallback, useState } from "react";
import type { EditorTab } from "@/types/post";

export const usePostEditorTabs = () => {
	const [activeTab, setActiveTab] = useState<EditorTab>("split");

	const handleWriteTab = useCallback(() => setActiveTab("write"), []);
	const handleSplitTab = useCallback(() => setActiveTab("split"), []);
	const handlePreviewTab = useCallback(() => setActiveTab("preview"), []);

	const isPreviewTab = activeTab === "preview";
	const isWriteTab = activeTab === "write";
	const isSplitTab = activeTab === "split";

	return {
		handleWriteTab,
		handleSplitTab,
		handlePreviewTab,
		isPreviewTab,
		isWriteTab,
		isSplitTab,
	};
};

export type IUsePostEditorTabsReturn = ReturnType<typeof usePostEditorTabs>;
