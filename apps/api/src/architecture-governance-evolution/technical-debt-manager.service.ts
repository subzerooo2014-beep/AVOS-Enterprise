import { Injectable } from '@nestjs/common';
import { TechnicalDebtItem } from './architecture-governance.types';

@Injectable()
export class AutonomousTechnicalDebtManagerService {
  prioritize(items: TechnicalDebtItem[]): TechnicalDebtItem[] {
    const severityWeight = { low: 1, medium: 2, high: 4, critical: 8 };

    return [...items].sort((left, right) => {
      const leftScore =
        left.principal * left.interestRate * severityWeight[left.severity];
      const rightScore =
        right.principal * right.interestRate * severityWeight[right.severity];
      return rightScore - leftScore;
    });
  }

  selectAutonomousActions(items: TechnicalDebtItem[]): TechnicalDebtItem[] {
    return this.prioritize(items).filter(
      (item) => item.autonomousActionAllowed && item.severity !== 'critical',
    );
  }
}