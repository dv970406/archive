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

export interface OtherItem {
	text: string;
	url?: string;
}

interface CareerData {
	name: string;
	position: string;
	title: string;
	email: string;
	github: string;
	experiences: Experience[];
	others: OtherItem[];
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
					text: "유니티-웹 간 통신 레이어 제거를 통해 가독성 개선 및 유지보수성 향상",
					details: [
						{
							text: "As Is: iframe 내부에 3D 렌더링 → 인터랙션 → Unity 커맨드 → iframe 외부에 메시지 전달 → Widget에 표시",
						},
						{
							text: "To Be: 3D 렌더링 → 인터랙션 → Unity 커맨드 → Widget에 표시",
						},
						{
							text: "위 iframe 레이어 제거 작업으로 약 1,200줄의 코드를 삭제",
						},
					],
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
							text: "피드 페이지 무한 스크롤 성능 최적화: 메모리 220MB → 80MB, CPU 100% → 20%로 감소",
							url: "https://www.choiseongjun.com/post/feed-performance-improvement-story",
						},
						{
							text: "질문상세 페이지에서 SSR 시 하이드레이션되고 있는 데이터를 최적화하여 문서크기 10KB 감소",
						},
						{
							text: "서비스 내 주요 비즈니스 데이터 탐색 로직에서 O(n)이 걸리던 부분을 O(1)로 자료구조 개선",
						},
					],
				},
				{
					text: "SEO 개선 주도",
					details: [
						{
							text: "재직 기간 중 회사 웹 MAU 1,200만 달성 (SEO 개선이 한 축으로 기여)",
						},
						{
							text: "기획/디자인 단계부터 SEO 관점 도입 — 페이지 구성에 내부링크 영역 강화를 제안하여 반영",
						},
						{
							text: "리스트 페이지를 페이지별 인덱싱 가능하도록 개선하여 검색엔진 크롤링 커버리지 확대",
						},
					],
				},
				{
					text: "서비스 특성을 고려하여 웹 MFA(Micro Frontend Architecture) 인프라를 모놀리식으로 재설계",
					details: [
						{
							text: "서버 비용 연간 최소 1,000만원 절감 (AWS Calculator 기준, 실제 절감액은 그 이상)",
						},
						{
							text: "빌드 시간 14분 → 3분으로 감소",
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
					text: "사내 기술 세미나 발표",
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
					text: "AI 에이전트(Claude Code Skills) 기반 반복 업무 자동화",
					details: [
						{
							text: "PR 생성 및 PR 리뷰 등 반복적 워크플로우를 자동화하여 협업 피로 감소 및 리뷰 퀄리티 향상",
						},
						{
							text: "피그마 MCP를 통한 에셋 업로드 자동화 및 에이전트의 분석/계획 단계 퀄리티 강화 (진행중)",
						},
					],
				},
				{
					text: "타 직군 협업 효율화 — 운영팀 자가서비스 도구 구축",
					details: [
						{
							text: "AWS S3 기반 피처플래그 시스템 구현 — 소스코드 배포 없이 운영팀이 백오피스에서 주요 운영 설정을 즉시 반영 가능",
						},
					],
				},
			],
		},
	],
	others: [
		{
			text: "리눅스마스터 1급 자격증(KAIT 주관)",
			url: "https://www.ihd.or.kr/introducesubject1.do",
		},
		{
			text: "2025년 회사 핵심가치를 이행한 우수사원 수상",
		},
	],
};
