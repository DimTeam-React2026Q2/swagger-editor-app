import { ReactElement } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  githubUrl: string;
}

export default function AboutPage(): ReactElement {
  const team: TeamMember[] = [
    {
      name: "Maryna (Team Lead)",
      role: "Core Architecture & Documentation Viewer",
      githubUrl: "https://github.com",
    },
    {
      name: "Mark",
      role: "Swagger Live Editor & Authentication",
      githubUrl: "https://github.com",
    },
    {
      name: "Dima",
      role: "Interactive REST Client & History Service",
      githubUrl: "https://github.com",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 font-sans sm:px-6 lg:px-8 dark:bg-zinc-950">
      <div className="animate-fade-in mx-auto max-w-4xl space-y-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            About Our Team
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-500 dark:text-zinc-400">
            Welcome to our Swagger Client application page. This project was
            built by dedicated students during the React course.
          </p>
        </div>

        <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center space-y-0 space-x-3 pb-2">
            <GraduationCap className="h-6 w-6 text-emerald-500" />
            <CardTitle className="text-xl">RS School React Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              The Rolling Scopes School is a free, community-driven educational
              initiative. This application serves as a final project
              demonstrating skills in Next.js, TypeScript, and modern frontend
              architecture.
            </p>
            <div className="pt-2">
              <a
                href="https://rs.school"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-500"
              >
                Learn more about RS School &rarr;
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 px-1 text-zinc-700 dark:text-zinc-300">
            <Users className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-semibold tracking-tight">
              Meet the Developers
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {team.map(
              (member: TeamMember): ReactElement => (
                <Card
                  key={member.githubUrl}
                  className="border-zinc-200 bg-white transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4 fill-current"
                        viewBox="0 0 16 16"
                        version="1.1"
                      >
                        <path d="M8 0c4.42 0 8 3.58 8 8 0 3.54-2.29 6.53-5.47 7.59-.4.07-.55-.17-.55-.38 0-.19.01-.82.01-1.49 2.01.37 2.53-.49 2.69-.94.09-.23.48-.94.82-1.13.28-.15.68-.52.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                      <span>GitHub Profile</span>
                    </a>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
