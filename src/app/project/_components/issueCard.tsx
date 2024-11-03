import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import IssueDetailDialogBox from "./issueDetailDialogBox";

type props = {
  issue: any;
  showStatus: boolean;
  onDelete: (p: any) => void;
  onUpdate: (p: any) => void;
};

const priorityColor: any = {
  LOW: "border-t-green-400",
  MEDIUM: "border-t-yellow-500",
  HIGH: "border-t-orange-500",
  URGENT: "border-t-red-500",
};

export default function IssueCard({
  issue,
  showStatus = false,
  onDelete,
  onUpdate,
}: props) {
  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });
  const { refresh } = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const onDeleteHandler = (params: any) => {
    refresh();
    onDelete(params);
  };

  const onUpdateHandler = (params: any) => {
    refresh();
    onUpdate(params);
  };

  return (
    <>
      <Card
        onClick={() => setDialogOpen(true)}
        className={`border-t-2 ${priorityColor[issue.priority]}`}
      >
        <CardHeader>
          <CardTitle className="tracking-widest">{issue.title}</CardTitle>
          <p className="text-xs text-foreground/50">#{issue.id}</p>
        </CardHeader>
        <CardContent>
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant="outline" className="text-xs text-foreground/50">
            {issue.priority}
          </Badge>
          <p className="text-sm">{issue.description}</p>
        </CardContent>
        <CardFooter className="space-x-3">
          <div className="flex items-end justify-start gap-1">
            <Avatar>
              <AvatarImage
                src={issue?.assignee?.imageUrl || ""}
                alt={issue?.assignee.name || ""}
              />
              <AvatarFallback className="capitalize">
                {issue.assignee.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <p className="flex flex-col ">
              <span className="text-sm text-foreground/70">
                {issue?.assignee?.name}
              </span>
              <span className="text-xs text-foreground/50">
                created {created}
              </span>
            </p>
          </div>
        </CardFooter>
      </Card>
      {dialogOpen && (
        <IssueDetailDialogBox
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          issue={issue}
          borderClr={priorityColor[issue.priority]}
        />
      )}
    </>
  );
}
