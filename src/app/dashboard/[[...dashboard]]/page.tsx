import AppLayout from "@/components/appLayout";
import Header from "@/components/Header";
import { OrganizationList } from "@clerk/nextjs";

export default function DashBoardPage() {
  return (
    <AppLayout>
      <h1>DashBoard</h1>
      <Header />

      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl={"/organization/:slug"}
        afterSelectOrganizationUrl={"/organization/:slug"}
      />
    </AppLayout>
  );
}
