import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { KnowledgeConflict, KnowledgeGap, KnowledgeInsight, KnowledgeSemanticMatch } from "./knowledge-intelligence.types";

@Injectable()
export class KnowledgeInsightGeneratorService {
  generate(matches: KnowledgeSemanticMatch[], conflicts: KnowledgeConflict[], gaps: KnowledgeGap[]): KnowledgeInsight[] {
    const now = new Date().toISOString();
    const insights: KnowledgeInsight[] = [];
    if (matches.length) {
      const top = matches[0];
      if (top) insights.push({ id: this.id(`summary:${top.item.knowledgeId}`), type: "SUMMARY", title: "Top knowledge match", description: `${top.item.name} ranked first with score ${top.finalScore}.`, supportingKnowledgeIds: [top.item.knowledgeId], confidence: top.finalScore, generatedAt: now });
    }
    if (conflicts.length) insights.push({ id: this.id(`risk:${conflicts.length}`), type: "RISK", title: "Knowledge conflicts detected", description: `${conflicts.length} conflicting knowledge relationship(s) require review.`, supportingKnowledgeIds: conflicts.flatMap((x) => [x.leftKnowledgeId, x.rightKnowledgeId]), confidence: 0.9, generatedAt: now });
    if (gaps.length) insights.push({ id: this.id(`gap:${gaps.length}`), type: "OPPORTUNITY", title: "Knowledge enrichment opportunity", description: gaps[0]?.recommendation ?? "Enrich missing knowledge.", supportingKnowledgeIds: [], confidence: 0.8, generatedAt: now });
    return insights;
  }
  private id(value: string): string { return createHash("sha256").update(value).digest("hex").slice(0, 20); }
}