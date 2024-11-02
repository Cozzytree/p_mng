"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { SprintStatus } from "@prisma/client";

interface sprintParams {
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

export const createSprint = async (projectId: string, data: sprintParams) => {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("project not found");

  if (project.organizationId !== orgId) {
    return null;
  }

  const sprint = await prisma.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      projectId: projectId,
      status: "PLANNED",
    },
  });

  return sprint;
};

export const updateSprintStatus = async (
  sprintId: string,
  newStatus: SprintStatus,
) => {
  const { userId, orgRole, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      include: { project: true },
    });
    if (!sprint) {
      throw new Error("sprint not found");
    }
    if (sprint.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    if (orgRole !== "org:admin") {
      throw new Error("Unauthorized");
    }

    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Cannot start sprint outside of date range");
    }
    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Cannot complete a sprint which is not started yet");
    }

    const updatedSprint = await prisma.sprint.update({
      where: { id: sprintId },
      data: { status: newStatus },
    });
    return { success: true, data: updatedSprint };
  } catch (err: any) {
    throw new Error(err.message);
  }
};
