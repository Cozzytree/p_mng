import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { checkUser } from "@/lib/checkUser";

export default async function Header() {
  await checkUser();
  return (
    <header className="w-full flex justify-between sticky top-0 backdrop-blur-md">
      <div>
        <Link href={"/"}>
          <h1 className="font-semibold w-full">P_MNG</h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href={"/project/create"}
          className={`${buttonVariants({ size: "sm", variant: "destructive" })}`}
        >
          Create Project
        </Link>
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <SignUpButton />
        </SignedOut>
      </div>
    </header>
  );
}
