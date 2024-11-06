"use client";

import { useFetch } from "@/hooks/useFetch";
import { useOrganization } from "@clerk/nextjs";
import { Trash } from "lucide-react";
import { deleteProject } from "../../../../actions/project";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
type props = {
  projectId: string;
};

export default function DeleteProject({ projectId }: props) {
  const { membership } = useOrganization();
  const { refresh } = useRouter();

  const { data, loading, error, fn } = useFetch(deleteProject);

  useEffect(() => {
    if (data?.success) {
      toast.error("project successfully deleted");
      refresh();
    }
  }, [data, loading, refresh, error]);

  const isAdmin = membership?.role === "org:admin";
  if (!isAdmin) return null;

  const handleDelete = () => {
    fn(projectId);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Trash size={18} fill="red" cursor={"pointer"} />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>
            Are you sure you want to delet this project ?
          </DialogTitle>
          <div className="w-full gap-3 flex justify-end items-center">
            <DialogClose>cancel</DialogClose>
            <Button variant={"destructive"} size={"sm"} onClick={handleDelete}>
              {loading ? "Deleting" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
