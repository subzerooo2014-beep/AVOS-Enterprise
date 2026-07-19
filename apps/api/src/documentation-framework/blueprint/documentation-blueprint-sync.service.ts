import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { BindDocumentationBlueprintDto } from "../dto/bind-documentation-blueprint.dto";
import { SynchronizeLivingDocumentationDto } from "../dto/synchronize-living-documentation.dto";
import { AvosDocumentRecord } from "../interfaces/documentation.types";
import { BlueprintBindingRecord } from "../interfaces/documentation-intelligence.types";

@Injectable()
export class DocumentationBlueprintSyncService {
  private readonly bindings = new Map<string, BlueprintBindingRecord>();

  bind(document: AvosDocumentRecord, dto: BindDocumentationBlueprintDto): BlueprintBindingRecord {
    const blueprintId = dto.blueprintId.trim();
    if (!blueprintId) throw new ConflictException("blueprintId is required.");

    const record: BlueprintBindingRecord = {
      id: `adf-blueprint-binding:${document.id}:${Date.now()}`,
      documentId: document.id,
      blueprintId,
      blueprintVersion: dto.blueprintVersion.trim(),
      documentVersion: document.version,
      checksum: dto.checksum?.trim(),
      linkedBy: dto.linkedBy.trim(),
      linkedAt: new Date().toISOString(),
      lastSynchronizedAt: new Date().toISOString(),
      status: "synchronized",
    };
    this.bindings.set(document.id, record);
    return record;
  }

  get(documentId: string): BlueprintBindingRecord {
    const binding = this.bindings.get(documentId);
    if (!binding) throw new NotFoundException(`No blueprint binding exists for '${documentId}'.`);
    return binding;
  }

  getOptional(documentId: string): BlueprintBindingRecord | undefined {
    return this.bindings.get(documentId);
  }

  list(): BlueprintBindingRecord[] {
    return Array.from(this.bindings.values()).sort((a, b) => a.documentId.localeCompare(b.documentId));
  }

  synchronize(document: AvosDocumentRecord, dto: SynchronizeLivingDocumentationDto): BlueprintBindingRecord {
    const current = this.get(document.id);
    const now = new Date().toISOString();
    const synchronized: BlueprintBindingRecord = {
      ...current,
      blueprintVersion: dto.blueprintVersion.trim(),
      documentVersion: document.version,
      checksum: dto.checksum?.trim() || current.checksum,
      linkedBy: dto.synchronizedBy.trim(),
      lastSynchronizedAt: now,
      status: "synchronized",
    };
    this.bindings.set(document.id, synchronized);
    return synchronized;
  }

  evaluate(document: AvosDocumentRecord): BlueprintBindingRecord | undefined {
    const current = this.bindings.get(document.id);
    if (!current) return undefined;
    const status = current.documentVersion === document.version ? "synchronized" : "drift-detected";
    if (status === current.status) return current;
    const evaluated: BlueprintBindingRecord = { ...current, status };
    this.bindings.set(document.id, evaluated);
    return evaluated;
  }

  count(): number { return this.bindings.size; }
  driftCount(): number { return this.list().filter((item) => item.status === "drift-detected").length; }
}
