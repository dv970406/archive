// 커리어 데이터
// ! API로 가져오진 않으나 데이터가 저장된 곳을 액세스한다는 의미에서 api 디렉토리에 포함시켜둠

// 링크가 포함된 성과 항목 타입
export interface LinkedText {
	text: string;
	links?: { text: string; url: string }[];
}

export interface DetailItem {
	text: string;
	url?: string;
}

export interface Achievement extends LinkedText {
	details?: DetailItem[];
}

interface Experience {
	company: string;
	position: string;
	period: string;
	startDate: string;
	endDate?: string;
	description: string;
	achievements: Achievement[];
}

interface CareerData {
	name: string;
	position: string;
	title: string;
	email: string;
	github: string;
	experiences: Experience[];
}

export const careerData: CareerData = {
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
				{
					text: "불필요한 통신 레이어를 제거하여 코드 최적화 및 통신 속도 개선",
				},
			],
		},
		{
			company: "아하",
			position: "프론트엔드 엔지니어",
			period: "2023.09 - 현재",
			startDate: "2023-09-11",
			description: "MAU 1200만, DAU 70만의 커뮤니티 서비스",
			achievements: [
				{
					text: "서비스 내 주요 페이지 성능 개선",
					details: [
						{
							text: "피드 페이지 메모이징 적용으로 인피니티 스크롤 시 발생하던 불필요한 리렌더링 제거하여 브라우저 메모리 사용량 최대 100MB 감소",
						},
						{
							text: "250개 가량의 불필요한 데이터가 질문상세 페이지에 하이드레이션되고 있던 부분을 개선하여 문서크기 10KB 감소",
						},
						{
							text: "서비스 내 주요 비즈니스 데이터 탐색 로직에서 O(n)이 걸리던 부분을 O(1)로 자료구조 개선",
						},
					],
				},
				{
					text: "SEO 지표 상승 기여",
					details: [
						{
							text: "구글 애널리틱스 기준 웹 MAU 1200만 달성",
						},
						{
							text: "기획/디자인 시 SEO 순위에 이점이 있도록 페이지 구성 시 내부링크 영역 강화 건의",
						},
						{
							text: "리스트 페이지를 페이지별로 인덱싱되게끔 수정하여 검색엔진이 사이트 내 페이지를 더 많이 크롤링할 수 있도록 수정",
						},
					],
				},
				{
					text: "서비스 특징을 고려하여 웹 MFA 인프라 구조를 모놀리식으로 수정",
					details: [
						{
							text: "서버 비용(AWS Calculator 기준) 연간 최소 1000만원 절감 + @",
						},
						{
							text: "빌드시간 기존 14분에서 3분으로 감소",
						},
					],
				},
				{
					text: "프론트엔드 기술적 주도",
					details: [
						{
							text: "app router 전환을 위한 디자인 툴 마이그레이션 (emotion -> tailwindcss)",
						},
						{
							text: "나뉘어 있던 모달/팝업 로직을 공통화하여 유지보수성 향상 및 DX 향상",
						},
						{
							text: "pages router -> app router 마이그레이션을 통해 캐싱 전략 개선 (진행중)",
						},
					],
				},
				{
					text: "사내 세미나 진행",
					details: [
						{
							text: "유료 콘텐츠 SEO 핸들링",
							url: "https://a-ha.atlassian.net/wiki/external/ZjE3ZjBjM2FjZWUwNDI1N2EwZTI3MjdhZjI5NjExNDE",
						},
						{
							text: "웹서버 비용 최적화",
							url: "https://a-ha.atlassian.net/wiki/external/ZDc3Zjg4MTEyY2RhNDdjYWJiODczNTZlNDU1MTNiY2I",
						},
						{
							text: "전문가 대시보드로 인한 인프라 구조 변경 및 SEO 전략",
							url: "https://a-ha.atlassian.net/wiki/external/NGViMWMxNTVlNDcxNDEzNjg2NzA4ODAxM2FiZjg1OTg",
						},
					],
				},
				{
					text: "AI 에이전트 SKILL로 반복업무 자동화",
					details: [
						{
							text: "PR 생성 및 PR 리뷰 등 반복적 워크플로우를 자동화하여 협업 피로 감소 및 리뷰 퀄리티 향상",
						},
						{
							text: "피그마 MCP를 통한 에셋 업로드 자동화 및 에이전트의 분석/계획 단계의 퀄리티 강화 (진행중)",
						},
					],
				},
				{
					text: "타 챕터의 편의를 위한 협업 툴 개선",
					details: [
						{
							text: "소스코드 배포 없이 오퍼레이션 팀이 백오피스에서 서비스 주요 운영 설정을 즉시 반영할 수 있도록 AWS S3 기반 피처플래그 시스템 구현",
						},
					],
				},
			],
		},
	],
};
