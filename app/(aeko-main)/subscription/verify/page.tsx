"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      const paymentMethod = searchParams.get("paymentMethod");

      if (!reference) {
        setVerifying(false);
        setSuccess(false);
        setMessage("Invalid verification link. Missing transaction reference.");
        return;
      }

      try {
        const query = new URLSearchParams();
        query.append("reference", reference);
        if (paymentMethod) query.append("paymentMethod", paymentMethod);

        const res = await fetch(`/api/subscription/verify?${query.toString()}`);
        const data = await res.json();

        if (data.success) {
          setSuccess(true);
          setMessage(data.data?.message || "Subscription activated successfully!");
          setDetails(data.data);
        } else {
          setSuccess(false);
          setMessage(data.message || "Payment verification failed.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setSuccess(false);
        setMessage("An error occurred while verifying your payment.");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          {success ? (
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          ) : (
            <XCircle className="h-10 w-10 text-destructive" />
          )}
        </div>
        <CardTitle className="text-2xl font-bold">
          {success ? "Payment Successful!" : "Payment Failed"}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          {message}
        </p>
        {success && details && (
          <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{details.currency} {details.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium capitalize text-green-600">{details.status}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        {success ? (
          <Button asChild size="lg" className="w-full">
            <Link href="/subscription">
              View My Subscription <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/subscription">
              Try Again
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
