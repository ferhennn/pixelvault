import Link from "next/link";
import {
  ArrowRight,
  Copy,
  FolderKanban,
  ScanText,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Search,
    title: "Instant search",
    description:
      "Find any screenshot by what's in it, not what you named it. Full-text and visual search, results in milliseconds.",
  },
  {
    icon: ScanText,
    title: "OCR built in",
    description:
      "Every screenshot is scanned on upload. Search error codes, quotes, and UI copy straight out of the image.",
  },
  {
    icon: Sparkles,
    title: "AI auto-tagging",
    description:
      "Screenshots are labeled, categorized, and summarized automatically — no manual filing required.",
  },
  {
    icon: FolderKanban,
    title: "Smart collections",
    description:
      "Group screenshots into projects and boards that organize themselves as you keep adding to them.",
  },
  {
    icon: Copy,
    title: "Duplicate detection",
    description:
      "Near-identical shots and retakes get caught and merged automatically, so your library stays clean.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description:
      "Your library is yours. Encrypted storage, no public links unless you create them.",
  },
];

const steps = [
  {
    step: "01",
    title: "Drop it in",
    description: "Drag a screenshot in, paste from clipboard, or sync a folder. It's saved instantly.",
  },
  {
    step: "02",
    title: "We read it",
    description: "OCR and AI tagging run in the background — text, context, and category, extracted automatically.",
  },
  {
    step: "03",
    title: "Find it later",
    description: "Search by anything you remember. It shows up, exactly when you need it.",
  },
];

const stats = [
  { value: "10M+", label: "Screenshots organized" },
  { value: "<80ms", label: "Median search time" },
  { value: "99.9%", label: "Uptime" },
];

export default function DemoPage() {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-[14px] font-semibold tracking-tight">
              PixelVault
            </span>
          </div>
          <nav className="hidden items-center gap-7 text-[13.5px] text-muted-foreground sm:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#cta" className="transition-colors hover:text-foreground">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link href="/login" />}>
              Sign in
            </Button>
            <Button size="sm" render={<Link href="/signup" />}>
              Get started
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="flex flex-col items-center gap-8 pt-24 pb-20 text-center">
          <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
            <Sparkles className="h-3 w-3" />
            AI-powered screenshot search
          </Badge>

          <h1 className="max-w-3xl text-[44px] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-[64px]">
            Every screenshot you've ever taken.{" "}
            <span className="text-muted-foreground">Instantly findable.</span>
          </h1>

          <p className="max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            PixelVault reads, tags, and organizes every screenshot the moment
            you save it — so you search for what's in it, not what you called
            it.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" className="h-11 gap-2 rounded-full px-6 text-[15px]" render={<Link href="/signup" />}>
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-11 gap-2 rounded-full px-6 text-[15px]"
              render={<Link href="/login" />}
            >
              <Upload className="h-4 w-4" />
              See a live library
            </Button>
          </div>

          {/* Search preview */}
          <div className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-center gap-4">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
              <div className="w-full truncate rounded-full border border-border bg-card py-4 pl-12 pr-5 text-left text-[16px] text-muted-foreground shadow-sm">
                "that pricing page with the annual toggle"
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["Supabase auth", "404 error", "Figma handoff", "Stripe webhook"].map(
                (example) => (
                  <span
                    key={example}
                    className="rounded-full border border-border px-3.5 py-1.5 text-[13px] text-muted-foreground"
                  >
                    {example}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="grid grid-cols-3 gap-6 rounded-2xl border border-border bg-card px-8 py-8 ring-1 ring-foreground/5">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
              <span className="text-[28px] font-semibold tracking-tight text-foreground sm:text-[32px]">
                {stat.value}
              </span>
              <span className="text-[13px] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* Features */}
        <section id="features" className="flex flex-col gap-12 py-28">
          <div className="mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
            <h2 className="text-[32px] font-semibold tracking-tight text-foreground">
              Built to disappear into your workflow
            </h2>
            <p className="text-[15px] text-muted-foreground">
              No folders to maintain, no tags to assign by hand. Save a
              screenshot and PixelVault does the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="px-1">
                <CardContent className="flex flex-col gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="flex flex-col gap-12 border-t border-border py-28">
          <div className="mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
            <h2 className="text-[32px] font-semibold tracking-tight text-foreground">
              Three steps. Zero filing.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="flex flex-col gap-2">
                <span className="text-[13px] font-medium text-primary">
                  {item.step}
                </span>
                <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section
          id="cta"
          className="mb-24 flex flex-col items-center gap-6 rounded-3xl border border-border bg-card px-8 py-16 text-center ring-1 ring-foreground/5"
        >
          <h2 className="max-w-md text-[28px] font-semibold tracking-tight text-foreground sm:text-[32px]">
            Stop scrolling through your camera roll
          </h2>
          <p className="max-w-sm text-[15px] text-muted-foreground">
            Free for up to 500 screenshots. No credit card required.
          </p>
          <Button size="lg" className="h-11 gap-2 rounded-full px-6 text-[15px]" render={<Link href="/signup" />}>
            Create your library
            <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="text-[13px] text-muted-foreground">
            &copy; {new Date().getFullYear()} PixelVault. All rights reserved.
          </span>
          <div className="flex items-center gap-5 text-[13px] text-muted-foreground">
            <Link href="/login" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
            <Link href="/signup" className="transition-colors hover:text-foreground">
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
