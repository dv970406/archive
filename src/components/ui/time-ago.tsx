"use client";

import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/lib/utils/time";

interface ITimeAgoProps {
	/** ISO 8601 */
	dateTime: string;
	/** 서버가 렌더 시점에 계산한 라벨 */
	initialLabel: string;
}

/**
 * 상대 시간("3일 전") 표시
 *
 * 모든 페이지가 빌드 시점에 정적으로 생성되므로 서버가 만든 라벨은 빌드 시각 기준이다.
 * 하이드레이션 불일치를 피하기 위해 먼저 서버 라벨을 그대로 그리고,
 * 마운트 후 현재 시각 기준으로 다시 계산해 갱신한다.
 */
const TimeAgo = ({ dateTime, initialLabel }: ITimeAgoProps) => {
	const [label, setLabel] = useState(initialLabel);

	useEffect(() => {
		setLabel(formatTimeAgo(dateTime));
	}, [dateTime]);

	return <time dateTime={dateTime}>{label}</time>;
};

export default TimeAgo;
