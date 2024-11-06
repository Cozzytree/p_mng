"use clienr";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { zodResolver } from "@hookform/resolvers/zod";
import { IssueStatus } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { issueSchema } from "@/lib/validator";
import { useFetch } from "@/hooks/useFetch";
import { createIssue } from "../../../../actions/issues";
import { getOrganizationUsers } from "../../../../actions/organizations";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type props = {
  isOpen: boolean;
  onClose: () => void;
  sprintId: string;
  status: IssueStatus | null;
  projectId: string;
  orgId: any;
  onIssueCreated: any;
};

export default function IsseuCreationDrawer({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}: props) {
  const { register, handleSubmit, control, reset } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
      title: "",
    },
  });

  const {
    loading: creatingIssue,
    data: newIssue,
    fn: createIssueFn,
  } = useFetch(createIssue);

  const {
    loading: loadingUsers,
    data: users,
    fn: getOrgUsers,
  } = useFetch(getOrganizationUsers);

  useEffect(() => {
    if (isOpen && orgId) {
      getOrgUsers(orgId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, orgId]);

  useEffect(() => {
    if (newIssue) {
      reset();
      onClose();
      onIssueCreated();
      toast.success(`${newIssue.id} added successfully`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newIssue]);

  const onSubmit = async (data: any) => {
    await createIssueFn(projectId, { ...data, status, sprintId });
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Issue</DrawerTitle>
        </DrawerHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full px-6 min-h-[50vh]"
        >
          <div className="mb-12 space-y-2">
            <Input
              className=""
              placeholder="Title"
              type="text"
              id="title"
              {...register("title")}
            />

            <Controller
              control={control}
              name="assigneeId"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    {loadingUsers ? "loading..." : "Select Assignee"}
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((u) => (
                      <SelectItem value={u.id} key={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MDEditor value={field.value} onChange={field.onChange} />
              )}
            />

            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>Select Priority</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">LOW</SelectItem>
                    <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                    <SelectItem value="HIGH">HIGH</SelectItem>
                    <SelectItem value="URGENT">URGENT</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Button
              disabled={creatingIssue}
              type="submit"
              className="float-right"
              size={"sm"}
            >
              {creatingIssue ? "creating issue" : "Create Issue"}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
