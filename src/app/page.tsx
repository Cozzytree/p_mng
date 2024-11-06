import { buttonVariants } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-foreground/5 w-full flex flex-col items-center">
      <div className="w-full py-3 flex justify-between sm:container">
        <h1 className="font-bold">T MNG</h1>
        <div className="space-x-4">
          <Link
            className={`${buttonVariants({ variant: "secondary", size: "sm" })} font-bold tracking-wide`}
            href={"/sign-up"}
          >
            Sign Up
          </Link>
          <Link
            className={`${buttonVariants({ variant: "default", size: "sm" })} font-bold tracking-wide`}
            href={"/sign-in"}
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="w-full mt-6">
        <h1 className="text-center text-3xl tracking-widest font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-700 to-purple-800">
          TEAM-MANAGER
        </h1>
        <p className="mt-5 tracking-wide text-foreground/80 w-full text-center">
          Manage your team with ease <br />A simple tool for keeping track of
          your team members. <br />
          Organize your team efficiently.
        </p>
      </div>
    </div>
  );
}
