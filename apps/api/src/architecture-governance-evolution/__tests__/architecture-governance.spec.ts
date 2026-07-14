import { Test } from '@nestjs/testing';
import { ArchitectureGovernanceModule } from '../architecture-governance.module';
import { SelfDesigningArchitectureService } from '../self-designing-architecture.service';
import { ArchitectureIntelligenceDashboardService } from '../architecture-intelligence-dashboard.service';
import { AutonomousTechnicalDebtManagerService } from '../technical-debt-manager.service';

describe('Ultra Bundle C architecture governance evolution', () => {
  it('creates, governs, and registers an architecture evolution proposal', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ArchitectureGovernanceModule],
    }).compile();

    const service = moduleRef.get(SelfDesigningArchitectureService);
    const result = service.design(
      'improve runtime resilience',
      [
        {
          id: 'signal-1',
          source: 'runtime-observability',
          category: 'resilience',
          value: 78,
          confidence: 0.9,
          observedAt: new Date().toISOString(),
        },
        {
          id: 'signal-2',
          source: 'governance-audit',
          category: 'governance',
          value: 82,
          confidence: 0.8,
          observedAt: new Date().toISOString(),
        },
      ],
      ['preserve backwards compatibility'],
    );

    expect(result.genome.version).toBe('1.0.0');
    expect(result.proposal.targetCapabilities.length).toBeGreaterThan(0);
    expect(result.principleScore).toBe(100);
    expect(result.evolution.sequence).toBe(1);
  });

  it('prioritizes technical debt using severity, principal, and interest', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ArchitectureGovernanceModule],
    }).compile();
    const service = moduleRef.get(AutonomousTechnicalDebtManagerService);

    const prioritized = service.prioritize([
      {
        id: 'low',
        area: 'docs',
        severity: 'low',
        principal: 10,
        interestRate: 1,
        recommendedAction: 'update docs',
        autonomousActionAllowed: true,
      },
      {
        id: 'high',
        area: 'runtime',
        severity: 'high',
        principal: 20,
        interestRate: 3,
        recommendedAction: 'refactor runtime',
        autonomousActionAllowed: true,
      },
    ]);

    expect(prioritized[0].id).toBe('high');
  });

  it('exposes all eleven dashboard capabilities as operational', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ArchitectureGovernanceModule],
    }).compile();
    const dashboard = moduleRef.get(ArchitectureIntelligenceDashboardService);
    const snapshot = dashboard.snapshot();

    expect(Object.keys(snapshot.capabilities)).toHaveLength(11);
    expect(snapshot.architectureFitness).toBeGreaterThanOrEqual(0);
    expect(snapshot.technicalDebtScore).toBeLessThanOrEqual(100);
  });
});