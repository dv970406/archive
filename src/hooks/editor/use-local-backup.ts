import { useEffect, useRef } from "react";
import type { EditorDraft } from "@/lib/editor/types";

const KEY_PREFIX = "post-editor-backup:";
/** 아직 파일로 저장되지 않은 새 글의 백업 키 */
const NEW_POST_KEY = "new";

interface IBackup {
	draft: EditorDraft;
	savedAt: string;
}

const storageKey = (key: string) => `${KEY_PREFIX}${key}`;

// localStorage 는 사생활 보호 모드·용량 초과 등으로 throw 할 수 있다. 백업은 보조 수단이라 실패해도 무시한다
const readBackup = (key: string): IBackup | null => {
	try {
		const raw = window.localStorage.getItem(storageKey(key));
		return raw ? (JSON.parse(raw) as IBackup) : null;
	} catch {
		return null;
	}
};

const writeBackup = (key: string, draft: EditorDraft) => {
	try {
		const backup: IBackup = { draft, savedAt: new Date().toISOString() };
		window.localStorage.setItem(storageKey(key), JSON.stringify(backup));
	} catch {}
};

const removeBackup = (key: string) => {
	try {
		window.localStorage.removeItem(storageKey(key));
	} catch {}
};

const isSameDraft = (a: EditorDraft, b: EditorDraft) =>
	a.title === b.title &&
	a.slug === b.slug &&
	a.category === b.category &&
	a.thumbnail === b.thumbnail &&
	a.content === b.content;

interface IUseLocalBackupProps {
	draft: EditorDraft;
	initialDraft: EditorDraft;
	/** 저장된 파일의 slug. 아직 파일이 없으면 null */
	savedSlug: string | null;
	/** 파일에 저장되지 않은 변경이 있는지 */
	isDirty: boolean;
	onRestore: (draft: EditorDraft) => void;
}

/**
 * 파일에 저장되지 않은 편집 내용을 localStorage 에 백업한다.
 * 공개 글은 저장 버튼으로만 저장되고 새 글은 제목·slug·카테고리가 채워져야 저장되므로,
 * 탭이 죽거나 새로고침하면 그 사이 내용이 사라진다. 다시 열었을 때 복원할지 묻는다
 */
export const useLocalBackup = ({
	draft,
	initialDraft,
	savedSlug,
	isDirty,
	onRestore,
}: IUseLocalBackupProps) => {
	const key = savedSlug ?? NEW_POST_KEY;
	const lastKeyRef = useRef(key);
	// 개발 모드(StrictMode)에서 effect 가 두 번 돌아도 한 번만 묻는다
	const hasCheckedRef = useRef(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: 에디터를 열 때 한 번만 확인한다
	useEffect(() => {
		if (hasCheckedRef.current) return;
		hasCheckedRef.current = true;

		const backup = readBackup(key);
		if (!backup) return;
		if (isSameDraft(backup.draft, initialDraft)) {
			removeBackup(key);
			return;
		}

		const savedAt = new Date(backup.savedAt).toLocaleString("ko-KR");
		if (
			window.confirm(
				`저장하지 않은 편집 내용이 있습니다 (${savedAt}).\n복원할까요? 취소하면 백업을 지웁니다.`,
			)
		) {
			onRestore(backup.draft);
		} else {
			removeBackup(key);
		}
	}, []);

	useEffect(() => {
		// 복원 여부를 묻기 전에는 기존 백업을 건드리지 않는다
		if (!hasCheckedRef.current) return;

		// slug 가 바뀌었거나 새 글이 처음 저장되면 이전 키의 백업을 옮긴다
		if (lastKeyRef.current !== key) {
			removeBackup(lastKeyRef.current);
			lastKeyRef.current = key;
		}

		if (isDirty) writeBackup(key, draft);
		else removeBackup(key);
	}, [draft, key, isDirty]);
};
