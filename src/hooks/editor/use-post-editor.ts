import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PostLocation } from "@/lib/content/post-files";
import {
	type ISavePostInput,
	publishDraft,
	savePost,
	unpublishPost,
	uploadMedia,
} from "@/lib/editor/actions";
import type { EditorDraft } from "@/lib/editor/types";
import { useLocalBackup } from "./use-local-backup";

/** 자동 저장 디바운스 지연 시간(밀리초) */
const AUTO_SAVE_DEBOUNCE_MS = 1000;
const SLUG_PATTERN = /^[a-z0-9-]+$/;

export type SaveStatus =
	| { type: "idle" }
	| { type: "saving" }
	| { type: "saved"; at: Date }
	| { type: "error"; message: string }
	| { type: "warning"; message: string };

interface IUsePostEditorProps {
	initialDraft: EditorDraft;
	/** 파일 위치. 아직 저장되지 않은 새 글이면 null */
	initialLocation: PostLocation | null;
}

/** 글 상태와 파일 저장(자동 임시저장·발행·숨기기·미디어 업로드)을 관리한다 */
export const usePostEditor = ({
	initialDraft,
	initialLocation,
}: IUsePostEditorProps) => {
	const router = useRouter();

	const [draft, setDraft] = useState(initialDraft);
	const [location, setLocation] = useState<PostLocation>(
		initialLocation ?? "draft",
	);
	const [isDirty, setIsDirty] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const [status, setStatus] = useState<SaveStatus>({ type: "idle" });

	// 저장 작업은 비동기로 순서대로 실행되므로 실행 시점의 최신 값을 ref 로 읽는다
	const draftRef = useRef(initialDraft);
	const locationRef = useRef<PostLocation>(initialLocation ?? "draft");
	const savedSlugRef = useRef<string | null>(
		initialLocation ? initialDraft.slug : null,
	);
	/** savedSlugRef 와 같은 값. 렌더에 쓰는 곳(로컬 백업 키)을 위해 state 로도 둔다 */
	const [savedSlug, setSavedSlug] = useState(savedSlugRef.current);
	/** 편집할 때마다 증가. 저장이 끝났을 때 그 사이 편집이 없었는지 판별한다 */
	const versionRef = useRef(0);
	/** 저장·업로드 요청을 직렬화한다. 동시에 나가면 slug 변경(파일 이름 바꾸기)이 꼬인다 */
	const queueRef = useRef<Promise<unknown>>(Promise.resolve());
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const enqueue = useCallback(<T>(task: () => Promise<T>): Promise<T> => {
		const run = queueRef.current.then(task);
		queueRef.current = run.catch(() => undefined);
		return run;
	}, []);

	const updateDraft = useCallback((patch: Partial<EditorDraft>) => {
		draftRef.current = { ...draftRef.current, ...patch };
		versionRef.current += 1;
		setDraft(draftRef.current);
		setIsDirty(true);
	}, []);

	useLocalBackup({
		draft,
		initialDraft,
		savedSlug,
		isDirty,
		onRestore: updateDraft,
	});

	const canSave =
		draft.title.trim() !== "" &&
		SLUG_PATTERN.test(draft.slug) &&
		draft.category !== "";

	// ref 만 읽으므로 참조가 바뀌지 않는다
	const buildInput = useCallback(
		(): ISavePostInput => ({
			...draftRef.current,
			location: locationRef.current,
			savedSlug: savedSlugRef.current,
		}),
		[],
	);

	/** 저장 결과를 에디터 상태에 반영한다 */
	const applySaved = useCallback(
		(result: { slug: string; renamedFrom: string | null }, version: number) => {
			const isFirstSave = savedSlugRef.current === null;
			savedSlugRef.current = result.slug;
			setSavedSlug(result.slug);

			// slug 를 바꿨으면 서버가 파일 안의 미디어 경로를 고쳤으므로 에디터 내용도 같게 맞춘다.
			// 저장 요청 이후에 입력한 내용이 있을 수 있어 응답 본문으로 덮지 않고 현재 값에서 치환한다
			if (result.renamedFrom) {
				const from = `/posts/${result.renamedFrom}/`;
				const to = `/posts/${result.slug}/`;
				draftRef.current = {
					...draftRef.current,
					content: draftRef.current.content.replaceAll(from, to),
					thumbnail: draftRef.current.thumbnail?.replaceAll(from, to) ?? null,
				};
				setDraft(draftRef.current);
			}

			if (versionRef.current === version) setIsDirty(false);

			// 새 글을 처음 저장했거나 slug 가 바뀌면 새로고침해도 이 글이 열리도록 주소를 맞춘다
			if (isFirstSave || result.renamedFrom) {
				window.history.replaceState(null, "", `/post/${result.slug}/update`);
			}
		},
		[],
	);

	/** 현재 내용을 파일에 저장한다 */
	const save = useCallback(
		(options: { summarize?: boolean } = {}) =>
			enqueue(async () => {
				const version = versionRef.current;
				setStatus({ type: "saving" });
				const result = await savePost({ ...buildInput(), ...options });
				if (!result.ok) {
					setStatus({ type: "error", message: result.message });
					return false;
				}
				applySaved(result, version);
				setStatus(
					result.warning
						? { type: "warning", message: result.warning }
						: { type: "saved", at: new Date() },
				);
				return true;
			}),
		[enqueue, buildInput, applySaved],
	);

	// 초안은 입력이 멈추면 자동 저장한다.
	// 공개 글은 파일을 고치는 즉시 다음 배포에 반영될 수 있어 저장 버튼으로만 저장한다
	// biome-ignore lint/correctness/useExhaustiveDependencies: draft 는 입력할 때마다 디바운스 타이머를 다시 거는 트리거로 쓴다
	useEffect(() => {
		if (location !== "draft" || !isDirty || !canSave) return;
		const timer = setTimeout(() => save(), AUTO_SAVE_DEBOUNCE_MS);
		return () => clearTimeout(timer);
	}, [draft, location, isDirty, canSave, save]);

	// 저장하지 않은 변경이 있으면 페이지를 떠나기 전에 확인한다
	useEffect(() => {
		if (!isDirty) return;
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault();
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [isDirty]);

	/** 초안 발행 */
	const publish = async (summarize: boolean) => {
		if (isPending) return;
		setIsPending(true);
		setStatus({ type: "saving" });
		const result = await enqueue(() =>
			publishDraft({ ...buildInput(), summarize }),
		);
		if (!result.ok) {
			setStatus({ type: "error", message: result.message });
			setIsPending(false);
			return;
		}
		setIsDirty(false);
		if (result.warning) window.alert(result.warning);
		router.push(`/post/${result.slug}`);
	};

	/** 공개 글 저장 후 상세 페이지로 이동 */
	const saveAndView = async (summarize: boolean) => {
		if (isPending) return;
		setIsPending(true);
		const isSaved = await save({ summarize });
		if (!isSaved) {
			setIsPending(false);
			return;
		}
		router.push(`/post/${draftRef.current.slug}`);
	};

	/** 공개 글을 초안으로 되돌린다 */
	const unpublish = async () => {
		if (isPending) return;
		if (
			!window.confirm(
				"이 글을 초안으로 되돌릴까요? 커밋·배포하면 사이트에서 내려갑니다.",
			)
		) {
			return;
		}
		setIsPending(true);
		const version = versionRef.current;
		const result = await enqueue(() => unpublishPost(buildInput()));
		setIsPending(false);
		if (!result.ok) {
			setStatus({ type: "error", message: result.message });
			return;
		}
		applySaved(result, version);
		locationRef.current = "draft";
		setLocation("draft");
		setStatus({ type: "warning", message: "초안으로 되돌렸습니다." });
	};

	/** 파일을 글의 미디어 폴더에 올리고 URL 을 돌려준다. 실패하면 null */
	const upload = async (
		file: File,
		kind: "thumbnail" | "body",
	): Promise<string | null> => {
		// 새 글은 파일이 있어야 미디어 폴더 위치가 정해지므로 먼저 저장한다
		if (savedSlugRef.current === null) {
			if (!canSave) {
				setStatus({
					type: "error",
					message: "제목·경로·카테고리를 입력한 뒤 업로드해주세요.",
				});
				return null;
			}
			if (!(await save())) return null;
		}

		return enqueue(async () => {
			const savedSlug = savedSlugRef.current;
			if (!savedSlug) return null;

			const formData = new FormData();
			formData.set("slug", savedSlug);
			formData.set("location", locationRef.current);
			formData.set("kind", kind);
			formData.set("file", file);

			const result = await uploadMedia(formData);
			if (!result.ok) {
				setStatus({ type: "error", message: result.message });
				return null;
			}
			// 아직 저장되지 않은 slug 변경이 있으면 다음 저장 때 서버가 경로를 새 slug 로 고친다
			return result.src;
		});
	};

	/** 커서 위치에 텍스트를 넣는다 (블록 단위라 앞 줄이 끝나지 않았으면 개행을 붙인다) */
	const insertAtCursor = useCallback(
		(text: string) => {
			const textarea = textareaRef.current;
			const content = draftRef.current.content;
			const selectionStart = textarea?.selectionStart ?? content.length;
			const selectionEnd = textarea?.selectionEnd ?? content.length;

			const before = content.slice(0, selectionStart);
			const after = content.slice(selectionEnd);
			const needsNewline = before.length > 0 && !before.endsWith("\n");
			const inserted = (needsNewline ? "\n" : "") + text;

			updateDraft({ content: before + inserted + after });

			const nextCursor = selectionStart + inserted.length;
			setTimeout(() => {
				if (!textarea) return;
				textarea.selectionStart = textarea.selectionEnd = nextCursor;
				textarea.focus();
			}, 0);
		},
		[updateDraft],
	);

	return {
		draft,
		location,
		isDirty,
		isPending,
		status,
		canSave,
		textareaRef,
		updateDraft,
		save,
		publish,
		saveAndView,
		unpublish,
		upload,
		insertAtCursor,
	};
};

export type IUsePostEditorReturn = ReturnType<typeof usePostEditor>;
