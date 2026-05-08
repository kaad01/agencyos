export type ProjectStatus = 'Planning' | 'Active' | 'At risk' | 'Done';
export type TicketStatus = 'Backlog' | 'Todo' | 'In progress' | 'Review' | 'Done';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type CustomerHealth = 'Excellent' | 'Healthy' | 'Needs care' | 'New';
export type ReportPeriod = 'all' | '7' | '30';

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

export type TimeEntryDraft = Omit<TimeEntry, 'id'>;

export function timeEntryDraftForTicket(data: AppData, ticketId: string, date: string, hours = 0.25): TimeEntryDraft | null {
  const ticket = data.tickets.find((item) => item.id === ticketId);
  if (!ticket) return null;
  const project = data.projects.find((item) => item.id === ticket.projectId);
  if (!project) return null;

  return {
    projectId: project.id,
    ticketId: ticket.id,
    colleagueId: ticket.assigneeId || project.leadId || data.colleagues[0]?.id || '',
    date,
    hours,
    billable: true,
    note: `Quick log: ${ticket.title}`,
  };
}

export function timeEntryDraftForTimesheetScope(data: AppData, filters: TimesheetFilters, hours = 1): TimeEntryDraft | null {
  const scopedEntries = filterTimeEntriesForTimesheet(data, filters);
  const projectId = filters.projectId || scopedEntries[0]?.projectId || data.projects[0]?.id || '';
  const project = data.projects.find((item) => item.id === projectId);
  if (!project) return null;
  const colleagueId = filters.colleagueId || scopedEntries[0]?.colleagueId || project.leadId || data.colleagues[0]?.id || '';

  return {
    projectId: project.id,
    ticketId: '',
    colleagueId,
    date: filters.weekDate,
    hours,
    billable: true,
    note: `Manual log for week of ${weekStartDate(filters.weekDate)}`,
  };
}

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

export function projectEstimatedHours(data: AppData, projectId: string) {
  return data.tickets.filter((ticket) => ticket.projectId === projectId).reduce((sum, ticket) => sum + ticket.estimateHours, 0);
}

export function projectRemainingEstimateHours(data: AppData, projectId: string) {
  return Math.max(0, projectEstimatedHours(data, projectId) - projectHours(data, projectId));
}

export function projectEstimateUsedPercent(data: AppData, projectId: string) {
  const estimate = projectEstimatedHours(data, projectId);
  if (estimate <= 0) return 0;
  return Math.round((projectHours(data, projectId) / estimate) * 100);
}

export function projectDeliverySignal(data: AppData, projectId: string) {
  const used = projectEstimateUsedPercent(data, projectId);
  const openTickets = data.tickets.filter((ticket) => ticket.projectId === projectId && ticket.status !== 'Done').length;
  if (used >= 100 && openTickets > 0) return 'Over estimate';
  if (used >= 75) return 'Watch scope';
  return 'On track';
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

export function projectBudgetRemaining(data: AppData, projectId: string) {
  const project = data.projects.find((item) => item.id === projectId);
  if (!project) return 0;
  return Math.max(0, project.budget - projectRevenue(data, projectId));
}

export function projectNonBillableHours(data: AppData, projectId: string) {
  return data.timeEntries.filter((entry) => entry.projectId === projectId && !entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
}

export function projectEffectiveRate(data: AppData, projectId: string) {
  const hours = projectHours(data, projectId);
  if (!hours) return 0;
  return Math.round(projectRevenue(data, projectId) / hours);
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

export function customerTickets(data: AppData, customerId: string) {
  const projectIds = new Set(customerProjects(data, customerId).map((project) => project.id));
  return data.tickets.filter((ticket) => projectIds.has(ticket.projectId));
}

export function colleagueLoggedHours(data: AppData, colleagueId: string) {
  return data.timeEntries.filter((entry) => entry.colleagueId === colleagueId).reduce((sum, entry) => sum + entry.hours, 0);
}

export function colleagueOpenTicketEstimate(data: AppData, colleagueId: string) {
  return data.tickets.filter((ticket) => ticket.assigneeId === colleagueId && ticket.status !== 'Done').reduce((sum, ticket) => sum + ticket.estimateHours, 0);
}

export function colleagueBillableRatio(data: AppData, colleagueId: string) {
  const entries = data.timeEntries.filter((entry) => entry.colleagueId === colleagueId);
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  if (!totalHours) return 0;
  const billableHours = entries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
  return Math.round((billableHours / totalHours) * 100);
}

export function colleagueDeliveryLoadPercent(data: AppData, colleagueId: string) {
  const colleague = data.colleagues.find((person) => person.id === colleagueId);
  if (!colleague || colleague.capacity <= 0) return 0;
  return Math.round(((colleagueOpenTicketEstimate(data, colleagueId) + colleagueLoggedHours(data, colleagueId)) / colleague.capacity) * 100);
}

export function colleagueLoadStatus(load: number) {
  return load >= 95 ? 'Overloaded' : load >= 65 ? 'Healthy' : 'Underbooked';
}

export function ticketLoggedHours(data: AppData, ticketId: string) {
  return data.timeEntries.filter((entry) => entry.ticketId === ticketId).reduce((sum, entry) => sum + entry.hours, 0);
}

export function ticketEstimateUsedPercent(data: AppData, ticketId: string) {
  const ticket = data.tickets.find((item) => item.id === ticketId);
  if (!ticket || ticket.estimateHours <= 0) return 0;
  return Math.round((ticketLoggedHours(data, ticketId) / ticket.estimateHours) * 100);
}

export function ticketDeliverySignal(data: AppData, ticketId: string) {
  const ticket = data.tickets.find((item) => item.id === ticketId);
  if (!ticket) return 'No estimate';
  const used = ticketEstimateUsedPercent(data, ticketId);
  if (ticket.estimateHours <= 0) return 'No estimate';
  if (used >= 100 && ticket.status !== 'Done') return 'Over estimate';
  if (used >= 75) return 'Watch scope';
  if (used === 0) return 'No time yet';
  return 'On track';
}

export function roundedTimerHours(startedAt: string, now = Date.now()) {
  const elapsedHours = Math.max(0, (now - new Date(startedAt).getTime()) / 36e5);
  return Math.max(0.25, Math.round(elapsedHours * 4) / 4);
}

export function weekStartDate(date: string) {
  const current = new Date(`${date}T00:00:00.000Z`);
  const day = current.getUTCDay() || 7;
  current.setUTCDate(current.getUTCDate() - day + 1);
  return current.toISOString().slice(0, 10);
}

export function addDays(date: string, days: number) {
  const current = new Date(`${date}T00:00:00.000Z`);
  current.setUTCDate(current.getUTCDate() + days);
  return current.toISOString().slice(0, 10);
}

export function timeEntriesForWeek(data: AppData, date: string) {
  const start = weekStartDate(date);
  const end = addDays(start, 6);
  return data.timeEntries.filter((entry) => entry.date >= start && entry.date <= end);
}

export function weeklyTimesheetByColleague(data: AppData, date: string) {
  const weekEntries = timeEntriesForWeek(data, date);
  return data.colleagues.map((person) => {
    const personEntries = weekEntries.filter((entry) => entry.colleagueId === person.id);
    const total = personEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const billable = personEntries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
    const dailyHours = Array.from({ length: 7 }, (_, index) => {
      const day = addDays(weekStartDate(date), index);
      return personEntries.filter((entry) => entry.date === day).reduce((sum, entry) => sum + entry.hours, 0);
    });

    return { colleague: person, dailyHours, total, billable, internal: total - billable };
  });
}


export function weeklyTimesheetByProject(data: AppData, date: string) {
  const weekEntries = timeEntriesForWeek(data, date);
  return data.projects
    .map((project) => {
      const projectEntries = weekEntries.filter((entry) => entry.projectId === project.id);
      const total = projectEntries.reduce((sum, entry) => sum + entry.hours, 0);
      const billable = projectEntries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
      const dailyHours = Array.from({ length: 7 }, (_, index) => {
        const day = addDays(weekStartDate(date), index);
        return projectEntries.filter((entry) => entry.date === day).reduce((sum, entry) => sum + entry.hours, 0);
      });

      return { project, dailyHours, total, billable, internal: total - billable };
    })
    .filter((row) => row.total > 0)
    .sort((left, right) => right.total - left.total || left.project.name.localeCompare(right.project.name));
}

export function weeklyTimesheetByCustomer(data: AppData, date: string) {
  const weekEntries = timeEntriesForWeek(data, date);

  return data.customers
    .map((customer) => {
      const customerProjectIds = new Set(data.projects.filter((project) => project.customerId === customer.id).map((project) => project.id));
      const projectRates = new Map(data.projects.map((project) => [project.id, project.hourlyRate]));
      const customerEntries = weekEntries.filter((entry) => customerProjectIds.has(entry.projectId));
      const total = customerEntries.reduce((sum, entry) => sum + entry.hours, 0);
      const billable = customerEntries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
      const earnedRevenue = customerEntries
        .filter((entry) => entry.billable)
        .reduce((sum, entry) => sum + entry.hours * (projectRates.get(entry.projectId) ?? 0), 0);
      const dailyHours = Array.from({ length: 7 }, (_, index) => {
        const day = addDays(weekStartDate(date), index);
        return customerEntries.filter((entry) => entry.date === day).reduce((sum, entry) => sum + entry.hours, 0);
      });

      return {
        customer,
        dailyHours,
        total,
        billable,
        internal: total - billable,
        earnedRevenue,
        projectCount: new Set(customerEntries.map((entry) => entry.projectId)).size,
      };
    })
    .filter((row) => row.total > 0)
    .sort((left, right) => right.total - left.total || left.customer.name.localeCompare(right.customer.name));
}

export type TimesheetFilters = {
  weekDate: string;
  projectId?: string;
  colleagueId?: string;
};

export function filterTimeEntriesForTimesheet(data: AppData, filters: TimesheetFilters) {
  const start = weekStartDate(filters.weekDate);
  const end = addDays(start, 6);

  return data.timeEntries.filter((entry) => {
    if (entry.date < start || entry.date > end) return false;
    if (filters.projectId && entry.projectId !== filters.projectId) return false;
    if (filters.colleagueId && entry.colleagueId !== filters.colleagueId) return false;
    return true;
  });
}


export function weeklyUnloggedTickets(data: AppData, filters: TimesheetFilters) {
  const start = weekStartDate(filters.weekDate);
  const end = addDays(start, 6);

  return data.tickets
    .filter((ticket) => {
      if (ticket.status === 'Done') return false;
      if (filters.projectId && ticket.projectId !== filters.projectId) return false;
      if (filters.colleagueId && ticket.assigneeId !== filters.colleagueId) return false;

      const hasWeeklyTime = data.timeEntries.some((entry) => entry.ticketId === ticket.id && entry.date >= start && entry.date <= end);
      return !hasWeeklyTime;
    })
    .sort((left, right) => {
      const priorityOrder: Record<TicketPriority, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
      return priorityOrder[left.priority] - priorityOrder[right.priority] || left.dueDate.localeCompare(right.dueDate);
    });
}


export function weeklyTimeCaptureFocus(data: AppData, filters: TimesheetFilters) {
  const unloggedTickets = weeklyUnloggedTickets(data, filters);
  const weekStart = weekStartDate(filters.weekDate);
  const weekEnd = addDays(weekStart, 6);
  const dueThisWeek = unloggedTickets.filter((ticket) => ticket.dueDate >= weekStart && ticket.dueDate <= weekEnd);
  const priorityTickets = unloggedTickets.filter((ticket) => ticket.priority === 'Urgent' || ticket.priority === 'High');
  const missingEstimateHours = unloggedTickets.reduce((sum, ticket) => sum + Math.max(0, ticket.estimateHours - ticketLoggedHours(data, ticket.id)), 0);
  const topTicket = priorityTickets[0] ?? dueThisWeek[0] ?? unloggedTickets[0];

  return {
    totalUnloggedTickets: unloggedTickets.length,
    priorityCount: priorityTickets.length,
    dueThisWeekCount: dueThisWeek.length,
    missingEstimateHours,
    topTicket,
    weekStart,
    weekEnd,
  };
}


export type TimesheetReviewStatus = 'Ready to review' | 'Needs time capture' | 'No time logged';


export function weeklyTimesheetAudit(data: AppData, filters: TimesheetFilters) {
  const scopedEntries = filterTimeEntriesForTimesheet(data, filters);
  const missingTicketEntries = scopedEntries.filter((entry) => !entry.ticketId);
  const missingNoteEntries = scopedEntries.filter((entry) => !entry.note.trim());
  const internalEntries = scopedEntries.filter((entry) => !entry.billable);
  const projectIds = new Set(scopedEntries.map((entry) => entry.projectId));
  const colleagueIds = new Set(scopedEntries.map((entry) => entry.colleagueId));
  const totalHours = scopedEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const billableHours = scopedEntries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);

  return {
    entryCount: scopedEntries.length,
    projectCount: projectIds.size,
    contributorCount: colleagueIds.size,
    totalHours,
    billableHours,
    internalHours: totalHours - billableHours,
    missingTicketCount: missingTicketEntries.length,
    missingNoteCount: missingNoteEntries.length,
    internalEntryCount: internalEntries.length,
    readyForExport: scopedEntries.length > 0 && missingTicketEntries.length === 0 && missingNoteEntries.length === 0,
  };
}

export type WeeklyApprovalStatus = 'Ready for client review' | 'Needs cleanup' | 'Needs time';

export function weeklyTimesheetApprovalSnapshot(data: AppData, filters: TimesheetFilters) {
  const audit = weeklyTimesheetAudit(data, filters);
  const review = weeklyTimesheetReview(data, filters);
  const cleanupItemCount = audit.missingTicketCount + audit.missingNoteCount + audit.internalEntryCount;
  const status: WeeklyApprovalStatus = audit.entryCount === 0
    ? 'Needs time'
    : audit.readyForExport && review.unloggedTicketCount === 0 && review.missingAssignees.length === 0
      ? 'Ready for client review'
      : 'Needs cleanup';
  const nextAction = audit.entryCount === 0
    ? 'Log scoped time before reviewing this week.'
    : audit.missingTicketCount > 0
      ? 'Attach delivery tickets to loose time entries.'
      : audit.missingNoteCount > 0
        ? 'Add short notes for invoice context.'
        : review.unloggedTicketCount > 0
          ? 'Capture time for active tickets without weekly entries.'
          : audit.internalEntryCount > 0
            ? 'Confirm internal time before sharing externally.'
            : 'Review and export this week with confidence.';

  return {
    status,
    nextAction,
    cleanupItemCount,
    clientReadyHours: audit.readyForExport ? audit.billableHours : 0,
    billableHours: audit.billableHours,
    internalHours: audit.internalHours,
    coverageLabel: review.coveredAssigneeCount + '/' + (review.expectedAssigneeCount || review.coveredAssigneeCount) + ' assignees covered',
  };
}



export function weeklyTimesheetValueSummary(data: AppData, filters: TimesheetFilters) {
  const scopedEntries = filterTimeEntriesForTimesheet(data, filters);
  const projectRates = new Map(data.projects.map((project) => [project.id, project.hourlyRate]));
  const totalHours = scopedEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const billableHours = scopedEntries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
  const internalHours = totalHours - billableHours;
  const earnedRevenue = scopedEntries
    .filter((entry) => entry.billable)
    .reduce((sum, entry) => sum + entry.hours * (projectRates.get(entry.projectId) ?? 0), 0);
  const nonBillableValue = scopedEntries
    .filter((entry) => !entry.billable)
    .reduce((sum, entry) => sum + entry.hours * (projectRates.get(entry.projectId) ?? 0), 0);

  return {
    totalHours,
    billableHours,
    internalHours,
    billableRatio: totalHours ? Math.round((billableHours / totalHours) * 100) : 0,
    earnedRevenue,
    nonBillableValue,
    effectiveRate: totalHours ? Math.round(earnedRevenue / totalHours) : 0,
    billableRate: billableHours ? Math.round(earnedRevenue / billableHours) : 0,
  };
}

export type WeeklyClientPacketStatus = 'Ready to send' | 'Draft needs cleanup' | 'No client time';

export function weeklyTimesheetClientPacket(data: AppData, filters: TimesheetFilters) {
  const scopedEntries = filterTimeEntriesForTimesheet(data, filters);
  const clientEntries = scopedEntries.filter((entry) => entry.billable && entry.ticketId && entry.note.trim());
  const excludedEntries = scopedEntries.filter((entry) => !entry.billable || !entry.ticketId || !entry.note.trim());
  const projectRates = new Map(data.projects.map((project) => [project.id, project.hourlyRate]));
  const projectsByCustomer = new Map(data.customers.map((customer) => [customer.id, data.projects.filter((project) => project.customerId === customer.id)]));
  const totalHours = clientEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const earnedRevenue = clientEntries.reduce((sum, entry) => sum + entry.hours * (projectRates.get(entry.projectId) ?? 0), 0);
  const status: WeeklyClientPacketStatus = clientEntries.length === 0
    ? 'No client time'
    : excludedEntries.length
      ? 'Draft needs cleanup'
      : 'Ready to send';

  const customers = data.customers
    .map((customer) => {
      const customerProjectIds = new Set((projectsByCustomer.get(customer.id) ?? []).map((project) => project.id));
      const entries = clientEntries.filter((entry) => customerProjectIds.has(entry.projectId));
      const projectIds = new Set(entries.map((entry) => entry.projectId));
      const hours = entries.reduce((sum, entry) => sum + entry.hours, 0);
      const revenue = entries.reduce((sum, entry) => sum + entry.hours * (projectRates.get(entry.projectId) ?? 0), 0);
      const highlights = entries
        .slice()
        .sort((left, right) => left.date.localeCompare(right.date) || left.id.localeCompare(right.id))
        .slice(0, 3)
        .map((entry) => entry.note.trim());

      return { customer, hours, revenue, projectCount: projectIds.size, entryCount: entries.length, highlights };
    })
    .filter((customer) => customer.hours > 0)
    .sort((left, right) => right.revenue - left.revenue || right.hours - left.hours || left.customer.name.localeCompare(right.customer.name));

  return {
    status,
    totalHours,
    earnedRevenue,
    customerCount: customers.length,
    includedEntryCount: clientEntries.length,
    excludedEntryCount: excludedEntries.length,
    customers,
    headline: totalHours
      ? `${totalHours}h client-ready across ${customers.length} customer${customers.length === 1 ? '' : 's'}`
      : 'No billable, ticket-linked notes are ready for client sharing yet.',
  };
}

export type WeeklyReviewQueueIssue = 'Missing ticket' | 'Missing note' | 'Confirm internal';

export type WeeklyReviewQueueItem = {
  entry: TimeEntry;
  issue: WeeklyReviewQueueIssue;
  project: Project | null;
  colleague: Colleague | null;
  ticket: Ticket | null;
  action: string;
};

export function weeklyTimesheetReviewQueue(data: AppData, filters: TimesheetFilters): WeeklyReviewQueueItem[] {
  const scopedEntries = filterTimeEntriesForTimesheet(data, filters);
  const issuePriority: Record<WeeklyReviewQueueIssue, number> = { 'Missing ticket': 0, 'Missing note': 1, 'Confirm internal': 2 };

  return scopedEntries
    .flatMap((entry) => {
      const project = data.projects.find((item) => item.id === entry.projectId) ?? null;
      const colleague = data.colleagues.find((person) => person.id === entry.colleagueId) ?? null;
      const ticket = entry.ticketId ? data.tickets.find((item) => item.id === entry.ticketId) ?? null : null;
      const base = { entry, project, colleague, ticket };
      const items: WeeklyReviewQueueItem[] = [];

      if (!entry.ticketId) {
        items.push({ ...base, issue: 'Missing ticket', action: 'Attach a delivery ticket before client reporting.' });
      }
      if (!entry.note.trim()) {
        items.push({ ...base, issue: 'Missing note', action: 'Add a short work note for invoice context.' });
      }
      if (!entry.billable) {
        items.push({ ...base, issue: 'Confirm internal', action: 'Confirm this should stay internal/non-billable.' });
      }

      return items;
    })
    .sort((left, right) => issuePriority[left.issue] - issuePriority[right.issue] || left.entry.date.localeCompare(right.entry.date) || left.entry.id.localeCompare(right.entry.id));
}

export function weeklyTimesheetReview(data: AppData, filters: TimesheetFilters) {
  const scopedEntries = filterTimeEntriesForTimesheet(data, filters);
  const totalHours = scopedEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const billableHours = scopedEntries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
  const internalHours = totalHours - billableHours;
  const billableRatio = totalHours ? Math.round((billableHours / totalHours) * 100) : 0;
  const activeTickets = data.tickets.filter((ticket) => {
    if (ticket.status === 'Done') return false;
    if (filters.projectId && ticket.projectId !== filters.projectId) return false;
    if (filters.colleagueId && ticket.assigneeId !== filters.colleagueId) return false;
    return true;
  });
  const expectedAssigneeIds = Array.from(new Set(activeTickets.map((ticket) => ticket.assigneeId).filter(Boolean)));
  const contributorIds = new Set(scopedEntries.map((entry) => entry.colleagueId));
  const coveredAssigneeCount = expectedAssigneeIds.filter((id) => contributorIds.has(id)).length;
  const missingAssignees = expectedAssigneeIds
    .filter((id) => !contributorIds.has(id))
    .map((id) => data.colleagues.find((person) => person.id === id))
    .filter((person): person is Colleague => Boolean(person));
  const unloggedTicketCount = weeklyUnloggedTickets(data, filters).length;
  const status: TimesheetReviewStatus = totalHours === 0
    ? 'No time logged'
    : unloggedTicketCount > 0 || missingAssignees.length > 0
      ? 'Needs time capture'
      : 'Ready to review';

  return {
    totalHours,
    billableHours,
    internalHours,
    billableRatio,
    contributorCount: contributorIds.size,
    coveredAssigneeCount,
    expectedAssigneeCount: expectedAssigneeIds.length,
    missingAssignees,
    unloggedTicketCount,
    status,
  };
}


export type WeeklyCapacityStatus = 'Over capacity' | 'Healthy' | 'Light';

export function weeklyCapacityTargetHours(colleague: Colleague) {
  return Math.round((Math.max(0, colleague.capacity) / 100) * 40 * 10) / 10;
}

export function weeklyTimesheetCapacity(data: AppData, filters: TimesheetFilters) {
  const scopedEntries = filterTimeEntriesForTimesheet(data, filters);
  const activeAssigneeIds = new Set(data.tickets
    .filter((ticket) => {
      if (ticket.status === 'Done') return false;
      if (filters.projectId && ticket.projectId !== filters.projectId) return false;
      if (filters.colleagueId && ticket.assigneeId !== filters.colleagueId) return false;
      return true;
    })
    .map((ticket) => ticket.assigneeId));
  const contributorIds = new Set(scopedEntries.map((entry) => entry.colleagueId));

  return data.colleagues
    .filter((person) => {
      if (filters.colleagueId && person.id !== filters.colleagueId) return false;
      return activeAssigneeIds.has(person.id) || contributorIds.has(person.id);
    })
    .map((person) => {
      const personEntries = scopedEntries.filter((entry) => entry.colleagueId === person.id);
      const loggedHours = personEntries.reduce((sum, entry) => sum + entry.hours, 0);
      const billableHours = personEntries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
      const targetHours = weeklyCapacityTargetHours(person);
      const usagePercent = targetHours > 0 ? Math.round((loggedHours / targetHours) * 100) : 0;
      const status: WeeklyCapacityStatus = usagePercent > 100 ? 'Over capacity' : usagePercent >= 60 ? 'Healthy' : 'Light';

      return { person, loggedHours, billableHours, internalHours: loggedHours - billableHours, targetHours, usagePercent, status };
    })
    .sort((left, right) => right.usagePercent - left.usagePercent || right.loggedHours - left.loggedHours || left.person.name.localeCompare(right.person.name));
}

export type ReportFilters = {
  period: ReportPeriod;
  customerId?: string;
  projectId?: string;
  colleagueId?: string;
};

export function filterTimeEntriesForReport(data: AppData, filters: ReportFilters) {
  const latestDate = data.timeEntries.reduce((latest, entry) => entry.date > latest ? entry.date : latest, data.timeEntries[0]?.date ?? '');
  const customerProjectIds = filters.customerId
    ? new Set(data.projects.filter((project) => project.customerId === filters.customerId).map((project) => project.id))
    : null;
  let startDate = '';

  if (filters.period !== 'all' && latestDate) {
    const start = new Date(`${latestDate}T00:00:00.000Z`);
    start.setUTCDate(start.getUTCDate() - Number(filters.period) + 1);
    startDate = start.toISOString().slice(0, 10);
  }

  return data.timeEntries.filter((entry) => {
    if (startDate && (entry.date < startDate || entry.date > latestDate)) return false;
    if (filters.customerId && !customerProjectIds?.has(entry.projectId)) return false;
    if (filters.projectId && entry.projectId !== filters.projectId) return false;
    if (filters.colleagueId && entry.colleagueId !== filters.colleagueId) return false;
    return true;
  });
}

export function customerReportRollups(data: AppData, entries: TimeEntry[]) {
  return data.customers
    .map((customer) => {
      const projectIds = new Set(data.projects.filter((project) => project.customerId === customer.id).map((project) => project.id));
      const customerEntries = entries.filter((entry) => projectIds.has(entry.projectId));
      const projectCount = new Set(customerEntries.map((entry) => entry.projectId)).size;
      const hours = customerEntries.reduce((sum, entry) => sum + entry.hours, 0);
      const billableHours = customerEntries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
      const revenue = customerEntries.reduce((sum, entry) => {
        const project = data.projects.find((item) => item.id === entry.projectId);
        return sum + (entry.billable ? entry.hours * (project?.hourlyRate ?? 0) : 0);
      }, 0);

      return { customer, projectCount, hours, billableHours, internalHours: hours - billableHours, revenue };
    })
    .filter((rollup) => rollup.hours > 0)
    .sort((left, right) => right.revenue - left.revenue || right.hours - left.hours);
}

export function moveTicketOnBoard(data: AppData, ticketId: string, status: TicketStatus, beforeTicketId?: string): AppData {
  const movedTicket = data.tickets.find((ticket) => ticket.id === ticketId);
  if (!movedTicket) return data;

  const updatedTicket = { ...movedTicket, status };
  const remainingTickets = data.tickets.filter((ticket) => ticket.id !== ticketId);
  const insertIndex = beforeTicketId ? remainingTickets.findIndex((ticket) => ticket.id === beforeTicketId) : -1;
  const tickets = [...remainingTickets];

  if (insertIndex >= 0) {
    tickets.splice(insertIndex, 0, updatedTicket);
  } else {
    let lastInColumnIndex = -1;
    for (let index = tickets.length - 1; index >= 0; index -= 1) {
      if (tickets[index].status === status) {
        lastInColumnIndex = index;
        break;
      }
    }
    tickets.splice(lastInColumnIndex + 1, 0, updatedTicket);
  }

  return { ...data, tickets };
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
