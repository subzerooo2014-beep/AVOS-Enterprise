import { Injectable } from '@nestjs/common';
import { ThinkingConstitutionRule } from './cognitive-governance.types';

@Injectable()
export class ThinkingConstitutionService {
  private readonly rules: ThinkingConstitutionRule[] = [
    {
      id: 'tc-foundation-first',
      name: 'Foundation First',
      description: 'Do not introduce higher-order autonomy before foundational governance is complete.',
      mandatory: true,
      active: true,
    },
    {
      id: 'tc-human-final-authority',
      name: 'Human Final Authority',
      description: 'Human authority remains the final approver for strategic and sensitive decisions.',
      mandatory: true,
      active: true,
    },
    {
      id: 'tc-living-vision',
      name: 'Living Vision Alignment',
      description: 'Every project and strategic decision must link to an approved Living Vision.',
      mandatory: true,
      active: true,
    },
    {
      id: 'tc-no-learning-before-governance',
      name: 'Governance Before Learning',
      description: 'Learning and self-modification remain blocked until cognitive governance approval.',
      mandatory: true,
      active: true,
    },
    {
      id: 'tc-no-multi-agent-before-org-os',
      name: 'Organization OS Before Multi-Agent',
      description: 'Multi-agent operation requires Organization OS and AI Council readiness.',
      mandatory: true,
      active: true,
    },
    {
      id: 'tc-retrospective',
      name: 'Mandatory Project Retrospective',
      description: 'Every completed project must publish a retrospective and reusable lessons.',
      mandatory: true,
      active: true,
    },
  ];

  list(): ThinkingConstitutionRule[] {
    return this.rules.map((rule) => ({ ...rule }));
  }

  activeRules(): ThinkingConstitutionRule[] {
    return this.rules.filter((rule) => rule.active);
  }

  validate(): { valid: boolean; failures: string[] } {
    const failures = this.rules
      .filter((rule) => rule.mandatory && !rule.active)
      .map((rule) => rule.id);

    return {
      valid: failures.length === 0,
      failures,
    };
  }
}