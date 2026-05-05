import { useEffect, useMemo, useState } from 'react';
import { BookOpenCheck, BriefcaseBusiness, CheckCircle2, CircleDollarSign, Clock3, FolderKanban, GitBranch, Handshake, LayoutDashboard, Lightbulb, Plus, Search, Sparkles, UsersRound, X } from 'lucide-react';
import { calculateMetrics, formatCurrency, initialData, makeId, type AppData, type Colleague, type Customer, type CustomerHealth, type Project, type ProjectStatus } from './domain';

type View = 'Overview' | 'Projects' | 'Colleagues' | 'Customers' | 'Workflow';
type Modal = 'project' | 'colleague' | 'customer' | null;

type TourStep = { title: string; body: string; view: View };

const storageKey = 'agencyos.data.v1';
const tourKey = 'agencyos.tour.done.v1';

const tourSteps: TourStep[] = [
  { view: 'Overview', title: 'Start with the agency health view', body: 'The overview is your weekly review: active projects, utilization, pipeline value, risk, and next actions.' },
  { view: 'Projects', title: 'Create delivery work from real customer demand', body: 'Projects connect a customer, a lead, budget, status, progress, dates, and the next action.' },
  { view: 'Colleagues', title: 'Keep staffing simple', body: 'Colleague capacity and focus make overbooking visible before it becomes delivery risk.' },
  { view: 'Customers', title: 'Manage relationships, not just tasks', body: 'Customer health, owner, revenue target, and notes make account reviews quick and useful.' },
  { view: 'Workflow', title: 'Build like an open-source product', body: 'Every product change should move through branch, spec, implementation, tests, PR review, merge, and deploy.' },
];

const statusOptions: ProjectStatus[] = ['Planning', 'On track', 'At risk', 'Complete'];
const healthOptions: CustomerHealth[] = ['Excellent', 'Healthy', 'Needs care', 'New'];

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) as AppData : initialData;
  } catch {
    return initialData;
  }
}

function statusClass(status: ProjectStatus) {
  return status === 'On track' ? 'green' : status === 'At risk' ? 'amber' : status === 'Complete' ? 'neutral' : 'blue';
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
  const [view, setView] = useState<View>('Overview');
  const [data, setData] = useState<AppData>(() => loadData());
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<Modal>(null);
  const [tourStep, setTourStep] = useState(() => localStorage.getItem(tourKey) ? -1 : 0);

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(data)), [data]);

  function goToTourStep(nextStep: number) {
    setTourStep(nextStep);
    setView(tourSteps[nextStep].view);
  }

  const metrics = useMemo(() => calculateMetrics(data), [data]);
  const lowerQuery = query.toLowerCase();
  const filteredProjects = data.projects.filter((project) => [project.name, customerName(data, project.customerId), leadName(data, project.leadId), project.status].join(' ').toLowerCase().includes(lowerQuery));
  const filteredColleagues = data.colleagues.filter((person) => [person.name, person.role, person.focus].join(' ').toLowerCase().includes(lowerQuery));
  const filteredCustomers = data.customers.filter((customer) => [customer.name, customer.segment, customer.owner, customer.health].join(' ').toLowerCase().includes(lowerQuery));
  const attentionProjects = data.projects.filter((project) => project.status === 'At risk' || project.progress < 25).slice(0, 3);

  function finishTour() {
    localStorage.setItem(tourKey, 'true');
    setTourStep(-1);
  }

  function resetDemoData() {
    setData(initialData);
    setQuery('');
  }

  function addCustomer(form: FormData) {
    const customer: Customer = {
      id: makeId('cust'),
      name: String(form.get('name') || 'New customer'),
      segment: String(form.get('segment') || 'Consulting'),
      owner: String(form.get('owner') || 'Unassigned'),
      health: form.get('health') as CustomerHealth,
      revenueTarget: Number(form.get('revenueTarget') || 0),
      notes: String(form.get('notes') || ''),
    };
    setData((current) => ({ ...current, customers: [customer, ...current.customers] }));
    setModal(null);
  }

  function addColleague(form: FormData) {
    const colleague: Colleague = {
      id: makeId('col'),
      name: String(form.get('name') || 'New colleague'),
      role: String(form.get('role') || 'Consultant'),
      focus: String(form.get('focus') || 'Bench'),
      capacity: Number(form.get('capacity') || 0),
      billableTarget: Number(form.get('billableTarget') || 0),
      active: true,
    };
    setData((current) => ({ ...current, colleagues: [colleague, ...current.colleagues] }));
    setModal(null);
  }

  function addProject(form: FormData) {
    const project: Project = {
      id: makeId('proj'),
      name: String(form.get('name') || 'New project'),
      customerId: String(form.get('customerId') || data.customers[0]?.id),
      leadId: String(form.get('leadId') || data.colleagues[0]?.id),
      status: form.get('status') as ProjectStatus,
      budget: Number(form.get('budget') || 0),
      progress: Number(form.get('progress') || 0),
      startDate: String(form.get('startDate') || todayPlus(0)),
      endDate: String(form.get('endDate') || todayPlus(30)),
      nextAction: String(form.get('nextAction') || 'Define next action.'),
    };
    setData((current) => ({ ...current, projects: [project, ...current.projects] }));
    setModal(null);
  }

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand"><span className="brandMark">A</span><div><strong>AgencyOS</strong><small>Open consulting ERP</small></div></div>
        <nav>
          {[
            ['Overview', LayoutDashboard],
            ['Projects', FolderKanban],
            ['Colleagues', UsersRound],
            ['Customers', Handshake],
            ['Workflow', GitBranch],
          ].map(([label, Icon]) => <button className={view === label ? 'active' : ''} key={label as string} onClick={() => setView(label as View)}><Icon size={18} />{label as string}</button>)}
        </nav>
        <div className="opensource"><Sparkles size={18}/><strong>Open source first</strong><p>Branch, spec, test, PR, review, merge, deploy. The workflow is part of the product.</p><button className="ghost" onClick={() => goToTourStep(0)}>Restart tour</button></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{view === 'Overview' ? 'Consulting agency command center' : `${view} workspace`}</p>
            <h1>{headlineFor(view)}</h1>
          </div>
          <div className="actions"><label className="search"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, customers..." /></label><button onClick={() => setModal(defaultModalFor(view))}><Plus size={18}/>{ctaFor(view)}</button></div>
        </header>

        {view === 'Overview' && <Overview metrics={metrics} data={data} attentionProjects={attentionProjects} onNewProject={() => setModal('project')} onReset={resetDemoData} />}
        {view === 'Projects' && <ProjectView projects={filteredProjects} data={data} onNew={() => setModal('project')} />}
        {view === 'Colleagues' && <ColleagueView colleagues={filteredColleagues} onNew={() => setModal('colleague')} />}
        {view === 'Customers' && <CustomerView customers={filteredCustomers} data={data} onNew={() => setModal('customer')} />}
        {view === 'Workflow' && <WorkflowView />}
      </section>

      {modal && <EntityModal modal={modal} data={data} onClose={() => setModal(null)} onCustomer={addCustomer} onColleague={addColleague} onProject={addProject} />}
      {tourStep >= 0 && <TourOverlay step={tourStep} onBack={() => goToTourStep(Math.max(0, tourStep - 1))} onNext={() => tourStep === tourSteps.length - 1 ? finishTour() : goToTourStep(tourStep + 1)} onSkip={finishTour} />}
    </main>
  );
}

function Overview({ metrics, data, attentionProjects, onNewProject, onReset }: { metrics: ReturnType<typeof calculateMetrics>; data: AppData; attentionProjects: Project[]; onNewProject: () => void; onReset: () => void }) {
  const stats = [
    { label: 'Active projects', value: String(metrics.activeProjects), delta: `${metrics.atRisk} needs attention`, icon: FolderKanban },
    { label: 'Team utilization', value: `${metrics.utilization}%`, delta: metrics.utilization > 85 ? 'Capacity pressure' : 'Healthy capacity', icon: Clock3 },
    { label: 'Pipeline value', value: formatCurrency(metrics.pipelineValue), delta: 'Active delivery budget', icon: CircleDollarSign },
    { label: 'Customers', value: String(metrics.customers), delta: 'Managed accounts', icon: Handshake },
  ];

  return <>
    <section className="hero">
      <div><p className="eyebrow">Guided operating rhythm</p><h2>Run the weekly agency review in one screen.</h2><p>Start with risks, staffing, account health, and project next actions. Add records as work becomes real; the dashboard updates from saved data.</p></div>
      <div className="heroCard"><CheckCircle2/><strong>Today’s workflow</strong><span>Review risks → confirm staffing → update customers → create project next actions.</span><button onClick={onNewProject}>Create first project</button></div>
    </section>
    <section className="stats">{stats.map(({ label, value, delta, icon: Icon }) => <article className="stat" key={label}><Icon/><span>{label}</span><strong>{value}</strong><small>{delta}</small></article>)}</section>
    <section className="grid">
      <article className="panel wide"><PanelTitle eyebrow="Project management" title="Needs attention" action="Reset demo" onAction={onReset}/><div className="projectList">{attentionProjects.map((project) => <ProjectRow key={project.id} project={project} data={data} />)}{attentionProjects.length === 0 && <EmptyState title="No delivery risks" body="Nothing is at risk right now. Add a project or update statuses during weekly review." />}</div></article>
      <article className="panel"><PanelTitle eyebrow="Colleague management" title="Capacity pressure" />{data.colleagues.slice().sort((a, b) => b.capacity - a.capacity).slice(0, 4).map((person) => <PersonRow key={person.id} person={person} />)}</article>
      <article className="panel"><PanelTitle eyebrow="Customer management" title="Account health" />{data.customers.slice(0, 4).map((customer) => <CustomerRow key={customer.id} customer={customer} open={data.projects.filter((project) => project.customerId === customer.id).length} />)}</article>
    </section>
  </>;
}

function ProjectView({ projects, data, onNew }: { projects: Project[]; data: AppData; onNew: () => void }) {
  return <section className="panel"><PanelTitle eyebrow="Project management" title="Delivery portfolio" action="New project" onAction={onNew}/><div className="tableHeader project"><span>Project</span><span>Progress</span><span>Budget</span><span>Status</span><span>Due</span></div><div className="projectList">{projects.map((project) => <ProjectRow key={project.id} project={project} data={data} />)}{projects.length === 0 && <EmptyState title="No projects found" body="Create a project to connect customer demand, budget, lead, dates, and next action." />}</div></section>;
}

function ColleagueView({ colleagues, onNew }: { colleagues: Colleague[]; onNew: () => void }) {
  return <section className="panel"><PanelTitle eyebrow="Colleague management" title="Team directory and utilization" action="New colleague" onAction={onNew}/><div className="peopleGrid">{colleagues.map((person) => <article className="personCard" key={person.id}><PersonRow person={person}/><div className="meter"><i style={{ width: `${person.capacity}%` }} /></div><small>{person.billableTarget}h weekly billable target · {person.active ? 'Active' : 'Inactive'}</small></article>)}</div>{colleagues.length === 0 && <EmptyState title="No colleagues found" body="Add your team so project leads and utilization can be managed properly." />}</section>;
}

function CustomerView({ customers, data, onNew }: { customers: Customer[]; data: AppData; onNew: () => void }) {
  return <section className="panel"><PanelTitle eyebrow="Customer management" title="Accounts" action="New customer" onAction={onNew}/><div className="cardGrid">{customers.map((customer) => <article className="accountCard" key={customer.id}><CustomerRow customer={customer} open={data.projects.filter((project) => project.customerId === customer.id).length}/><p>{customer.notes}</p><small>Owner: {customer.owner} · Segment: {customer.segment}</small></article>)}</div>{customers.length === 0 && <EmptyState title="No customers found" body="Create a customer before planning projects and account work." />}</section>;
}

function WorkflowView() {
  const steps = ['Create branch', 'Write spec', 'Implement slice', 'Run tests', 'Open PR', 'Review UX/code', 'Merge to master', 'Deploy via Vercel'];
  return <section className="grid"><article className="panel wide"><PanelTitle eyebrow="Product development" title="AgencyOS delivery workflow"/><div className="workflowSteps">{steps.map((step, index) => <div className="workflowStep" key={step}><span>{index + 1}</span><strong>{step}</strong><p>{workflowCopy(step)}</p></div>)}</div></article><article className="panel"><BookOpenCheck/><h3>Definition of done</h3><ul className="checklist"><li>Requirement/spec updated</li><li>Functional UI path implemented</li><li>Onboarding/help updated</li><li>Lint, test, build passing</li><li>PR has summary + evidence</li></ul></article><article className="panel"><Lightbulb/><h3>Next product slices</h3><p>Authentication, database-backed workspaces, edit/delete flows, time tracking, invoices, retainers, reporting, and GitHub issue templates.</p></article></section>;
}

function EntityModal({ modal, data, onClose, onCustomer, onColleague, onProject }: { modal: Modal; data: AppData; onClose: () => void; onCustomer: (form: FormData) => void; onColleague: (form: FormData) => void; onProject: (form: FormData) => void }) {
  const title = modal === 'project' ? 'Create project' : modal === 'colleague' ? 'Add colleague' : 'Add customer';
  return <div className="modalBackdrop" role="dialog" aria-modal="true"><form className="modal" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); if (modal === 'project') onProject(form); if (modal === 'colleague') onColleague(form); if (modal === 'customer') onCustomer(form); }}><div className="modalHead"><h2>{title}</h2><button type="button" className="iconButton" onClick={onClose}><X size={18}/></button></div>{modal === 'project' && <ProjectFields data={data}/>} {modal === 'colleague' && <ColleagueFields/>} {modal === 'customer' && <CustomerFields/>}<div className="modalActions"><button type="button" className="ghost" onClick={onClose}>Cancel</button><button type="submit">Save</button></div></form></div>;
}

function ProjectFields({ data }: { data: AppData }) {
  return <><label>Project name<input name="name" required placeholder="Discovery sprint" /></label><label>Customer<select name="customerId">{data.customers.map((customer) => <option value={customer.id} key={customer.id}>{customer.name}</option>)}</select></label><label>Lead<select name="leadId">{data.colleagues.map((person) => <option value={person.id} key={person.id}>{person.name}</option>)}</select></label><div className="formGrid"><label>Budget<input name="budget" type="number" min="0" defaultValue="12000" /></label><label>Progress<input name="progress" type="number" min="0" max="100" defaultValue="0" /></label></div><label>Status<select name="status">{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label><div className="formGrid"><label>Start<input name="startDate" type="date" defaultValue={todayPlus(0)} /></label><label>End<input name="endDate" type="date" defaultValue={todayPlus(30)} /></label></div><label>Next action<textarea name="nextAction" placeholder="What should happen next?" /></label></>;
}

function ColleagueFields() {
  return <><label>Name<input name="name" required placeholder="Alex Morgan" /></label><label>Role<input name="role" placeholder="Consultant" /></label><label>Focus<input name="focus" placeholder="Client / capability focus" /></label><div className="formGrid"><label>Capacity %<input name="capacity" type="number" min="0" max="120" defaultValue="70" /></label><label>Billable target h/week<input name="billableTarget" type="number" min="0" defaultValue="30" /></label></div></>;
}

function CustomerFields() {
  return <><label>Customer name<input name="name" required placeholder="Acme GmbH" /></label><label>Segment<input name="segment" placeholder="B2B SaaS" /></label><label>Owner<input name="owner" placeholder="Account owner" /></label><div className="formGrid"><label>Health<select name="health">{healthOptions.map((health) => <option key={health}>{health}</option>)}</select></label><label>Revenue target<input name="revenueTarget" type="number" min="0" defaultValue="25000" /></label></div><label>Notes<textarea name="notes" placeholder="Relationship context, risks, goals..." /></label></>;
}

function TourOverlay({ step, onBack, onNext, onSkip }: { step: number; onBack: () => void; onNext: () => void; onSkip: () => void }) {
  const current = tourSteps[step];
  return <div className="tour"><div className="tourCard"><p className="eyebrow">Training onboarding · Step {step + 1}/{tourSteps.length}</p><h2>{current.title}</h2><p>{current.body}</p><div className="tourActions"><button className="ghost" onClick={onSkip}>Skip</button><button className="ghost" disabled={step === 0} onClick={onBack}>Back</button><button onClick={onNext}>{step === tourSteps.length - 1 ? 'Finish' : 'Next'}</button></div></div></div>;
}

function ProjectRow({ project, data }: { project: Project; data: AppData }) {
  return <div className="project"><div><strong>{project.name}</strong><span>{customerName(data, project.customerId)} · Lead {leadName(data, project.leadId)}</span><small>{project.nextAction}</small></div><div className="meter"><i style={{ width: `${project.progress}%` }} /></div><b>{formatCurrency(project.budget)}</b><em className={statusClass(project.status)}>{project.status}</em><small>{new Date(project.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</small></div>;
}

function PersonRow({ person }: { person: Colleague }) {
  return <div className="person"><span>{initials(person.name)}</span><div><strong>{person.name}</strong><small>{person.role} · {person.focus}</small></div><b>{person.capacity}%</b></div>;
}

function CustomerRow({ customer, open }: { customer: Customer; open: number }) {
  return <div className="customer"><BriefcaseBusiness/><div><strong>{customer.name}</strong><small>{open} open projects · {customer.segment}</small></div><span>{formatCurrency(customer.revenueTarget)}</span><em>{customer.health}</em></div>;
}

function PanelTitle({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action?: string; onAction?: () => void }) {
  return <div className="panelHead"><div><p className="eyebrow">{eyebrow}</p><h3>{title}</h3></div>{action && <button className="linkButton" onClick={onAction}>{action}</button>}</div>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="empty"><strong>{title}</strong><p>{body}</p></div>;
}

function customerName(data: AppData, id: string) {
  return data.customers.find((customer) => customer.id === id)?.name ?? 'Unknown customer';
}

function leadName(data: AppData, id: string) {
  return data.colleagues.find((person) => person.id === id)?.name ?? 'Unassigned';
}

function headlineFor(view: View) {
  return ({ Overview: 'Projects, people, and customers in one calm place.', Projects: 'Plan, track, and rescue consulting delivery.', Colleagues: 'Know who is busy, available, and focused.', Customers: 'Keep account health visible and actionable.', Workflow: 'Ship changes through a professional product workflow.' })[view];
}

function ctaFor(view: View) {
  return view === 'Colleagues' ? 'New colleague' : view === 'Customers' ? 'New customer' : view === 'Workflow' ? 'New project' : 'New project';
}

function defaultModalFor(view: View): Modal {
  return view === 'Colleagues' ? 'colleague' : view === 'Customers' ? 'customer' : 'project';
}

function workflowCopy(step: string) {
  return ({ 'Create branch': 'Start from master with a focused feature branch.', 'Write spec': 'Capture user need, acceptance criteria, and tradeoffs first.', 'Implement slice': 'Build the smallest useful workflow end-to-end.', 'Run tests': 'Use lint, unit tests, and production build as gates.', 'Open PR': 'Explain what changed, why, screenshots, and evidence.', 'Review UX/code': 'Check simplicity, accessibility, correctness, and maintainability.', 'Merge to master': 'Merge only when the branch is reviewable and green.', 'Deploy via Vercel': 'Use preview deployments for review and production for master.' })[step];
}
