"use client";

import { createPortal } from "react-dom";
import AlertModal from "@/components/modal/alert-modal";

const PortalProvider = () => {
	if (typeof window === "undefined") return null;

	const container = document.getElementById("modal-root");
	if (!container) return null;

	return createPortal(<AlertModal />, container);
};
export default PortalProvider;
