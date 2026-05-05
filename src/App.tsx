import { BriefcaseBusiness, CalendarDays, CheckCircle2, CircleDollarSign, Clock3, FolderKanban, Handshake, LayoutDashboard, Plus, Search, Sparkles, UsersRound } from 'lucide-react';

type Status = 'On track' | 'At risk' | 'Planning';

type Project = {
  name: string;
  customer: string;
  lead: string;
  budget: string;
  progress: number;
  status: Status;
  deadline: string;
};

const projects: Project[] = [
  { name: 'Brand refresh rollout', customer: 'Northstar Labs', lead: 'Mina', budget: '€42k', progress: 72, status: 'On track', deadline: '18 Jun' },
  { name: 'ERP discovery sprint', customer: 'Acme Consulting', lead: 'Jonas', budget: '€18k', progress: 39, status: 'At risk', deadline: '31 May' },
  { name: 'Market entry playbook', customer: 'Helio Foods', lead: 'Sara', budget: '€27k', progress: 12, status: 'Planning', deadline: '09 Jul' },
];

const colleagues = [
  { name: 'Mina Keller', role: 'Strategy Lead', load: '82%', focus: 'Northstar Labs' },
  { name: 'Jonas Meyer', role: 'Consultant', load: '96%', focus: 'Acme Consulting' },
  { name: 'Sara Demir', role: 'Project Manager', load: '64%', focus: 'Helio Foods' },
  { name: 'Leo Hart', role: 'Finance Ops', load: '48%', focus: 'Retainers' },
];

const customers = [
  { name: 'Northstar Labs', health: 'Excellent', revenue: '€86k', open: 3 },
  { name: 'Acme Consulting', health: 'Needs care', revenue: '€34k', open: 2 },
  { name: 'Helio Foods', health: 'New', revenue: '€27k', open: 1 },
];

const stats = [
  { label: 'Active projects', value: '18', delta: '+4 this quarter', icon: FolderKanban },
  { label: 'Billable utilization', value: '76%', delta: '8% capacity free', icon: Clock3 },
  { label: 'Pipeline value', value: '€214k', delta: 'Next 90 days', icon: CircleDollarSign },
  { label: 'Customers', value: '42', delta: '9 strategic accounts', icon: Handshake },
];

function statusClass(status: Status) {
  return status === 'On track' ? 'green' : status === 'At risk' ? 'amber' : 'blue';
}

export function App() {
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
            ['Planning', CalendarDays],
          ].map(([label, Icon], index) => <a className={index === 0 ? 'active' : ''} href="#" key={label as string}><Icon size={18} />{label as string}</a>)}
        </nav>
        <div className="opensource"><Sparkles size={18}/><strong>Open source first</strong><p>MIT-ready foundation for agencies that want ownership, clarity, and calm workflows.</p></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Consulting agency command center</p>
            <h1>Projects, people, and customers in one calm place.</h1>
          </div>
          <div className="actions"><label className="search"><Search size={17}/><input placeholder="Search projects, customers..." /></label><button><Plus size={18}/>New project</button></div>
        </header>

        <section className="hero">
          <div><p className="eyebrow">Inspired by focused tools like MOCO</p><h2>Less admin. More billable clarity.</h2><p>Track consulting work from customer relationship to staffing, project health, budget, and deadlines without enterprise clutter.</p></div>
          <div className="heroCard"><CheckCircle2/><strong>Today’s focus</strong><span>Review 2 risks, confirm 4 allocations, send 3 customer updates.</span></div>
        </section>

        <section className="stats">
          {stats.map(({ label, value, delta, icon: Icon }) => <article className="stat" key={label}><Icon/><span>{label}</span><strong>{value}</strong><small>{delta}</small></article>)}
        </section>

        <section className="grid">
          <article className="panel wide">
            <div className="panelHead"><div><p className="eyebrow">Project management</p><h3>Active work</h3></div><a href="#">View all</a></div>
            <div className="projectList">
              {projects.map((project) => <div className="project" key={project.name}><div><strong>{project.name}</strong><span>{project.customer} · Lead {project.lead}</span></div><div className="meter"><i style={{ width: `${project.progress}%` }} /></div><b>{project.budget}</b><em className={statusClass(project.status)}>{project.status}</em><small>{project.deadline}</small></div>)}
            </div>
          </article>

          <article className="panel">
            <div className="panelHead"><div><p className="eyebrow">Colleague management</p><h3>Team capacity</h3></div></div>
            {colleagues.map((person) => <div className="person" key={person.name}><span>{person.name.split(' ').map((part) => part[0]).join('')}</span><div><strong>{person.name}</strong><small>{person.role} · {person.focus}</small></div><b>{person.load}</b></div>)}
          </article>

          <article className="panel">
            <div className="panelHead"><div><p className="eyebrow">Customer management</p><h3>Accounts</h3></div></div>
            {customers.map((customer) => <div className="customer" key={customer.name}><BriefcaseBusiness/><div><strong>{customer.name}</strong><small>{customer.open} open projects</small></div><span>{customer.revenue}</span><em>{customer.health}</em></div>)}
          </article>
        </section>
      </section>
    </main>
  );
}
