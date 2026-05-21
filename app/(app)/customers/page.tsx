import { customerHours, customerRevenue, initialData } from "@/src/domain";
import { ShellPage } from "@/src/components/routes/shell-page";
import { formatEuro } from "@/src/lib/demo-helpers";

export default function CustomersPage() {
  return (
    <ShellPage
      eyebrow="Customers"
      title="Customer routes keep CRM-lite context anchored to delivery work."
      description="AgencyOS stays focused on consulting delivery, so customers connect directly to projects, hours, and revenue instead of becoming a generic pipeline module."
      note="The Next.js shell makes room for shareable customer URLs and workspace-scoped access later in Loop 1."
    >
      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {initialData.customers.map((customer) => (
          <article key={customer.id} className="agency-panel rounded-[1.75rem] p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#738076]">
              {customer.segment}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#17201b]">
              {customer.name}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#536357]">
              Owner {customer.owner} · {customer.health} account health · {formatEuro(customer.revenueTarget)} target.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.15rem] bg-[#f8f6ef] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#738076]">Logged hours</p>
                <strong className="mt-2 block text-lg font-black tracking-[-0.03em] text-[#17201b]">
                  {customerHours(initialData, customer.id)}h
                </strong>
              </div>
              <div className="rounded-[1.15rem] bg-[#f8f6ef] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#738076]">Earned revenue</p>
                <strong className="mt-2 block text-lg font-black tracking-[-0.03em] text-[#17201b]">
                  {formatEuro(customerRevenue(initialData, customer.id))}
                </strong>
              </div>
            </div>
          </article>
        ))}
      </section>
    </ShellPage>
  );
}
