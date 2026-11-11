// YYYY-MM-DD 형태로 출력하는 로케일(en-CA)을 한국 시간대로 고정한다
const seoulDateFormatter = new Intl.DateTimeFormat("en-CA", {
	timeZone: "Asia/Seoul",
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
});

/** 한국 시간 기준 YYYY.MM.DD */
const formatDateInSeoul = (date: Date) =>
	seoulDateFormatter.format(date).replaceAll("-", ".");

export const formatTimeAgo = (time: Date | string | number) => {
	const start = new Date(time);
	const end = new Date();

	// 초 단위 시간차이 구하기
	const secondDiff = Math.floor((end.getTime() - start.getTime()) / 1000);
	if (secondDiff < 60) {
		return "방금 전";
	}

	const minuteDiff = Math.floor(secondDiff / 60);
	if (minuteDiff < 60) {
		return `${minuteDiff}분 전`;
	}

	const hourDiff = Math.floor(minuteDiff / 60);
	if (hourDiff < 24) {
		return `${hourDiff}시간 전`;
	}

	const dayDiff = Math.floor(hourDiff / 24);
	if (dayDiff < 7) {
		return `${dayDiff}일 전`;
	}

	// "몇 달 전" 같은 상대적 시간 표시에서는 28~31일 중 택일을 해야할 만큼 정밀한 정확도가 필요하지 않아서 30일 근사치를 사용
	const monthDiff = Math.floor(dayDiff / 30);

	// monthDiff < 1 (dayDiff < 30) 이면 주 단위로 표시 → weekDiff는 최소 1 보장
	const weekDiff = Math.floor(dayDiff / 7);
	if (monthDiff < 1) {
		return `${weekDiff}주 전`;
	}

	if (monthDiff < 3) {
		return `${monthDiff}달 전`;
	}

	// 3달 이상이면 YYYY.MM.DD 포맷으로 표시
	// 빌드 서버·브라우저의 타임존과 무관하게 같은 문자열이 나오도록 한국 시간 기준으로 고정한다
	return formatDateInSeoul(start);
};
