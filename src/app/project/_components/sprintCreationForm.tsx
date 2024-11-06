"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/useFetch";
import { addDays, formatISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "react-day-picker/dist/style.css";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createSprint } from "../../../../actions/sprint";

type props = {
  projectTitle: string;
  projectId: string;
  projectKey: string;
  sprintKey: number;
};

export default function SprintCretionForm({
  projectId,
  projectKey,
  projectTitle,
  sprintKey,
}: props) {
  const [showForm, setShowForm] = useState(false);
  const dateRange = {
    from: new Date(),
    to: addDays(new Date(), 14),
  };
  const { refresh } = useRouter();
  const { loading: creatingSprint, fn: createSprintfn } =
    useFetch(createSprint);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = async (data: any) => {
    const startDate = formatISO(data.startDate);
    const endDate = formatISO(data.endDate);
    await createSprintfn(projectId, {
      name: data.name,
      startDate,
      endDate,
    });

    setShowForm(false);
    toast.success("sprint created successfully");
    refresh();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-xl font-sans px-5">{projectTitle}</h1>
        <Button
          className="mb-3"
          onClick={() => setShowForm(!showForm)}
          size={"sm"}
        >
          {showForm ? "cancel" : "Create new sprint"}
        </Button>
      </div>

      {showForm && (
        <div className="w-full flex justify-center">
          <Card className="w-full">
            <CardHeader className="py-2">Sprint Form</CardHeader>
            <CardContent className="pb-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="">
                  <label className="text-sm text-foreground/50" htmlFor="name">
                    Sprint name
                  </label>
                  <Input
                    className=""
                    defaultValue={`${projectKey} - ${sprintKey}`}
                    id="name"
                    placeholder="Name"
                    {...register("name")}
                  />
                  {errors.name?.message && (
                    <p className="text-sm text-red-600">
                      {errors.root?.message}
                    </p>
                  )}
                </div>

                <div className="w-full flex justify-between items-center">
                  <label className="text-sm text-foreground/50">
                    Sprint Duration
                  </label>

                  <Input
                    className=""
                    defaultValue={JSON.stringify(dateRange.from)}
                    type="date"
                    id="startDate"
                    {...register("startDate", {
                      required: true,
                      validate: {
                        checkMore: (v) => {
                          const startDate = new Date(v);
                          const endDate = new Date(getValues("endDate"));
                          return (
                            startDate < endDate ||
                            "Start date must be before end date"
                          );
                        },
                      },
                    })}
                  />
                  <Input
                    className=""
                    defaultValue={JSON.stringify(dateRange.to)}
                    type="date"
                    id="endDate"
                    {...register("endDate", {
                      required: true,
                      validate: {
                        checkLess: (v) => {
                          const endDate = new Date(v);
                          const startDate = new Date(getValues("startDate"));
                          return (
                            endDate > startDate ||
                            "End date must be after start date"
                          );
                        },
                      },
                    })}
                  />
                </div>
                <Button
                  disabled={creatingSprint}
                  size={"sm"}
                  variant={"secondary"}
                >
                  {creatingSprint ? "creating sprint" : "Create sprint"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
