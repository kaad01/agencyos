import { githubAuthEnabled } from "@/auth";
import { SignInForm } from "@/src/components/routes/sign-in-form";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="agency-stat rounded-[2rem] p-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/70">
            Auth.js scaffold
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.08em] text-white sm:text-5xl">
            Sign-in is wired for the new AgencyOS shell.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#dce8df]">
            Credentials sign-in is available immediately for local development, and GitHub
            OAuth activates automatically when <code>AUTH_GITHUB_ID</code> and{" "}
            <code>AUTH_GITHUB_SECRET</code> are set.
          </p>
        </section>
        <section className="agency-panel rounded-[2rem] p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#738076]">
            Local shell access
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-[#17201b]">
            Use any valid email and a password with at least 8 characters.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#536357]">
            This is a deliberate Loop 1 scaffold so contributors can exercise the app shell
            before real workspace membership lands in Prisma.
          </p>
          <SignInForm githubEnabled={githubAuthEnabled} />
        </section>
      </div>
    </main>
  );
}
