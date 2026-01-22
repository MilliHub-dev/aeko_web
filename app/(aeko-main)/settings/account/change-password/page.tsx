"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Change Password page – client side validation:
 *  - Current password must be non‑empty.
 *  - New password must be at least 8 characters (simple rule).
 *  - Confirm password must match new password.
 *  - "Update Password" button is disabled until the form is valid.
 *  - Error messages are shown inline.
 */
export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const isCurrentValid = currentPassword.length > 0;
  const isNewValid = newPassword.length >= 8;
  const isConfirmValid = confirmPassword === newPassword && confirmPassword.length > 0;

  const canSubmit = isCurrentValid && isNewValid && isConfirmValid;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // In a real app you would call an API endpoint here.
    console.log("Changing password", {
      currentPassword,
      newPassword,
    });
    alert("Password updated (demo)");
    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTouched({ current: false, new: false, confirm: false });
  };

  const onBlur =
    (field: keyof typeof touched) => (e: ChangeEvent<HTMLInputElement>) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
    };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      {/* Header with back navigation */}
      <div className="flex items-center mb-4">
        <Link href="/settings/account" legacyBehavior>
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Change Password</h1>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Update Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onBlur={onBlur("current")}
                placeholder="Enter current password"
                required
                className={!isCurrentValid && touched.current ? "border-red-500" : ""}
              />
              {!isCurrentValid && touched.current && (
                <p className="text-sm text-red-600">Password required</p>
              )}
            </div>

            {/* New Password */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={onBlur("new")}
                placeholder="Minimum 8 characters"
                required
                className={!isNewValid && touched.new ? "border-red-500" : ""}
              />
              {!isNewValid && touched.new && (
                <p className="text-sm text-red-600">
                  New password must be at least 8 characters
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={onBlur("confirm")}
                placeholder="Repeat new password"
                required
                className={!isConfirmValid && touched.confirm ? "border-red-500" : ""}
              />
              {!isConfirmValid && touched.confirm && (
                <p className="text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            <Button type="submit" disabled={!canSubmit} className="w-full mt-2">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
