import { BriefcaseBusiness, CircleDollarSign, TicketCheck, TimerReset } from "lucide-react";
import { calculateMetrics, initialData } from "@/src/domain";
import { ShellPage } from "@/src/components/routes/shell-page";
import { customerName, projectStatusTone } from "@/src/lib/demo-helpers";

export default function DashboardPage() {
  const metrics = calculateMetrics(initialData);
  const spotlightProjects = initialData.projects.slice(0, 3);
  const urgentTickets = initialData.tickets.filter((ticket) =>
    ["High", "Urgent"].includes(ticket.priority),
  );

  return (
    <ShellPage
      eyebrow="Dashboard"
      title="Agency operations that connect work, people, and money."
      description="This App Router shell keeps AgencyOS route-based and ready for real auth, while the current delivery workflow stays grounded in the same prototype data and language."
      note="The full interactive SPA remains available at /prototype during the migration."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: BriefcaseBusiness,
            label: "Active projects",
            value: String(metrics.activeProjects),
            detail: `${metrics.atRisk} at risk need attention`,
          },
          {
            icon: TicketCheck,
            label: "Open tickets",
            value: String(metrics.openTickets),
            detail: "Backlog through done stays visible",
          },
          {
            icon: TimerReset,
            label: "Billable hours",
            value: `${metrics.billableHours}h`,
            detail: `${metrics.totalHours}h logged total`,
          },
          {
            icon: CircleDollarSign,
            label: "Earned revenue",
            value: `${metrics.revenue.toLocaleString("en-US")} EUR`,
            detail: `${metrics.utilization}% billable ratio`,
          },
        ].map(({ icon: Icon, label, value, detail }) => (
          <article key={label} className="agency-stat rounded-[1.75rem] p-5">
            <Icon className="h-5 w-5 text-[#a6ef82]" />
            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-white/70">
              {label}
            </p>
            <strong className="mt-2 block text-3xl font-black tracking-[-0.06em]">
              {value}
            </strong>
            <p className="mt-2 text-sm text-[#dce8df]">{detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="agency-panel rounded-[1.75rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#738076]">
            Project cockpit
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#17201b]">
            Active projects
          </h2>
          <div className="mt-5 grid gap-3">
            {spotlightProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-[1.25rem] bg-[#f8f6ef] p-4 shadow-[0_10px_24px_rgba(23,32,27,0.04)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <strong className="block text-lg font-black tracking-[-0.03em]">
                      {project.name}
                    </strong>
                    <p className="mt-1 text-sm text-[#66736b]">
                      {customerName(project.customerId)} · {project.summary}
                    </p>
                  </div>
                  <span className={`agency-badge ${projectStatusTone(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="agency-panel rounded-[1.75rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#738076]">
            Ticket system
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#17201b]">
            Priority work
          </h2>
          <div className="mt-5 grid gap-3">
            {urgentTickets.map((ticket) => (
              <div key={ticket.id} className="rounded-[1.25rem] bg-[#f8f6ef] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <strong className="block text-base font-black tracking-[-0.03em]">
                      {ticket.title}
                    </strong>
                    <p className="mt-1 text-sm text-[#66736b]">
                      {ticket.status} · due {ticket.dueDate}
                    </p>
                  </div>
                  <span className="agency-badge agency-badge--amber">{ticket.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </ShellPage>
  );
}
