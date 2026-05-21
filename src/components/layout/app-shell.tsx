import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { auth, signOut } from "@/auth";
import { SidebarNav } from "@/src/components/layout/sidebar-nav";

export async function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="agency-shell">
      <aside className="agency-sidebar flex flex-col gap-8 px-7 py-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#17201b] text-lg font-black text-white shadow-[0_14px_30px_rgba(23,32,27,0.18)]">
            A
          </div>
          <div>
            <strong className="block text-base font-black text-[#17201b]">AgencyOS</strong>
            <small className="text-sm text-[#66736b]">Consulting operations</small>
          </div>
        </div>

        <SidebarNav />

        <div className="mt-auto rounded-[1.7rem] border border-[#276e32]/10 bg-[#e5f7db] p-5">
          <div className="flex items-center gap-2 text-[#17201b]">
            <CheckCircle2 className="h-5 w-5" />
            <strong className="text-sm font-black">Migration safety rail</strong>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#536357]">
            The full localStorage prototype is still available while Next.js routes and
            Auth.js sessions take shape.
          </p>
          <Link
            href="/prototype"
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-black text-[#17201b]"
          >
            Open prototype
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </aside>

      <main className="min-w-0 px-6 py-8 sm:px-8 lg:px-10">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#738076]">
              Next.js app shell
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[#17201b] sm:text-4xl">
              Route-based AgencyOS foundation
            </h1>
          </div>

          <div className="agency-panel rounded-[1.4rem] px-4 py-3">
            {session?.user ? (
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <strong className="block text-sm font-black text-[#17201b]">
                    {session.user.name ?? "Signed-in teammate"}
                  </strong>
                  <small className="text-sm text-[#66736b]">
                    {session.user.email ?? "Credentials scaffold session"}
                  </small>
                </div>
                <form action={handleSignOut}>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#17201b] px-4 py-2 text-sm font-black text-white"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <strong className="block text-sm font-black text-[#17201b]">
                    Auth scaffold ready
                  </strong>
                  <small className="text-sm text-[#66736b]">
                    Credentials works locally. GitHub enables with env vars.
                  </small>
                </div>
                <Link
                  href="/sign-in"
                  className="rounded-xl bg-[#ff6b35] px-4 py-2 text-sm font-black text-white"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
