import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'demo-agency' },
    update: {},
    create: { name: 'Demo Agency', slug: 'demo-agency' },
  });

  const users = await Promise.all([
    upsertUser('mina@agencyos.dev', 'Mina Keller'),
    upsertUser('jonas@agencyos.dev', 'Jonas Meyer'),
    upsertUser('sara@agencyos.dev', 'Sara Demir'),
    upsertUser('leo@agencyos.dev', 'Leo Hart'),
  ]);

  await Promise.all(users.map((user, index) => prisma.membership.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: index === 0 ? 'OWNER' : index === 1 ? 'MANAGER' : 'MEMBER',
      hourlyRate: [130, 105, 115, 90][index],
      capacityHoursPerWeek: [32, 36, 28, 20][index],
    },
  })));

  const northstar = await prisma.customer.create({ data: { workspaceId: workspace.id, name: 'Northstar Labs', segment: 'B2B SaaS', ownerName: 'Mina Keller', health: 'EXCELLENT', revenueTarget: 86000 } });
  const acme = await prisma.customer.create({ data: { workspaceId: workspace.id, name: 'Acme Consulting', segment: 'Professional services', ownerName: 'Jonas Meyer', health: 'NEEDS_CARE', revenueTarget: 34000 } });

  const brand = await prisma.project.create({ data: { workspaceId: workspace.id, customerId: northstar.id, leadId: users[0].id, name: 'Brand refresh rollout', status: 'ACTIVE', budget: 42000, hourlyRate: 120, summary: 'Roll out the new positioning, visual identity, and launch assets.' } });
  const erp = await prisma.project.create({ data: { workspaceId: workspace.id, customerId: acme.id, leadId: users[1].id, name: 'ERP discovery sprint', status: 'AT_RISK', budget: 18000, hourlyRate: 110, summary: 'Map processes, risks, and software selection criteria.' } });

  const ticket = await prisma.ticket.create({ data: { workspaceId: workspace.id, projectId: brand.id, title: 'Finalize launch briefing', description: 'Confirm launch scope, audience, and decision makers.', assigneeId: users[0].id, reporterId: users[2].id, status: 'IN_PROGRESS', priority: 'HIGH', estimateMinutes: 480 } });
  await prisma.ticket.create({ data: { workspaceId: workspace.id, projectId: erp.id, title: 'Resolve scope conflict', assigneeId: users[1].id, status: 'IN_PROGRESS', priority: 'URGENT', estimateMinutes: 360 } });

  await prisma.timeEntry.create({ data: { workspaceId: workspace.id, projectId: brand.id, ticketId: ticket.id, userId: users[0].id, date: new Date(), durationMinutes: 210, billable: true, hourlyRateSnapshot: 120, description: 'Launch briefing draft' } });

  console.log(`Seeded workspace ${workspace.slug}`);
}

function upsertUser(email, name) {
  return prisma.user.upsert({ where: { email }, update: { name }, create: { email, name } });
}

main().finally(async () => prisma.$disconnect());
