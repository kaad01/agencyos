export type ProjectStatus = 'Planning' | 'Active' | 'At risk' | 'Done';
export type TicketStatus = 'Backlog' | 'Todo' | 'In progress' | 'Review' | 'Done';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type CustomerHealth = 'Excellent' | 'Healthy' | 'Needs care' | 'New';

export type Customer = {
  id: string;
  name: string;
  segment: string;
  owner: string;
  health: CustomerHealth;
  revenueTarget: number;
};

export type Colleague = {
  id: string;
  name: string;
  role: string;
  capacity: number;
  billableRate: number;
  active: boolean;
};

export type Project = {
  id: string;
  name: string;
  customerId: string;
  leadId: string;
  status: ProjectStatus;
  budget: number;
  hourlyRate: number;
  startDate: string;
  endDate: string;
  summary: string;
  memberIds: string[];
};

export type Ticket = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  status: TicketStatus;
  priority: TicketPriority;
  estimateHours: number;
  dueDate: string;
};

export type TimeEntry = {
  id: string;
  projectId: string;
  ticketId: string;
  colleagueId: string;
  date: string;
  hours: number;
  billable: boolean;
  note: string;
};

export type AppData = {
  customers: Customer[];
  colleagues: Colleague[];
  projects: Project[];
  tickets: Ticket[];
  timeEntries: TimeEntry[];
};

export const ticketStatuses: TicketStatus[] = ['Backlog', 'Todo', 'In progress', 'Review', 'Done'];
export const projectStatuses: ProjectStatus[] = ['Planning', 'Active', 'At risk', 'Done'];
export const priorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

export const initialData: AppData = {
  customers: [
    { id: 'cust-northstar', name: 'Northstar Labs', segment: 'B2B SaaS', owner: 'Mina Keller', health: 'Excellent', revenueTarget: 86000 },
    { id: 'cust-acme', name: 'Acme Consulting', segment: 'Professional services', owner: 'Jonas Meyer', health: 'Needs care', revenueTarget: 34000 },
    { id: 'cust-helio', name: 'Helio Foods', segment: 'Consumer goods', owner: 'Sara Demir', health: 'New', revenueTarget: 27000 },
  ],
  colleagues: [
    { id: 'col-mina', name: 'Mina Keller', role: 'Strategy Lead', capacity: 82, billableRate: 130, active: true },
    { id: 'col-jonas', name: 'Jonas Meyer', role: 'Consultant', capacity: 96, billableRate: 105, active: true },
    { id: 'col-sara', name: 'Sara Demir', role: 'Project Manager', capacity: 64, billableRate: 115, active: true },
    { id: 'col-leo', name: 'Leo Hart', role: 'Finance Ops', capacity: 48, billableRate: 90, active: true },
  ],
  projects: [
    { id: 'proj-brand', name: 'Brand refresh rollout', customerId: 'cust-northstar', leadId: 'col-mina', budget: 42000, hourlyRate: 120, status: 'Active', startDate: '2026-05-01', endDate: '2026-06-18', summary: 'Roll out the new positioning, visual identity, and launch assets.', memberIds: ['col-mina', 'col-sara'] },
    { id: 'proj-erp', name: 'ERP discovery sprint', customerId: 'cust-acme', leadId: 'col-jonas', budget: 18000, hourlyRate: 110, status: 'At risk', startDate: '2026-05-04', endDate: '2026-05-31', summary: 'Map processes, risks, and software selection criteria.', memberIds: ['col-jonas', 'col-leo'] },
    { id: 'proj-market', name: 'Market entry playbook', customerId: 'cust-helio', leadId: 'col-sara', budget: 27000, hourlyRate: 115, status: 'Planning', startDate: '2026-05-22', endDate: '2026-07-09', summary: 'Create launch plan for DACH retail expansion.', memberIds: ['col-sara', 'col-mina'] },
  ],
  tickets: [
    { id: 'tic-brief', projectId: 'proj-brand', title: 'Finalize launch briefing', description: 'Confirm launch scope, audience, and decision makers.', assigneeId: 'col-mina', status: 'In progress', priority: 'High', estimateHours: 8, dueDate: '2026-05-12' },
    { id: 'tic-assets', projectId: 'proj-brand', title: 'Prepare asset checklist', description: 'List deliverables, owners, and review dates.', assigneeId: 'col-sara', status: 'Todo', priority: 'Medium', estimateHours: 5, dueDate: '2026-05-15' },
    { id: 'tic-scope', projectId: 'proj-erp', title: 'Resolve scope conflict', description: 'Align stakeholder expectations before workshops continue.', assigneeId: 'col-jonas', status: 'In progress', priority: 'Urgent', estimateHours: 6, dueDate: '2026-05-09' },
    { id: 'tic-interviews', projectId: 'proj-market', title: 'Draft interview guide', description: 'Prepare research questions for retailer interviews.', assigneeId: 'col-sara', status: 'Backlog', priority: 'Medium', estimateHours: 4, dueDate: '2026-05-24' },
  ],
  timeEntries: [
    { id: 'time-1', projectId: 'proj-brand', ticketId: 'tic-brief', colleagueId: 'col-mina', date: '2026-05-05', hours: 3.5, billable: true, note: 'Launch briefing draft' },
    { id: 'time-2', projectId: 'proj-brand', ticketId: 'tic-assets', colleagueId: 'col-sara', date: '2026-05-05', hours: 2, billable: true, note: 'Asset checklist structure' },
    { id: 'time-3', projectId: 'proj-erp', ticketId: 'tic-scope', colleagueId: 'col-jonas', date: '2026-05-05', hours: 4, billable: true, note: 'Scope risk workshop' },
    { id: 'time-4', projectId: 'proj-erp', ticketId: 'tic-scope', colleagueId: 'col-leo', date: '2026-05-04', hours: 1.5, billable: false, note: 'Internal budget review' },
  ],
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function projectHours(data: AppData, projectId: string) {
  return data.timeEntries.filter((entry) => entry.projectId === projectId).reduce((sum, entry) => sum + entry.hours, 0);
}

export function projectBillableHours(data: AppData, projectId: string) {
  return data.timeEntries.filter((entry) => entry.projectId === projectId && entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
}

export function projectRevenue(data: AppData, projectId: string) {
  const project = data.projects.find((item) => item.id === projectId);
  if (!project) return 0;
  return projectBillableHours(data, projectId) * project.hourlyRate;
}

export function projectBudgetUsedPercent(data: AppData, projectId: string) {
  const project = data.projects.find((item) => item.id === projectId);
  if (!project || project.budget <= 0) return 0;
  return Math.round((projectRevenue(data, projectId) / project.budget) * 100);
}

export function customerProjects(data: AppData, customerId: string) {
  return data.projects.filter((project) => project.customerId === customerId);
}

export function customerHours(data: AppData, customerId: string) {
  const projectIds = new Set(customerProjects(data, customerId).map((project) => project.id));
  return data.timeEntries.filter((entry) => projectIds.has(entry.projectId)).reduce((sum, entry) => sum + entry.hours, 0);
}

export function customerRevenue(data: AppData, customerId: string) {
  return customerProjects(data, customerId).reduce((sum, project) => sum + projectRevenue(data, project.id), 0);
}

export function colleagueLoggedHours(data: AppData, colleagueId: string) {
  return data.timeEntries.filter((entry) => entry.colleagueId === colleagueId).reduce((sum, entry) => sum + entry.hours, 0);
}

export function colleagueOpenTicketEstimate(data: AppData, colleagueId: string) {
  return data.tickets.filter((ticket) => ticket.assigneeId === colleagueId && ticket.status !== 'Done').reduce((sum, ticket) => sum + ticket.estimateHours, 0);
}

export function ticketLoggedHours(data: AppData, ticketId: string) {
  return data.timeEntries.filter((entry) => entry.ticketId === ticketId).reduce((sum, entry) => sum + entry.hours, 0);
}

export function calculateMetrics(data: AppData) {
  const activeProjects = data.projects.filter((project) => project.status !== 'Done');
  const billableHours = data.timeEntries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
  const totalHours = data.timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const revenue = data.projects.reduce((sum, project) => sum + projectRevenue(data, project.id), 0);
  const budget = activeProjects.reduce((sum, project) => sum + project.budget, 0);
  const openTickets = data.tickets.filter((ticket) => ticket.status !== 'Done').length;
  const utilization = totalHours ? Math.round((billableHours / totalHours) * 100) : 0;

  return {
    activeProjects: activeProjects.length,
    openTickets,
    billableHours,
    totalHours,
    utilization,
    revenue,
    budget,
    atRisk: activeProjects.filter((project) => project.status === 'At risk').length,
  };
}

export function byId<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id);
}
