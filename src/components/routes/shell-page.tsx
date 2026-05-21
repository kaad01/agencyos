import Link from "next/link";

export function ShellPage({
  eyebrow,
  title,
  description,
  note,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="agency-stat rounded-[2rem] p-7">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/70">
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-4xl text-4xl font-black tracking-[-0.07em] text-white sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#dce8df]">{description}</p>
        </article>

        <article className="agency-panel rounded-[2rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#738076]">
            Migration note
          </p>
          <p className="mt-3 text-base leading-8 text-[#536357]">{note}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/prototype"
              className="rounded-2xl bg-[#fff5ed] px-4 py-3 text-sm font-black text-[#ff6b35]"
            >
              Full prototype
            </Link>
            <Link
              href="/sign-in"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-black text-[#17201b]"
            >
              Auth scaffold
            </Link>
          </div>
        </article>
      </section>

      {children}
    </div>
  );
}
