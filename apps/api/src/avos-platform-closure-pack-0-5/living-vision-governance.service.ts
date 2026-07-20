import { Injectable } from '@nestjs/common';
import { LivingVisionGovernanceLink } from './cognitive-governance.types';

@Injectable()
export class LivingVisionGovernanceService {
  private readonly links = new Map<string, LivingVisionGovernanceLink>();

  linkProject(input: {
    projectId: string;
    livingVisionId: string;
    linkedBy: string;
  }): LivingVisionGovernanceLink {
    const link: LivingVisionGovernanceLink = {
      projectId: input.projectId,
      livingVisionId: input.livingVisionId,
      linkedBy: input.linkedBy,
      linkedAt: new Date().toISOString(),
      active: true,
    };

    this.links.set(input.projectId, link);
    return { ...link };
  }

  getProjectLink(projectId: string): LivingVisionGovernanceLink | null {
    const link = this.links.get(projectId);
    return link ? { ...link } : null;
  }

  list(): LivingVisionGovernanceLink[] {
    return [...this.links.values()].map((link) => ({ ...link }));
  }

  isLinked(projectId?: string, livingVisionId?: string): boolean {
    if (!projectId || !livingVisionId) {
      return false;
    }

    const link = this.links.get(projectId);

    return Boolean(
      link &&
        link.active &&
        link.livingVisionId === livingVisionId,
    );
  }
}