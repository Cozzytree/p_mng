import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IssuePriority, User } from "@prisma/client";
import { X } from "lucide-react";
import { useState } from "react";

type props = {
  issues: any[];
  onFilterChange: (newFilteredIssues: any[]) => void;
};

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function BoardFilters({ issues, onFilterChange }: props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignee, setSelecedAssignee] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState<IssuePriority | "">(
    "",
  );
  const cleearFilters = () => {
    setSelecedAssignee([]);
    setSelectedPriority("");
    setSearchTerm("");
  };

  const assignees = issues
    .map((issue) => issue.assignee)
    .filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    );
  const isFiltersApplies =
    searchTerm !== "" || selectedPriority !== "" || selectedAssignee.length > 0;

  return (
    <div>
      <div className="w-full flex justify-start  gap-3 items-center">
        <Input
          value={searchTerm}
          className="h-fit py-[0.3em] max-w-32 px-4"
          placeholder="Search Issues..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div>
          {assignees.map((s: User) => (
            <Avatar key={s.id} className="w-8 h-8">
              <AvatarImage src={s.imageUrl || ""} alt={s.name || ""} />
              <AvatarFallback className="capitalize">
                {s.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>

        <Select
          value={selectedPriority}
          onValueChange={(v) => {
            setSelectedPriority(v as IssuePriority);
          }}
        >
          <SelectTrigger className="h-fit py-1 w-fit">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltersApplies && (
          <Button
            className="w-fit h-fit py-2 px-4"
            onClick={cleearFilters}
            size="sm"
            variant="ghost"
          >
            <X /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
