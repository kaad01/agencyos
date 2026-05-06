import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, CheckCircle2, CircleDollarSign, Clock3, Download, FolderKanban, Handshake, HeartPulse, LayoutDashboard, Lightbulb, Plus, Search, Sparkles, TicketCheck, TimerReset, UsersRound, X } from 'lucide-react';
import { byId, calculateMetrics, colleagueBillableRatio, colleagueDeliveryLoadPercent, colleagueLoadStatus, colleagueLoggedHours, colleagueOpenTicketEstimate, customerHours, customerProjects, customerRevenue, customerTickets, formatCurrency, initialData, makeId, priorities, projectBillableHours, projectBudgetUsedPercent, projectHours, projectRevenue, projectStatuses, ticketLoggedHours, ticketStatuses, type AppData, type Colleague, type Customer, type CustomerHealth, type Project, type ProjectStatus, type Ticket, type TicketPriority, type TicketStatus, type TimeEntry } from './domain';

type View = 'Dashboard' | 'Projects' | 'Tickets' | 'Time' | 'Reports' | 'Customers' | 'Team';
type Modal = 'project' | 'ticket' | 'time' | 'customer' | 'colleague' | null;

const storageKey = 'agencyos.ops.v1';
const healthOptions: CustomerHealth[] = ['Excellent', 'Healthy', 'Needs care', 'New'];

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? { ...initialData, ...JSON.parse(raw) as AppData } : initialData;
  } catch {
    return initialData;
  }
}

function statusClass(status: ProjectStatus | TicketStatus | TicketPriority) {
  return ['Active', 'In progress', 'High', 'Urgent', 'At risk'].includes(status) ? 'amber' : ['Done', 'Review'].includes(status) ? 'green' : status === 'Planning' || status === 'Backlog' ? 'blue' : 'neutral';
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function todayPlus(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function App() {
  const [view, setView] = useState<View>('Dashboard');
  const [data, setData] = useState<AppData>(() => loadData());
  const [query, setQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(() => initialData.projects[0]?.id ?? '');
  const [selectedCustomerId, setSelectedCustomerId] = useState(() => initialData.customers[0]?.id ?? '');
  const [modal, setModal] = useState<Modal>(null);

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(data)), [data]);

  const metrics = useMemo(() => calculateMetrics(data), [data]);
  const safeSelectedProjectId = data.projects.some((project) => project.id === selectedProjectId) ? selectedProjectId : data.projects[0]?.id ?? '';
  const safeSelectedCustomerId = data.customers.some((customer) => customer.id === selectedCustomerId) ? selectedCustomerId : data.customers[0]?.id ?? '';
  const selectedProject = byId(data.projects, safeSelectedProjectId) ?? data.projects[0];
  const selectedCustomer = byId(data.customers, safeSelectedCustomerId) ?? data.customers[0];
  const lowerQuery = query.toLowerCase();
  const filteredProjects = data.projects.filter((project) => [project.name, customerName(data, project.customerId), leadName(data, project.leadId), project.status].join(' ').toLowerCase().includes(lowerQuery));
  const filteredTickets = data.tickets.filter((ticket) => [ticket.title, projectName(data, ticket.projectId), colleagueName(data, ticket.assigneeId), ticket.status, ticket.priority].join(' ').toLowerCase().includes(lowerQuery));

  function addProject(form: FormData) {
    const project: Project = {
      id: makeId('proj'),
      name: String(form.get('name') || 'New project'),
      customerId: String(form.get('customerId') || data.customers[0]?.id),
      leadId: String(form.get('leadId') || data.colleagues[0]?.id),
      status: form.get('status') as ProjectStatus,
      budget: Number(form.get('budget') || 0),
      hourlyRate: Number(form.get('hourlyRate') || 100),
      startDate: String(form.get('startDate') || todayPlus(0)),
      endDate: String(form.get('endDate') || todayPlus(30)),
      summary: String(form.get('summary') || ''),
      memberIds: Array.from(new Set([String(form.get('leadId') || data.colleagues[0]?.id), ...form.getAll('memberIds').map(String)])).filter(Boolean),
    };
    setData((current) => ({ ...current, projects: [project, ...current.projects] }));
    setSelectedProjectId(project.id);
    setView('Projects');
    setModal(null);
  }

  function addTicket(form: FormData) {
    const ticket: Ticket = {
      id: makeId('tic'),
      projectId: String(form.get('projectId') || selectedProject?.id),
      title: String(form.get('title') || 'New ticket'),
      description: String(form.get('description') || ''),
      assigneeId: String(form.get('assigneeId') || data.colleagues[0]?.id),
      status: form.get('status') as TicketStatus,
      priority: form.get('priority') as TicketPriority,
      estimateHours: Number(form.get('estimateHours') || 1),
      dueDate: String(form.get('dueDate') || todayPlus(7)),
    };
    setData((current) => ({ ...current, tickets: [ticket, ...current.tickets] }));
    setSelectedProjectId(ticket.projectId);
    setModal(null);
  }

  function addTimeEntry(form: FormData) {
    const entry: TimeEntry = {
      id: makeId('time'),
      projectId: String(form.get('projectId') || selectedProject?.id),
      ticketId: String(form.get('ticketId') || ''),
      colleagueId: String(form.get('colleagueId') || data.colleagues[0]?.id),
      date: String(form.get('date') || todayPlus(0)),
      hours: Number(form.get('hours') || 1),
      billable: form.get('billable') === 'on',
      note: String(form.get('note') || ''),
    };
    setData((current) => ({ ...current, timeEntries: [entry, ...current.timeEntries] }));
    setSelectedProjectId(entry.projectId);
    setModal(null);
  }

  function addCustomer(form: FormData) {
    const customer: Customer = { id: makeId('cust'), name: String(form.get('name') || 'New customer'), segment: String(form.get('segment') || 'Consulting'), owner: String(form.get('owner') || 'Unassigned'), health: form.get('health') as CustomerHealth, revenueTarget: Number(form.get('revenueTarget') || 0) };
    setData((current) => ({ ...current, customers: [customer, ...current.customers] }));
    setSelectedCustomerId(customer.id);
    setModal(null);
  }

  function updateCustomerHealth(customerId: string, health: CustomerHealth) {
    setData((current) => ({ ...current, customers: current.customers.map((customer) => customer.id === customerId ? { ...customer, health } : customer) }));
  }

  function addColleague(form: FormData) {
    const colleague: Colleague = { id: makeId('col'), name: String(form.get('name') || 'New colleague'), role: String(form.get('role') || 'Consultant'), capacity: Number(form.get('capacity') || 60), billableRate: Number(form.get('billableRate') || 100), active: true };
    setData((current) => ({ ...current, colleagues: [colleague, ...current.colleagues] }));
    setModal(null);
  }

  function moveTicket(ticketId: string, status: TicketStatus) {
    setData((current) => ({ ...current, tickets: current.tickets.map((ticket) => ticket.id === ticketId ? { ...ticket, status } : ticket) }));
  }

  function exportCsv() {
    const rows = [['Date', 'Customer', 'Project', 'Ticket', 'Person', 'Hours', 'Billable', 'Note'], ...data.timeEntries.map((entry) => [entry.date, customerName(data, byId(data.projects, entry.projectId)?.customerId ?? ''), projectName(data, entry.projectId), ticketTitle(data, entry.ticketId), colleagueName(data, entry.colleagueId), String(entry.hours), entry.billable ? 'yes' : 'no', entry.note])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agencyos-time-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand"><span className="brandMark">A</span><div><strong>AgencyOS</strong><small>Consulting operations</small></div></div>
        <nav>
          {[
            ['Dashboard', LayoutDashboard], ['Projects', FolderKanban], ['Tickets', TicketCheck], ['Time', TimerReset], ['Reports', CircleDollarSign], ['Customers', Handshake], ['Team', UsersRound],
          ].map(([label, Icon]) => <button className={view === label ? 'active' : ''} key={label as string} onClick={() => setView(label as View)}><Icon size={18}/>{label as string}</button>)}
        </nav>
        <div className="opensource"><CheckCircle2 size={18}/><strong>Real agency workflow</strong><p>Projects → tickets → assignments → time → reports. Onboarding comes later.</p></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div><p className="eyebrow">{view}</p><h1>{headlineFor(view)}</h1></div>
          <div className="actions"><label className="search"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, tickets, people..." /></label><button onClick={() => setModal(defaultModalFor(view))} aria-label={`${ctaFor(view)}`}><Plus size={18} aria-hidden="true"/>{ctaFor(view)}</button></div>
        </header>

        {view === 'Dashboard' && <Dashboard data={data} metrics={metrics} onSelectProject={(id) => { setSelectedProjectId(id); setView('Projects'); }} onNewProject={() => setModal('project')} onNewTicket={() => setModal('ticket')} onLogTime={() => setModal('time')} onOpenReports={() => setView('Reports')} />}
        {view === 'Projects' && (selectedProject ? <ProjectsView data={data} projects={filteredProjects} selectedProject={selectedProject} onSelectProject={setSelectedProjectId} onNewProject={() => setModal('project')} onNewTicket={() => setModal('ticket')} onLogTime={() => setModal('time')} onMoveTicket={moveTicket} /> : <section className="panel"><PanelTitle eyebrow="Projects" title="Portfolio" /><EmptyState title="No projects yet" body="Create the first client project to open the cockpit, tickets, and time workflow." action="Create project" onAction={() => setModal('project')}/></section>)}
        {view === 'Tickets' && <TicketsView data={data} tickets={filteredTickets} onMoveTicket={moveTicket} onNew={() => setModal('ticket')} />}
        {view === 'Time' && <TimeView data={data} onNew={() => setModal('time')} />}
        {view === 'Reports' && <ReportsView data={data} metrics={metrics} onExport={exportCsv} onLogTime={() => setModal('time')} />}
        {view === 'Customers' && <CustomersView data={data} selectedCustomer={selectedCustomer} onSelectCustomer={setSelectedCustomerId} onUpdateHealth={updateCustomerHealth} onNew={() => setModal('customer')} onNewProject={() => setModal('project')} onOpenProject={(id) => { setSelectedProjectId(id); setView('Projects'); }} onLogTime={() => setModal('time')} />}
        {view === 'Team' && <TeamView data={data} onNew={() => setModal('colleague')} />}
      </section>

      {modal && <EntityModal modal={modal} data={data} selectedProjectId={selectedProject?.id ?? ''} onClose={() => setModal(null)} onProject={addProject} onTicket={addTicket} onTime={addTimeEntry} onCustomer={addCustomer} onColleague={addColleague} />}
    </main>
  );
}

function Dashboard({ data, metrics, onSelectProject, onNewProject, onNewTicket, onLogTime, onOpenReports }: { data: AppData; metrics: ReturnType<typeof calculateMetrics>; onSelectProject: (id: string) => void; onNewProject: () => void; onNewTicket: () => void; onLogTime: () => void; onOpenReports: () => void }) {
  const stats = [
    { label: 'Active projects', value: String(metrics.activeProjects), delta: `${metrics.atRisk} at risk`, icon: FolderKanban },
    { label: 'Open tickets', value: String(metrics.openTickets), delta: 'Across all projects', icon: TicketCheck },
    { label: 'Billable hours', value: `${metrics.billableHours}h`, delta: `${metrics.utilization}% billable ratio`, icon: Clock3 },
    { label: 'Earned so far', value: formatCurrency(metrics.revenue), delta: `${formatCurrency(metrics.budget)} active budget`, icon: CircleDollarSign },
  ];
  const urgentTickets = data.tickets.filter((ticket) => ticket.priority === 'Urgent' || ticket.priority === 'High');
  return <><section className="hero"><div><p className="eyebrow">MOCO + Trello + Clockify core</p><h2>Run consulting delivery from project cockpit to reports.</h2><p>Track project health, assign ticket work, log billable time, and understand where the agency spends effort.</p></div><div className="heroCard"><TimerReset/><strong>Today’s useful loop</strong><span>Create project → add ticket → assign colleague → log time → review reports.</span><div className="quickActions"><button onClick={onNewProject}><Plus size={16}/>Project</button><button className="ghost" onClick={onNewTicket}>Ticket</button><button className="ghost" onClick={onLogTime}>Time</button><button className="ghost" onClick={onOpenReports}>Reports</button></div></div></section><section className="stats">{stats.map(({ label, value, delta, icon: Icon }) => <article className="stat" key={label}><Icon/><span>{label}</span><strong>{value}</strong><small>{delta}</small></article>)}</section><section className="grid"><article className="panel wide"><PanelTitle eyebrow="Project cockpit" title="Active projects" />{data.projects.length ? data.projects.map((project) => <button className="projectButton" key={project.id} onClick={() => onSelectProject(project.id)}><ProjectSummary data={data} project={project}/></button>) : <EmptyState title="No projects yet" body="Create the first client project, then add tickets and time from its cockpit." action="Create project" onAction={onNewProject}/>}</article><article className="panel"><PanelTitle eyebrow="Ticket system" title="Priority work" action="New ticket" onAction={onNewTicket}/>{urgentTickets.length ? urgentTickets.map((ticket) => <TicketCard data={data} ticket={ticket} key={ticket.id}/>) : <EmptyState title="No high-priority tickets" body="Add delivery work when a project needs attention." action="Add ticket" onAction={onNewTicket}/>}</article><article className="panel"><PanelTitle eyebrow="Time tracking" title="Recent entries" action="Log time" onAction={onLogTime}/>{data.timeEntries.length ? data.timeEntries.slice(0, 4).map((entry) => <TimeRow data={data} entry={entry} key={entry.id}/>) : <EmptyState title="No time logged" body="Log time against a ticket to make reports and budgets useful." action="Log time" onAction={onLogTime}/>}</article></section></>;
}

function ProjectsView({ data, projects, selectedProject, onSelectProject, onNewProject, onNewTicket, onLogTime, onMoveTicket }: { data: AppData; projects: Project[]; selectedProject: Project; onSelectProject: (id: string) => void; onNewProject: () => void; onNewTicket: () => void; onLogTime: () => void; onMoveTicket: (ticketId: string, status: TicketStatus) => void }) {
  const tickets = data.tickets.filter((ticket) => ticket.projectId === selectedProject.id);
  const time = data.timeEntries.filter((entry) => entry.projectId === selectedProject.id);
  return <section className="projectWorkspace"><aside className="projectListRail"><PanelTitle eyebrow="Projects" title="Portfolio" />{projects.length ? projects.map((project) => <button className={project.id === selectedProject.id ? 'selected projectRailItem' : 'projectRailItem'} key={project.id} onClick={() => onSelectProject(project.id)}>{project.name}<small>{customerName(data, project.customerId)}</small></button>) : <EmptyState title="No matching projects" body="Try another search term or create a new engagement for this customer portfolio." action="Create project" onAction={onNewProject}/>}</aside><article className="panel projectCockpit"><div className="cockpitHead"><div><p className="eyebrow">{customerName(data, selectedProject.customerId)} · Lead {leadName(data, selectedProject.leadId)}</p><h2>{selectedProject.name}</h2><p>{selectedProject.summary}</p></div><em className={statusClass(selectedProject.status)}>{selectedProject.status}</em></div><section className="miniStats"><span><strong>{tickets.filter((ticket) => ticket.status !== 'Done').length}</strong> open tickets</span><span><strong>{projectHours(data, selectedProject.id)}h</strong> logged</span><span><strong>{projectBillableHours(data, selectedProject.id)}h</strong> billable</span><span><strong>{formatCurrency(projectRevenue(data, selectedProject.id))}</strong> earned</span></section><div className="cockpitActions"><button onClick={onNewTicket}><Plus size={16}/>Add ticket</button><button className="ghost" onClick={onLogTime}><TimerReset size={16}/>Log time</button></div><ProjectTeamStrip data={data} project={selectedProject}/><Board data={data} tickets={tickets} onMoveTicket={onMoveTicket}/><PanelTitle eyebrow="Timesheet" title="Project time" />{time.length ? time.map((entry) => <TimeRow data={data} entry={entry} key={entry.id}/>) : <EmptyState title="No time on this project yet" body="Log the first billable or internal entry to unlock budget and delivery signals." action="Log time" onAction={onLogTime}/>}</article></section>;
}

function Board({ data, tickets, onMoveTicket }: { data: AppData; tickets: Ticket[]; onMoveTicket: (ticketId: string, status: TicketStatus) => void }) {
  return <div className="board">{ticketStatuses.map((status) => {
    const columnTickets = tickets.filter((ticket) => ticket.status === status);
    return <section className="boardColumn" key={status}><h3>{status}</h3>{columnTickets.length ? columnTickets.map((ticket) => <TicketCard data={data} ticket={ticket} key={ticket.id} onMove={(next) => onMoveTicket(ticket.id, next)}/>) : <p className="columnEmpty">No {status.toLowerCase()} tickets</p>}</section>;
  })}</div>;
}

function TicketsView({ data, tickets, onMoveTicket, onNew }: { data: AppData; tickets: Ticket[]; onMoveTicket: (ticketId: string, status: TicketStatus) => void; onNew: () => void }) {
  return <section className="panel"><PanelTitle eyebrow="Tickets" title="Global ticket system" action="New ticket" onAction={onNew}/>{tickets.length ? <div className="cardGrid">{tickets.map((ticket) => <TicketCard data={data} ticket={ticket} key={ticket.id} onMove={(status) => onMoveTicket(ticket.id, status)}/>)}</div> : <EmptyState title="No tickets found" body="Create a delivery ticket or adjust search to bring work back into view." action="New ticket" onAction={onNew}/>}</section>;
}

function TimeView({ data, onNew }: { data: AppData; onNew: () => void }) {
  return <section className="panel"><PanelTitle eyebrow="Time management" title="Manual timesheet" action="Log time" onAction={onNew}/>{data.timeEntries.length ? data.timeEntries.map((entry) => <TimeRow data={data} entry={entry} key={entry.id}/>) : <EmptyState title="No time entries yet" body="Start with a manual entry so reports can show billable hours, utilization, and earned revenue." action="Log time" onAction={onNew}/>}</section>;
}

function ReportsView({ data, metrics, onExport, onLogTime }: { data: AppData; metrics: ReturnType<typeof calculateMetrics>; onExport: () => void; onLogTime: () => void }) {
  const hasReportRows = data.projects.length > 0 && data.timeEntries.length > 0;
  return <section className="grid"><article className="panel wide"><PanelTitle eyebrow="Reports" title="Project profitability and hours" action="Export CSV" onAction={onExport}/>{hasReportRows ? data.projects.map((project) => <div className="reportRow" key={project.id}><div><strong>{project.name}</strong><small>{customerName(data, project.customerId)}</small></div><span>{projectHours(data, project.id)}h total</span><span>{projectBillableHours(data, project.id)}h billable</span><span>{projectBudgetUsedPercent(data, project.id)}% budget</span><b>{formatCurrency(projectRevenue(data, project.id))}</b></div>) : <EmptyState title="Reports need project time" body="Log time to turn this into an agency revenue and utilization cockpit." action="Log time" onAction={onLogTime}/>}</article><article className="panel"><Download/><h3>Report summary</h3><p>{metrics.totalHours}h tracked, {metrics.billableHours}h billable, {formatCurrency(metrics.revenue)} earned from logged work.</p></article></section>;
}

function CustomersView({ data, selectedCustomer, onSelectCustomer, onUpdateHealth, onNew, onNewProject, onOpenProject, onLogTime }: { data: AppData; selectedCustomer?: Customer; onSelectCustomer: (id: string) => void; onUpdateHealth: (id: string, health: CustomerHealth) => void; onNew: () => void; onNewProject: () => void; onOpenProject: (id: string) => void; onLogTime: () => void }) {
  if (!data.customers.length || !selectedCustomer) return <section className="panel"><PanelTitle eyebrow="Customers" title="Accounts and delivery" action="New customer" onAction={onNew}/><EmptyState title="No customers yet" body="Add the first client account so projects, tickets, time, and revenue have CRM-lite context." action="New customer" onAction={onNew}/></section>;
  const projects = customerProjects(data, selectedCustomer.id);
  const tickets = customerTickets(data, selectedCustomer.id);
  const openTickets = tickets.filter((ticket) => ticket.status !== 'Done');
  const revenue = customerRevenue(data, selectedCustomer.id);
  const hours = customerHours(data, selectedCustomer.id);
  const targetProgress = selectedCustomer.revenueTarget ? Math.min(100, Math.round((revenue / selectedCustomer.revenueTarget) * 100)) : 0;
  const atRiskProjects = projects.filter((project) => project.status === 'At risk');
  const nextAction = atRiskProjects.length
    ? `Schedule a recovery check-in for ${atRiskProjects[0].name}.`
    : openTickets.length
      ? `Review ${openTickets[0].title} before ${new Date(openTickets[0].dueDate).toLocaleDateString()}.`
      : projects.length
        ? 'Log fresh time or add the next delivery ticket.'
        : 'Create the first project for this account.';

  return <section className="customerWorkspace"><aside className="customerListRail"><PanelTitle eyebrow="Customers" title="Accounts" action="New" onAction={onNew}/>{data.customers.map((customer) => {
    const customerProjectCount = customerProjects(data, customer.id).length;
    return <button className={customer.id === selectedCustomer.id ? 'selected customerRailItem' : 'customerRailItem'} key={customer.id} onClick={() => onSelectCustomer(customer.id)}><CustomerRow customer={customer} open={customerProjectCount}/><small>{customerHours(data, customer.id)}h · {formatCurrency(customerRevenue(data, customer.id))}</small></button>;
  })}</aside><article className="panel customerCockpit"><div className="customerHero"><div><p className="eyebrow">CRM-lite cockpit · {selectedCustomer.segment}</p><h2>{selectedCustomer.name}</h2><p>Owner {selectedCustomer.owner}. Connects account health, projects, open delivery work, time, and revenue target progress in one customer record.</p></div><div className="healthEditor" aria-label="Customer health"><HeartPulse size={18}/><strong>{selectedCustomer.health}</strong><select value={selectedCustomer.health} onChange={(event) => onUpdateHealth(selectedCustomer.id, event.target.value as CustomerHealth)}>{healthOptions.map((health) => <option key={health}>{health}</option>)}</select></div></div><section className="miniStats"><span><strong>{projects.length}</strong> projects</span><span><strong>{openTickets.length}</strong> open tickets</span><span><strong>{hours}h</strong> logged</span><span><strong>{formatCurrency(revenue)}</strong> earned</span></section><div className="targetPanel"><div><p className="eyebrow">Revenue target</p><strong>{targetProgress}% of {formatCurrency(selectedCustomer.revenueTarget)}</strong></div><div className="meter"><i style={{ width: `${targetProgress}%` }} /></div></div><section className="nextAction"><Lightbulb size={19}/><div><strong>Suggested next action</strong><p>{nextAction}</p></div></section><div className="customerCockpitGrid"><article><PanelTitle eyebrow="Connected projects" title="Delivery portfolio" />{projects.length ? projects.map((project) => <button className="projectButton" key={project.id} onClick={() => onOpenProject(project.id)}><ProjectSummary data={data} project={project}/></button>) : <EmptyState title="No projects yet" body="Create a project to connect this customer to delivery, time, and reports." action="Create project" onAction={onNewProject}/>}</article><article><PanelTitle eyebrow="Open work" title="Tickets needing attention" />{openTickets.length ? openTickets.slice(0, 4).map((ticket) => <TicketCard data={data} ticket={ticket} key={ticket.id}/>) : <EmptyState title="No open tickets" body="This account has no active delivery work. Log time or add the next ticket from a project cockpit." action="Log time" onAction={onLogTime}/>}</article></div></article></section>;
}

function TeamView({ data, onNew }: { data: AppData; onNew: () => void }) {
  const team = data.colleagues.map((person) => {
    const openTickets = data.tickets.filter((ticket) => ticket.assigneeId === person.id && ticket.status !== 'Done');
    const plannedHours = colleagueOpenTicketEstimate(data, person.id);
    const loggedHours = colleagueLoggedHours(data, person.id);
    const load = colleagueDeliveryLoadPercent(data, person.id);
    const status = colleagueLoadStatus(load);
    const billableRatio = colleagueBillableRatio(data, person.id);
    const projectCount = data.projects.filter((project) => project.memberIds?.includes(person.id) || project.leadId === person.id).length;
    return { person, openTickets, plannedHours, loggedHours, load, status, billableRatio, projectCount };
  });
  const overloaded = team.filter((item) => item.status === 'Overloaded').length;
  const underbooked = team.filter((item) => item.status === 'Underbooked').length;
  const totalLogged = team.reduce((sum, item) => sum + item.loggedHours, 0);
  const totalPlanned = team.reduce((sum, item) => sum + item.plannedHours, 0);

  return <section className="panel teamCockpit"><PanelTitle eyebrow="Team" title="Capacity and time cockpit" action="New colleague" onAction={onNew}/>{data.colleagues.length ? <><div className="teamOverview"><div><p className="eyebrow">Employee time overview</p><strong>{totalLogged}h logged · {totalPlanned}h planned</strong><span>{overloaded} overloaded, {underbooked} underbooked — capacity is visible before delivery slips.</span></div><button className="ghost" onClick={onNew}><Plus size={16}/>Add capacity</button></div><div className="peopleGrid">{team.map(({ person, openTickets, plannedHours, loggedHours, load, status, billableRatio, projectCount }) => (
    <article className={`personCard ${status.toLowerCase()}`} key={person.id}><div className="personCardHead"><PersonRow person={person}/><em className={status === 'Overloaded' ? 'amber' : status === 'Healthy' ? 'green' : 'blue'}>{status}</em></div><div className="capacityLine"><div><strong>{Math.min(100, load)}%</strong><small>delivery load</small></div><div><strong>{billableRatio}%</strong><small>billable ratio</small></div><div><strong>{projectCount}</strong><small>projects</small></div></div><div className="deliveryFacts"><span>{openTickets.length} open tickets</span><span>{plannedHours}h planned</span><span>{loggedHours}h logged</span></div><div className="meter" aria-label={`${person.name} delivery load ${load}%`}><i style={{ width: `${Math.min(100, load)}%` }} /></div><small>{person.billableRate}€/h · {person.capacity}h capacity signal · {load}% load from assigned work and logged time</small></article>
  ))}</div></> : <EmptyState title="No teammates yet" body="Add colleagues to make capacity, assignments, and billable rates visible across the agency." action="New colleague" onAction={onNew}/>}</section>;
}

function EntityModal({ modal, data, selectedProjectId, onClose, onProject, onTicket, onTime, onCustomer, onColleague }: { modal: Modal; data: AppData; selectedProjectId: string; onClose: () => void; onProject: (form: FormData) => void; onTicket: (form: FormData) => void; onTime: (form: FormData) => void; onCustomer: (form: FormData) => void; onColleague: (form: FormData) => void }) {
  const title = modal === 'project' ? 'Start a new engagement' : modal === 'ticket' ? 'Create ticket' : modal === 'time' ? 'Log time' : modal === 'customer' ? 'Add customer' : 'Add colleague';
  const submitLabel = modal === 'project' ? 'Create project' : 'Save';
  return <div className={`modalBackdrop ${modal === 'project' ? 'drawerBackdrop' : ''}`} role="dialog" aria-modal="true"><form className={`modal ${modal === 'project' ? 'projectDrawer' : ''}`} onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); if (modal === 'project') onProject(form); if (modal === 'ticket') onTicket(form); if (modal === 'time') onTime(form); if (modal === 'customer') onCustomer(form); if (modal === 'colleague') onColleague(form); }}><div className="modalHead"><div><p className="eyebrow">{modal === 'project' ? 'Premium project creation' : 'AgencyOS'}</p><h2>{title}</h2></div><button type="button" className="iconButton" onClick={onClose} aria-label="Close dialog"><X size={18}/></button></div>{modal === 'project' && <ProjectFields data={data}/>} {modal === 'ticket' && <TicketFields data={data} selectedProjectId={selectedProjectId}/>} {modal === 'time' && <TimeFields data={data} selectedProjectId={selectedProjectId}/>} {modal === 'customer' && <CustomerFields/>} {modal === 'colleague' && <ColleagueFields/>}<div className="modalActions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button type="submit">{submitLabel}</button></div></form></div>;
}

function ProjectFields({ data }: { data: AppData }) {
  const [budget, setBudget] = useState(20000);
  const [hourlyRate, setHourlyRate] = useState(120);
  const [leadId, setLeadId] = useState(data.colleagues[0]?.id ?? '');
  const [memberIds, setMemberIds] = useState<string[]>(data.colleagues.slice(0, 2).map((person) => person.id));
  const selectedMembers = data.colleagues.filter((person) => memberIds.includes(person.id) || person.id === leadId);
  const blendedRate = selectedMembers.length ? Math.round(selectedMembers.reduce((sum, person) => sum + person.billableRate, 0) / selectedMembers.length) : hourlyRate;
  const plannedHours = hourlyRate > 0 ? Math.floor(budget / hourlyRate) : 0;
  const teamCapacity = selectedMembers.reduce((sum, person) => sum + person.capacity, 0);

  function toggleMember(id: string) {
    setMemberIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return <div className="projectDrawerFields"><section className="drawerIntro"><Sparkles size={20}/><div><strong>Set up the customer, lead, team, and money signals in one pass.</strong><p>The live summary keeps this from feeling like a spreadsheet row.</p></div></section><div className="drawerLayout"><div><div className="formStep"><span>1</span><div><label>Project name<input name="name" required placeholder="Website relaunch" /></label><label>Customer<select name="customerId">{data.customers.map((customer) => <option value={customer.id} key={customer.id}>{customer.name}</option>)}</select></label><label>Status<select name="status" defaultValue="Planning">{projectStatuses.map((status) => <option key={status}>{status}</option>)}</select></label></div></div><div className="formStep"><span>2</span><div><div className="formGrid"><label>Budget<input name="budget" type="number" min="0" value={budget} onChange={(event) => setBudget(Number(event.target.value))} /></label><label>Hourly rate<input name="hourlyRate" type="number" min="0" value={hourlyRate} onChange={(event) => setHourlyRate(Number(event.target.value))} /></label></div><div className="formGrid"><label>Start<input name="startDate" type="date" defaultValue={todayPlus(0)} /></label><label>End<input name="endDate" type="date" defaultValue={todayPlus(30)} /></label></div></div></div><div className="formStep"><span>3</span><div><label>Project lead<select name="leadId" value={leadId} onChange={(event) => setLeadId(event.target.value)}>{data.colleagues.map((person) => <option value={person.id} key={person.id}>{person.name} · {person.billableRate}€/h</option>)}</select></label><fieldset className="teamPicker"><legend>Team assignment</legend>{data.colleagues.map((person) => <label className="memberOption" key={person.id}><input type="checkbox" name="memberIds" value={person.id} checked={memberIds.includes(person.id)} onChange={() => toggleMember(person.id)} /><span>{initials(person.name)}</span><strong>{person.name}</strong><small>{person.capacity}% capacity · {person.billableRate}€/h</small></label>)}</fieldset></div></div><label>Summary<textarea name="summary" placeholder="What outcome is this engagement responsible for?" /></label></div><aside className="drawerSummary"><p className="eyebrow">Live engagement summary</p><strong>{formatCurrency(budget)}</strong><span>budget creates roughly {plannedHours} sellable hours at {formatCurrency(hourlyRate)}/h.</span><div className="summaryFacts"><b>{selectedMembers.length}</b><small>team members</small><b>{teamCapacity}%</b><small>combined capacity signal</small><b>{formatCurrency(blendedRate)}</b><small>avg. team rate</small></div><p>After creation, AgencyOS opens the project cockpit so tickets and time can start immediately.</p></aside></div></div>;
}
function TicketFields({ data, selectedProjectId }: { data: AppData; selectedProjectId: string }) { return <><label>Ticket title<input name="title" required placeholder="Run stakeholder workshop" /></label><label>Project<select name="projectId" defaultValue={selectedProjectId}>{data.projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label><label>Assignee<select name="assigneeId">{data.colleagues.map((person) => <option value={person.id} key={person.id}>{person.name}</option>)}</select></label><div className="formGrid"><label>Status<select name="status">{ticketStatuses.map((status) => <option key={status}>{status}</option>)}</select></label><label>Priority<select name="priority" defaultValue="Medium">{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label></div><div className="formGrid"><label>Estimate hours<input name="estimateHours" type="number" min="0" step="0.5" defaultValue="4" /></label><label>Due date<input name="dueDate" type="date" defaultValue={todayPlus(7)} /></label></div><label>Description<textarea name="description" placeholder="What needs to happen?" /></label></>; }
function TimeFields({ data, selectedProjectId }: { data: AppData; selectedProjectId: string }) { const [projectId, setProjectId] = useState(selectedProjectId); const projectTickets = data.tickets.filter((ticket) => ticket.projectId === projectId); return <><label>Project<select name="projectId" value={projectId} onChange={(event) => setProjectId(event.target.value)}>{data.projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label><label>Ticket<select name="ticketId" key={projectId}><option value="">No ticket</option>{projectTickets.map((ticket) => <option value={ticket.id} key={ticket.id}>{ticket.title}</option>)}</select><small className="fieldHint">Only tickets from the selected project appear here, so logged time rolls up cleanly.</small></label><label>Person<select name="colleagueId">{data.colleagues.map((person) => <option value={person.id} key={person.id}>{person.name}</option>)}</select></label><div className="formGrid"><label>Date<input name="date" type="date" defaultValue={todayPlus(0)} /></label><label>Hours<input name="hours" type="number" min="0.25" step="0.25" defaultValue="1" /></label></div><label className="checkbox"><input name="billable" type="checkbox" defaultChecked />Billable</label><label>Note<textarea name="note" placeholder="What did you work on?" /></label></>; }
function CustomerFields() { return <><label>Customer name<input name="name" required placeholder="Acme GmbH" /></label><label>Segment<input name="segment" placeholder="B2B SaaS" /></label><label>Owner<input name="owner" placeholder="Account owner" /></label><div className="formGrid"><label>Health<select name="health">{healthOptions.map((health) => <option key={health}>{health}</option>)}</select></label><label>Revenue target<input name="revenueTarget" type="number" defaultValue="25000" /></label></div></>; }
function ColleagueFields() { return <><label>Name<input name="name" required placeholder="Alex Morgan" /></label><label>Role<input name="role" placeholder="Consultant" /></label><div className="formGrid"><label>Capacity %<input name="capacity" type="number" min="0" max="120" defaultValue="70" /></label><label>Billable rate €/h<input name="billableRate" type="number" min="0" defaultValue="100" /></label></div></>; }

function ProjectTeamStrip({ data, project }: { data: AppData; project: Project }) {
  const members = data.colleagues.filter((person) => project.memberIds?.includes(person.id) || person.id === project.leadId);
  return <section className="projectTeamStrip" aria-label="Project team"><div><p className="eyebrow">Team assignment</p><strong>{members.length} people on this engagement</strong></div>{members.map((person) => {
    const openWork = data.tickets.filter((ticket) => ticket.projectId === project.id && ticket.assigneeId === person.id && ticket.status !== 'Done');
    const loggedHours = data.timeEntries.filter((entry) => entry.projectId === project.id && entry.colleagueId === person.id).reduce((sum, entry) => sum + entry.hours, 0);
    return <span key={person.id}>{initials(person.name)}<small>{person.name} · {loggedHours}h · {openWork.length} open</small></span>;
  })}</section>;
}

function ProjectSummary({ data, project }: { data: AppData; project: Project }) { return <div className="projectSummary"><div><strong>{project.name}</strong><span>{customerName(data, project.customerId)} · Lead {leadName(data, project.leadId)}</span></div><em className={statusClass(project.status)}>{project.status}</em><small>{projectHours(data, project.id)}h · {projectBudgetUsedPercent(data, project.id)}% of {formatCurrency(project.budget)}</small></div>; }
function TicketCard({ data, ticket, onMove }: { data: AppData; ticket: Ticket; onMove?: (status: TicketStatus) => void }) { return <article className="ticketCard"><div><strong>{ticket.title}</strong><p>{ticket.description}</p></div><div className="ticketMeta"><span>{projectName(data, ticket.projectId)}</span><span>{colleagueName(data, ticket.assigneeId)}</span><em className={statusClass(ticket.priority)}>{ticket.priority}</em></div><small>{ticketLoggedHours(data, ticket.id)}h logged / {ticket.estimateHours}h est · due {new Date(ticket.dueDate).toLocaleDateString()}</small>{onMove && <select value={ticket.status} onChange={(event) => onMove(event.target.value as TicketStatus)}>{ticketStatuses.map((status) => <option key={status}>{status}</option>)}</select>}</article>; }
function TimeRow({ data, entry }: { data: AppData; entry: TimeEntry }) { return <div className="timeRow"><TimerReset size={18}/><div><strong>{entry.hours}h · {projectName(data, entry.projectId)}</strong><small>{ticketTitle(data, entry.ticketId)} · {colleagueName(data, entry.colleagueId)} · {entry.date}</small></div><em className={entry.billable ? 'green' : 'neutral'}>{entry.billable ? 'Billable' : 'Internal'}</em></div>; }
function PersonRow({ person }: { person: Colleague }) { return <div className="person"><span>{initials(person.name)}</span><div><strong>{person.name}</strong><small>{person.role}</small></div><b>{person.capacity}%</b></div>; }
function CustomerRow({ customer, open }: { customer: Customer; open: number }) { return <div className="customer"><BriefcaseBusiness/><div><strong>{customer.name}</strong><small>{open} projects · {customer.segment}</small></div><em>{customer.health}</em></div>; }
function PanelTitle({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action?: string; onAction?: () => void }) { return <div className="panelHead"><div><p className="eyebrow">{eyebrow}</p><h3>{title}</h3></div>{action && <button className="linkButton" onClick={onAction}>{action}</button>}</div>; }
function EmptyState({ title, body, action, onAction }: { title: string; body: string; action: string; onAction: () => void }) { return <div className="emptyState"><strong>{title}</strong><p>{body}</p><button className="linkButton" onClick={onAction}>{action}</button></div>; }
function customerName(data: AppData, id: string) { return byId(data.customers, id)?.name ?? 'Unknown customer'; }
function projectName(data: AppData, id: string) { return byId(data.projects, id)?.name ?? 'Unknown project'; }
function leadName(data: AppData, id: string) { return colleagueName(data, id); }
function colleagueName(data: AppData, id: string) { return byId(data.colleagues, id)?.name ?? 'Unassigned'; }
function ticketTitle(data: AppData, id: string) { return byId(data.tickets, id)?.title ?? 'No ticket'; }
function headlineFor(view: View) { return ({ Dashboard: 'Agency operations that connect work, people, and money.', Projects: 'A real project cockpit with tickets, time, and team.', Tickets: 'Assign, move, and track delivery tickets.', Time: 'Log billable and internal consulting time.', Reports: 'See hours, revenue, utilization, and project load.', Customers: 'Manage client accounts around real delivery.', Team: 'Understand workload, rates, and assignments.' })[view]; }
function ctaFor(view: View) { return view === 'Tickets' ? 'New ticket' : view === 'Time' ? 'Log time' : view === 'Customers' ? 'New customer' : view === 'Team' ? 'New colleague' : 'New project'; }
function defaultModalFor(view: View): Modal { return view === 'Tickets' ? 'ticket' : view === 'Time' ? 'time' : view === 'Customers' ? 'customer' : view === 'Team' ? 'colleague' : 'project'; }
