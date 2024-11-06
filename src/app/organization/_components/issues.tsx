import IssueCard from "@/app/project/_components/issueCard";
import { getUserIssues } from "../../../../actions/issues";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";

type props = {
  userId: string;
};

export default async function Issues({ userId }: props) {
  const data = await getUserIssues(userId);

  if (!data.success) return <div>an error occurred</div>;

  const assignedIssues = data.data.filter((i) => {
    return i.assigneeId;
  });
  const reportedIssues = data.data.filter((i) => i.reporterId);

  return (
    <>
      <Tabs defaultValue="assigned">
        <TabsList>
          <TabsTrigger value="assigned">Assigned To You</TabsTrigger>
          <TabsTrigger value="reported">Reported By You</TabsTrigger>
        </TabsList>
        <TabsContent value="assigned">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid issues={assignedIssues} />
          </Suspense>
        </TabsContent>
        <TabsContent value="reported">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid issues={reportedIssues} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </>
  );
}

function IssueGrid({ issues }: { issues: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 mb-8">
      {issues.map((i) => (
        <IssueCard key={i.id} issue={i} showStatus={true} />
      ))}
    </div>
  );
}
