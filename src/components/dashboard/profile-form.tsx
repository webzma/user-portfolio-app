"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Database } from "@/types/supabase";
import { useSupabase } from "@/components/supabase-provider";
import { Upload } from "lucide-react";
import { toast } from "sonner";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const { user } = useSupabase();
  const [name, setName] = useState(profile?.name || "");
  const [jobTitle, setJobTitle] = useState(profile?.job_title || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error uploading avatar:", error.message);
      } else {
        console.error("Error uploading avatar:", error);
      }
      toast("Error uploading avatar. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        name,
        job_title: jobTitle,
        bio,
        avatar_url: avatarUrl,
        email: user?.email,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating profile:", error.message);
      } else {
        console.error("Error updating profile:", error);
      }
      toast("Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="avatar">Profile Image</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
            <AvatarFallback>
              {name?.charAt(0) || user?.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <Label
              htmlFor="avatar-upload"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Image"}
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isUploading}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-2">
              JPG, PNG or GIF. 1MB max.
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="job-title">Job Title</Label>
        <Input
          id="job-title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Frontend Developer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a short bio about yourself"
          className="min-h-[120px]"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
