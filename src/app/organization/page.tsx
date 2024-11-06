"use client";

import AppLayout from "@/components/appLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOrganizationList } from "@clerk/nextjs";
import { format } from "date-fns";
import Link from "next/link";

export default function Organizations() {
  const { userMemberships, isLoaded } = useOrganizationList({
    userMemberships: { pageSize: 10, initialPage: 1 },
  });

  return (
    <AppLayout>
      {!isLoaded ? (
        <div>Loading...</div>
      ) : (
        <div className="px-4 py-4">
          <div className="w-full flex justify-between items-center">
            <span className="text-sm text-foreground/50">
              Organizations Count : {userMemberships.count}
            </span>
          </div>

          <h3 className="pt-3 font-semibold">Organizations</h3>

          <div className="flex flex-col gap-3 py-3">
            {userMemberships.data?.map((o) => (
              <Link
                className="w-full"
                href={`/organization/${o.organization.slug}`}
                key={o.id}
              >
                <Card className="">
                  <CardHeader>
                    <div className="w-full flex justify-between">
                      <CardTitle className="tracking-wider flex items-end gap-2">
                        <Avatar>
                          <AvatarImage
                            src={o.organization.imageUrl}
                            alt=""
                            width={60}
                            height={60}
                          />
                          <AvatarFallback className="capitalize">
                            {o.organization.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {o.organization.name}
                        <span className="text-sm text-foreground/70">
                          ( {o.organization.slug} )
                        </span>
                      </CardTitle>
                      <span className="text-sm text-foreground/60">
                        {format(o.organization.createdAt, "dd-LL-yy")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      <span>role: {o.role}</span>
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
