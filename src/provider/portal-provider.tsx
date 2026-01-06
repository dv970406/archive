import { createPortal } from "react-dom";

const PortalProvider = () => {
	if (typeof window === "undefined") return null;

	return (
		<>
			<div id="modal-root"></div>
			{createPortal(
				<>{/* <PostEditorModal /> */}</>,
				document.getElementById("modal-root") as HTMLElement,
			)}
		</>
	);
};
export default PortalProvider;
