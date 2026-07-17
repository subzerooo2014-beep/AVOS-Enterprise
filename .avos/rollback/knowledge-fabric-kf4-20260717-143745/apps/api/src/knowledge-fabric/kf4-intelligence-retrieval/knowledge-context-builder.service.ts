import { Injectable } from "@nestjs/common";
import { KnowledgeContextResult, KnowledgeSearchResult } from "./knowledge-retrieval.types";

@Injectable()
export class KnowledgeContextBuilderService {
  build(query: string, results: KnowledgeSearchResult[], maxCharacters = 4000): KnowledgeContextResult {
    const safeLimit = Math.max(256, Math.min(maxCharacters, 20000));
    const blocks = results.map((result, index) =>
      `[${index + 1}] ${result.title}\n${result.summary}`,
    );
    let context = blocks.join("\n\n");
    if (context.length > safeLimit) context = context.slice(0, safeLimit).trimEnd();
    return {
      query,
      context,
      citations: results.map((result) => ({
        id: result.id,
        title: result.title,
        kind: result.kind,
        score: result.score,
      })),
      resultCount: results.length,
      generatedAt: new Date().toISOString(),
    };
  }
}