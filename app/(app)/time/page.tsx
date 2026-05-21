import { initialData } from "@/src/domain";
import { ShellPage } from "@/src/components/routes/shell-page";
import { colleagueName, projectName, ticketName } from "@/src/lib/demo-helpers";

export default function TimePage() {
  return (
    <ShellPage
      eyebrow="Time"
      title="Time tracking is ready for Auth.js-backed teammates and workspace identity."
      description="This shell route keeps the timesheet language, billable/internal split, and reporting context intact while the current timer and CRUD workflow remain available in the preserved prototype."
      note="Use /prototype for the full timer, weekly review, and scoped CSV export experience during migration."
    >
      <section className="grid gap-4">
        {initialData.timeEntries.map((entry) => (
          <article key={entry.id} className="agency-panel rounded-[1.5rem] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#738076]">
                  {entry.date}
                </p>
                <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#17201b]">
                  {projectName(entry.projectId)}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#536357]">
                  {ticketName(entry.ticketId)} · {colleagueName(entry.colleagueId)} · {entry.note}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`agency-badge ${
                    entry.billable ? "agency-badge--green" : "agency-badge--neutral"
                  }`}
                >
                  {entry.billable ? "Billable" : "Internal"}
                </span>
                <strong className="mt-3 block text-2xl font-black tracking-[-0.05em] text-[#17201b]">
                  {entry.hours}h
                </strong>
              </div>
            </div>
          </article>
        ))}
      </section>
    </ShellPage>
  );
}
