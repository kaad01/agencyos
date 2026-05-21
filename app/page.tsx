import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, FolderKanban, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-between rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-[0_18px_48px_rgba(23,32,27,0.08)] backdrop-blur sm:p-10">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#738076]">
              Loop 1 foundation
            </p>
            <h1 className="max-w-3xl text-5xl font-black tracking-[-0.08em] text-[#17201b] sm:text-6xl">
              AgencyOS now has a Next.js shell without losing the original prototype.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#536357]">
              The App Router shell is live for dashboard, projects, tickets, time,
              reports, customers, and team. Auth.js is scaffolded so workspace auth
              can grow into the next migration slice, and the full discovery SPA stays
              available at <code>/prototype</code>.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#ff6b35] px-5 py-3 text-sm font-black text-white shadow-[0_16px_30px_rgba(255,107,53,0.18)]"
              >
                Open app shell
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/prototype"
                className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-5 py-3 text-sm font-black text-[#17201b]"
              >
                Open full prototype
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-[#fff5ed] px-5 py-3 text-sm font-black text-[#ff6b35]"
              >
                Auth.js scaffold
              </Link>
            </div>
          </div>

          <div className="agency-stat rounded-[2rem] p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                {
                  icon: FolderKanban,
                  title: "Route-based shell",
                  body: "Each core product area now has a stable URL and app-level navigation.",
                },
                {
                  icon: ShieldCheck,
                  title: "Auth.js ready",
                  body: "Credentials sign-in works locally, and GitHub can be enabled with env vars.",
                },
                {
                  icon: Clock3,
                  title: "Prototype preserved",
                  body: "The existing Vite/localStorage workflow is still reachable for migration parity.",
                },
                {
                  icon: CheckCircle2,
                  title: "Open-source friendly",
                  body: "Next.js, Tailwind, Prisma, and the current domain logic all stay in one repo.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <article
                  key={title}
                  className="rounded-[1.4rem] border border-white/10 bg-white/10 p-4"
                >
                  <Icon className="h-5 w-5 text-[#a6ef82]" />
                  <strong className="mt-3 block text-lg tracking-[-0.03em]">{title}</strong>
                  <p className="mt-2 text-sm leading-6 text-[#dce8df]">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
