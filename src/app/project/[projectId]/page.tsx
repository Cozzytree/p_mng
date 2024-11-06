import AppLayout from "@/components/appLayout";
import { notFound } from "next/navigation";
import { getProject } from "../../../../actions/project";
import SprintBoard from "../_components/sprintBoard";
import SprintCretionForm from "../_components/sprintCreationForm";

export default async function ProjectPage({ params }: any) {
  const { projectId } = params;
  const project = await getProject(projectId);

  if (!project) notFound();
  return (
    <AppLayout>
      <div className="mb-7">
        <div className="py-3">
          <SprintCretionForm
            projectTitle={project.name}
            projectId={project.id}
            projectKey={project.key}
            sprintKey={project.sprints.length + 1}
          />
        </div>
        {project.sprints.length > 0 ? (
          <SprintBoard
            sprints={project.sprints}
            orgId={project.organizationId}
            projectId={project.id}
          />
        ) : (
          <p className="text-sm text-foreground/60">no sprints</p>
        )}
      </div>
    </AppLayout>
  );
}
