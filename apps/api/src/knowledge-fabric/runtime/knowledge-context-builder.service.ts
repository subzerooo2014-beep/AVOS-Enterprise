import { Injectable } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import { KnowledgeRuntimeContext, KnowledgeRuntimeContextItem } from "./knowledge-runtime.types";

@Injectable()
export class KnowledgeContextBuilderService {
  build(sessionId: string, query: string, items: KnowledgeRuntimeContextItem[]): KnowledgeRuntimeContext {
    const normalizedItems = items.map((item) => structuredClone(item));
    const serialized = JSON.stringify({ sessionId, query, items: normalizedItems });
    return {
      id: `kctx_${randomUUID()}`,
      sessionId,
      query,
      items: normalizedItems,
      tokenEstimate: Math.ceil(serialized.length / 4),
      checksum: createHash("sha256").update(serialized).digest("hex"),
      assembledAt: new Date().toISOString(),
    };
  }
}
