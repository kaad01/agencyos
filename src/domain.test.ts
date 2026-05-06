import { describe, expect, it } from 'vitest';
import { calculateMetrics, colleagueBillableRatio, colleagueDeliveryLoadPercent, colleagueLoadStatus, colleagueLoggedHours, colleagueOpenTicketEstimate, customerHours, customerRevenue, customerTickets, formatCurrency, initialData, projectBillableHours, projectBudgetUsedPercent, projectHours, projectRevenue, ticketLoggedHours } from './domain';

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

  it('formats agency budgets as EUR', () => {
    expect(formatCurrency(42000)).toContain('42.000');
    expect(formatCurrency(42000)).toContain('€');
  });
});
