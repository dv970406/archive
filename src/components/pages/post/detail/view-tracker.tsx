"use client";

import { useViewTracking } from "@/hooks/post/use-view-tracking";
import type { PostEntity } from "@/types/post";

type IViewTracker = Pick<PostEntity, "id">;
const ViewTracker = ({ id }: IViewTracker) => {
	useViewTracking(id);
	return null;
};

export default ViewTracker;
