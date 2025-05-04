import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProjectsList } from "@/components/dashboard/project-list";

export default async function ProjectsPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/signin");
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Projects</h3>
        <p className="text-sm text-muted-foreground">
          Add and manage your portfolio projects.
        </p>
      </div>
      <ProjectsList initialProjects={projects || []} />
    </div>
  );
}
