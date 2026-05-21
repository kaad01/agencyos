import { initialData, ticketEstimateUsedPercent, ticketLoggedHours } from "@/src/domain";
import { ShellPage } from "@/src/components/routes/shell-page";
import { projectName, ticketPriorityTone } from "@/src/lib/demo-helpers";

export default function TicketsPage() {
  return (
    <ShellPage
      eyebrow="Tickets"
      title="Tickets stay tied to real delivery work instead of generic task noise."
      description="The route shell keeps the Backlog → Todo → In progress → Review → Done model visible while the existing prototype continues to handle the deeper interactions."
      note="This route is intentionally scaffolded for the Next.js shell first, before full CRUD and board state move off localStorage."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        {initialData.tickets.map((ticket) => (
          <article key={ticket.id} className="agency-panel rounded-[1.75rem] p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#738076]">
                  {projectName(ticket.projectId)}
                </p>
                <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#17201b]">
                  {ticket.title}
                </h2>
              </div>
              <span className={`agency-badge ${ticketPriorityTone(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#536357]">{ticket.description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MiniMetric label="Status" value={ticket.status} />
              <MiniMetric label="Logged" value={`${ticketLoggedHours(initialData, ticket.id)}h`} />
              <MiniMetric
                label="Estimate used"
                value={`${ticketEstimateUsedPercent(initialData, ticket.id)}%`}
              />
            </div>
          </article>
        ))}
      </section>
    </ShellPage>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.15rem] bg-[#f8f6ef] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#738076]">{label}</p>
      <strong className="mt-2 block text-base font-black tracking-[-0.03em] text-[#17201b]">
        {value}
      </strong>
    </div>
  );
}
