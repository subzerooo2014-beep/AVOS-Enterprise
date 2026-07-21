import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { OmegaDecision } from './omega-foundation.types';

@Injectable()
export class HumanFinalAuthorityService {
  private readonly decisions: OmegaDecision[] = [];

  requestApproval(type: string, summary: string): OmegaDecision {
    const decision: OmegaDecision = {
      id: randomUUID(),
      type,
      summary,
      requiresHumanApproval: true,
      approved: false,
      createdAt: new Date().toISOString(),
    };

    this.decisions.push(decision);
    return structuredClone(decision);
  }

  approve(id: string, approvedBy: string): OmegaDecision {
    if (!approvedBy.startsWith('human:')) {
      throw new BadRequestException('approvedBy must use the human:<identity> format.');
    }

    const decision = this.decisions.find((item) => item.id === id);
    if (!decision) {
      throw new BadRequestException(`Decision ${id} was not found.`);
    }

    decision.approved = true;
    decision.approvedBy = approvedBy;
    return structuredClone(decision);
  }

  list(): OmegaDecision[] {
    return structuredClone(this.decisions);
  }
}