import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { KnowledgeConflict, KnowledgeIntelligenceItem } from "./knowledge-intelligence.types";

@Injectable()
export class KnowledgeConflictDetectionService {
  detect(items: KnowledgeIntelligenceItem[]): KnowledgeConflict[] {
    const conflicts: KnowledgeConflict[] = [];
    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        const left = items[i]; const right = items[j];
        if (!left || !right || left.key !== right.key || left.version === right.version) continue;
        if (JSON.stringify(left.content) === JSON.stringify(right.content)) continue;
        conflicts.push({
          id: createHash("sha256").update(`${left.knowledgeId}:${right.knowledgeId}`).digest("hex").slice(0, 20),
          leftKnowledgeId: left.knowledgeId,
          rightKnowledgeId: right.knowledgeId,
          field: "content",
          severity: Math.abs(left.version - right.version) > 1 ? "HIGH" : "MEDIUM",
          explanation: `Different content detected for knowledge key ${left.key}.`,
          detectedAt: new Date().toISOString(),
        });
      }
    }
    return conflicts;
  }
}