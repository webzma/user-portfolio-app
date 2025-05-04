import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

export function createClient() {
  // Asegúrate de que cookies() se espera
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Hacer la función get asíncrona
        async get(name: string) {
          const cookieStore = await cookies(); // Asegurarte de esperar cookies
          return cookieStore.get(name)?.value;
        },
        set(
          name: string,
          value: string,
          options: {
            path?: string;
            domain?: string;
            secure?: boolean;
            httpOnly?: boolean;
            sameSite?: "strict" | "lax" | "none";
            maxAge?: number;
          }
        ) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: { path?: string; domain?: string }) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}
