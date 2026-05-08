import { describe, expect, it } from 'vitest';
import { addDays, calculateMetrics, colleagueBillableRatio, colleagueDeliveryLoadPercent, colleagueLoadStatus, colleagueLoggedHours, colleagueOpenTicketEstimate, customerHours, customerReportRollups, customerRevenue, customerTickets, filterTimeEntriesForReport, filterTimeEntriesForTimesheet, formatCurrency, initialData, moveTicketOnBoard, projectBillableHours, projectBudgetRemaining, projectBudgetUsedPercent, projectDeliverySignal, projectEffectiveRate, projectEstimatedHours, projectEstimateUsedPercent, projectHours, projectNonBillableHours, projectRemainingEstimateHours, projectRevenue, reportScopeInsights, roundedTimerHours, ticketDeliverySignal, ticketEstimateUsedPercent, ticketLoggedHours, timeEntriesForWeek, timeEntryDraftForTicket, timeEntryDraftForTimesheetScope, weekStartDate, weeklyCapacityTargetHours, weeklyTimeCaptureFocus, weeklyTimesheetApprovalSnapshot, weeklyTimesheetAudit, weeklyTimesheetByColleague, weeklyTimesheetByCustomer, weeklyTimesheetByProject, weeklyTimesheetCapacity, weeklyTimesheetClientPacket, weeklyTimesheetCoach, weeklyTimesheetDayHealth, weeklyTimesheetReview, weeklyTimesheetReviewQueue, weeklyTimesheetValueSummary, weeklyUnloggedTickets } from './domain';

describe('AgencyOS operations metrics', () => {
  it('calculates dashboard metrics from projects, tickets, and time entries', () => {
    const metrics = calculateMetrics(initialData);

    expect(metrics.activeProjects).toBe(3);
    expect(metrics.openTickets).toBe(4);
    expect(metrics.atRisk).toBe(1);
    expect(metrics.totalHours).toBe(11);
    expect(metrics.billableHours).toBe(9.5);
    expect(metrics.utilization).toBe(86);
    expect(metrics.budget).toBe(87000);
    expect(metrics.revenue).toBe(1100);
  });

  it('rolls time up to project and ticket reporting', () => {
    expect(projectHours(initialData, 'proj-brand')).toBe(5.5);
    expect(projectBillableHours(initialData, 'proj-brand')).toBe(5.5);
    expect(projectRevenue(initialData, 'proj-brand')).toBe(660);
    expect(projectBudgetUsedPercent(initialData, 'proj-brand')).toBe(2);
    expect(ticketLoggedHours(initialData, 'tic-scope')).toBe(5.5);
    expect(ticketEstimateUsedPercent(initialData, 'tic-scope')).toBe(92);
    expect(ticketDeliverySignal(initialData, 'tic-scope')).toBe('Watch scope');
    expect(ticketDeliverySignal(initialData, 'tic-interviews')).toBe('No time yet');
  });

  it('calculates profitability-lite reporting signals', () => {
    expect(projectNonBillableHours(initialData, 'proj-erp')).toBe(1.5);
    expect(projectEffectiveRate(initialData, 'proj-erp')).toBe(80);
    expect(projectBudgetRemaining(initialData, 'proj-erp')).toBe(17560);
  });

  it('compares project logged time against ticket estimates', () => {
    expect(projectEstimatedHours(initialData, 'proj-brand')).toBe(13);
    expect(projectRemainingEstimateHours(initialData, 'proj-brand')).toBe(7.5);
    expect(projectEstimateUsedPercent(initialData, 'proj-brand')).toBe(42);
    expect(projectDeliverySignal(initialData, 'proj-brand')).toBe('On track');

    const overEstimate = {
      ...initialData,
      timeEntries: [
        ...initialData.timeEntries,
        { id: 'time-extra-scope', projectId: 'proj-brand', ticketId: 'tic-brief', colleagueId: 'col-mina', date: '2026-05-06', hours: 8, billable: true, note: 'Extra scope' },
      ],
    };

    expect(projectEstimateUsedPercent(overEstimate, 'proj-brand')).toBe(104);
    expect(projectDeliverySignal(overEstimate, 'proj-brand')).toBe('Over estimate');
  });

  it('keeps internal consulting time in workload totals without inflating revenue', () => {
    const data = {
      ...initialData,
      timeEntries: [
        ...initialData.timeEntries,
        {
          id: 'time-internal-retro',
          projectId: 'proj-brand',
          ticketId: 'tic-brief',
          colleagueId: 'col-mina',
          date: '2026-05-06',
          hours: 2,
          billable: false,
          note: 'Internal delivery retro',
        },
      ],
    };

    expect(projectHours(data, 'proj-brand')).toBe(7.5);
    expect(projectBillableHours(data, 'proj-brand')).toBe(5.5);
    expect(projectRevenue(data, 'proj-brand')).toBe(660);
    expect(customerHours(data, 'cust-northstar')).toBe(7.5);
    expect(customerRevenue(data, 'cust-northstar')).toBe(660);
    expect(calculateMetrics(data).totalHours).toBe(13);
    expect(calculateMetrics(data).billableHours).toBe(9.5);
  });

  it('connects customer and colleague screens to delivery work', () => {
    expect(customerHours(initialData, 'cust-acme')).toBe(5.5);
    expect(customerRevenue(initialData, 'cust-acme')).toBe(440);
    expect(customerTickets(initialData, 'cust-acme').map((ticket) => ticket.id)).toEqual(['tic-scope']);
    expect(colleagueLoggedHours(initialData, 'col-sara')).toBe(2);
    expect(colleagueOpenTicketEstimate(initialData, 'col-sara')).toBe(9);
  });

  it('classifies colleague delivery load and billable ratio for capacity planning', () => {
    expect(colleagueBillableRatio(initialData, 'col-leo')).toBe(0);
    expect(colleagueBillableRatio(initialData, 'col-mina')).toBe(100);
    expect(colleagueDeliveryLoadPercent(initialData, 'col-sara')).toBe(17);
    expect(colleagueLoadStatus(42)).toBe('Underbooked');
    expect(colleagueLoadStatus(72)).toBe('Healthy');
    expect(colleagueLoadStatus(101)).toBe('Overloaded');
  });

  it('moves and reorders tickets on the board without losing ticket data', () => {
    const moved = moveTicketOnBoard(initialData, 'tic-assets', 'In progress', 'tic-brief');

    expect(moved.tickets.map((ticket) => ticket.id).slice(0, 2)).toEqual(['tic-assets', 'tic-brief']);
    expect(moved.tickets.find((ticket) => ticket.id === 'tic-assets')?.status).toBe('In progress');
    expect(moved.tickets.find((ticket) => ticket.id === 'tic-assets')?.assigneeId).toBe('col-sara');
  });

  it('rounds running timers into safe quarter-hour entries', () => {
    expect(roundedTimerHours('2026-05-06T10:00:00.000Z', Date.parse('2026-05-06T10:04:00.000Z'))).toBe(0.25);
    expect(roundedTimerHours('2026-05-06T10:00:00.000Z', Date.parse('2026-05-06T10:37:00.000Z'))).toBe(0.5);
    expect(roundedTimerHours('2026-05-06T10:00:00.000Z', Date.parse('2026-05-06T11:53:00.000Z'))).toBe(2);
  });

  it('groups time entries into weekly colleague timesheets', () => {
    expect(weekStartDate('2026-05-06')).toBe('2026-05-04');
    expect(addDays('2026-05-04', 6)).toBe('2026-05-10');
    expect(timeEntriesForWeek(initialData, '2026-05-06')).toHaveLength(4);

    const rows = weeklyTimesheetByColleague(initialData, '2026-05-06');
    const mina = rows.find((row) => row.colleague.id === 'col-mina');
    const leo = rows.find((row) => row.colleague.id === 'col-leo');

    expect(mina?.dailyHours).toEqual([0, 3.5, 0, 0, 0, 0, 0]);
    expect(mina?.total).toBe(3.5);
    expect(mina?.billable).toBe(3.5);
    expect(leo?.internal).toBe(1.5);
  });


  it('groups weekly timesheet time by project for delivery review', () => {
    const rows = weeklyTimesheetByProject(initialData, '2026-05-06');

    expect(rows.map((row) => row.project.id)).toEqual(['proj-brand', 'proj-erp']);
    expect(rows[0]).toMatchObject({ total: 5.5, billable: 5.5, internal: 0 });
    expect(rows[0].dailyHours).toEqual([0, 5.5, 0, 0, 0, 0, 0]);
    expect(rows[1]).toMatchObject({ total: 5.5, billable: 4, internal: 1.5 });
    expect(weeklyTimesheetByProject(initialData, '2026-05-13')).toEqual([]);
  });

  it('groups weekly timesheet time by customer for client review', () => {
    const rows = weeklyTimesheetByCustomer(initialData, '2026-05-06');

    expect(rows.map((row) => row.customer.id)).toEqual(['cust-acme', 'cust-northstar']);
    expect(rows[0]).toMatchObject({ total: 5.5, billable: 4, internal: 1.5, earnedRevenue: 440, projectCount: 1 });
    expect(rows[0].dailyHours).toEqual([1.5, 4, 0, 0, 0, 0, 0]);
    expect(rows[1]).toMatchObject({ total: 5.5, billable: 5.5, internal: 0, earnedRevenue: 660, projectCount: 1 });
    expect(weeklyTimesheetByCustomer(initialData, '2026-05-13')).toEqual([]);
  });

  it('drops tickets at the end of the target status when no card target is provided', () => {
    const moved = moveTicketOnBoard(initialData, 'tic-interviews', 'In progress');

    expect(moved.tickets.map((ticket) => ticket.id)).toEqual(['tic-brief', 'tic-assets', 'tic-scope', 'tic-interviews']);
    expect(moved.tickets.at(-1)?.status).toBe('In progress');
  });

  it('surfaces unlogged active tickets for the selected timesheet scope', () => {
    expect(weeklyUnloggedTickets(initialData, { weekDate: '2026-05-06' }).map((ticket) => ticket.id)).toEqual(['tic-interviews']);
    expect(weeklyUnloggedTickets(initialData, { weekDate: '2026-05-13', projectId: 'proj-brand' }).map((ticket) => ticket.id)).toEqual(['tic-brief', 'tic-assets']);
    expect(weeklyUnloggedTickets(initialData, { weekDate: '2026-05-13', colleagueId: 'col-sara' }).map((ticket) => ticket.id)).toEqual(['tic-assets', 'tic-interviews']);
  });

  it('summarizes the next weekly time capture focus', () => {
    const focus = weeklyTimeCaptureFocus(initialData, { weekDate: '2026-05-13', projectId: 'proj-brand' });

    expect(focus).toMatchObject({
      totalUnloggedTickets: 2,
      priorityCount: 1,
      dueThisWeekCount: 2,
      missingEstimateHours: 7.5,
      weekStart: '2026-05-11',
      weekEnd: '2026-05-17',
    });
    expect(focus.topTicket?.id).toBe('tic-brief');
  });

  it('summarizes weekly timesheet readiness before review', () => {
    const review = weeklyTimesheetReview(initialData, { weekDate: '2026-05-06' });

    expect(review.status).toBe('Needs time capture');
    expect(review.totalHours).toBe(11);
    expect(review.billableHours).toBe(9.5);
    expect(review.internalHours).toBe(1.5);
    expect(review.billableRatio).toBe(86);
    expect(review.contributorCount).toBe(4);
    expect(review.coveredAssigneeCount).toBe(3);
    expect(review.expectedAssigneeCount).toBe(3);
    expect(review.unloggedTicketCount).toBe(1);
    expect(review.missingAssignees.map((person) => person.id)).toEqual([]);

    expect(weeklyTimesheetReview(initialData, { weekDate: '2026-05-13', projectId: 'proj-brand' })).toMatchObject({
      status: 'No time logged',
      totalHours: 0,
      unloggedTicketCount: 2,
    });
  });




  it('builds a client-ready weekly packet from clean billable entries', () => {
    expect(weeklyTimesheetClientPacket(initialData, { weekDate: '2026-05-06' })).toMatchObject({
      status: 'Draft needs cleanup',
      totalHours: 9.5,
      earnedRevenue: 1100,
      customerCount: 2,
      includedEntryCount: 3,
      excludedEntryCount: 1,
      headline: '9.5h client-ready across 2 customers',
    });

    const packet = weeklyTimesheetClientPacket(initialData, { weekDate: '2026-05-06', projectId: 'proj-brand' });
    expect(packet.status).toBe('Ready to send');
    expect(packet.customers.map((customer) => customer.customer.id)).toEqual(['cust-northstar']);
    expect(packet.customers[0]).toMatchObject({ hours: 5.5, revenue: 660, projectCount: 1, entryCount: 2 });
    expect(packet.customers[0].highlights).toEqual(['Launch briefing draft', 'Asset checklist structure']);

    expect(weeklyTimesheetClientPacket(initialData, { weekDate: '2026-05-13' })).toMatchObject({
      status: 'No client time',
      totalHours: 0,
      customerCount: 0,
      headline: 'No billable, ticket-linked notes are ready for client sharing yet.',
    });
  });

  it('builds a weekly review queue for entries that need cleanup', () => {
    const data = {
      ...initialData,
      timeEntries: [
        ...initialData.timeEntries,
        { id: 'time-missing-ticket', projectId: 'proj-brand', ticketId: '', colleagueId: 'col-mina', date: '2026-05-06', hours: 1, billable: true, note: 'Client workshop' },
        { id: 'time-missing-note', projectId: 'proj-brand', ticketId: 'tic-brief', colleagueId: 'col-mina', date: '2026-05-06', hours: 0.5, billable: true, note: '   ' },
      ],
    };

    const queue = weeklyTimesheetReviewQueue(data, { weekDate: '2026-05-06' });

    expect(queue.map((item) => [item.entry.id, item.issue])).toEqual([
      ['time-missing-ticket', 'Missing ticket'],
      ['time-missing-note', 'Missing note'],
      ['time-4', 'Confirm internal'],
    ]);
    expect(queue[0]).toMatchObject({
      project: { id: 'proj-brand' },
      colleague: { id: 'col-mina' },
      action: 'Attach a delivery ticket before client reporting.',
    });
    expect(weeklyTimesheetReviewQueue(initialData, { weekDate: '2026-05-13' })).toEqual([]);
  });

  it('summarizes weekly timesheet approval readiness for client review', () => {
    expect(weeklyTimesheetApprovalSnapshot(initialData, { weekDate: '2026-05-06' })).toMatchObject({
      status: 'Needs cleanup',
      nextAction: 'Capture time for active tickets without weekly entries.',
      cleanupItemCount: 1,
      clientReadyHours: 9.5,
      billableHours: 9.5,
      internalHours: 1.5,
      coverageLabel: '3/3 assignees covered',
    });

    const ready = {
      ...initialData,
      tickets: initialData.tickets.map((ticket) => ticket.id === 'tic-interviews' ? { ...ticket, status: 'Done' as const } : ticket),
      timeEntries: initialData.timeEntries.filter((entry) => entry.billable),
    };

    expect(weeklyTimesheetApprovalSnapshot(ready, { weekDate: '2026-05-06' })).toMatchObject({
      status: 'Ready for client review',
      nextAction: 'Review and export this week with confidence.',
      cleanupItemCount: 0,
      clientReadyHours: 9.5,
    });

    expect(weeklyTimesheetApprovalSnapshot(initialData, { weekDate: '2026-05-13' })).toMatchObject({
      status: 'Needs time',
      nextAction: 'Log scoped time before reviewing this week.',
      clientReadyHours: 0,
    });
  });

  it('coaches the next weekly timesheet action from cleanup, capture, client, and capacity signals', () => {
    const coach = weeklyTimesheetCoach(initialData, { weekDate: '2026-05-06' });

    expect(coach).toMatchObject({
      headline: 'Clean up 1 timesheet item',
      primaryAction: 'Start with the top missing ticket.',
      attentionCount: 3,
      ready: false,
    });
    expect(coach.checklist.map((item) => [item.label, item.status, item.tone])).toEqual([
      ['Capture coverage', 'Gaps remain', 'amber'],
      ['Export hygiene', 'Cleanup needed', 'amber'],
      ['Client packet', 'Draft needs cleanup', 'amber'],
      ['Capacity check', 'No spikes', 'green'],
    ]);

    const ready = {
      ...initialData,
      tickets: initialData.tickets.map((ticket) => ticket.id === 'tic-interviews' ? { ...ticket, status: 'Done' as const } : ticket),
      timeEntries: initialData.timeEntries.filter((entry) => entry.billable),
    };

    expect(weeklyTimesheetCoach(ready, { weekDate: '2026-05-06' })).toMatchObject({
      headline: 'Ready to package for client review',
      primaryAction: 'Approve and export this weekly packet.',
      attentionCount: 0,
      ready: true,
    });
  });

  it('summarizes weekly timesheet client value for review', () => {
    expect(weeklyTimesheetValueSummary(initialData, { weekDate: '2026-05-06' })).toMatchObject({
      totalHours: 11,
      billableHours: 9.5,
      internalHours: 1.5,
      billableRatio: 86,
      earnedRevenue: 1100,
      nonBillableValue: 165,
      effectiveRate: 100,
      billableRate: 116,
    });

    expect(weeklyTimesheetValueSummary(initialData, { weekDate: '2026-05-06', projectId: 'proj-brand' })).toMatchObject({
      earnedRevenue: 660,
      nonBillableValue: 0,
      billableRatio: 100,
    });
    expect(weeklyTimesheetValueSummary(initialData, { weekDate: '2026-05-13' })).toMatchObject({
      earnedRevenue: 0,
      effectiveRate: 0,
      billableRate: 0,
    });
  });

  it('summarizes daily timesheet health against scoped capacity', () => {
    const days = weeklyTimesheetDayHealth(initialData, { weekDate: '2026-05-06' });

    expect(days.map((day) => [day.date, day.totalHours, day.status])).toEqual([
      ['2026-05-04', 1.5, 'Light capture'],
      ['2026-05-05', 9.5, 'Light capture'],
      ['2026-05-06', 0, 'No time'],
      ['2026-05-07', 0, 'No time'],
      ['2026-05-08', 0, 'No time'],
      ['2026-05-09', 0, 'No time'],
      ['2026-05-10', 0, 'No time'],
    ]);
    expect(days[0]).toMatchObject({ billableHours: 0, internalHours: 1.5, entryCount: 1, targetHours: 19.4, usagePercent: 8 });
    expect(days[5]).toMatchObject({ targetHours: 0, usagePercent: 0, status: 'No time' });

    const cleanup = weeklyTimesheetDayHealth({
      ...initialData,
      timeEntries: [
        ...initialData.timeEntries,
        { id: 'time-needs-cleanup', projectId: 'proj-brand', ticketId: '', colleagueId: 'col-mina', date: '2026-05-06', hours: 1, billable: true, note: '' },
      ],
    }, { weekDate: '2026-05-06' });

    expect(cleanup[2]).toMatchObject({ status: 'Needs cleanup', missingTicketCount: 1, missingNoteCount: 1 });
  });

  it('audits weekly timesheets for export cleanup signals', () => {
    const audit = weeklyTimesheetAudit(initialData, { weekDate: '2026-05-06' });

    expect(audit).toMatchObject({
      entryCount: 4,
      projectCount: 2,
      contributorCount: 4,
      totalHours: 11,
      billableHours: 9.5,
      internalHours: 1.5,
      missingTicketCount: 0,
      missingNoteCount: 0,
      internalEntryCount: 1,
      readyForExport: true,
    });

    expect(weeklyTimesheetAudit({
      ...initialData,
      timeEntries: [
        ...initialData.timeEntries,
        { id: 'time-needs-cleanup', projectId: 'proj-brand', ticketId: '', colleagueId: 'col-mina', date: '2026-05-06', hours: 1, billable: true, note: '' },
      ],
    }, { weekDate: '2026-05-06' })).toMatchObject({
      missingTicketCount: 1,
      missingNoteCount: 1,
      readyForExport: false,
    });
  });

  it('turns weekly time into capacity signals for timesheet review', () => {
    expect(weeklyCapacityTargetHours(initialData.colleagues[0])).toBe(32.8);

    const signals = weeklyTimesheetCapacity(initialData, { weekDate: '2026-05-06' });

    expect(signals.map((signal) => signal.person.id)).toEqual(['col-mina', 'col-jonas', 'col-sara', 'col-leo']);
    expect(signals[0]).toMatchObject({ loggedHours: 3.5, billableHours: 3.5, internalHours: 0, targetHours: 32.8, usagePercent: 11, status: 'Light' });
    expect(signals.find((signal) => signal.person.id === 'col-leo')).toMatchObject({ loggedHours: 1.5, billableHours: 0, internalHours: 1.5 });

    const overloaded = {
      ...initialData,
      timeEntries: [
        ...initialData.timeEntries,
        { id: 'time-capacity-spike', projectId: 'proj-brand', ticketId: 'tic-brief', colleagueId: 'col-mina', date: '2026-05-06', hours: 36, billable: true, note: 'Launch crunch' },
      ],
    };

    expect(weeklyTimesheetCapacity(overloaded, { weekDate: '2026-05-06' })[0]).toMatchObject({ person: initialData.colleagues[0], usagePercent: 120, status: 'Over capacity' });
    expect(weeklyTimesheetCapacity(initialData, { weekDate: '2026-05-06', colleagueId: 'col-sara' }).map((signal) => signal.person.id)).toEqual(['col-sara']);
  });


  it('creates a safe manual time draft from an unlogged ticket', () => {
    expect(timeEntryDraftForTicket(initialData, 'tic-interviews', '2026-05-06')).toEqual({
      projectId: 'proj-market',
      ticketId: 'tic-interviews',
      colleagueId: 'col-sara',
      date: '2026-05-06',
      hours: 0.25,
      billable: true,
      note: 'Quick log: Draft interview guide',
    });

    expect(timeEntryDraftForTicket(initialData, 'missing-ticket', '2026-05-06')).toBeNull();
  });

  it('prefills manual time entries from the active timesheet scope', () => {
    expect(timeEntryDraftForTimesheetScope(initialData, { weekDate: '2026-05-07', projectId: 'proj-erp', colleagueId: 'col-leo' })).toEqual({
      projectId: 'proj-erp',
      ticketId: '',
      colleagueId: 'col-leo',
      date: '2026-05-07',
      hours: 1,
      billable: true,
      note: 'Manual log for week of 2026-05-04',
    });

    expect(timeEntryDraftForTimesheetScope(initialData, { weekDate: '2026-05-07' })).toMatchObject({
      projectId: 'proj-brand',
      colleagueId: 'col-mina',
      date: '2026-05-07',
    });
  });

  it('filters weekly timesheet time by week, project, and person', () => {
    expect(filterTimeEntriesForTimesheet(initialData, { weekDate: '2026-05-06' }).map((entry) => entry.id)).toEqual(['time-1', 'time-2', 'time-3', 'time-4']);
    expect(filterTimeEntriesForTimesheet(initialData, { weekDate: '2026-05-06', projectId: 'proj-brand' }).map((entry) => entry.id)).toEqual(['time-1', 'time-2']);
    expect(filterTimeEntriesForTimesheet(initialData, { weekDate: '2026-05-06', colleagueId: 'col-leo' }).map((entry) => entry.id)).toEqual(['time-4']);
    expect(filterTimeEntriesForTimesheet(initialData, { weekDate: '2026-05-13' })).toHaveLength(0);
  });

  it('filters report time by period, customer, project, and person', () => {
    expect(filterTimeEntriesForReport(initialData, { period: '7', customerId: 'cust-acme' }).map((entry) => entry.id)).toEqual(['time-3', 'time-4']);
    expect(filterTimeEntriesForReport(initialData, { period: 'all', projectId: 'proj-brand', colleagueId: 'col-sara' }).map((entry) => entry.id)).toEqual(['time-2']);
    expect(filterTimeEntriesForReport(initialData, { period: '7', customerId: 'cust-northstar', projectId: 'proj-erp' })).toHaveLength(0);
  });

  it('summarizes report scope by customer value', () => {
    const rollups = customerReportRollups(initialData, filterTimeEntriesForReport(initialData, { period: 'all' }));

    expect(rollups.map((rollup) => rollup.customer.id)).toEqual(['cust-northstar', 'cust-acme']);
    expect(rollups[0]).toMatchObject({ hours: 5.5, billableHours: 5.5, internalHours: 0, projectCount: 1, revenue: 660 });
    expect(rollups[1]).toMatchObject({ hours: 5.5, billableHours: 4, internalHours: 1.5, projectCount: 1, revenue: 440 });
  });

  it('coaches report scope insights from billable mix, client concentration, internal drag, and budget', () => {
    const insights = reportScopeInsights(initialData, filterTimeEntriesForReport(initialData, { period: 'all' }));

    expect(insights).toMatchObject({
      headline: 'Report scope looks healthy',
      primaryAction: 'Export this scope or narrow the filters for a client review.',
      attentionCount: 0,
      totalHours: 11,
      billableHours: 9.5,
      internalHours: 1.5,
      billableRatio: 86,
      revenue: 1100,
    });
    expect(insights.insights.map((item) => [item.label, item.status, item.tone])).toEqual([
      ['Billable mix', '86% billable', 'green'],
      ['Client concentration', 'Northstar Labs leads', 'green'],
      ['Internal drag', '14% internal', 'green'],
      ['Budget watch', 'Brand refresh rollout at 2%', 'green'],
    ]);

    const internalHeavy = {
      ...initialData,
      timeEntries: [
        ...initialData.timeEntries,
        { id: 'time-internal-strategy', projectId: 'proj-brand', ticketId: 'tic-brief', colleagueId: 'col-mina', date: '2026-05-06', hours: 8, billable: false, note: 'Internal strategy review' },
      ],
    };
    const warnings = reportScopeInsights(internalHeavy, filterTimeEntriesForReport(internalHeavy, { period: 'all', customerId: 'cust-northstar' }));

    expect(warnings.headline).toBe('Review 3 report signals');
    expect(warnings.attentionCount).toBe(3);
    expect(warnings.insights.map((item) => item.tone)).toEqual(['amber', 'amber', 'amber', 'green']);
    expect(reportScopeInsights(initialData, [])).toMatchObject({
      headline: 'No report signal in this scope yet',
      attentionCount: 0,
      primaryAction: 'Log time or widen the filters before reviewing revenue.',
    });
  });

  it('formats agency budgets as EUR', () => {
    expect(formatCurrency(42000)).toContain('42.000');
    expect(formatCurrency(42000)).toContain('€');
  });
});
