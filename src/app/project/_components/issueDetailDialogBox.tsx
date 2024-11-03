import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useFetch } from "@/hooks/useFetch";
import { Issue, IssuePriority, IssueStatus } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { deleteIssue, updateIssue } from "../../../../actions/issues";
import { useEffect, useState } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import statuses from "@/data/status.json";
import MDEditor from "@uiw/react-md-editor";

type props = {
  issue: Issue | any;
  isOpen: boolean;
  onClose: () => void;
  onDelete: any;
  onUpdate: any;
  borderClr: string;
};

export default function IssueDetailDialogBox({
  issue,
  isOpen,
  onClose,
  onDelete,
  onUpdate,
  borderClr,
}: props) {
  const pathaname = usePathname();
  const isProjectPage = pathaname.startsWith("/project/");
  const [status, setStatus] = useState<IssueStatus | null>(issue.status);
  const [priority, setPriority] = useState<IssuePriority | null>(
    issue.priority,
  );
  const { user } = useUser();
  const { membership } = useOrganization();

  const {
    fn: deleteIssueFn,
    loading: deletingIssue,
    data: deletedIssue,
    error: deleteErr,
  } = useFetch(deleteIssue);
  const {
    fn: updateIssueFn,
    loading: updatingIssue,
    data: updatedIssue,
    error: updateErr,
  } = useFetch(updateIssue);

  useEffect(() => {
    if (deletedIssue?.success) {
      onClose();
      onDelete();
    }
    if (updatedIssue?.success) {
      onUpdate(updatedIssue.data);
    }
  }, [deletedIssue, updatedIssue, deletingIssue, updatingIssue]);

  const handleStatusChange = (status: IssueStatus) => {
    if (issue.status === status) return;
    updateIssueFn(issue.id, { status: status, priority: issue.priority });
    setStatus(status);
  };

  const handlePriorityChange = (newpriority: IssuePriority) => {
    if (issue.priority === newpriority) return;
    updateIssueFn(issue.id, { status: issue.status, priority: newpriority });
    setPriority(newpriority);
  };

  const handleDelete = () => {
    if (!issue.id) return;
    deleteIssueFn(issue.id);
  };

  const canChange =
    user?.id === issue.reporter.clerkUserId || membership?.role === "org:admin";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="">
        {/* loader */}
        <div
          className={`${deletingIssue || updatingIssue ? "opacity-100" : "opacity-0"} w-full text-sm text-foreground/40 h-2 text-center pointer-events-none`}
        >
          <span>Loading...</span>
        </div>

        <div className="space-y-3">
          <DialogTitle className="text-2xl">{issue.title}</DialogTitle>
          {isProjectPage && (
            <Link
              href={`/project/${issue.projectId}`}
              className={`${buttonVariants({ variant: "link", size: "sm" })} h-fit`}
            >
              view project
            </Link>
          )}

          <div className="flex flex-warp gap-1 items-center">
            {/* statuses */}
            <Select disabled={updatingIssue} onValueChange={handleStatusChange}>
              <SelectTrigger>
                Status <span className="font-semibold">{status && status}</span>
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* priority */}
            <Select
              disabled={!canChange || updatingIssue}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger className={`border-2 ${borderClr}`}>
                Priority{" "}
                <span className="text-sm font-semibold">
                  {priority && priority}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">LOW</SelectItem>
                <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                <SelectItem value="HIGH">HIGH</SelectItem>
                <SelectItem value="URGENT">URGENT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3>Description</h3>
            <MDEditor.Markdown
              className="min-h-14 p-2 rounded-md text-sm"
              source={issue.description || ""}
            />
          </div>

          {/* reported and assignee */}
          <div className="w-full flex justify-between pt-1 border-t mt-5">
            <div className="flex flex-col items-start">
              <h3>Assigned</h3>
              <div className="flex items-end gap-1">
                <Avatar>
                  <AvatarImage
                    src={issue?.assignee?.imageUrl || ""}
                    alt={issue?.assignee.name || ""}
                  />
                  <AvatarFallback className="capitalize">
                    {issue.assignee.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-foreground/50">
                  {issue?.assignee?.name}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start">
              <h3>Reporter</h3>
              <div className="flex items-end gap-1">
                <Avatar>
                  <AvatarImage
                    src={issue?.reporter?.imageUrl || ""}
                    alt={issue?.reporter.name || ""}
                  />
                  <AvatarFallback className="capitalize">
                    {issue?.reporter.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-foreground/50">
                  {issue?.reporter?.name}
                </span>
              </div>
            </div>
          </div>
          {canChange && (
            <Button
              onClick={handleDelete}
              disabled={deletingIssue}
              size="sm"
              variant={"destructive"}
            >
              {deletingIssue ? "deleting issue" : "delete"}
            </Button>
          )}
          {(deleteErr || updateErr) && (
            <p className="text-sm text-red-600">{deleteErr || updateErr}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
