"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowLeft, UserPen, Lock, Headphones, ChevronRight, Trash2, AlertTriangle, ShieldCheck, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useUser } from "@/components/shared/user-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AccountSettingsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoadingSub, setIsLoadingSub] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch("/api/subscription/status");
        const data = await res.json();
        if (data.success) {
          setSubscription(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      } finally {
        setIsLoadingSub(false);
      }
    };
    fetchSubscription();
  }, []);

  const sections = [
    {
      href: "/settings/account/edit-profile",
      title: "Edit Profile",
      description: "Update your name, username, bio and pictures",
      icon: UserPen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      href: "/settings/account/change-password",
      title: "Change Password",
      description: "Update your password with validation",
      icon: Lock,
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    {
      href: "/settings/account/contact-support",
      title: "Contact Support",
      description: "Send a ticket or report a problem",
      icon: Headphones,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
  ];

  const handleDeleteAccount = async () => {
    if (!user?.id && !user?._id) return;
    
    setIsDeleting(true);
    try {
      const userId = user.id || user._id;
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      toast.success("Account deleted successfully");
      // Redirect to login or home
      router.push("/login");
      router.refresh();
      
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete account");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-8 md:px-8 max-w-7xl mx-auto w-full">
      {/* Header with back navigation */}
      <div className="flex items-center mb-8 gap-4">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
          <Link href="/settings">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Account & Profile</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your personal information and security</p>
        </div>
      </div>

      {/* Subscription Status Section */}
      <div className="mb-8">
        <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-3 rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">Subscription Plan</CardTitle>
              <CardDescription>Your current plan details and status</CardDescription>
            </div>
            <Button variant={subscription?.subscriptionStatus === "active" ? "outline" : "default"} asChild>
              <Link href="/subscription">
                {subscription?.subscriptionStatus === "active" ? "Manage Plan" : "Upgrade Now"}
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingSub ? (
              <div className="flex items-center gap-2 text-muted-foreground py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading subscription details...</span>
              </div>
            ) : subscription?.subscriptionStatus === "active" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
                    <p className="text-lg font-bold text-primary flex items-center gap-2">
                      {subscription.subscriptionPlan?.name || "Premium Plan"}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 font-medium">Active</span>
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Expires On</p>
                    <p className="font-medium">
                      {subscription.subscriptionExpiry 
                        ? new Date(subscription.subscriptionExpiry).toLocaleDateString(undefined, { dateStyle: 'medium' }) 
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Free Plan</p>
                    <p className="text-sm text-muted-foreground">You are currently on the free plan</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-muted-foreground">Upgrade to unlock</p>
                  <p className="text-xs text-primary font-medium">Premium Features</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {sections.map((sec) => (
          <Link key={sec.href} href={sec.href} className="group block h-full outline-none">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 border-muted-foreground/10 overflow-hidden relative">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <div className={`p-3 rounded-xl ${sec.bgColor} ${sec.color} ring-1 ring-inset ring-black/5 dark:ring-white/10 transition-transform group-hover:scale-110 duration-300`}>
                  <sec.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center justify-between">
                    {sec.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed mb-4">
                    {sec.description}
                </CardDescription>
                <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 absolute bottom-4 right-4">
                  Go <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="border border-destructive/20 rounded-xl overflow-hidden bg-destructive/5">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-destructive flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Permanently delete your account and all of your content. This action cannot be undone.
          </p>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
