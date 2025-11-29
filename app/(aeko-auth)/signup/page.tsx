"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LandingHeader } from "@/components/landing/landing-header";
import { FloatingCards } from "@/components/landing/floating-cards";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signupAction, SignupState } from "../actions";

const initialState: SignupState = {
  message: "",
  errors: {},
  success: false,
};

export default function SignupPage() {
  const images = [
    "/posts/street-photography.jpg",
    "/users/sarah-johnson.jpeg",
    "/posts/interior-design.jpg",
    "/users/mike-chen.jpg",
  ];

  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState
  );

  return (
    <main className="min-h-screen relative overflow-hidden bg-[radial-gradient(120%_120%_at_30%_10%,#007F6D,#003B33)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_0%,transparent,rgba(0,0,0,0.04))]" />

      <LandingHeader />

      <section className="relative mx-auto max-w-xl lg:max-w-7xl 2xl:max-w-[1600px] px-6 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 place-content-center lg:items-center min-h-[50vh] xl:min-h-[70vh]">
        {/* Form card */}
        <div className="relative z-10 order-2 lg:order-1">
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-6 sm:p-8 lg:p-10 xl:p-12 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.15)] max-w-xl lg:max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-2">
              Create your account
            </h1>
            <p className="text-secondary/80 mb-8 text-base lg:text-lg">
              Join Aeko and start connecting.
            </p>

            <form action={formAction} className="space-y-4 text-secondary">
              {state?.message && !state.success && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-100 text-sm">
                  {state.message}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  required
                  className="h-12 md:h-12 lg:h-14 text-base lg:text-lg px-4 placeholder:text-secondary/80"
                />
                {state?.errors?.name && (
                  <p className="text-red-300 text-sm">{state.errors.name[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="@janedoe"
                  required
                  className="h-12 md:h-12 lg:h-14 text-base lg:text-lg px-4 placeholder:text-secondary/80"
                />
                {state?.errors?.username && (
                  <p className="text-red-300 text-sm">
                    {state.errors.username[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="h-12 md:h-12 lg:h-14 text-base lg:text-lg px-4 placeholder:text-secondary/80"
                />
                {state?.errors?.email && (
                  <p className="text-red-300 text-sm">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="h-12 md:h-12 lg:h-14 text-base lg:text-lg px-4 placeholder:text-secondary/80"
                  />
                  {state?.errors?.password && (
                    <p className="text-red-300 text-sm">
                      {state.errors.password[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input
                    id="confirm"
                    name="confirm"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="h-12 md:h-12 lg:h-14 text-base lg:text-lg px-4 placeholder:text-secondary/80"
                  />
                </div>
              </div>
              <div className="text-sm text-secondary/90">
                By signing up, you agree to our{" "}
                <Link href="#" className="underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline">
                  Privacy Policy
                </Link>
                .
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full btn-glass rounded-xl h-12 md:h-12 lg:h-14 text-base lg:text-lg">
                {isPending ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <p className="text-center text-secondary/90 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="underline hover:text-secondary">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative cards */}
        <div className="hidden lg:block order-1 lg:order-2">
          <FloatingCards images={images} />
        </div>
      </section>
    </main>
  );
}
