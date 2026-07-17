
import { BadRequestException, Injectable } from "@nestjs/common";
import { KnowledgeLifecycleState } from "./knowledge-governance.types";

@Injectable()
export class KnowledgeLifecycleService {
  private readonly states = new Map<string, KnowledgeLifecycleState>();
  private readonly allowed: Record<KnowledgeLifecycleState, KnowledgeLifecycleState[]> = {
    DRAFT: ["REVIEW", "ARCHIVED"],
    REVIEW: ["APPROVED", "DRAFT", "ARCHIVED"],
    APPROVED: ["ACTIVE", "DRAFT", "ARCHIVED"],
    ACTIVE: ["DEPRECATED", "ARCHIVED"],
    DEPRECATED: ["ACTIVE", "ARCHIVED"],
    ARCHIVED: [],
  };

  get(knowledgeId: string): KnowledgeLifecycleState {
    return this.states.get(knowledgeId) ?? "DRAFT";
  }

  transition(knowledgeId: string, target: KnowledgeLifecycleState, _actorId: string): KnowledgeLifecycleState {
    const current = this.get(knowledgeId);
    if (current === target) return current;
    if (!this.allowed[current].includes(target)) throw new BadRequestException(`Invalid knowledge lifecycle transition: ${current} -> ${target}`);
    this.states.set(knowledgeId, target);
    return target;
  }
}