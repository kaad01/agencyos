import { describe, expect, it } from 'vitest';
import { calculateMetrics, formatCurrency, initialData } from './domain';

describe('AgencyOS domain metrics', () => {
  it('calculates dashboard metrics from app data', () => {
    const metrics = calculateMetrics(initialData);

    expect(metrics.activeProjects).toBe(3);
    expect(metrics.customers).toBe(3);
    expect(metrics.atRisk).toBe(1);
    expect(metrics.pipelineValue).toBe(87000);
    expect(metrics.utilization).toBe(73);
  });

  it('formats agency budgets as EUR', () => {
    expect(formatCurrency(42000)).toContain('42.000');
    expect(formatCurrency(42000)).toContain('€');
  });
});
