import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeMergeService {
  merge(base: Record<string, unknown>, incoming: Record<string, unknown>, strategy: "PREFER_BASE" | "PREFER_INCOMING" = "PREFER_INCOMING") {
    const merged = strategy === "PREFER_INCOMING" ? { ...base, ...incoming } : { ...incoming, ...base };
    return { strategy, merged, fields: Object.keys(merged).length, mergedAt: new Date().toISOString() };
  }
}