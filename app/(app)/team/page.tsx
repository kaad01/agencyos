import {
  colleagueBillableRatio,
  colleagueDeliveryLoadPercent,
  colleagueLoggedHours,
  colleagueOpenTicketEstimate,
  initialData,
} from "@/src/domain";
import { ShellPage } from "@/src/components/routes/shell-page";

export default function TeamPage() {
  return (
    <ShellPage
      eyebrow="Team"
      title="Team routes are ready for workspace members, capacity, and assignment visibility."
      description="The shell keeps AgencyOS grounded in real agency planning: who is staffed, how billable the week is, and where open ticket load still needs attention."
      note="Membership roles and workspace permissions are the next logical step once Auth.js sessions connect to Prisma data."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        {initialData.colleagues.map((person) => (
          <article key={person.id} className="agency-panel rounded-[1.75rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#738076]">
                  {person.role}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#17201b]">
                  {person.name}
                </h2>
              </div>
              <span className="agency-badge agency-badge--blue">{person.capacity}% capacity</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Metric label="Logged" value={`${colleagueLoggedHours(initialData, person.id)}h`} />
              <Metric label="Planned" value={`${colleagueOpenTicketEstimate(initialData, person.id)}h`} />
              <Metric label="Billable mix" value={`${colleagueBillableRatio(initialData, person.id)}%`} />
            </div>
            <p className="mt-4 text-sm font-bold text-[#536357]">
              Delivery load signal: {colleagueDeliveryLoadPercent(initialData, person.id)}%
            </p>
          </article>
        ))}
      </section>
    </ShellPage>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.15rem] bg-[#f8f6ef] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#738076]">{label}</p>
      <strong className="mt-2 block text-lg font-black tracking-[-0.03em] text-[#17201b]">
        {value}
      </strong>
    </div>
  );
}
