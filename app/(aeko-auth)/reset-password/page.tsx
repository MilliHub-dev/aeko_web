"use client";

import { useActionState, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LandingHeader } from "@/components/landing/landing-header";
import { FloatingCards } from "@/components/landing/floating-cards";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { resetPasswordAction, ResetPasswordState } from "../actions";
import { Eye, EyeOff } from "lucide-react";

const initialState: ResetPasswordState = {
  message: "",
  errors: {},
  success: false,
};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const images = [
    "/posts/street-photography.jpg",
    "/users/sarah-johnson.jpeg",
    "/posts/interior-design.jpg",
    "/users/mike-chen.jpg",
  ];

  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState
  );

  if (!token) {
    return (
       <main className="min-h-screen relative overflow-hidden bg-[radial-gradient(120%_120%_at_30%_10%,#007F6D,#003B33)]">
        <LandingHeader />
        <section className="relative mx-auto max-w-xl lg:max-w-7xl px-6 py-16 flex items-center justify-center min-h-[70vh]">
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl text-center text-white border border-white/20">
            <h1 className="text-3xl font-bold mb-4">Invalid Link</h1>
            <p className="mb-6 text-white/80">This password reset link is invalid or has expired.</p>
            <Button asChild className="btn-glass">
              <Link href="/forgot-password">Request a new link</Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-[radial-gradient(120%_120%_at_30%_10%,#007F6D,#003B33)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_0%,transparent,rgba(0,0,0,0.04))]" />

      <LandingHeader />

      <section className="relative mx-auto max-w-xl lg:max-w-7xl 2xl:max-w-[1600px] px-6 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 place-content-center lg:items-center min-h-[50vh] xl:min-h-[70vh]">
        {/* Form card */}
        <div className="relative z-10">
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-6 sm:p-8 lg:p-10 xl:p-12 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.15)] max-w-xl lg:max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-2">
              Reset Password
            </h1>
            <p className="text-secondary/80 mb-8 text-base lg:text-lg">
              Create a new password for your account.
            </p>

            <form action={formAction} className="space-y-4 text-secondary">
              <input type="hidden" name="token" value={token} />
              
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="h-12 md:h-12 lg:h-14 text-base lg:text-lg px-4 pr-10 placeholder:text-secondary/80"
                  />
                   <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/70 hover:text-secondary focus:outline-none">
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                 {state.errors?.password && (
                  <p className="text-red-400 text-sm">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="h-12 md:h-12 lg:h-14 text-base lg:text-lg px-4 pr-10 placeholder:text-secondary/80"
                  />
                   <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/70 hover:text-secondary focus:outline-none">
                    {showConfirm ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {state.message && (
                <p className="text-sm text-red-400">{state.message}</p>
              )}

              <Button
                disabled={isPending}
                className="w-full btn-glass rounded-xl h-12 md:h-12 lg:h-14 text-base lg:text-lg">
                {isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </div>
        </div>

        {/* Decorative cards */}
        <div className="hidden lg:block">
          <FloatingCards images={images} />
        </div>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[radial-gradient(120%_120%_at_30%_10%,#007F6D,#003B33)]" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
