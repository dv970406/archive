import { Github, Mail } from "lucide-react";
import Link from "next/link";
import type { Person, ProfilePage, WithContext } from "schema-dts";
import { Card } from "@/components/ui/card";
import JsonLdProvider from "@/provider/jsonld-provider";

// 커리어 데이터
const careerData = {
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

const CareerPage = () => {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

	const personJsonLd: WithContext<Person> = {
		"@context": "https://schema.org",
		"@type": "Person",
		"@id": `${siteUrl}/career#person`,
		name: careerData.name,
		alternateName: "dv970406",
		url: siteUrl,
		email: careerData.email,
		jobTitle: careerData.position,
		description: careerData.title,
		sameAs: [careerData.github],
		worksFor: {
			"@type": "Organization",
			name: "아하",
			description: "MAU 1200만, DAU 70만의 커뮤니티 서비스",
		},
		knowsAbout: [
			"Frontend Development",
			"React",
			"Next.js",
			"TypeScript",
			"Web Performance Optimization",
			"SEO",
		],
		alumniOf: careerData.experiences.map((exp) => ({
			"@type": "Organization" as const,
			name: exp.company,
			description: exp.description,
		})),
	};

	const profilePageJsonLd: WithContext<ProfilePage> = {
		"@context": "https://schema.org",
		"@type": "ProfilePage",
		"@id": `${siteUrl}/career#profilepage`,
		url: `${siteUrl}/career`,
		name: `${careerData.name} - ${careerData.position}`,
		description: careerData.title,
		dateCreated: "2022-06-01",
		dateModified: "2023-09-11",
		mainEntity: {
			"@type": "Person",
			"@id": `${siteUrl}/career#person`,
		},
		isPartOf: {
			"@type": "WebSite",
			"@id": `${siteUrl}/#website`,
			name: "최성준 아카이브",
			url: siteUrl,
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "홈",
					item: siteUrl,
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "경력",
					item: `${siteUrl}/career`,
				},
			],
		},
		inLanguage: "ko-KR",
	};
	return (
		<JsonLdProvider jsonLd={personJsonLd}>
			<JsonLdProvider jsonLd={profilePageJsonLd}>
				{/* 프로필 섹션 */}
				<section className="mb-16">
					<div className="flex flex-col md:flex-row gap-8">
						<div className="w-32 h-32 bg-linear-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center">
							<span className="text-5xl font-bold text-primary-foreground">
								{"D"}
							</span>
						</div>

						<div>
							<p className="text-4xl font-bold mb-2">{careerData.name}</p>
							<p className="text-xl text-muted-foreground mb-4">
								{careerData.position}
							</p>
							<h1 className="mb-6 font-semibold">{careerData.title}</h1>

							<div className="flex flex-wrap gap-4">
								<a
									href={`mailto:${careerData.email}`}
									className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									<Mail className="w-4 h-4" />
									{careerData.email}
								</a>
								<a
									href={careerData.github}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									<Github className="w-4 h-4" />
									GitHub
								</a>
							</div>
						</div>
					</div>
				</section>

				{/* 경력 섹션 */}
				<section>
					<h2 className="text-2xl font-bold mb-6">Work Experience</h2>
					<div className="space-y-8">
						{careerData.experiences.map((exp) => (
							<Card key={exp.company} className="p-6">
								<div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
									<div>
										<h3 className="text-xl font-semibold">{exp.company}</h3>
										<p className="text-primary font-medium">{exp.position}</p>
									</div>
									<span className="text-sm text-muted-foreground mt-2 md:mt-0">
										{exp.period}
									</span>
								</div>
								<p className="text-muted-foreground mb-4">{exp.description}</p>
								<ul className="space-y-4">
									{exp.achievements.map((achievement) => (
										<li key={achievement}>
											<Link className="flex gap-2 text-sm group" href={""}>
												<span className="text-primary">•</span>
												<span className="group-hover:text-primary transition-colors">
													{achievement}
												</span>
											</Link>
										</li>
									))}
								</ul>
							</Card>
						))}
					</div>
				</section>
			</JsonLdProvider>
		</JsonLdProvider>
	);
};

export default CareerPage;
