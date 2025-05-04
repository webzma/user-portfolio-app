import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContactForm } from "@/components/portfolio/contact-form";
import { ExternalLink, Github } from "lucide-react";
import type { Metadata } from "next";

interface PortfolioPageProps {
  params: { id: string }; // Asegúrate de que sea el tipo correcto
}

// Generar metadata para la página
export async function generateMetadata({
  params,
}: PortfolioPageProps): Promise<Metadata> {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!profile) {
    return {
      title: "Portfolio Not Found",
    };
  }

  return {
    title: `${profile.name || "Developer"}'s Portfolio`,
    description:
      profile.bio ||
      `View ${profile.name || "this developer"}'s portfolio and projects.`,
  };
}

// Página principal del portfolio
export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { id } = params;
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={profile.avatar_url || ""}
                  alt={profile.name || ""}
                />
                <AvatarFallback>
                  {profile.name?.charAt(0) || profile.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h1 className="mt-4 text-2xl font-bold">{profile.name}</h1>
              {profile.job_title && (
                <p className="text-muted-foreground">{profile.job_title}</p>
              )}
            </div>

            {profile.bio && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">About</h2>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Contact</h2>
              <ContactForm
                recipientId={id}
                recipientEmail={profile.email || ""}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Projects</h2>
            {projects && projects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      {project.description && (
                        <CardDescription>{project.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardFooter className="flex justify-start gap-4">
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Demo
                          </Button>
                        </a>
                      )}
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="gap-2">
                            <Github className="h-4 w-4" />
                            Code
                          </Button>
                        </a>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No projects to display yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
