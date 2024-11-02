import Link from "next/link";
import { getProjects } from "../../../../actions/project";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import DeleteProject from "./deleteProject";

export default async function ProjetList({
  organizationId,
}: {
  organizationId: string;
}) {
  const data = await getProjects(organizationId);

  if (data.length === 0)
    return (
      <p className="text-sm w-full text-foreground/60">
        no projects{" "}
        <Link
          className={`${buttonVariants({ variant: "link", size: "sm" })}`}
          href="/project/create"
        >
          Create one
        </Link>
      </p>
    );

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {data.map((p) => (
        <Card key={p.id} className="w-full space-y-1">
          <CardHeader className="p-3 w-full flex flex-row justify-between items-center">
            <h3>{p.name}</h3>
            <DeleteProject projectId={p.id} />
          </CardHeader>
          <CardContent className="p-3">
            <CardDescription>{p.description}</CardDescription>
            <Link
              className={`text-blue-600 ${buttonVariants({ variant: "link", size: "sm" })} p-0`}
              href={`/project/${p.id}`}
            >
              View project
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
