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

	// "몇 주 전" 도 몇 달 전과 마찬가지로 4주를 근사치로 잡는다.
	const weekDiff = Math.floor(dayDiff / 7);
	if (weekDiff < 4) {
		return `${weekDiff}주 전`;
	}

	// "몇 달 전" 같은 상대적 시간 표시에서는 28~31일 중 택일을 해야할 만큼 정밀한 정확도가 필요하지 않아서 30일 근사치를 사용
	const monthDiff = Math.floor(dayDiff / 30);
	if (monthDiff < 3) {
		return `${monthDiff}달 전`;
	}

	// 3달 이상이면 YYYY.MM.DD 포맷으로 표시
	const year = start.getFullYear();
	const month = String(start.getMonth() + 1).padStart(2, "0");
	const day = String(start.getDate()).padStart(2, "0");
	return `${year}.${month}.${day}`;
};
