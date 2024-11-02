import { addDays } from "date-fns";
import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(4, "project name should be more than 3 characters")
    .max(100, "should be less than 100 characters"),
  key: z
    .string()
    .min(2, "project name should be more than 2 characters")
    .max(10, "should be less than 10 characters"),
  description: z.string().max(500, "should be less than 500 characters"),
});

export const sprintSchema = z.object({
  name: z.string().min(1, "sprint name is required"),
  startDate: z.date().min(new Date()),
  endDate: z.date().min(addDays(new Date(), 10)),
});

export const issueSchema = z.object({
  title: z.string().min(1, "sprint name is required"),
  description: z.string().max(500, ""),
  assigneeId: z.string().cuid("please select assignee"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});
