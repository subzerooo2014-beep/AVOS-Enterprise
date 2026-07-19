import { Injectable } from "@nestjs/common";
import { DocumentationGraphSnapshot } from "./documentation-graph.types";

export interface KnowledgeSynchronizationRecord {
  id: string;
  synchronizedBy: string;
  nodeCount: number;
  linkCount: number;
  graphVersion: string;
  humanFinalAuthority: true;
  synchronizedAt: string;
}

@Injectable()
export class DocumentationKnowledgeSyncService {
  private readonly records: KnowledgeSynchronizationRecord[] = [];

  synchronize(
    snapshot: DocumentationGraphSnapshot,
    synchronizedBy: string,
  ): KnowledgeSynchronizationRecord {
    const actor =
      synchronizedBy && synchronizedBy.trim().length > 0
        ? synchronizedBy.trim()
        : "human:unknown";

    const record: KnowledgeSynchronizationRecord = {
      id: `documentation-knowledge-sync:${Date.now()}:${this.records.length + 1}`,
      synchronizedBy: actor,
      nodeCount: snapshot.nodes.length,
      linkCount: snapshot.links.length,
      graphVersion: snapshot.version,
      humanFinalAuthority: true,
      synchronizedAt: new Date().toISOString(),
    };

    this.records.push(record);
    return record;
  }

  status() {
    const latest =
      this.records.length > 0
        ? this.records[this.records.length - 1]
        : null;

    return {
      name: "AVOS Documentation Knowledge Synchronizer",
      status: "operational",
      synchronizationCount: this.records.length,
      latest,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };
  }

  history(): KnowledgeSynchronizationRecord[] {
    return [...this.records];
  }
}
