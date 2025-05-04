import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, FolderKanban, ExternalLink } from "lucide-react";

export default async function Dashboard() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/signin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", session.user.id);

  const portfolioUrl = `/portfolio/${session.user.id}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href={portfolioUrl} target="_blank">
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View Portfolio
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profile Completion
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile ? "Complete" : "Incomplete"}
            </div>
            <p className="text-xs text-muted-foreground">
              {profile ? "Your profile is set up" : "Set up your profile"}
            </p>
            <div className="mt-4">
              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm">
                  {profile ? "Edit Profile" : "Complete Profile"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {projects?.length
                ? "Projects added to your portfolio"
                : "No projects added yet"}
            </p>
            <div className="mt-4">
              <Link href="/dashboard/projects">
                <Button variant="outline" size="sm">
                  Manage Projects
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
