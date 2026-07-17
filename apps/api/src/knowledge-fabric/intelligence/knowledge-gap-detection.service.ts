import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { KnowledgeGap, KnowledgeSemanticMatch } from "./knowledge-intelligence.types";

@Injectable()
export class KnowledgeGapDetectionService {
  detect(query: string, matches: KnowledgeSemanticMatch[], namespace?: string): KnowledgeGap[] {
    const terms = query.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g, " ").split(" ").filter((x) => x.length > 2);
    const corpus = matches.map((m) => `${m.item.name} ${m.item.tags.join(" ")} ${JSON.stringify(m.item.content)}`).join(" ").toLowerCase();
    const missingConcepts = Array.from(new Set(terms.filter((term) => !corpus.includes(term))));
    if (matches.length >= 3 && missingConcepts.length === 0) return [];
    const severity = matches.length === 0 ? "HIGH" : matches.length < 3 ? "MEDIUM" : "LOW";
    return [{
      id: createHash("sha256").update(`${namespace ?? "global"}:${query}`).digest("hex").slice(0, 20),
      query, namespace, missingConcepts, severity,
      recommendation: matches.length === 0 ? "Create or ingest authoritative knowledge for this query." : "Enrich the knowledge set with the missing concepts.",
      detectedAt: new Date().toISOString(),
    }];
  }
}