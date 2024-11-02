import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sprint, SprintStatus } from "@prisma/client";
import { useFetch } from "@/hooks/useFetch";
import { updateSprintStatus } from "../../../../actions/sprint";

type props = {
  sprints: Sprint[];
  projectId: string;
  currentSprint: Sprint;
  setCurrentSprint: Dispatch<SetStateAction<Sprint>>;
};

export default function SprintManager({
  currentSprint,
  projectId,
  setCurrentSprint,
  sprints,
}: props) {
  const startDate = new Date(currentSprint.startDate);
  const endDate = new Date(currentSprint.endDate);
  const now = new Date();

  const {
    fn: updateStatus,
    data: updatedStatus,
    loading: updatingStatus,
  } = useFetch(updateSprintStatus);

  useEffect(() => {
    if (updatedStatus?.success) {
      setCurrentSprint(updatedStatus.data);
    }
  }, [updatedStatus, setCurrentSprint, updatingStatus]);

  const canStart =
    isBefore(now, new Date(currentSprint.endDate)) &&
    isAfter(now, new Date(currentSprint.startDate)) &&
    currentSprint.status === "PLANNED";
  const canEnd = currentSprint.status === "ACTIVE";

  const handleSprintChange = (e: string) => {
    const selectedSprint: Sprint | undefined = sprints.find((s) => s.id === e);
    if (!selectedSprint) return;
    setCurrentSprint(selectedSprint);
  };

  const handleStatusChange = async (newStatus: SprintStatus) => {
    await updateStatus(currentSprint.id, newStatus).finally(() => {
      if (!updatedStatus?.success) return;
      setCurrentSprint({ ...currentSprint, status: updatedStatus.data.status });
    });
  };

  const statusText = () => {
    if (currentSprint.status === "COMPLETED") {
      return "Sprint completed";
    }
    if (currentSprint.status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overduw by ${formatDistanceToNow(endDate)}`;
    }
    if (currentSprint.status === "PLANNED" && isBefore(now, startDate)) {
      return `starts in ${formatDistanceToNow(startDate)}`;
    }
  };

  return (
    <>
      <div className="w-full flex items-center justify-between gap-3">
        <Select
          onValueChange={(e) => handleSprintChange(e)}
          defaultValue={currentSprint.id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sprints" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((s) => (
              <SelectItem value={s.id} key={s.id}>
                {s.name} ({format(s.startDate, "d-LL-y")} -
                {format(s.endDate, "d-LL-y")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {canStart && (
          <Button
            className="bg-green-700 hover:bg-green-300 hover:text-green-800 text-green-100"
            disabled={updatingStatus}
            size={"sm"}
            variant={"default"}
            onClick={() => handleStatusChange("ACTIVE")}
          >
            {updatingStatus ? "Starting" : "Start sprint"}
          </Button>
        )}
        {canEnd && (
          <Button
            onClick={() => handleStatusChange("COMPLETED")}
            size={"sm"}
            variant={"destructive"}
          >
            End sprint
          </Button>
        )}
      </div>
      <p className="text-sm px-2 py-2 text-foreground/60">{statusText()} </p>
    </>
  );
}
