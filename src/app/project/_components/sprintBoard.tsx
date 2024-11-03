"use client";

import { useEffect, useState } from "react";
import SprintManager from "./sprintManager";
import { IssueStatus, Sprint } from "@prisma/client";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import statuses from "@/data/status.json";
import { Button } from "@/components/ui/button";
import IsseuCreationDrawer from "./createIssue";
import { useFetch } from "@/hooks/useFetch";
import { getSprintIssues, updateIssueOrder } from "../../../../actions/issues";
import IssueCard from "./issueCard";
import { toast } from "sonner";
import BoardFilters from "./boardFilters";

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

  /* gettting issues of the sprint */
  const {
    fn: getIssuesofSprint,
    loading: gettingIssues,
    data: sprintIssues,
    error,
    setData,
  } = useFetch(getSprintIssues);

  const {
    fn: updateIssues,
    loading: updatingIssues,
    data,
    error: updateIssuesError,
    // setData,
  } = useFetch(updateIssueOrder);

  useEffect(() => {
    if (currentSprint.id) {
      getIssuesofSprint(currentSprint.id);
    }
  }, [currentSprint.id]);

  const [selectedStatus] = useState<IssueStatus | null>("TODO");
  const [filteredIssue, setFilteredIssue] = useState(sprintIssues);

  const handleFilteredIssues = (newFilteredIssues: ANY[]) => {
    setFilteredIssue(newFilteredIssues);
  };

  // const handleAddIssue = () => {};
  const handleIssueCreated = () => {};

  const onDragEnd = async (result: any) => {
    const { destination, source } = result;
    if (!source || !destination) return;
    if (
      destination.droppableId == source.droppableId &&
      destination.index == source.index
    )
      return;
    if (
      currentSprint.status === "PLANNED" ||
      currentSprint.status === "COMPLETED"
    ) {
      toast.error("sprint should be active");
      return;
    }

    const newOrderedData = [...(sprintIssues || [])];
    // const sourceList = newOrderedData.filter(
    //   (l) => l.id === source.droppableId,
    // );
    // const destinationList = newOrderedData.filter(
    //   (l) => l.id === destination.droppableId,
    // );

    if (source.droppableId === destination.droppableId) {
      const temp = newOrderedData[source.index];
      newOrderedData[source.index] = newOrderedData[destination.index];
      newOrderedData[destination.index] = temp;
    } else {
      newOrderedData[source.index].status = destination.droppableId;
      const temp = newOrderedData[source.index];
      newOrderedData[source.index] = newOrderedData[destination.index];
      newOrderedData[destination.index] = temp;
    }
    newOrderedData.forEach((a, i) => (a.order = i));
    newOrderedData.sort((a, b) => a.order - b.order);

    setData(newOrderedData);
    await updateIssues(newOrderedData);
  };

  return (
    <div className="w-full">
      <SprintManager
        currentSprint={currentSprint}
        setCurrentSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {sprintIssues && !gettingIssues && (
        <BoardFilters
          issues={sprintIssues}
          onFilterChange={handleFilteredIssues}
        />
      )}

      <div
        className={`${updatingIssues || gettingIssues ? "flex opacity-100" : "opacity-0"} pointer-events-none w-full justify-center h-5`}
      >
        <span className="text-sm text-foreground/50"> Loading...</span>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 bg-foreground/5 p-4 rounded-md">
          {statuses.map((s, i) => (
            <Droppable key={i} droppableId={s.key}>
              {(droppableProvided, snapshot) => (
                <div
                  style={{ minHeight: "200px" }}
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                  className={
                    snapshot.isDraggingOver
                      ? " isDraggingOver"
                      : "" + " space-y-3"
                  }
                >
                  <h3 className="text-md">{s.name}</h3>

                  <>
                    {sprintIssues
                      ?.filter((issue) => issue.status === s.key)
                      .map((i, index) => (
                        <Draggable
                          isDragDisabled={updatingIssues}
                          draggableId={i.id}
                          index={index}
                          key={i.id}
                        >
                          {(provided) => (
                            <div
                              className=""
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                            >
                              <IssueCard
                                issue={i}
                                showStatus={true}
                                onDelete={() => {
                                  getIssuesofSprint(currentSprint.id);
                                }}
                                onUpdate={(data) => {
                                  setData((issues) => {
                                    if (!issues) return []; // Handle the case where issues might be undefined
                                    return issues.map((issue) => {
                                      if (issue.id === data.id) {
                                        return data; // Merge the updated data into the existing issue
                                      }
                                      return issue; // Return the issue unchanged
                                    });
                                  });
                                }}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                  </>

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

      {/* Issue form */}
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
