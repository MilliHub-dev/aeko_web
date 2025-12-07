"use client";

import { useActionState, useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmailAction, resendVerificationAction } from "../actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/logo";

const initialState = {
  message: "",
  success: false,
};

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [state, formAction, isPending] = useActionState(
    verifyEmailAction,
    initialState
  );
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendMessage, setResendMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 4) newOtp[index] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 3)]?.focus();
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setResendMessage("");

    const result = await resendVerificationAction(email);
    setResendMessage(result.message);
    setIsResending(false);
  };

  // Mask email for display
  const maskedEmail = email
    ? email.replace(/(.{3})(.*)(@.*)/, "$1*******$3")
    : "";

  return (
    <div className="relative z-10 w-full max-w-md px-6 py-12 text-center">
      <h1 className="text-3xl font-bold text-white mb-4">Verification</h1>
      <p className="text-white/70 mb-12">
        We've sent a code to {maskedEmail || "your email"}
      </p>

      <form action={formAction} className="space-y-8">
        <input type="hidden" name="email" value={email || ""} />
        <input type="hidden" name="code" value={otp.join("")} />

        <div className="flex justify-center gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-16 h-16 rounded-xl border border-white/30 bg-transparent text-center text-2xl text-white focus:border-white focus:outline-none transition-colors"
              placeholder="0"
            />
          ))}
        </div>

        {state?.message && !state.success && (
          <p className="text-red-400 text-sm">{state.message}</p>
        )}

        {resendMessage && (
          <p className="text-green-400 text-sm">{resendMessage}</p>
        )}

        <div className="space-y-4 mt-12">
          <p className="text-white/70 text-sm">Didn't receive code?</p>

          <Button
            type="submit"
            disabled={isPending || otp.some((d) => !d)}
            className="w-full h-14 rounded-full bg-[#005c4b] hover:bg-[#004d3f] text-white border border-white/10 text-lg font-medium">
            {isPending ? "Verifying..." : "Verify"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleResend}
            disabled={isResending}
            className="w-full h-14 rounded-full bg-transparent border-white/30 text-white hover:bg-white/5 hover:text-white text-lg font-medium">
            {isResending ? "Sending..." : "Resend code"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[radial-gradient(120%_120%_at_30%_10%,#007F6D,#003B33)] flex flex-col">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_0%,transparent,rgba(0,0,0,0.04))]" />

      <header className="relative z-20 mx-auto w-full max-w-[1920px] p-6 lg:px-12 lg:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-16 lg:w-24">
            <Logo />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center">
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </main>
  );
}
