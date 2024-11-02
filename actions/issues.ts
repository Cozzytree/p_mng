"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Issue } from "@prisma/client";

export async function createIssue(projectId: string, data: Issue) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("user not found");

  const lastIssue = await prisma.issue.findFirst({
    where: { projectId: projectId, status: data.status },
    orderBy: { order: "desc" },
  });
  const newOrder = lastIssue ? lastIssue?.order + 1 : 0;

  const issue = await prisma.issue.create({
    data: {
      title: data.title,
      description: data.description,
      assigneeId: data.assigneeId,
      priority: data.priority,
      sprintId: data.sprintId,
      status: data.status,
      projectId: projectId,
      reporterId: user.id,
      order: newOrder,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });
  return issue;
}
