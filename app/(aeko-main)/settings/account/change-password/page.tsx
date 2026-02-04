"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/profile/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully");
        router.push("/settings/account");
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("An error occurred while updating password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-8 md:px-8 max-w-7xl mx-auto w-full">
      {/* Header with back navigation */}
      <div className="flex items-center mb-8 gap-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
          <Link href="/settings/account">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Change Password</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Ensure your account is secure with a strong password</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                <KeyRound className="w-5 h-5" />
              </div>
              <CardTitle>Update Password</CardTitle>
            </div>
            <CardDescription>
              Enter your current password and choose a new one.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className={
                      confirmPassword && newPassword !== confirmPassword
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              <Alert variant="default" className="bg-muted/50 border-primary/20">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle>Password Requirements</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground mt-1">
                  • At least 8 characters long<br />
                  • Include at least one number or symbol<br />
                  • Different from your previous password
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
