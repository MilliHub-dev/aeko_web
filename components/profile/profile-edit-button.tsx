"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditProfileModal } from "./edit-profile-modal";

interface UserProfile {
  name: string;
  username: string;
  bio: string;
  profilePicture: string;
  coverPicture?: string;
  email: string;
}

export function ProfileEditButton({ user }: { user: UserProfile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full shadow-sm"
        onClick={() => setIsModalOpen(true)}
        title="Edit Profile"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <EditProfileModal user={user} isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
