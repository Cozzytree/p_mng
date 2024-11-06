"use client";

import AppLayout from "@/components/appLayout";
import OrgaSwitcher from "@/components/orgswitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/useFetch";
import { projectSchema } from "@/lib/validator";
import { useOrganization, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createProject } from "../../../../actions/project";

export default function CreateProject() {
  const { isLoaded: orgLoad, membership } = useOrganization();
  const { isLoaded: userLoad } = useUser();
  const [isAdmin, setAdmin] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(projectSchema) });
  const {
    data: projectData,
    loading,
    fn: createProjectMutation,
  } = useFetch(createProject);

  useEffect(() => {
    if (userLoad && orgLoad && membership) {
      setAdmin(membership.role === "org:admin");
    }
  }, [userLoad, orgLoad, membership]);

  useEffect(() => {
    if (projectData) {
      toast.success("project created successfully");
      redirect(`/project/${projectData.id}`);
    }
  }, [projectData, loading]);

  const onSubmit = (data: any) => {
    createProjectMutation(data);
  };

  return (
    <AppLayout>
      {!orgLoad || (!userLoad && <div>Loading...</div>)}

      {!isAdmin && (
        <div className="w-full flex flex-col gap-2 items-center">
          <span>Only admins can create project</span>
          <OrgaSwitcher />
        </div>
      )}

      {orgLoad && userLoad && isAdmin && (
        <div className="pt-7">
          <h3 className="text-center mb-5">Create Project</h3>

          <div className="w-full flex justify-center items-center">
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <Input
                className=""
                placeholder="Name"
                id="name"
                {...register("name")}
              />

              <Input
                className=""
                placeholder="Key"
                id="key"
                {...register("key")}
              />
              <Textarea
                className="max-h-40"
                placeholder="Description"
                id="description"
                {...register("description")}
              />
              <p className="text-sm text-red-600 w-full text-center">
                {errors.root?.message && errors.root?.message}
              </p>
              <Button
                disabled={loading}
                type="submit"
                size={"sm"}
                className="w-full"
                variant={"secondary"}
              >
                {loading ? "Creating" : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
