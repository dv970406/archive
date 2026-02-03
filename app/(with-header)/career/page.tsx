import { Github, Mail } from "lucide-react";
import Link from "next/link";
import type { Person, ProfilePage, WithContext } from "schema-dts";
import { careerData } from "@/api/career";
import { Card } from "@/components/ui/card";
import JsonLdProvider from "@/provider/jsonld-provider";

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
		dateCreated: new Date("2022-06-01").toISOString(),
		dateModified: new Date("2023-09-11").toISOString(),
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
