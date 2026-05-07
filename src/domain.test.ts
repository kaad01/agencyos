import { describe, expect, it } from 'vitest';
import { addDays, calculateMetrics, colleagueBillableRatio, colleagueDeliveryLoadPercent, colleagueLoadStatus, colleagueLoggedHours, colleagueOpenTicketEstimate, customerHours, customerReportRollups, customerRevenue, customerTickets, filterTimeEntriesForReport, filterTimeEntriesForTimesheet, formatCurrency, initialData, moveTicketOnBoard, projectBillableHours, projectBudgetRemaining, projectBudgetUsedPercent, projectDeliverySignal, projectEffectiveRate, projectEstimatedHours, projectEstimateUsedPercent, projectHours, projectNonBillableHours, projectRemainingEstimateHours, projectRevenue, roundedTimerHours, ticketDeliverySignal, ticketEstimateUsedPercent, ticketLoggedHours, timeEntriesForWeek, weekStartDate, weeklyTimesheetByColleague, weeklyUnloggedTickets } from './domain';

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

  it('formats agency budgets as EUR', () => {
    expect(formatCurrency(42000)).toContain('42.000');
    expect(formatCurrency(42000)).toContain('€');
  });
});
