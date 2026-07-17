import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeRetirementService {
  retire(input: { knowledgeId: string; reason: string; replacements?: string[]; approved: boolean; actorId: string }) {
    if (!input.approved) throw new BadRequestException("Knowledge retirement requires approval");
    return { knowledgeId: input.knowledgeId, state: "RETIRED", reason: input.reason, replacements: input.replacements ?? [], retiredBy: input.actorId, retiredAt: new Date().toISOString() };
  }
}