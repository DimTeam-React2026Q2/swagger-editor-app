import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  isLoggedin: boolean;
};

export default function Header({ isLoggedin }: HeaderProps): React.JSX.Element {
  return (
    <header className="grid grid-cols-3 items-center bg-[#173647] p-5 text-base">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/swagger-logo.svg"
          alt="Swagger logo"
          width={32}
          height={32}
          priority
        />
        Swagger
      </Link>
      <div className="flex justify-center">
        <Button variant="ghost" asChild>
          <Link href="/about">About</Link>
        </Button>
      </div>
      <nav className="flex items-center justify-end gap-2">
        <Button variant="ghost" asChild>
          <Link href="/history">{isLoggedin ? "History" : "Sign in"}</Link>
        </Button>
        <Button variant="ghost" type="button">
          {isLoggedin ? "Sign up" : "Sign out"}
        </Button>
      </nav>
    </header>
  );
}
