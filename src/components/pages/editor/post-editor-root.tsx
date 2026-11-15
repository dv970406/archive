"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMediaUploader } from "@/hooks/editor/use-media-uploader";
import { type SaveStatus, usePostEditor } from "@/hooks/editor/use-post-editor";
import type { PostLocation } from "@/lib/content/post-files";
import type { EditorDraft, EditorTab } from "@/lib/editor/types";
import { cn } from "@/lib/style/tailwind";
import type { Category } from "@/types/post";
import MdxPreview from "./mdx-preview";
import MdxToolbar from "./mdx-toolbar";
import ThumbnailField from "./thumbnail-field";

interface IPostEditorRootProps {
	initialDraft: EditorDraft;
	/** 파일 위치. 새 글이면 null */
	initialLocation: PostLocation | null;
	categories: Category[];
	/** 불러올 수 있는 초안 목록 (새 글 작성 화면에서만) */
	drafts?: { slug: string; title: string }[];
}

const TABS: { value: EditorTab; label: string }[] = [
	{ value: "write", label: "작성" },
	{ value: "split", label: "분할" },
	{ value: "preview", label: "미리보기" },
];

const inputClassName =
	"h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-input/30";

/**
 * 개발 서버 전용 MDX 에디터.
 * 초안(content/drafts)은 입력이 멈추면 자동 저장되고, 공개 글(content/posts)은 저장 버튼으로 저장한다.
 * 파일에 쓰기만 하므로 배포하려면 변경 사항을 커밋/푸시한다
 */
const PostEditorRoot = ({
	initialDraft,
	initialLocation,
	categories,
	drafts = [],
}: IPostEditorRootProps) => {
	const router = useRouter();
	const editor = usePostEditor({ initialDraft, initialLocation });
	const { draft, location, isPending, updateDraft } = editor;

	const { isUploading, uploadError, handleDragOver, handleDrop, handlePaste } =
		useMediaUploader(editor);

	const [tab, setTab] = useState<EditorTab>("split");
	const isDraft = location === "draft";
	// 발행할 때는 요약을 새로 만들고, 공개 글을 고칠 때는 오탈자 수정처럼 요약이 필요 없는 경우가 많아 기본으로 끈다
	const [summarize, setSummarize] = useState(isDraft);

	return (
		<div className="flex flex-col h-screen">
			{/* 헤더 */}
			<div className="border-b px-6 py-3">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex items-center gap-4">
						<Link
							href="/"
							className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
						>
							<ArrowLeft className="w-4 h-4" />
							목록
						</Link>
						<h1 className="font-semibold">
							MDX 에디터
							<span className="ml-2 text-xs font-normal text-muted-foreground">
								{isDraft ? "초안 · content/drafts" : "공개 글 · content/posts"}
							</span>
						</h1>
						{drafts.length > 0 && (
							<select
								aria-label="초안 불러오기"
								value=""
								onChange={(event) =>
									router.push(`/post/${event.currentTarget.value}/update`)
								}
								className="h-8 rounded-md border bg-background px-2 text-sm dark:bg-input/30"
							>
								<option value="" disabled>
									초안 불러오기 ({drafts.length})
								</option>
								{drafts.map((item) => (
									<option key={item.slug} value={item.slug}>
										{item.title}
									</option>
								))}
							</select>
						)}
					</div>

					<div className="flex items-center gap-3">
						<StatusLabel
							status={editor.status}
							isUploading={isUploading}
							uploadError={uploadError}
							hint={
								isDraft && editor.isDirty && !editor.canSave
									? "제목·경로·카테고리를 입력하면 자동 저장됩니다"
									: !isDraft && editor.isDirty
										? "저장하지 않은 변경이 있습니다"
										: null
							}
						/>

						<div className="flex rounded-lg p-1">
							{TABS.map(({ value, label }) => (
								<button
									key={value}
									type="button"
									onClick={() => setTab(value)}
									className={cn(
										"px-3 py-1.5 rounded-md text-sm transition-colors text-muted-foreground",
										tab === value && "bg-accent text-foreground",
									)}
								>
									{label}
								</button>
							))}
						</div>

						<label className="flex items-center gap-1.5 text-sm text-muted-foreground">
							<input
								type="checkbox"
								checked={summarize}
								onChange={(event) => setSummarize(event.currentTarget.checked)}
							/>
							AI 요약
						</label>

						{isDraft ? (
							<Button
								type="button"
								onClick={() => editor.publish(summarize)}
								disabled={isPending || isUploading || !editor.canSave}
							>
								{isPending ? "발행 중..." : "발행"}
							</Button>
						) : (
							<>
								<Button
									type="button"
									variant="outline"
									onClick={editor.unpublish}
									disabled={isPending || isUploading}
								>
									숨기기
								</Button>
								<Button
									type="button"
									onClick={() => editor.saveAndView(summarize)}
									disabled={isPending || isUploading || !editor.canSave}
								>
									{isPending ? "저장 중..." : "저장"}
								</Button>
							</>
						)}
					</div>
				</div>
			</div>

			{/* 에디터 영역 */}
			<div
				className={cn("flex-1 flex overflow-hidden", {
					"divide-x": tab === "split",
				})}
			>
				{tab !== "preview" && (
					<div className="flex-1 flex flex-col min-w-0">
						<div className="px-6 py-3 border-b flex flex-col gap-3">
							<div className="flex gap-2">
								<input
									value={draft.title}
									onChange={(event) =>
										updateDraft({ title: event.currentTarget.value })
									}
									className={inputClassName}
									placeholder="제목을 입력해주세요."
								/>
								<input
									value={draft.slug}
									onChange={(event) =>
										updateDraft({ slug: event.currentTarget.value })
									}
									className={inputClassName}
									placeholder="경로(slug) 예) my-first-post"
									aria-invalid={
										draft.slug !== "" && !/^[a-z0-9-]+$/.test(draft.slug)
									}
								/>
							</div>

							<div className="flex items-center gap-2">
								<select
									aria-label="카테고리"
									value={draft.category}
									onChange={(event) =>
										updateDraft({ category: event.currentTarget.value })
									}
									className="h-9 rounded-md border bg-background px-2 text-sm dark:bg-input/30"
								>
									{categories.map((category) => (
										<option key={category.pathname} value={category.pathname}>
											{category.title}
										</option>
									))}
								</select>
								<ThumbnailField
									thumbnail={draft.thumbnail}
									onChange={(thumbnail) => updateDraft({ thumbnail })}
									upload={editor.upload}
									disabled={isPending}
								/>
							</div>
						</div>

						<textarea
							ref={editor.textareaRef}
							disabled={isPending}
							value={draft.content}
							onChange={(event) =>
								updateDraft({ content: event.currentTarget.value })
							}
							onDragOver={handleDragOver}
							onDrop={handleDrop}
							onPaste={handlePaste}
							className="w-full p-6 flex-1 resize-none outline-none bg-transparent font-mono text-sm disabled:opacity-60"
							placeholder="여기에 MDX를 작성하세요... (이미지·영상은 드래그 또는 붙여넣기로 업로드)"
						/>
					</div>
				)}

				{tab !== "write" && (
					<MdxPreview
						content={draft.content}
						onContentChange={(content) => updateDraft({ content })}
					/>
				)}
			</div>

			<MdxToolbar onInsert={editor.insertAtCursor} />
		</div>
	);
};

interface IStatusLabelProps {
	status: SaveStatus;
	isUploading: boolean;
	uploadError: string | null;
	hint: string | null;
}

const StatusLabel = ({
	status,
	isUploading,
	uploadError,
	hint,
}: IStatusLabelProps) => {
	if (isUploading) {
		return <span className="text-sm text-muted-foreground">업로드 중...</span>;
	}
	if (uploadError) {
		return <span className="text-sm text-destructive">{uploadError}</span>;
	}
	if (status.type === "error") {
		return <span className="text-sm text-destructive">{status.message}</span>;
	}
	if (status.type === "warning") {
		return <span className="text-sm text-amber-500">{status.message}</span>;
	}
	if (hint) {
		return <span className="text-sm text-muted-foreground">{hint}</span>;
	}
	if (status.type === "saving") {
		return <span className="text-sm text-muted-foreground">저장 중...</span>;
	}
	if (status.type === "saved") {
		return (
			<span className="text-sm text-muted-foreground">
				{status.at.toLocaleTimeString("ko-KR", {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				})}{" "}
				저장됨
			</span>
		);
	}
	return null;
};

export default PostEditorRoot;
