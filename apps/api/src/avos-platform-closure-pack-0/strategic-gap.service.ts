import { Injectable } from '@nestjs/common';
import {
  ArchitectureInventory,
  GapFinding,
} from './platform-closure-pack-0.types';

@Injectable()
export class StrategicGapService {
  analyze(inventory: ArchitectureInventory): GapFinding[] {
    const gaps: GapFinding[] = [];
    const searchable = inventory.components
      .map((component) => `${component.name} ${component.relativePath}`.toLowerCase())
      .join('\n');

    const requiredSignals = [
      {
        capability: 'Enterprise Cognitive Governance Layer',
        signals: ['cognitive-governance', 'ai-council', 'thinking-constitution'],
        recommendation:
          'Complete Pack 0.5 before activating autonomous learning capabilities.',
      },
      {
        capability: 'Living Vision Integration',
        signals: ['living-vision', 'living-blueprint'],
        recommendation:
          'Require every project registry entry to reference a Living Vision identifier.',
      },
      {
        capability: 'Organization OS',
        signals: ['organization-os', 'digital-organization'],
        recommendation:
          'Complete Organization OS and AI Council before enabling multi-agent execution.',
      },
      {
        capability: 'Human Approval Gate',
        signals: ['human-approval', 'human-final-authority'],
        recommendation:
          'Ensure all strategic and sensitive technical actions are approval-gated.',
      },
      {
        capability: 'Project Retrospective',
        signals: ['project-retrospective', 'retrospective'],
        recommendation:
          'Add mandatory post-project retrospective evidence and shared-learning publication.',
      },
    ];

    for (const requirement of requiredSignals) {
      const found = requirement.signals.some((signal) => searchable.includes(signal));
      gaps.push({
        id: `gap:${requirement.capability.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        severity: found ? 'informational' : 'recommended',
        capability: requirement.capability,
        evidence: found
          ? 'At least one matching architecture signal exists and requires consolidation review.'
          : 'No matching architecture signal was found in the current source inventory.',
        recommendation: requirement.recommendation,
        requiresHumanApproval: true,
      });
    }

    return gaps;
  }
}