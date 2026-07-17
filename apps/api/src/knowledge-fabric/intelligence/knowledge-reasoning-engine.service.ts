import { Injectable } from "@nestjs/common";
import { KnowledgeSemanticMatch } from "./knowledge-intelligence.types";

@Injectable()
export class KnowledgeReasoningEngineService {
  reason(query: string, matches: KnowledgeSemanticMatch[]) {
    const evidence = matches.slice(0, 5).map((match) => ({ knowledgeId: match.item.knowledgeId, proposition: match.item.name, confidence: match.finalScore }));
    const confidence = evidence.length ? Number((evidence.reduce((sum, item) => sum + item.confidence, 0) / evidence.length).toFixed(4)) : 0;
    return { query, evidence, conclusion: evidence.length ? `Reasoning completed from ${evidence.length} knowledge item(s).` : "Insufficient evidence for a conclusion.", confidence };
  }
}