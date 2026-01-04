"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/landing/landing-header";
import { FloatingCards } from "@/components/landing/floating-cards";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

import { loginAction, LoginState } from "../actions";

const initialState: LoginState = {
  message: "",
  errors: {},
  success: false,
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const images = [
    "/posts/street-photography.jpg",
    "/users/sarah-johnson.jpeg",
    "/posts/interior-design.jpg",
    "/users/mike-chen.jpg",
  ];

  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <main className="min-h-screen relative overflow-hidden bg-[radial-gradient(120%_120%_at_30%_10%,#007F6D,#003B33)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_0%,transparent,rgba(0,0,0,0.04))]" />

      <LandingHeader />

      <section className="relative mx-auto max-w-xl lg:max-w-7xl 2xl:max-w-[1600px] px-6 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 place-content-center lg:items-center min-h-[50vh] xl:min-h-[70vh]">
        {/* Form card */}
        <div className="relative z-10">
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-6 sm:p-8 lg:p-10 xl:p-12 shadow-[inset_0_1px_4px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.35),0_0_12px_rgba(255,255,255,0.15)] max-w-xl lg:max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-2">
              Welcome back
            </h1>
            <p className="text-secondary/80 mb-8 text-base lg:text-lg">
              Sign in to continue to Aeko.
            </p>

            <form action={formAction} className="space-y-4 text-secondary">
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
                {state.errors?.email && (
                  <p className="text-red-400 text-sm">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
              <div className="flex items-center justify-between text-sm">
                <Link
                  href="#"
                  className="underline text-secondary/90 hover:text-secondary">
                  Forgot password?
                </Link>
              </div>

              {state.message && (
                <p className="text-sm  text-red-400">{state.message}</p>
              )}

              <Button
                disabled={isPending}
                className="w-full btn-glass rounded-xl h-12 md:h-12 lg:h-14 text-base lg:text-lg">
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="text-center text-secondary/90 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline hover:text-secondary">
                Create one
              </Link>
            </p>
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
