"use server";

import prisma from "@/lib/prisma";
import {
  auth,
  clerkClient,
  OrganizationMembership,
} from "@clerk/nextjs/server";

export const getOrganizations = async ({ slug }: { slug: string }) => {
  const { userId } = await auth();
  if (!userId) return null;

  const loggedUser = await prisma.user
    .findUnique({
      where: { clerkUserId: userId },
    })
    .catch((err) => {
      if (err) {
        throw new Error(err.message || "internal server error");
      }
    });

  if (!loggedUser) throw new Error("user not found");

  const theOrg = (await clerkClient()).organizations.getOrganization({ slug });

  if (!theOrg) return null;

  const memberList = (
    await clerkClient()
  ).organizations.getOrganizationMembershipList({
    organizationId: (await theOrg).id,
  });

  const isMember = (await memberList).data.find(
    (v) => v.publicUserData?.userId === userId,
  );

  if (!isMember) throw new Error("not a member");

  return theOrg;
};

export const getOrganizationUsers = async (orgId: string) => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("user not found");

  const memberList = (
    await clerkClient()
  ).organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  const userIds: string[] = (await memberList).data
    .map((o: OrganizationMembership) => o.publicUserData?.userId)
    .filter((id: any): id is string => id !== undefined);

  const users = await prisma.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
    },
  });
  return users;
};
