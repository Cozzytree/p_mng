"use client";

import AppLayout from "@/components/appLayout";
import { Button } from "@/components/ui/button";
import { useOrganizationList } from "@clerk/nextjs";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Organizations() {
  const { userMemberships, isLoaded, createOrganization } = useOrganizationList(
    { userMemberships: { pageSize: 10, initialPage: 1 } },
  );

  const handleCreateOrganizayion = async () => {
    if (!createOrganization) return;
    await createOrganization({
      name: "test organization",
      slug: "testmest",
    })
      .then((v) => {
        redirect(`/organization/${v.slug}`);
      })
      .catch((err) => {
        return err;
      });
  };

  return (
    <AppLayout>
      {!isLoaded ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="w-full flex justify-between items-center">
            <span className="text-sm text-foreground/50">
              Organizations Count : {userMemberships.count}
            </span>
            <Button
              onClick={handleCreateOrganizayion}
              size={"sm"}
              variant={"secondary"}
            >
              Create Organization <PlusIcon />
            </Button>
          </div>
          {userMemberships.data?.map((o) => (
            <Link href={`/organization/${o.organization.slug}`} key={o.id}>
              {o.organization.name}
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
