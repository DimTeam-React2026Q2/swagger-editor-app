import { ReactElement } from "react";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";

interface TeamMember {
  nameKey: string;
  roleKey: string;
  githubUrl: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    nameKey: "team.marina.name",
    roleKey: "team.marina.role",
    githubUrl: "https://github.com",
  },
  {
    nameKey: "team.mark.name",
    roleKey: "team.mark.role",
    githubUrl: "https://github.com",
  },
  {
    nameKey: "team.dima.name",
    roleKey: "team.dima.role",
    githubUrl: "https://github.com",
  },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<ReactElement> {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations("About");

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 font-sans sm:px-6 lg:px-8 dark:bg-zinc-950">
      <div className="animate-fade-in mx-auto max-w-4xl space-y-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-500 dark:text-zinc-400">
            {t("description")}
          </p>
        </div>

        <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center space-y-0 space-x-3 pb-2">
            <GraduationCap className="h-6 w-6 text-emerald-500" />
            <CardTitle className="text-xl">{t("course.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {t("course.description")}
            </p>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {t("course.descriptionSecondary")}
            </p>
            <a
              href="https://rs.school"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
            >
              {t("course.linkLabel")} &rarr;
            </a>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 px-1 text-zinc-700 dark:text-zinc-300">
            <Users className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-semibold tracking-tight">
              {t("team.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TEAM_MEMBERS.map((member) => (
              <Card
                key={member.nameKey}
                className="flex h-full flex-col border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <CardHeader className="flex-1 pb-3">
                  <CardTitle className="text-base font-semibold">
                    {t(member.nameKey)}
                  </CardTitle>
                  <CardDescription className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {t(member.roleKey)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto">
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-500 hover:text-zinc-900"
                  >
                    {t("team.githubLabel")}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
