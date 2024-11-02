"use server";

import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

interface projectParams {
  name: string;
  key: string;
  description: string;
}
export const createProject = async (params: projectParams) => {
  const { userId, orgId } = await auth();

  if (!userId) throw new Error("unauthorized");
  if (!orgId) throw new Error("no organization");

  const data = (
    await clerkClient()
  ).organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });
  const isMember = (await data).data.find(
    (o) => o.publicUserData?.userId === userId,
  );

  if (!isMember || isMember.role !== "org:admin") {
    throw new Error("not authorized to create project");
  }

  try {
    const project = await prisma.project.create({
      data: {
        name: params.name,
        description: params.description,
        key: params.key,
        organizationId: orgId,
      },
    });

    return project;
  } catch (err: any) {
    throw new Error(err?.message || "error creating project");
  }
};

export const getProjects = async (orgId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");

  const projects = await prisma.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });
  return projects;
};

export const deleteProject = async (projectId: string) => {
  const { userId, orgId, orgRole } = await auth();
  if (!userId || !orgId) throw new Error("Unauthorized");

  if (orgRole !== "org:admin")
    throw new Error("only admin can delete a project");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("project not found or project not part of organization");
  }

  await prisma.project.delete({
    where: { id: project.id },
  });
  return { success: true };
};

export const getProject = async (projectId: string) => {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User bot found");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!project) throw new Error("project not found");

  if (project.organizationId !== orgId) {
    return null;
  }
  return project;
};
