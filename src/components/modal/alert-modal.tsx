import { useAlertModal } from "@/store/alert-modal";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";

const AlertModal = () => {
	const store = useAlertModal();
	if (!store.isOpen) return null;

	const handleCancelClick = () => {
		if (store.onNegative) store.onNegative();
		store.actions.close();
	};
	const handleActionClick = () => {
		if (store.onPositive) store.onPositive();
		store.actions.close();
	};
	return (
		<Dialog open={store.isOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{store.title}</DialogTitle>
					<DialogDescription>{store.description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button onClick={handleCancelClick} variant="outline">
						취소
					</Button>
					<Button onClick={handleActionClick} type="submit">
						확인
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AlertModal;
