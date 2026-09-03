import type { Metadata } from "next";
import Link from "next/link";
import {
  POLICY_LAST_UPDATED,
  PRIVACY_SECTIONS,
  SERVICE_NAME,
} from "@/lib/legal-content";

/**
 * Privacy Policy.
 *
 * Deliberately at the route root rather than inside (aeko-main): legal pages
 * must be reachable without an account, because the app stores and the signup
 * flow both link to them. `/privacy` is not in middleware's protectedRoutes.
 *
 * Server-rendered with no client state, so it is fully indexable.
 */

export const metadata: Metadata = {
  title: `Privacy Policy · ${SERVICE_NAME}`,
  description: `How ${SERVICE_NAME} collects, uses and protects your personal data.`,
};

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {POLICY_LAST_UPDATED}
        </p>
      </header>

      <div className="space-y-8">
        {PRIVACY_SECTIONS.map((section) => (
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

      <footer className="mt-14 border-t pt-6">
        <Link
          href="/terms"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Terms of Service →
        </Link>
      </footer>
    </main>
  );
}
