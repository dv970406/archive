import { useDraftAutoSaver } from "./use-draft-auto-saver";
import { useDraftLoader } from "./use-draft-loader";

/**
 * 드래프트 관리 통합 훅
 * - useDraftLoader: 기존 드래프트 로드 또는 새 드래프트 생성
 * - useDraftAutoSaver: 입력 변화 감지 시 디바운스 저장
 */
export const useSavedPostDraft = () => {
	// 드래프트 로드/생성이 먼저 실행되어야 postId가 설정됨
	useDraftLoader();
	// postId가 없으면 자동 저장이 스킵되므로 순서 안전
	useDraftAutoSaver();
};

export type IUseSavedPostDraftReturn = ReturnType<typeof useSavedPostDraft>;
