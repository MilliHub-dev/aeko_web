"use client";

import Link from "next/link";

const trendingTopics = [
  { tag: "#aekoDesign", change: "+48%" },
  { tag: "#liteDrop", change: "Stable" },
  { tag: "#collabzone", change: "+18%" },
];

const creatorSpotlights = [
  {
    name: "Riley Porter",
    handle: "@riley_ui",
    avatar: "/users/sarah-johnson.jpeg",
    category: "UX Shots",
  },
  {
    name: "Maya Kelvin",
    handle: "@maya.motion",
    avatar: "/users/lisa-wong.jpeg",
    category: "Motion",
  },
];

const schedule = [
  {
    title: "Live critique session",
    time: "Today, 5:00 PM",
    cta: "Join room",
  },
  {
    title: "Drop reminder",
    time: "Tomorrow, 9:45 AM",
    cta: "Set alert",
  },
];

export function RightSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-full shrink-0 xl:flex border-l">
      <div className="flex h-full w-full flex-col gap-6 overflow-hidden border-none">
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <section className="rounded-3xl border border-border/60 bg-muted p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Overview
            </p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-foreground">2.4K</h3>
                <p className="text-sm text-muted-foreground">
                  Interactions this week
                </p>
              </div>
              <span className="rounded-full bg-emerald-200/30 px-3 py-1 text-xs font-medium text-emerald-500">
                +12%
              </span>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                Trending
              </p>
              <Link
                href="/explore"
                className="text-xs text-primary hover:text-primary/80">
                See all
              </Link>
            </div>
            <div className="space-y-3">
              {trendingTopics.map((topic) => (
                <button
                  key={topic.tag}
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-border/60 bg-muted px-4 py-3 text-sm text-muted-foreground transition hover:bg-muted/80 hover:text-foreground">
                  <span>{topic.tag}</span>
                  <span className="text-xs text-emerald-500">
                    {topic.change}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                Creators
              </p>
              <Link
                href="/communities"
                className="text-xs text-primary hover:text-primary/80">
                View profiles
              </Link>
            </div>
            <div className="space-y-3">
              {creatorSpotlights.map((creator) => (
                <div
                  key={creator.handle}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted px-3 py-3 text-sm text-muted-foreground transition hover:bg-muted/80 hover:text-foreground">
                  <span className="flex items-center gap-3">
                    <span className="relative h-10 w-10 overflow-hidden rounded-full border border-border/60">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="flex flex-col">
                      <strong className="text-foreground">
                        {creator.name}
                      </strong>
                      <span className="text-xs text-muted-foreground">
                        {creator.category}
                      </span>
                    </span>
                  </span>
                  <Link
                    href={`/messages?with=${creator.handle}`}
                    className="text-xs text-primary hover:text-primary/80">
                    Connect
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Schedule
            </p>
            <div className="space-y-3">
              {schedule.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/60 bg-muted px-4 py-3 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground/80">
                    {item.time}
                  </p>
                  <Link
                    href="/calendar"
                    className="mt-3 inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80">
                    {item.cta}
                  </Link>
                </div>
              ))}
            </div>
          </section> */}
        </div>
      </div>
    </aside>
  );
}
