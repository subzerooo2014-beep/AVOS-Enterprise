import { Injectable } from "@nestjs/common";
import { AvosDocumentRecord } from "../interfaces/documentation.types";
import { BlueprintBindingRecord, LivingDocumentationSnapshot } from "../interfaces/documentation-intelligence.types";

@Injectable()
export class LivingDocumentationService {
  private readonly snapshots = new Map<string, LivingDocumentationSnapshot[]>();

  createSnapshot(
    document: AvosDocumentRecord,
    binding: BlueprintBindingRecord | undefined,
    generatedBy: string,
  ): LivingDocumentationSnapshot {
    const driftReasons: string[] = [];
    if (!binding) driftReasons.push("Document is not linked to a Living Blueprint.");
    if (binding && binding.documentVersion !== document.version) {
      driftReasons.push(`Document version '${document.version}' differs from synchronized version '${binding.documentVersion}'.`);
    }

    const syncStatus = !binding
      ? "not-linked"
      : driftReasons.length > 0
        ? "drift-detected"
        : "synchronized";

    const existing = this.snapshots.get(document.id) || [];
    const snapshot: LivingDocumentationSnapshot = {
      id: `adf-living-snapshot:${document.id}:${Date.now()}:${existing.length + 1}`,
      documentId: document.id,
      documentVersion: document.version,
      blueprintId: binding?.blueprintId,
      blueprintVersion: binding?.blueprintVersion,
      syncStatus,
      driftReasons,
      generatedBy: generatedBy.trim() || "system:avos-documentation-intelligence",
      generatedAt: new Date().toISOString(),
      humanFinalAuthority: true,
    };
    this.snapshots.set(document.id, [...existing, snapshot]);
    return snapshot;
  }

  list(documentId?: string): LivingDocumentationSnapshot[] {
    if (documentId) return [...(this.snapshots.get(documentId) || [])];
    return Array.from(this.snapshots.values()).flat().sort((a, b) => a.generatedAt.localeCompare(b.generatedAt));
  }

  latest(documentId: string): LivingDocumentationSnapshot | undefined {
    const items = this.snapshots.get(documentId) || [];
    return items.length ? items[items.length - 1] : undefined;
  }

  count(): number { return this.list().length; }
}
