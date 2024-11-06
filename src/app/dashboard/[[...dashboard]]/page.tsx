import AppLayout from "@/components/appLayout";
import Header from "@/components/Header";
import { OrganizationList } from "@clerk/nextjs";

export default function DashBoardPage() {
  return (
    <AppLayout>
      <div className="py-4 px-4 space-y-3 w-full flex flex-col items-center">
        <Header />

        <OrganizationList
          hidePersonal
          afterCreateOrganizationUrl={"/organization/:slug"}
          afterSelectOrganizationUrl={"/organization/:slug"}
        />
      </div>
    </AppLayout>
  );
}
