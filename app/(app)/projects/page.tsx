import { initialData, projectBudgetRemaining, projectBudgetUsedPercent, projectHours } from "@/src/domain";
import { ShellPage } from "@/src/components/routes/shell-page";
import { customerName, formatEuro, projectStatusTone } from "@/src/lib/demo-helpers";

export default function ProjectsPage() {
  return (
    <ShellPage
      eyebrow="Projects"
      title="A route-based project cockpit for delivery, budgets, and team context."
      description="This shell keeps the existing visual/product direction while preparing each major product area for shareable URLs, auth, and server-backed data."
      note="Project detail routes can grow from here once the workspace and database slices land."
    >
      <section className="grid gap-4">
        {initialData.projects.map((project) => (
          <article key={project.id} className="agency-panel rounded-[1.75rem] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#738076]">
                  {customerName(project.customerId)}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#17201b]">
                  {project.name}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#536357]">{project.summary}</p>
              </div>
              <span className={`agency-badge ${projectStatusTone(project.status)}`}>
                {project.status}
              </span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <MetricCard label="Logged hours" value={`${projectHours(initialData, project.id)}h`} />
              <MetricCard label="Budget used" value={`${projectBudgetUsedPercent(initialData, project.id)}%`} />
              <MetricCard label="Budget left" value={formatEuro(projectBudgetRemaining(initialData, project.id))} />
              <MetricCard label="Date window" value={`${project.startDate} → ${project.endDate}`} />
            </div>
          </article>
        ))}
      </section>
    </ShellPage>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] bg-[#f8f6ef] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#738076]">{label}</p>
      <strong className="mt-2 block text-lg font-black tracking-[-0.03em] text-[#17201b]">
        {value}
      </strong>
    </div>
  );
}
