"use client";

import { useState } from "react";
import SprintManager from "./sprintManager";
import { IssueStatus, Sprint } from "@prisma/client";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import statuses from "@/data/status.json";
import { Button } from "@/components/ui/button";
import IsseuCreationDrawer from "./createIssue";

type props = {
  sprints: Sprint[];
  projectId: string;
  orgId: string;
};

export default function SprintBoard({ sprints, orgId, projectId }: props) {
  const [currentSprint, setCurrentSprint] = useState<Sprint>(
    sprints.find((s) => s.status === "ACTIVE") || sprints[0],
  );
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | null>(
    "TODO",
  );

  const handleAddIssue = () => {};
  const handleIssueCreated = () => {};

  const onDragEnd = () => [console.log("end")];

  return (
    <div className="w-full">
      <SprintManager
        currentSprint={currentSprint}
        setCurrentSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-foreground/5 p-4 rounded-md">
          {statuses.map((s, i) => (
            <Droppable key={i} droppableId={s.key}>
              {(droppableProvided, snapshot) => (
                <div
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                  className={snapshot.isDraggingOver ? " isDraggingOver" : ""}
                >
                  <h3 className="text-md">{s.name}</h3>
                  {droppableProvided.placeholder}
                  {s.key === "TODO" && currentSprint.status !== "COMPLETED" && (
                    <Button
                      onClick={() => setDrawerOpen(!isDrawerOpen)}
                      size={"sm"}
                      variant={"outline"}
                    >
                      Create Issue
                    </Button>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <IsseuCreationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        sprintId={currentSprint.id}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
        status={selectedStatus}
      />
    </div>
  );
}
