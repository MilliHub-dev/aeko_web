"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, ShieldCheck, Zap, Crown, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: string;
  features: string[];
  limits?: string[];
  targetAudience: string;
  recommended?: boolean;
}

interface SubscriptionStatus {
  subscriptionStatus: "active" | "inactive";
  subscriptionExpiry?: string;
  subscriptionPlan?: {
    id: string;
    name: string;
    price: number;
  };
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializingPlanId, setInitializingPlanId] = useState<string | null>(null);
  
  // 2FA State
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  
  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState("paystack");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, statusRes] = await Promise.all([
          fetch("/api/subscription-plans"),
          fetch("/api/subscription/status")
        ]);

        const plansData = await plansRes.json();
        const statusData = await statusRes.json();

        if (plansData.success) {
          setPlans(plansData.data);
        }
        
        if (statusData.success) {
          setStatus(statusData.data);
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        toast.error("Failed to load subscription details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubscribe = async (planId: string, otp?: string) => {
    setInitializingPlanId(planId);
    if (otp) setIsVerifying2FA(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (otp) {
        headers["x-2fa-token"] = otp;
      }

      const res = await fetch("/api/subscription/initialize", {
        method: "POST",
        headers,
        body: JSON.stringify({
          planId,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Redirect to payment provider
        window.location.href = data.data.authorization_url;
      } else if (data.code === "2FA_REQUIRED") {
        setPendingPlanId(planId);
        setShow2FADialog(true);
        setInitializingPlanId(null);
        setIsVerifying2FA(false);
      } else {
        toast.error(data.message || "Failed to initialize payment");
        setInitializingPlanId(null);
        setIsVerifying2FA(false);
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("An error occurred while starting payment");
      setInitializingPlanId(null);
      setIsVerifying2FA(false);
    }
  };

  const handle2FASubmit = () => {
    if (!otpCode) {
      toast.error("Please enter the 2FA code");
      return;
    }
    if (pendingPlanId) {
      handleSubscribe(pendingPlanId, otpCode);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock exclusive features, boost your reach, and monetize your content with Aeko Premium.
          </p>
        </div>

        {status?.subscriptionStatus === "active" && (
          <div className="max-w-md mx-auto">
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Active Subscription
                </CardTitle>
                <CardDescription>
                  You are currently subscribed to <strong>{status.subscriptionPlan?.name}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Expires on: {new Date(status.subscriptionExpiry!).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = status?.subscriptionPlan?.id === plan.id;
            const isElite = plan.name.toLowerCase().includes("elite");
            const isPro = plan.name.toLowerCase().includes("pro");

            return (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col ${
                  isCurrentPlan ? "border-primary shadow-lg shadow-primary/10" : 
                  isElite ? "border-amber-500/50 shadow-lg shadow-amber-500/10" : ""
                }`}
              >
                {isElite && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1">
                      Best Value
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    {isElite ? <Crown className="w-8 h-8 text-amber-500" /> : 
                     isPro ? <Zap className="w-8 h-8 text-purple-500" /> : 
                     <ShieldCheck className="w-8 h-8 text-blue-500" />}
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">
                      {plan.currency === "USD" ? "$" : plan.currency}{plan.price}
                    </span>
                    <span className="text-muted-foreground">/{plan.duration}</span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.targetAudience}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                    {plan.limits?.map((limit, i) => (
                      <li key={`limit-${i}`} className="flex items-start gap-2 text-sm opacity-70">
                        <X className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{limit}</span>
                      </li>
                    ))}
                  </ul>
                  {isElite && (
                    <div className="mt-4 flex items-center gap-2">
                      <Image
                        src="/ticks/pride_tick.jpg"
                        alt="Pride Tick"
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                      <Image
                        src="/ticks/green_tick.jpg"
                        alt="Green Business Tick"
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                      <span className="text-xs font-medium text-amber-600">
                        Exclusive on Aeko Elite
                      </span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <div className="w-full">
                    <Label className="text-xs mb-2 block text-muted-foreground">Payment Method</Label>
                    <RadioGroup 
                      defaultValue="paystack" 
                      value={paymentMethod} 
                      onValueChange={setPaymentMethod}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paystack" id={`paystack-${plan.id}`} />
                        <Label htmlFor={`paystack-${plan.id}`}>Paystack</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stripe" id={`stripe-${plan.id}`} />
                        <Label htmlFor={`stripe-${plan.id}`}>Stripe</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={isCurrentPlan || initializingPlanId !== null}
                    variant={isElite ? "default" : isCurrentPlan ? "outline" : "secondary"}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {initializingPlanId === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Please enter the OTP code from your authenticator app to confirm this transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="otp">OTP Code</Label>
            <Input
              id="otp"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="mt-2 text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FADialog(false)}>
              Cancel
            </Button>
            <Button onClick={handle2FASubmit} disabled={isVerifying2FA}>
              {isVerifying2FA ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Confirm Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
