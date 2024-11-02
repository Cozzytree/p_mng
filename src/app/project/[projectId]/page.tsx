import AppLayout from "@/components/appLayout";
import { getProject } from "../../../../actions/project";
import { notFound } from "next/navigation";
import SprintCretionForm from "../_components/sprintCreationForm";
import SprintBoard from "../_components/sprintBoard";

type props = {
  params: { projectId: string };
};

export default async function ProjectPage({ params }: props) {
  const { projectId } = params;
  const project = await getProject(projectId);

  if (!project) notFound();
  return (
    <AppLayout>
      <div>
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
    </AppLayout>
  );
}
