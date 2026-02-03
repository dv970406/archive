// 커리어 데이터
// ! API로 가져오진 않으나 데이터가 저장된 곳을 액세스한다는 의미에서 api 디렉토리에 포함시켜둠
export const careerData = {
	name: "최성준",
	position: "프론트엔드 엔지니어",
	title:
		"속도를 최고 가치로 두고, 빠른 유저 경험을 최우선으로 하는 개발자입니다.",
	email: "dv970406@gmail.com",
	github: "https://github.com/dv970406",
	experiences: [
		{
			company: "팀솔루션",
			position: "프론트엔드 엔지니어",
			period: "2022.06 - 2023.06",
			startDate: "2022-06-01",
			endDate: "2023-06-30",
			description:
				"3D 디지털트윈 기술로 산업현장을 데이터화하여 시각적으로 표현하는 기업",
			achievements: [
				"불필요한 통신 레이어를 제거하여 코드 최적화 및 통신 속도 개선",
			],
		},
		{
			company: "아하",
			position: "프론트엔드 엔지니어",
			period: "2023.09 - 현재",
			startDate: "2023-09-11",
			description: "MAU 1200만, DAU 70만의 커뮤니티 서비스",
			achievements: [
				"피드 페이지 메모이징 적용으로 메모리 사용량 대폭 개선",
				"기존 MFA의 구조를 개선하여 서버 비용 최적화",
				"주요 페이지 크기 최적화",
				"SEO 지표 상승 기여 및 리치 스니펫 노출 확대",
				"서비스의 코어 로직을 개선하여 검색 컴퓨팅 시간 개선",
				"사내 세미나 진행",
			],
		},
	],
	// projects: [
	//   {
	//     name: "개발자 블로그 플랫폼",
	//     description: "Next.js와 MDX를 활용한 개인 블로그 시스템",
	//     tech: ["Next.js", "TypeScript", "MDX", "Tailwind CSS"],
	//     link: "github.com/project1",
	//   },
	// ],
};
