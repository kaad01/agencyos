import { calculateMetrics, customerReportRollups, filterTimeEntriesForReport, initialData } from "@/src/domain";
import { ShellPage } from "@/src/components/routes/shell-page";
import { formatEuro } from "@/src/lib/demo-helpers";

export default function ReportsPage() {
  const reportEntries = filterTimeEntriesForReport(initialData, {
    period: "all",
    customerId: "",
    projectId: "",
    colleagueId: "",
    billable: "all",
  });
  const scopedMetrics = calculateMetrics({ ...initialData, timeEntries: reportEntries });
  const customerRollups = customerReportRollups(initialData, reportEntries);

  return (
    <ShellPage
      eyebrow="Reports"
      title="Report routes are in place for profitability, scope review, and export workflows."
      description="The current shell keeps the reporting voice accurate: hours, earned revenue, billable ratio, and CSV exports are still driven by time entries, not placeholder analytics."
      note="Current CSV behavior remains time-entry based in the prototype and will move into server-backed exports in a later loop."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <ReportStat label="Tracked hours" value={`${scopedMetrics.totalHours}h`} />
        <ReportStat label="Billable ratio" value={`${scopedMetrics.utilization}%`} />
        <ReportStat label="Earned revenue" value={formatEuro(scopedMetrics.revenue)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="agency-panel rounded-[1.75rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#738076]">
            Reporting workflow
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#17201b]">
            Current CSV export behavior
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#536357]">
            AgencyOS currently exports time-entry rows filtered by report scope. That
            keeps spreadsheet-based client reviews and billing prep understandable while
            deeper server-side reporting lands.
          </p>
        </article>

        <article className="agency-panel rounded-[1.75rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#738076]">
            Customer rollups
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#17201b]">
            Client value in scope
          </h2>
          <div className="mt-5 grid gap-3">
            {customerRollups.map((rollup) => (
              <div key={rollup.customer.id} className="rounded-[1.15rem] bg-[#f8f6ef] p-4">
                <strong className="block text-base font-black tracking-[-0.03em] text-[#17201b]">
                  {rollup.customer.name}
                </strong>
                <p className="mt-1 text-sm text-[#66736b]">
                  {rollup.hours}h total · {rollup.billableHours}h billable ·{" "}
                  {formatEuro(rollup.revenue)} earned
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </ShellPage>
  );
}

function ReportStat({ label, value }: { label: string; value: string }) {
  return (
    <article className="agency-stat rounded-[1.5rem] p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">{label}</p>
      <strong className="mt-2 block text-3xl font-black tracking-[-0.05em]">{value}</strong>
    </article>
  );
}
