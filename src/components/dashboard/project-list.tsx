"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/supabase";
import { useSupabase } from "@/components/supabase-provider";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ProjectDialog } from "@/components/dashboard/project-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export function ProjectsList({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const { user } = useSupabase();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleAddProject = () => {
    setCurrentProject(null);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) {
        throw error;
      }

      setProjects(projects.filter((project) => project.id !== id));

      router.refresh();
    } catch (error: any) {}
  };

  const handleSaveProject = async (
    project: Omit<Project, "id" | "created_at" | "updated_at" | "user_id">
  ) => {
    try {
      if (currentProject) {
        // Update existing project
        const { data, error } = await supabase
          .from("projects")
          .update({
            ...project,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentProject.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setProjects(
          projects.map((p) => (p.id === currentProject.id ? data : p))
        );
      } else {
        // Create new project
        const { data, error } = await supabase
          .from("projects")
          .insert({
            ...project,
            user_id: user?.id as string,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        setProjects([data, ...projects]);
      }

      router.refresh();
      setIsDialogOpen(false);
    } catch (error: any) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleAddProject}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No projects yet. Add your first project!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                {project.description && (
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {project.demo_url && (
                  <p className="text-sm">
                    <span className="font-medium">Demo:</span>{" "}
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {project.demo_url}
                    </a>
                  </p>
                )}
                {project.repo_url && (
                  <p className="text-sm mt-1">
                    <span className="font-medium">Repository:</span>{" "}
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {project.repo_url}
                    </a>
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditProject(project)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your project.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteProject(project.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <ProjectDialog
        project={currentProject}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveProject}
      />
    </div>
  );
}
