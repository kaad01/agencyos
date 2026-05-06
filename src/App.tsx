import { type DragEvent, useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, CheckCircle2, CircleDollarSign, Clock3, Download, FolderKanban, Handshake, HeartPulse, LayoutDashboard, Lightbulb, Plus, Search, Sparkles, TicketCheck, TimerReset, UsersRound, X } from 'lucide-react';
import { addDays, byId, calculateMetrics, colleagueBillableRatio, colleagueDeliveryLoadPercent, colleagueLoadStatus, colleagueLoggedHours, colleagueOpenTicketEstimate, customerHours, customerProjects, customerRevenue, customerTickets, formatCurrency, initialData, makeId, moveTicketOnBoard, priorities, projectBillableHours, projectBudgetRemaining, projectBudgetUsedPercent, projectEffectiveRate, projectEstimateUsedPercent, projectEstimatedHours, projectHours, projectNonBillableHours, projectRemainingEstimateHours, projectRevenue, projectDeliverySignal, filterTimeEntriesForReport, filterTimeEntriesForTimesheet, projectStatuses, ticketLoggedHours, ticketStatuses, weekStartDate, weeklyTimesheetByColleague, type AppData, type Colleague, type Customer, type CustomerHealth, type Project, type ProjectStatus, type Ticket, type TicketPriority, type TicketStatus, type ReportPeriod, type TimeEntry } from './domain';

type View = 'Dashboard' | 'Projects' | 'Tickets' | 'Time' | 'Reports' | 'Customers' | 'Team';
type Modal = 'project' | 'ticket' | 'time' | 'customer' | 'colleague' | null;
type DragTicket = { id: string; status: TicketStatus };
type ActiveTimer = { projectId: string; ticketId: string; colleagueId: string; billable: boolean; note: string; startedAt: string };
type TimerStartOptions = { colleagueId?: string; billable?: boolean; note?: string };

const storageKey = 'agencyos.ops.v1';
const activeTimerKey = 'agencyos.activeTimer.v1';
const healthOptions: CustomerHealth[] = ['Excellent', 'Healthy', 'Needs care', 'New'];
const reportPeriods: Record<ReportPeriod, string> = { all: 'All time', '7': 'Last 7 days', '30': 'Last 30 days' };

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? { ...initialData, ...JSON.parse(raw) as AppData } : initialData;
  } catch {
    return initialData;
  }
}

function loadActiveTimer(): ActiveTimer | null {
  try {
    const raw = localStorage.getItem(activeTimerKey);
    return raw ? JSON.parse(raw) as ActiveTimer : null;
  } catch {
    return null;
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

function timerDurationHours(startedAt: string, now = Date.now()) {
  const elapsedHours = Math.max(0, (now - new Date(startedAt).getTime()) / 36e5);
  return Math.max(0.25, Math.round(elapsedHours * 4) / 4);
}

function elapsedTimerLabel(startedAt: string, now = Date.now()) {
  const elapsedSeconds = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
}

export function App() {
  const [view, setView] = useState<View>('Dashboard');
  const [data, setData] = useState<AppData>(() => loadData());
  const [query, setQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(() => initialData.projects[0]?.id ?? '');
  const [selectedCustomerId, setSelectedCustomerId] = useState(() => initialData.customers[0]?.id ?? '');
  const [modal, setModal] = useState<Modal>(null);
  const [editingTimeEntryId, setEditingTimeEntryId] = useState<string | null>(null);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(() => loadActiveTimer());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(data)), [data]);
  useEffect(() => {
    if (activeTimer) localStorage.setItem(activeTimerKey, JSON.stringify(activeTimer));
    else localStorage.removeItem(activeTimerKey);
  }, [activeTimer]);
  useEffect(() => {
    if (!activeTimer) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [activeTimer]);

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

  function startTimer(projectId: string, ticketId = '', options: TimerStartOptions = {}) {
    if (activeTimer) return;
    const project = byId(data.projects, projectId);
    const ticket = byId(data.tickets, ticketId);
    const colleagueId = options.colleagueId || ticket?.assigneeId || project?.leadId || data.colleagues[0]?.id || '';
    if (!project || !colleagueId) return;
    setActiveTimer({
      projectId: project.id,
      ticketId,
      colleagueId,
      billable: options.billable ?? true,
      note: options.note?.trim() || (ticket ? `Timer: ${ticket.title}` : `Timer: ${project.name}`),
      startedAt: new Date().toISOString(),
    });
    setSelectedProjectId(project.id);
  }

  function stopTimer() {
    if (!activeTimer) return;
    const entry: TimeEntry = {
      id: makeId('time'),
      projectId: activeTimer.projectId,
      ticketId: activeTimer.ticketId,
      colleagueId: activeTimer.colleagueId,
      date: todayPlus(0),
      hours: timerDurationHours(activeTimer.startedAt),
      billable: activeTimer.billable,
      note: activeTimer.note,
    };
    setData((current) => ({ ...current, timeEntries: [entry, ...current.timeEntries] }));
    setSelectedProjectId(entry.projectId);
    setActiveTimer(null);
  }

  function cancelTimer() {
    if (!activeTimer) return;
    const confirmed = window.confirm(`Discard the running timer for ${projectName(data, activeTimer.projectId)}?`);
    if (confirmed) setActiveTimer(null);
  }

  function saveTimeEntry(form: FormData) {
    const id = editingTimeEntryId ?? makeId('time');
    const entry: TimeEntry = {
      id,
      projectId: String(form.get('projectId') || selectedProject?.id),
      ticketId: String(form.get('ticketId') || ''),
      colleagueId: String(form.get('colleagueId') || data.colleagues[0]?.id),
      date: String(form.get('date') || todayPlus(0)),
      hours: Number(form.get('hours') || 1),
      billable: form.get('billable') === 'on',
      note: String(form.get('note') || ''),
    };
    setData((current) => ({
      ...current,
      timeEntries: editingTimeEntryId
        ? current.timeEntries.map((item) => item.id === id ? entry : item)
        : [entry, ...current.timeEntries],
    }));
    setSelectedProjectId(entry.projectId);
    setEditingTimeEntryId(null);
    setModal(null);
  }

  function editTimeEntry(entryId: string) {
    const entry = byId(data.timeEntries, entryId);
    if (!entry) return;
    setEditingTimeEntryId(entry.id);
    setSelectedProjectId(entry.projectId);
    setModal('time');
  }

  function deleteTimeEntry(entryId: string) {
    const entry = byId(data.timeEntries, entryId);
    if (!entry) return;
    const confirmed = window.confirm(`Delete ${entry.hours}h for ${projectName(data, entry.projectId)} on ${entry.date}?`);
    if (!confirmed) return;
    setData((current) => ({ ...current, timeEntries: current.timeEntries.filter((item) => item.id !== entryId) }));
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

  function moveTicket(ticketId: string, status: TicketStatus, beforeTicketId?: string) {
    setData((current) => moveTicketOnBoard(current, ticketId, status, beforeTicketId));
  }

  function exportCsv(entries = data.timeEntries) {
    const rows = [['Date', 'Customer', 'Project', 'Ticket', 'Person', 'Hours', 'Billable', 'Note'], ...entries.map((entry) => [entry.date, customerName(data, byId(data.projects, entry.projectId)?.customerId ?? ''), projectName(data, entry.projectId), ticketTitle(data, entry.ticketId), colleagueName(data, entry.colleagueId), String(entry.hours), entry.billable ? 'yes' : 'no', entry.note])];
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

        {activeTimer && <ActiveTimerBar data={data} activeTimer={activeTimer} now={now} onStop={stopTimer} onCancel={cancelTimer} />}

        {view === 'Dashboard' && <Dashboard data={data} metrics={metrics} onSelectProject={(id) => { setSelectedProjectId(id); setView('Projects'); }} onNewProject={() => setModal('project')} onNewTicket={() => setModal('ticket')} onLogTime={() => setModal('time')} onOpenReports={() => setView('Reports')} />}
        {view === 'Projects' && (selectedProject ? <ProjectsView data={data} projects={filteredProjects} selectedProject={selectedProject} onSelectProject={setSelectedProjectId} onNewProject={() => setModal('project')} onNewTicket={() => setModal('ticket')} onLogTime={() => setModal('time')} onEditTime={editTimeEntry} onDeleteTime={deleteTimeEntry} onMoveTicket={moveTicket} onStartTimer={startTimer} activeTimer={activeTimer} /> : <section className="panel"><PanelTitle eyebrow="Projects" title="Portfolio" /><EmptyState title="No projects yet" body="Create the first client project to open the cockpit, tickets, and time workflow." action="Create project" onAction={() => setModal('project')}/></section>)}
        {view === 'Tickets' && <TicketsView data={data} tickets={filteredTickets} onMoveTicket={moveTicket} onStartTimer={startTimer} activeTimer={activeTimer} onNew={() => setModal('ticket')} />}
        {view === 'Time' && <TimeView data={data} activeTimer={activeTimer} now={now} onStartTimer={startTimer} onStopTimer={stopTimer} onCancelTimer={cancelTimer} onNew={() => setModal('time')} onEdit={editTimeEntry} onDelete={deleteTimeEntry} />}
        {view === 'Reports' && <ReportsView data={data} metrics={metrics} onExport={exportCsv} onLogTime={() => setModal('time')} />}
        {view === 'Customers' && <CustomersView data={data} selectedCustomer={selectedCustomer} onSelectCustomer={setSelectedCustomerId} onUpdateHealth={updateCustomerHealth} onNew={() => setModal('customer')} onNewProject={() => setModal('project')} onOpenProject={(id) => { setSelectedProjectId(id); setView('Projects'); }} onLogTime={() => setModal('time')} />}
        {view === 'Team' && <TeamView data={data} onNew={() => setModal('colleague')} />}
      </section>

      {modal && <EntityModal modal={modal} data={data} selectedProjectId={selectedProject?.id ?? ''} editingTimeEntry={editingTimeEntryId ? byId(data.timeEntries, editingTimeEntryId) : undefined} onClose={() => { setModal(null); setEditingTimeEntryId(null); }} onProject={addProject} onTicket={addTicket} onTime={saveTimeEntry} onCustomer={addCustomer} onColleague={addColleague} />}
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

function ProjectsView({ data, projects, selectedProject, onSelectProject, onNewProject, onNewTicket, onLogTime, onEditTime, onDeleteTime, onMoveTicket, onStartTimer, activeTimer }: { data: AppData; projects: Project[]; selectedProject: Project; onSelectProject: (id: string) => void; onNewProject: () => void; onNewTicket: () => void; onLogTime: () => void; onEditTime: (entryId: string) => void; onDeleteTime: (entryId: string) => void; onMoveTicket: (ticketId: string, status: TicketStatus, beforeTicketId?: string) => void; onStartTimer: (projectId: string, ticketId?: string) => void; activeTimer: ActiveTimer | null }) {
  const tickets = data.tickets.filter((ticket) => ticket.projectId === selectedProject.id);
  const time = data.timeEntries.filter((entry) => entry.projectId === selectedProject.id);
  const loggedHours = projectHours(data, selectedProject.id);
  const estimatedHours = projectEstimatedHours(data, selectedProject.id);
  const estimateUsed = projectEstimateUsedPercent(data, selectedProject.id);
  const remainingEstimate = projectRemainingEstimateHours(data, selectedProject.id);
  const deliverySignal = projectDeliverySignal(data, selectedProject.id);
  return <section className="projectWorkspace"><aside className="projectListRail"><PanelTitle eyebrow="Projects" title="Portfolio" />{projects.length ? projects.map((project) => <button className={project.id === selectedProject.id ? 'selected projectRailItem' : 'projectRailItem'} key={project.id} onClick={() => onSelectProject(project.id)}>{project.name}<small>{customerName(data, project.customerId)}</small></button>) : <EmptyState title="No matching projects" body="Try another search term or create a new engagement for this customer portfolio." action="Create project" onAction={onNewProject}/>}</aside><article className="panel projectCockpit"><div className="cockpitHead"><div><p className="eyebrow">{customerName(data, selectedProject.customerId)} · Lead {leadName(data, selectedProject.leadId)}</p><h2>{selectedProject.name}</h2><p>{selectedProject.summary}</p></div><em className={statusClass(selectedProject.status)}>{selectedProject.status}</em></div><section className="miniStats"><span><strong>{tickets.filter((ticket) => ticket.status !== 'Done').length}</strong> open tickets</span><span><strong>{loggedHours}h / {estimatedHours}h</strong> logged vs est.</span><span><strong>{projectBillableHours(data, selectedProject.id)}h</strong> billable</span><span><strong>{formatCurrency(projectRevenue(data, selectedProject.id))}</strong> earned</span></section><section className="effortPanel" aria-label="Project effort against estimates"><div><p className="eyebrow">Delivery effort</p><strong>{estimateUsed}% of ticket estimates used</strong><span>{loggedHours}h logged against {estimatedHours}h estimated · {remainingEstimate}h estimate remaining.</span></div><em className={deliverySignal === 'Over estimate' ? 'amber' : deliverySignal === 'Watch scope' ? 'blue' : 'green'}>{deliverySignal}</em><div className="meter"><i style={{ width: `${Math.min(100, estimateUsed)}%` }} /></div></section><div className="cockpitActions"><button onClick={onNewTicket}><Plus size={16}/>Add ticket</button><button className="ghost" onClick={onLogTime}><TimerReset size={16}/>Log time</button><button className="ghost" disabled={!!activeTimer} title={activeTimer ? 'Stop or discard the running timer before starting another.' : undefined} onClick={() => onStartTimer(selectedProject.id)}><Clock3 size={16}/>{activeTimer ? 'Timer already running' : 'Start timer'}</button></div>{activeTimer && <p className="timerHint">One timer can run at a time. Stop or discard the current timer before starting another project or ticket.</p>}<ProjectTeamStrip data={data} project={selectedProject}/><Board data={data} tickets={tickets} onMoveTicket={onMoveTicket} onStartTimer={onStartTimer} activeTimer={activeTimer}/><PanelTitle eyebrow="Timesheet" title="Project time" />{time.length ? time.map((entry) => <TimeRow data={data} entry={entry} key={entry.id} onEdit={onEditTime} onDelete={onDeleteTime}/>) : <EmptyState title="No time on this project yet" body="Log the first billable or internal entry to unlock budget and delivery signals." action="Log time" onAction={onLogTime}/>}</article></section>;
}

function Board({ data, tickets, onMoveTicket, onStartTimer, activeTimer }: { data: AppData; tickets: Ticket[]; onMoveTicket: (ticketId: string, status: TicketStatus, beforeTicketId?: string) => void; onStartTimer: (projectId: string, ticketId?: string) => void; activeTimer: ActiveTimer | null }) {
  const [draggedTicket, setDraggedTicket] = useState<DragTicket | null>(null);
  const [dropTarget, setDropTarget] = useState<{ status: TicketStatus; beforeTicketId?: string } | null>(null);

  function startDrag(event: DragEvent<HTMLElement>, ticket: Ticket) {
    const payload: DragTicket = { id: ticket.id, status: ticket.status };
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/json', JSON.stringify(payload));
    event.dataTransfer.setData('text/plain', ticket.id);
    setDraggedTicket(payload);
  }

  function readDrag(event: DragEvent<HTMLElement>) {
    if (draggedTicket) return draggedTicket;
    try {
      return JSON.parse(event.dataTransfer.getData('application/json')) as DragTicket;
    } catch {
      const id = event.dataTransfer.getData('text/plain');
      const ticket = tickets.find((item) => item.id === id);
      return ticket ? { id: ticket.id, status: ticket.status } : null;
    }
  }

  function allowDrop(event: DragEvent<HTMLElement>, status: TicketStatus, beforeTicketId?: string) {
    if (!draggedTicket) return;
    event.preventDefault();
    if (beforeTicketId) event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    setDropTarget({ status, beforeTicketId });
  }

  function drop(event: DragEvent<HTMLElement>, status: TicketStatus, beforeTicketId?: string) {
    event.preventDefault();
    if (beforeTicketId) event.stopPropagation();
    const ticket = readDrag(event);
    if (ticket && ticket.id !== beforeTicketId) onMoveTicket(ticket.id, status, beforeTicketId);
    setDraggedTicket(null);
    setDropTarget(null);
  }

  return <div className="board" aria-label="Drag tickets between columns or use each card status selector">{ticketStatuses.map((status) => {
    const columnTickets = tickets.filter((ticket) => ticket.status === status);
    const isColumnTarget = dropTarget?.status === status && !dropTarget.beforeTicketId;
    return <section className={`boardColumn ${draggedTicket ? 'dropReady' : ''} ${isColumnTarget ? 'dropTarget' : ''}`} key={status} onDragOver={(event) => allowDrop(event, status)} onDrop={(event) => drop(event, status)} onDragLeave={() => setDropTarget(null)}><h3>{status}</h3>{columnTickets.length ? columnTickets.map((ticket) => <TicketCard data={data} ticket={ticket} key={ticket.id} draggable onDragStart={(event) => startDrag(event, ticket)} onDragEnd={() => { setDraggedTicket(null); setDropTarget(null); }} onDragOver={(event) => allowDrop(event, status, ticket.id)} onDrop={(event) => drop(event, status, ticket.id)} isDragging={draggedTicket?.id === ticket.id} isDropTarget={dropTarget?.beforeTicketId === ticket.id} onMove={(next) => onMoveTicket(ticket.id, next)} onStartTimer={() => onStartTimer(ticket.projectId, ticket.id)} timerRunning={!!activeTimer}/>) : <p className="columnEmpty">No {status.toLowerCase()} tickets — drop one here</p>}</section>;
  })}</div>;
}

function TicketsView({ data, tickets, onMoveTicket, onStartTimer, activeTimer, onNew }: { data: AppData; tickets: Ticket[]; onMoveTicket: (ticketId: string, status: TicketStatus, beforeTicketId?: string) => void; onStartTimer: (projectId: string, ticketId?: string) => void; activeTimer: ActiveTimer | null; onNew: () => void }) {
  return <section className="panel"><PanelTitle eyebrow="Tickets" title="Global ticket system" action="New ticket" onAction={onNew}/>{tickets.length ? <div className="cardGrid">{tickets.map((ticket) => <TicketCard data={data} ticket={ticket} key={ticket.id} onMove={(status) => onMoveTicket(ticket.id, status)} onStartTimer={() => onStartTimer(ticket.projectId, ticket.id)} timerRunning={!!activeTimer}/>)}</div> : <EmptyState title="No tickets found" body="Create a delivery ticket or adjust search to bring work back into view." action="New ticket" onAction={onNew}/>}</section>;
}

function TimeView({ data, activeTimer, now, onStartTimer, onStopTimer, onCancelTimer, onNew, onEdit, onDelete }: { data: AppData; activeTimer: ActiveTimer | null; now: number; onStartTimer: (projectId: string, ticketId?: string, options?: TimerStartOptions) => void; onStopTimer: () => void; onCancelTimer: () => void; onNew: () => void; onEdit: (entryId: string) => void; onDelete: (entryId: string) => void }) {
  const latestDate = data.timeEntries.reduce((latest, entry) => entry.date > latest ? entry.date : latest, data.timeEntries[0]?.date ?? todayPlus(0));
  const [selectedWeekDate, setSelectedWeekDate] = useState(latestDate);
  const [projectId, setProjectId] = useState('');
  const [colleagueId, setColleagueId] = useState('');
  const weekStart = weekStartDate(selectedWeekDate);
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const scopedEntries = filterTimeEntriesForTimesheet(data, { weekDate: selectedWeekDate, projectId, colleagueId });
  const scopedData = { ...data, timeEntries: scopedEntries };
  const weeklyRows = weeklyTimesheetByColleague(scopedData, selectedWeekDate).filter((row) => row.total > 0);
  const weeklyTotal = weeklyRows.reduce((sum, row) => sum + row.total, 0);
  const weeklyBillable = weeklyRows.reduce((sum, row) => sum + row.billable, 0);
  const dailyTotals = weekDays.map((day) => scopedEntries.filter((entry) => entry.date === day).reduce((sum, entry) => sum + entry.hours, 0));
  const scopeLabel = [projectId ? projectName(data, projectId) : 'all projects', colleagueId ? colleagueName(data, colleagueId) : 'everyone'].join(' · ');
  const activityEntries = [...scopedEntries].sort((a, b) => b.date.localeCompare(a.date));

  return <section className="panel timeCockpit"><PanelTitle eyebrow="Time management" title="Weekly timesheet" action="Log time" onAction={onNew}/><TimerControl data={data} activeTimer={activeTimer} now={now} onStartTimer={onStartTimer} onStopTimer={onStopTimer} onCancelTimer={onCancelTimer}/>{data.timeEntries.length ? <><div className="timesheetSummary"><div><p className="eyebrow">Week of {weekStart}</p><strong>{weeklyTotal}h logged · {weeklyBillable}h billable</strong><span>Filtered to {scopeLabel}. Daily totals make Clockify-style review possible before reports and billing.</span></div><button className="ghost" onClick={onNew}>Add manual entry</button></div><div className="timesheetToolbar" aria-label="Timesheet filters"><label><span>Week</span><input type="date" value={selectedWeekDate} onChange={(event) => setSelectedWeekDate(event.target.value || latestDate)} /></label><label><span>Project</span><select value={projectId} onChange={(event) => setProjectId(event.target.value)}><option value="">All projects</option>{data.projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label><label><span>Person</span><select value={colleagueId} onChange={(event) => setColleagueId(event.target.value)}><option value="">Everyone</option>{data.colleagues.map((person) => <option value={person.id} key={person.id}>{person.name}</option>)}</select></label><button className="ghost" onClick={() => { setSelectedWeekDate(latestDate); setProjectId(''); setColleagueId(''); }}>Reset</button></div>{weeklyRows.length ? <div className="timesheetTable" role="table" aria-label="Weekly timesheet totals by colleague"><div className="timesheetHeader" role="row"><span>Person</span>{weekDays.map((day) => <span key={day}>{new Date(`${day}T00:00:00.000Z`).toLocaleDateString(undefined, { weekday: 'short' })}</span>)}<span>Total</span></div>{weeklyRows.map((row) => <div className="timesheetLine" role="row" key={row.colleague.id}><strong>{row.colleague.name}<small>{row.billable}h billable · {row.internal}h internal</small></strong>{row.dailyHours.map((hours, index) => <span key={`${row.colleague.id}-${weekDays[index]}`} className={hours ? 'hasHours' : ''}>{hours ? `${hours}h` : '—'}</span>)}<b>{row.total}h</b></div>)}<div className="timesheetLine timesheetTotals" role="row"><strong>Daily total<small>{weeklyBillable}h billable · {weeklyTotal - weeklyBillable}h internal</small></strong>{dailyTotals.map((hours, index) => <span key={`daily-total-${weekDays[index]}`} className={hours ? 'hasHours' : ''}>{hours ? `${hours}h` : '—'}</span>)}<b>{weeklyTotal}h</b></div></div> : <EmptyState title="No time in this timesheet scope" body="Adjust the week, project, or person filters — or log time in this scope before exporting reports." action="Log time" onAction={onNew}/>}<PanelTitle eyebrow="Scoped entries" title="Activity log" />{activityEntries.map((entry) => <TimeRow data={data} entry={entry} key={entry.id} onEdit={onEdit} onDelete={onDelete}/>)}</> : <EmptyState title="No time entries yet" body="Start with a manual entry so reports can show billable hours, utilization, and earned revenue." action="Log time" onAction={onNew}/>}</section>;
}

function ActiveTimerBar({ data, activeTimer, now, onStop, onCancel }: { data: AppData; activeTimer: ActiveTimer; now: number; onStop: () => void; onCancel: () => void }) {
  return <section className="activeTimerBar" aria-live="polite"><div><p className="eyebrow">Running timer</p><strong>{elapsedTimerLabel(activeTimer.startedAt, now)} · {projectName(data, activeTimer.projectId)}</strong><span>{ticketTitle(data, activeTimer.ticketId)} · {colleagueName(data, activeTimer.colleagueId)} · {activeTimer.billable ? 'Billable' : 'Internal'}</span></div><div><button onClick={onStop}><CheckCircle2 size={16}/>Stop and save</button><button className="ghost" onClick={onCancel}>Discard</button></div></section>;
}

function TimerControl({ data, activeTimer, now, onStartTimer, onStopTimer, onCancelTimer }: { data: AppData; activeTimer: ActiveTimer | null; now: number; onStartTimer: (projectId: string, ticketId?: string, options?: TimerStartOptions) => void; onStopTimer: () => void; onCancelTimer: () => void }) {
  const [projectId, setProjectId] = useState(data.projects[0]?.id ?? '');
  const [ticketId, setTicketId] = useState('');
  const [colleagueId, setColleagueId] = useState(data.projects[0]?.leadId ?? data.colleagues[0]?.id ?? '');
  const [billable, setBillable] = useState(true);
  const [note, setNote] = useState('');
  const projectTickets = data.tickets.filter((ticket) => ticket.projectId === projectId);
  const selectedTicketId = projectTickets.some((ticket) => ticket.id === ticketId) ? ticketId : '';
  const defaultNote = selectedTicketId ? `Timer: ${ticketTitle(data, selectedTicketId)}` : `Timer: ${projectName(data, projectId)}`;
  if (activeTimer) return <section className="timerControl running"><TimerReset size={20}/><div><p className="eyebrow">Timer running</p><strong>{elapsedTimerLabel(activeTimer.startedAt, now)} · rounds to {timerDurationHours(activeTimer.startedAt, now)}h</strong><span>{projectName(data, activeTimer.projectId)} · {ticketTitle(data, activeTimer.ticketId)} · {colleagueName(data, activeTimer.colleagueId)} · {activeTimer.billable ? 'Billable' : 'Internal'}</span></div><button onClick={onStopTimer}>Stop and save</button><button className="ghost" onClick={onCancelTimer}>Discard</button></section>;
  return <section className="timerControl"><TimerReset size={20}/><div><p className="eyebrow">Start/stop timer</p><strong>Track live work before it becomes a timesheet entry.</strong><span>Choose project, ticket, person, billable status, and note before the timer starts.</span></div><label>Project<select value={projectId} onChange={(event) => { const nextProjectId = event.target.value; setProjectId(nextProjectId); setTicketId(''); setColleagueId(byId(data.projects, nextProjectId)?.leadId ?? data.colleagues[0]?.id ?? ''); }}>{data.projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label><label>Ticket<select value={selectedTicketId} onChange={(event) => { const nextTicketId = event.target.value; setTicketId(nextTicketId); const ticket = byId(data.tickets, nextTicketId); if (ticket?.assigneeId) setColleagueId(ticket.assigneeId); }}><option value="">No ticket</option>{projectTickets.map((ticket) => <option value={ticket.id} key={ticket.id}>{ticket.title}</option>)}</select></label><label>Person<select value={colleagueId} onChange={(event) => setColleagueId(event.target.value)}>{data.colleagues.map((person) => <option value={person.id} key={person.id}>{person.name}</option>)}</select></label><label>Note<input value={note} placeholder={defaultNote} onChange={(event) => setNote(event.target.value)} /></label><label className="timerBillable"><input type="checkbox" checked={billable} onChange={(event) => setBillable(event.target.checked)} />Billable</label><button disabled={!projectId || !colleagueId} onClick={() => onStartTimer(projectId, selectedTicketId, { colleagueId, billable, note: note || defaultNote })}><Clock3 size={16}/>Start timer</button></section>;
}
function ReportsView({ data, metrics, onExport, onLogTime }: { data: AppData; metrics: ReturnType<typeof calculateMetrics>; onExport: (entries?: TimeEntry[]) => void; onLogTime: () => void }) {
  const [period, setPeriod] = useState<ReportPeriod>('all');
  const [customerId, setCustomerId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [colleagueId, setColleagueId] = useState('');
  const customerProjectsForFilter = customerId ? data.projects.filter((project) => project.customerId === customerId) : data.projects;
  const selectedProjectId = customerProjectsForFilter.some((project) => project.id === projectId) ? projectId : '';
  const reportTimeEntries = filterTimeEntriesForReport(data, { period, customerId, projectId: selectedProjectId, colleagueId });
  const scopedData = { ...data, timeEntries: reportTimeEntries };
  const scopedMetrics = calculateMetrics(scopedData);
  const projectsWithTime = data.projects.filter((project) => reportTimeEntries.some((entry) => entry.projectId === project.id));
  const latestDate = data.timeEntries.reduce((latest, entry) => entry.date > latest ? entry.date : latest, data.timeEntries[0]?.date ?? '');
  const hasReportRows = projectsWithTime.length > 0;
  return <section className="grid"><article className="panel wide"><div className="reportToolbar"><PanelTitle eyebrow="Reports" title="Project profitability and hours" action="Export CSV" onAction={() => onExport(reportTimeEntries)}/><div className="reportFilters reportFilterGrid"><label><span>Period</span><select value={period} onChange={(event) => setPeriod(event.target.value as ReportPeriod)}>{Object.entries(reportPeriods).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label><span>Customer</span><select value={customerId} onChange={(event) => { setCustomerId(event.target.value); setProjectId(''); }}><option value="">All customers</option>{data.customers.map((customer) => <option value={customer.id} key={customer.id}>{customer.name}</option>)}</select></label><label><span>Project</span><select value={selectedProjectId} onChange={(event) => setProjectId(event.target.value)}><option value="">All projects</option>{customerProjectsForFilter.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label><label><span>Person</span><select value={colleagueId} onChange={(event) => setColleagueId(event.target.value)}><option value="">Everyone</option>{data.colleagues.map((person) => <option value={person.id} key={person.id}>{person.name}</option>)}</select></label></div></div>{hasReportRows ? projectsWithTime.map((project) => <div className="reportRow" key={project.id}><div><strong>{project.name}</strong><small>{customerName(data, project.customerId)}</small></div><span>{projectHours(scopedData, project.id)}h total</span><span>{projectBillableHours(scopedData, project.id)}h billable</span><span>{projectNonBillableHours(scopedData, project.id)}h non-billable</span><span>{projectBudgetUsedPercent(scopedData, project.id)}% budget</span><b>{formatCurrency(projectRevenue(scopedData, project.id))}</b><small>{formatCurrency(projectBudgetRemaining(scopedData, project.id))} left · {formatCurrency(projectEffectiveRate(scopedData, project.id))}/h effective</small></div>) : <EmptyState title="No time matches these filters" body="Adjust the report filters or log time to turn this into an agency revenue and utilization cockpit." action="Log time" onAction={onLogTime}/>}</article><article className="panel"><Download/><h3>Report summary</h3><p>{scopedMetrics.totalHours}h tracked, {scopedMetrics.billableHours}h billable, {formatCurrency(scopedMetrics.revenue)} earned from the selected scope.</p><div className="reportSummaryGrid"><span><strong>{scopedMetrics.utilization}%</strong><small>billable ratio</small></span><span><strong>{projectsWithTime.length}</strong><small>projects with time</small></span><span><strong>{formatCurrency(metrics.revenue - scopedMetrics.revenue)}</strong><small>outside this scope</small></span></div>{period !== 'all' && latestDate ? <p className="fieldHint">Window is calculated through the newest logged entry: {latestDate}.</p> : null}<p className="fieldHint">CSV export follows the active period, customer, project, and person filters.</p></article></section>;
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

function EntityModal({ modal, data, selectedProjectId, editingTimeEntry, onClose, onProject, onTicket, onTime, onCustomer, onColleague }: { modal: Modal; data: AppData; selectedProjectId: string; editingTimeEntry?: TimeEntry; onClose: () => void; onProject: (form: FormData) => void; onTicket: (form: FormData) => void; onTime: (form: FormData) => void; onCustomer: (form: FormData) => void; onColleague: (form: FormData) => void }) {
  const title = modal === 'project' ? 'Start a new engagement' : modal === 'ticket' ? 'Create ticket' : modal === 'time' ? editingTimeEntry ? 'Edit time entry' : 'Log time' : modal === 'customer' ? 'Add customer' : 'Add colleague';
  const submitLabel = modal === 'project' ? 'Create project' : modal === 'time' && editingTimeEntry ? 'Update entry' : 'Save';
  return <div className={`modalBackdrop ${modal === 'project' ? 'drawerBackdrop' : ''}`} role="dialog" aria-modal="true"><form className={`modal ${modal === 'project' ? 'projectDrawer' : ''}`} onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); if (modal === 'project') onProject(form); if (modal === 'ticket') onTicket(form); if (modal === 'time') onTime(form); if (modal === 'customer') onCustomer(form); if (modal === 'colleague') onColleague(form); }}><div className="modalHead"><div><p className="eyebrow">{modal === 'project' ? 'Premium project creation' : modal === 'time' ? 'Manual time control' : 'AgencyOS'}</p><h2>{title}</h2></div><button type="button" className="iconButton" onClick={onClose} aria-label="Close dialog"><X size={18}/></button></div>{modal === 'project' && <ProjectFields data={data}/>} {modal === 'ticket' && <TicketFields data={data} selectedProjectId={selectedProjectId}/>} {modal === 'time' && <TimeFields data={data} selectedProjectId={selectedProjectId} entry={editingTimeEntry}/>} {modal === 'customer' && <CustomerFields/>} {modal === 'colleague' && <ColleagueFields/>}<div className="modalActions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button type="submit">{submitLabel}</button></div></form></div>;
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
function TimeFields({ data, selectedProjectId, entry }: { data: AppData; selectedProjectId: string; entry?: TimeEntry }) { const [projectId, setProjectId] = useState(entry?.projectId ?? selectedProjectId); const projectTickets = data.tickets.filter((ticket) => ticket.projectId === projectId); const ticketBelongsToProject = entry?.ticketId && projectTickets.some((ticket) => ticket.id === entry.ticketId); return <><section className="timeEditNote"><TimerReset size={18}/><div><strong>{entry ? 'Correct the source of truth before reports go out.' : 'Add manual time with clean project and ticket rollups.'}</strong><p>{entry ? 'Updates immediately refresh weekly totals, project budgets, customer revenue, and CSV exports.' : 'Manual entries are the Clockify-style base for reports, capacity, and billing readiness.'}</p></div></section><label>Project<select name="projectId" value={projectId} onChange={(event) => setProjectId(event.target.value)}>{data.projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label><label>Ticket<select name="ticketId" key={projectId} defaultValue={ticketBelongsToProject ? entry?.ticketId : ''}><option value="">No ticket</option>{projectTickets.map((ticket) => <option value={ticket.id} key={ticket.id}>{ticket.title}</option>)}</select><small className="fieldHint">Only tickets from the selected project appear here, so logged time rolls up cleanly.</small></label><label>Person<select name="colleagueId" defaultValue={entry?.colleagueId}>{data.colleagues.map((person) => <option value={person.id} key={person.id}>{person.name}</option>)}</select></label><div className="formGrid"><label>Date<input name="date" type="date" defaultValue={entry?.date ?? todayPlus(0)} /></label><label>Hours<input name="hours" type="number" min="0.25" step="0.25" defaultValue={entry?.hours ?? 1} /></label></div><label className="checkbox"><input name="billable" type="checkbox" defaultChecked={entry?.billable ?? true} />Billable</label><label>Note<textarea name="note" placeholder="What did you work on?" defaultValue={entry?.note ?? ''} /></label></>; }
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
function TicketCard({ data, ticket, onMove, onStartTimer, timerRunning = false, draggable = false, isDragging = false, isDropTarget = false, onDragStart, onDragEnd, onDragOver, onDrop }: { data: AppData; ticket: Ticket; onMove?: (status: TicketStatus) => void; onStartTimer?: () => void; timerRunning?: boolean; draggable?: boolean; isDragging?: boolean; isDropTarget?: boolean; onDragStart?: (event: DragEvent<HTMLElement>) => void; onDragEnd?: () => void; onDragOver?: (event: DragEvent<HTMLElement>) => void; onDrop?: (event: DragEvent<HTMLElement>) => void }) { return <article className={`ticketCard ${draggable ? 'draggableTicket' : ''} ${isDragging ? 'isDragging' : ''} ${isDropTarget ? 'dropBefore' : ''}`} draggable={draggable} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} onDrop={onDrop}><div><strong>{ticket.title}</strong><p>{ticket.description}</p></div><div className="ticketMeta"><span>{projectName(data, ticket.projectId)}</span><span>{colleagueName(data, ticket.assigneeId)}</span><em className={statusClass(ticket.priority)}>{ticket.priority}</em></div><small>{ticketLoggedHours(data, ticket.id)}h logged / {ticket.estimateHours}h est · due {new Date(ticket.dueDate).toLocaleDateString()}</small>{onMove && <label className="statusFallback"><span>Move to</span><select value={ticket.status} onChange={(event) => onMove(event.target.value as TicketStatus)}>{ticketStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>}{onStartTimer && <button type="button" className="ticketTimerButton" disabled={timerRunning} title={timerRunning ? 'Stop or discard the running timer before starting another.' : undefined} onClick={onStartTimer}><Clock3 size={15}/>{timerRunning ? 'Timer running' : 'Start timer'}</button>}</article>; }
function TimeRow({ data, entry, onEdit, onDelete }: { data: AppData; entry: TimeEntry; onEdit?: (entryId: string) => void; onDelete?: (entryId: string) => void }) { return <div className="timeRow"><TimerReset size={18}/><div><strong>{entry.hours}h · {projectName(data, entry.projectId)}</strong><small>{ticketTitle(data, entry.ticketId)} · {colleagueName(data, entry.colleagueId)} · {entry.date}</small>{entry.note ? <small>{entry.note}</small> : null}</div><em className={entry.billable ? 'green' : 'neutral'}>{entry.billable ? 'Billable' : 'Internal'}</em>{(onEdit || onDelete) && <div className="rowActions" aria-label={`Time entry actions for ${projectName(data, entry.projectId)}`}><button type="button" onClick={() => onEdit?.(entry.id)}>Edit</button><button type="button" className="danger" onClick={() => onDelete?.(entry.id)}>Delete</button></div>}</div>; }
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
