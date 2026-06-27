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

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Maryna (Team Lead)",
    role: "Core Architecture & Documentation Viewer",
    githubUrl: "https://github.com/dromari",
  },
  {
    name: "Mark",
    role: "Swagger Live Editor & Authentication",
    githubUrl: "https://github.com/mark-pribylnov",
  },
  {
    name: "Dima",
    role: "Interactive REST Client & History Service",
    githubUrl: "https://github.com/karpovdmitriy",
  },
];

export default function AboutPage(): ReactElement {
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
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              The RS School React course is a free, comprehensive online
              training program designed for students with solid foundational
              skills in Core JavaScript, TypeScript, HTML5, and CSS3. The
              curriculum covers everything from initial project setup and
              testing fundamentals to modern state management, data fetching,
              performance optimization, and Next.js. All study materials are
              fully open and publicly available on GitHub and YouTube.
            </p>

            <div className="pt-2">
              <a
                href="https://rs.school/courses/reactjs"
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
            {TEAM_MEMBERS.map(
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
                        viewBox="0 0 26 26"
                        version="1.1"
                        fill="#000000"
                      >
                        <path d="m12.301 0h.093c2.242 0 4.34.613 6.137 1.68l-.055-.031c1.871 1.094 3.386 2.609 4.449 4.422l.031.058c1.04 1.769 1.654 3.896 1.654 6.166 0 5.406-3.483 10-8.327 11.658l-.087.026c-.063.02-.135.031-.209.031-.162 0-.312-.054-.433-.144l.002.001c-.128-.115-.208-.281-.208-.466 0-.005 0-.01 0-.014v.001q0-.048.008-1.226t.008-2.154c.007-.075.011-.161.011-.249 0-.792-.323-1.508-.844-2.025.618-.061 1.176-.163 1.718-.305l-.076.017c.573-.16 1.073-.373 1.537-.642l-.031.017c.508-.28.938-.636 1.292-1.058l.006-.007c.372-.476.663-1.036.84-1.645l.009-.035c.209-.683.329-1.468.329-2.281 0-.045 0-.091-.001-.136v.007c0-.022.001-.047.001-.072 0-1.248-.482-2.383-1.269-3.23l.003.003c.168-.44.265-.948.265-1.479 0-.649-.145-1.263-.404-1.814l.011.026c-.115-.022-.246-.035-.381-.035-.334 0-.649.078-.929.216l.012-.005c-.568.21-1.054.448-1.512.726l.038-.022-.609.384c-.922-.264-1.981-.416-3.075-.416s-2.153.152-3.157.436l.081-.02q-.256-.176-.681-.433c-.373-.214-.814-.421-1.272-.595l-.066-.022c-.293-.154-.64-.244-1.009-.244-.124 0-.246.01-.364.03l.013-.002c-.248.524-.393 1.139-.393 1.788 0 .531.097 1.04.275 1.509l-.01-.029c-.785.844-1.266 1.979-1.266 3.227 0 .025 0 .051.001.076v-.004c-.001.039-.001.084-.001.13 0 .809.12 1.591.344 2.327l-.015-.057c.189.643.476 1.202.85 1.693l-.009-.013c.354.435.782.793 1.267 1.062l.022.011c.432.252.933.465 1.46.614l.046.011c.466.125 1.024.227 1.595.284l.046.004c-.431.428-.718 1-.784 1.638l-.001.012c-.207.101-.448.183-.699.236l-.021.004c-.256.051-.549.08-.85.08-.022 0-.044 0-.066 0h.003c-.394-.008-.756-.136-1.055-.348l.006.004c-.371-.259-.671-.595-.881-.986l-.007-.015c-.198-.336-.459-.614-.768-.827l-.009-.006c-.225-.169-.49-.301-.776-.38l-.016-.004-.32-.048c-.023-.002-.05-.003-.077-.003-.14 0-.273.028-.394.077l.007-.003q-.128.072-.08.184c.039.086.087.16.145.225l-.001-.001c.061.072.13.135.205.19l.003.002.112.08c.283.148.516.354.693.603l.004.006c.191.237.359.505.494.792l.01.024.16.368c.135.402.38.738.7.981l.005.004c.3.234.662.402 1.057.478l.016.002c.33.064.714.104 1.106.112h.007c.045.002.097.002.15.002.261 0 .517-.021.767-.062l-.027.004.368-.064q0 .609.008 1.418t.008.873v.014c0 .185-.08.351-.208.466h-.001c-.119.089-.268.143-.431.143-.075 0-.147-.011-.214-.032l.005.001c-4.929-1.689-8.409-6.283-8.409-11.69 0-2.268.612-4.393 1.681-6.219l-.032.058c1.094-1.871 2.609-3.386 4.422-4.449l.058-.031c1.739-1.034 3.835-1.645 6.073-1.645h.098-.005zm-7.64 17.666q.048-.112-.112-.192-.16-.048-.208.032-.048.112.112.192.144.096.208-.032zm.497.545q.112-.08-.032-.256-.16-.144-.256-.048-.112.08.032.256.159.157.256.047zm.48.72q.144-.112 0-.304-.128-.208-.272-.096-.144.08 0 .288t.272.112zm.672.673q.128-.128-.064-.304-.192-.192-.32-.048-.144.128.064.304.192.192.32.044zm.913.4q.048-.176-.208-.256-.24-.064-.304.112t.208.24q.24.097.304-.096zm1.009.08q0-.208-.272-.176-.256 0-.256.176 0 .208.272.176.256.001.256-.175zm.929-.16q-.032-.176-.288-.144-.256.048-.224.24t.288.128.225-.224z" />
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
