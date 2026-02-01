"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportDialog } from "@/components/report/report-dialog";

interface UserReportButtonProps {
  userId: string;
}

export function UserReportButton({ userId }: UserReportButtonProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)}>
            <Flag className="w-4 h-4 mr-2" />
            Report User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportDialog
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        entityId={userId}
        entityType="USER"
        reportedId={userId}
      />
    </>
  );
}
