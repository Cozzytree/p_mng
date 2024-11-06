import AppLayout from "@/components/appLayout";
import OrgaSwitcher from "@/components/orgswitcher";
import Image from "next/image";
import { getOrganizations } from "../../../../actions/organizations";
import ProjectList from "../_components/projectList";
import { auth } from "@clerk/nextjs/server";
import Issues from "../_components/issues";

export default async function OrganizationPage({ params }: any) {
  const { userId } = await auth();
  const data = await getOrganizations({ slug: params?.orgId });

  return (
    <AppLayout>
      {/* <Header /> */}
      <div className="w-full flex items-center justify-between py-4 px-4">
        <div className="flex justify-start items-end gap-3">
          <Image
            src={data?.imageUrl || ""}
            height={100}
            width={100}
            alt={data?.imageUrl || ""}
            className="rounded-full h-8 w-8"
          />
          <h3 className="text-xl">{data?.name}</h3>x
        </div>
        <div>
          <OrgaSwitcher />
        </div>
      </div>
      <div className="w-full flex flex-col mt-5">
        <h3 className="text-xl pb-4">Projects</h3>
        <ProjectList organizationId={data?.id || ""} />
      </div>

      <div className="space-y-4 mt-2">
        <h5 className="text-md text-foreground/70">
          Your assigned and reported issues
        </h5>

        {userId && <Issues userId={userId} />}
      </div>
    </AppLayout>
  );
}
