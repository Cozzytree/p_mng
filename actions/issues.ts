"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Issue, IssuePriority, IssueStatus } from "@prisma/client";

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

export async function getSprintIssues(sprintId: string) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("user not found");

  const issue = await prisma.issue.findMany({
    where: { sprintId: sprintId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });
  return issue;
}

export async function updateIssueOrder(updatedIssues: Issue[]) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("user not found");

  await prisma.$transaction(async (p) => {
    for (const issue of updatedIssues) {
      await p.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status,
          order: issue.order,
        },
      });
    }
  });

  return { status: true };
}

export async function deleteIssue(issueId: string) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("user not found");

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      project: true,
    },
  });

  if (!issue) throw new Error("issue not found");

  if (issue.reporterId !== user.id && issue.assigneeId !== user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.issue
    .delete({
      where: { id: issueId },
    })
    .catch((err) => {
      throw new Error(err);
    });

  return { success: true };
}

export async function updateIssue(
  issueId: string,
  data: { status: IssueStatus; priority: IssuePriority },
) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("user not found");

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      project: true,
    },
  });

  if (!issue) {
    throw new Error("issue not found");
  }

  if (issue.project.organizationId !== orgId) {
    throw new Error("Unauthorized");
  }

  const updatedIssue = await prisma.issue
    .update({
      where: { id: issueId },
      data: {
        status: data.status,
        priority: data.priority,
      },
      include: {
        assignee: true,
        reporter: true,
      },
    })
    .catch((err) => {
      throw new Error(err.message || "error while updating issue");
    });

  return { success: true, data: updatedIssue };
}
