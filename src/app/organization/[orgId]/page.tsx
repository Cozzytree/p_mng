import AppLayout from "@/components/appLayout";
import { getOrganizations } from "../../../../actions/organizations";
import Image from "next/image";
import OrgaSwitcher from "@/components/orgswitcher";
import ProjectList from "../_components/projectList";

type props = {
  params: {
    orgId: string;
  };
};

export default async function OrganizationPage({ params }: props) {
  const data = await getOrganizations({ slug: params?.orgId });

  return (
    <AppLayout>
      {/* <Header /> */}
      <div className="w-full flex items-center justify-between">
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
    </AppLayout>
  );
}
