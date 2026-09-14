import type { Metadata } from "next";
import Link from "next/link";
import {
  CHILD_SAFETY_CONTACT_EMAIL,
  CHILD_SAFETY_LAST_UPDATED,
  CHILD_SAFETY_SECTIONS,
  SERVICE_NAME,
} from "@/lib/legal-content";

/**
 * Child Safety Standards (CSAE).
 *
 * Google Play requires social apps to link to published standards against child
 * sexual abuse and exploitation. Like /privacy and /terms it sits at the route
 * root, outside (aeko-main), so it is reachable without an account; the path is
 * not in middleware's protectedRoutes.
 */

export const metadata: Metadata = {
  title: `Child Safety Standards · ${SERVICE_NAME}`,
  description: `${SERVICE_NAME}'s standards against child sexual abuse and exploitation (CSAE), and how to report it.`,
};

export default function ChildSafetyStandardsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <nav className="mb-10">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to {SERVICE_NAME}
        </Link>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Child Safety Standards
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {CHILD_SAFETY_LAST_UPDATED}
        </p>
      </header>

      <div className="mb-10 rounded-lg border p-5">
        <p className="text-sm font-semibold">Report a child safety concern</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Use Report in the app, or email{" "}
          <a
            href={`mailto:${CHILD_SAFETY_CONTACT_EMAIL}`}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {CHILD_SAFETY_CONTACT_EMAIL}
          </a>
          . If a child is in immediate danger, contact local police or emergency
          services first.
        </p>
      </div>

      <div className="space-y-8">
        {CHILD_SAFETY_SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-14 flex flex-wrap gap-6 border-t pt-6">
        <Link
          href="/terms"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Terms of Service →
        </Link>
        <Link
          href="/privacy"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Privacy Policy →
        </Link>
      </footer>
    </main>
  );
}
