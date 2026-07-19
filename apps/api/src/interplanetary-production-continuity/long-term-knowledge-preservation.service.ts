import { createHash } from "crypto";
import { Injectable } from "@nestjs/common";
import { InterplanetaryProductionContinuityStore } from "./interplanetary-production-continuity.store";

@Injectable()
export class LongTermKnowledgePreservationService {
  constructor(private readonly store: InterplanetaryProductionContinuityStore) {}

  preserve(input: {
    domain: string;
    title: string;
    classification?: string;
    preservationTier?: number;
    replicationTargets?: string[];
  }) {
    const payload = `${input.domain}:${input.title}:${this.store.now()}`;
    const artifact = {
      id: this.store.id("preserved-knowledge"),
      domain: input.domain,
      title: input.title,
      classification: input.classification ?? "civilization-critical",
      preservationTier: input.preservationTier ?? 1,
      replicationTargets: input.replicationTargets ?? this.store.nodes.map((node) => node.id),
      integrityHash: createHash("sha256").update(payload).digest("hex"),
      immutable: true,
      createdAt: this.store.now(),
    };
    this.store.memoryArtifacts.push(artifact);
    return artifact;
  }
}