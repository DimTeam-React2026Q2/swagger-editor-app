import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignOutButton from "@/components/auth/SignOutButton";

type HeaderProps = {
  isLoggedin: boolean;
};

export default function Header({ isLoggedin }: HeaderProps): React.JSX.Element {
  return (
    <header className="grid grid-cols-3 items-center bg-[#173647] p-5 text-white">
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
        {isLoggedin ? (
          <>
            <Button variant="ghost" asChild>
              <Link href="/history">History</Link>
            </Button>
            <SignOutButton />
          </>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
