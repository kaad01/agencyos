export type ProjectStatus = 'Planning' | 'On track' | 'At risk' | 'Complete';
export type CustomerHealth = 'Excellent' | 'Healthy' | 'Needs care' | 'New';

export type Customer = {
  id: string;
  name: string;
  segment: string;
  owner: string;
  health: CustomerHealth;
  revenueTarget: number;
  notes: string;
};

export type Colleague = {
  id: string;
  name: string;
  role: string;
  capacity: number;
  billableTarget: number;
  focus: string;
  active: boolean;
};

export type Project = {
  id: string;
  name: string;
  customerId: string;
  leadId: string;
  status: ProjectStatus;
  budget: number;
  progress: number;
  startDate: string;
  endDate: string;
  nextAction: string;
};

export type AppData = {
  customers: Customer[];
  colleagues: Colleague[];
  projects: Project[];
};

export const initialData: AppData = {
  customers: [
    { id: 'cust-northstar', name: 'Northstar Labs', segment: 'B2B SaaS', owner: 'Mina Keller', health: 'Excellent', revenueTarget: 86000, notes: 'Strategic account with expansion opportunity.' },
    { id: 'cust-acme', name: 'Acme Consulting', segment: 'Professional services', owner: 'Jonas Meyer', health: 'Needs care', revenueTarget: 34000, notes: 'Needs clearer scope before next sprint.' },
    { id: 'cust-helio', name: 'Helio Foods', segment: 'Consumer goods', owner: 'Sara Demir', health: 'New', revenueTarget: 27000, notes: 'New logo, high onboarding attention.' },
  ],
  colleagues: [
    { id: 'col-mina', name: 'Mina Keller', role: 'Strategy Lead', capacity: 82, billableTarget: 32, focus: 'Northstar Labs', active: true },
    { id: 'col-jonas', name: 'Jonas Meyer', role: 'Consultant', capacity: 96, billableTarget: 36, focus: 'Acme Consulting', active: true },
    { id: 'col-sara', name: 'Sara Demir', role: 'Project Manager', capacity: 64, billableTarget: 28, focus: 'Helio Foods', active: true },
    { id: 'col-leo', name: 'Leo Hart', role: 'Finance Ops', capacity: 48, billableTarget: 20, focus: 'Retainers', active: true },
  ],
  projects: [
    { id: 'proj-brand', name: 'Brand refresh rollout', customerId: 'cust-northstar', leadId: 'col-mina', budget: 42000, progress: 72, status: 'On track', startDate: '2026-05-01', endDate: '2026-06-18', nextAction: 'Approve rollout plan with client sponsor.' },
    { id: 'proj-erp', name: 'ERP discovery sprint', customerId: 'cust-acme', leadId: 'col-jonas', budget: 18000, progress: 39, status: 'At risk', startDate: '2026-05-04', endDate: '2026-05-31', nextAction: 'Resolve scope conflict and reset delivery plan.' },
    { id: 'proj-market', name: 'Market entry playbook', customerId: 'cust-helio', leadId: 'col-sara', budget: 27000, progress: 12, status: 'Planning', startDate: '2026-05-22', endDate: '2026-07-09', nextAction: 'Finish onboarding interview script.' },
  ],
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

export function calculateMetrics(data: AppData) {
  const activeProjects = data.projects.filter((project) => project.status !== 'Complete');
  const activeColleagues = data.colleagues.filter((colleague) => colleague.active);
  const utilization = activeColleagues.length ? Math.round(activeColleagues.reduce((sum, colleague) => sum + colleague.capacity, 0) / activeColleagues.length) : 0;
  const pipelineValue = activeProjects.reduce((sum, project) => sum + project.budget, 0);
  const atRisk = activeProjects.filter((project) => project.status === 'At risk').length;

  return {
    activeProjects: activeProjects.length,
    utilization,
    pipelineValue,
    customers: data.customers.length,
    atRisk,
  };
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
