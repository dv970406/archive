import { Github, Globe, Linkedin, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// 커리어 데이터
const careerData = {
  name: "최성준",
  position: "Frontend Developer",
  title:
    "속도를 최고 가치로 두고, 빠른 유저 경험을 최우선으로 하는 개발자입니다.",
  email: "dv970406@gmail.com",
  github: "https://github.com/dv970406",
  experiences: [
    {
      company: "팀솔루션",
      position: "Frontend Developer",
      period: "2022.06 - 2023.06",
      description:
        "3D 디지털트윈 기술로 산업현장을 데이터화하여 시각적으로 표현하는 기업",
      achievements: ["", "", ""],
    },
    {
      company: "아하",
      position: "Frontend Developer",
      period: "2023.09 - 현재",
      description: "MAU, 트래픽",
      achievements: ["", "", ""],
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
  return (
    <>
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
            <h1 className="mb-6 text-lg font-semibold">{careerData.title}</h1>

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
          {careerData.experiences.map((exp, index) => (
            <Card key={index} className="p-6">
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
                {exp.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <span className="text-primary">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default CareerPage;
