export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string | null;
          job_title: string | null;
          bio: string | null;
          avatar_url: string | null;
          email: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          name?: string | null;
          job_title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          email?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string | null;
          job_title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          email?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          description: string | null;
          demo_url: string | null;
          repo_url: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          description?: string | null;
          demo_url?: string | null;
          repo_url?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          description?: string | null;
          demo_url?: string | null;
          repo_url?: string | null;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
