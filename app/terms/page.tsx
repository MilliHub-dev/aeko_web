import type { Metadata } from "next";
import Link from "next/link";
import {
  POLICY_LAST_UPDATED,
  SERVICE_NAME,
  TERMS_SECTIONS,
} from "@/lib/legal-content";

/**
 * Terms of Service.
 *
 * At the route root for the same reason as /privacy: it must be readable
 * without an account, and it is linked from signup and the store listings.
 */

export const metadata: Metadata = {
  title: `Terms of Service · ${SERVICE_NAME}`,
  description: `The terms that govern your use of ${SERVICE_NAME}.`,
};

export default function TermsOfServicePage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {POLICY_LAST_UPDATED}
        </p>
      </header>

      <div className="space-y-8">
        {TERMS_SECTIONS.map((section) => (
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
          href="/privacy"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Privacy Policy →
        </Link>
      </footer>
    </main>
  );
}
