import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b ">
        <div className="container mx-auto flex h-16 items-center justify-between py-4">
          <h1 className="text-2xl font-bold">Portfolio Manager</h1>
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
                <form action="/auth/signout" method="post">
                  <Button variant="outline">Sign Out</Button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/signin">
                  <Button>Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Showcase Your Developer Portfolio
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Create and manage your professional developer portfolio with
                  ease. Highlight your projects and skills to potential
                  employers.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href={session ? "/dashboard" : "/signin"}>
                  <Button size="lg" className="px-8">
                    {session ? "Go to Dashboard" : "Get Started"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Portfolio Manager. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
