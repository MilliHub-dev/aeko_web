"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export type EntityType = "USER" | "POST" | "COMMENT";

interface ReportDialogProps {
  entityId: string;
  entityType: EntityType;
  reportedId?: string; // ID of the user being reported
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const REPORT_REASONS = [
  "Harassment",
  "Spam",
  "Inappropriate Content",
  "Misinformation",
  "Violence",
  "Other"
];

export function ReportDialog({ 
  entityId, 
  entityType, 
  reportedId, 
  isOpen, 
  onOpenChange 
}: ReportDialogProps) {
  const [reason, setReason] = useState<string>("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    const finalReason = reason === "Other" ? customReason : reason;
    if (reason === "Other" && !customReason.trim()) {
        toast.error("Please specify the reason");
        return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityId,
          entityType,
          reason: finalReason,
          reportedId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit report");
      }

      toast.success("Report submitted successfully");
      onOpenChange(false);
      setReason("");
      setCustomReason("");
    } catch (error) {
      console.error("Report error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report {entityType.toLowerCase()}</DialogTitle>
          <DialogDescription>
            Please select a reason for reporting this content.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <RadioGroup value={reason} onValueChange={setReason} className="gap-3">
            {REPORT_REASONS.map((r) => (
              <div key={r} className="flex items-center space-x-2">
                <RadioGroupItem value={r} id={r} />
                <Label htmlFor={r} className="cursor-pointer">{r}</Label>
              </div>
            ))}
          </RadioGroup>

          {reason === "Other" && (
            <Textarea
              placeholder="Please provide more details..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="mt-2"
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !reason}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
