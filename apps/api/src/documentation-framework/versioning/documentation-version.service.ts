import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateDocumentationVersionDto } from "../dto/create-documentation-version.dto";
import { DocumentationVersionRecord } from "../interfaces/documentation-workflow.types";

@Injectable()
export class DocumentationVersionService {
  private readonly versions = new Map<string, DocumentationVersionRecord[]>();

  create(
    documentId: string,
    currentVersion: string,
    dto: CreateDocumentationVersionDto,
  ): DocumentationVersionRecord {
    const existing = this.versions.get(documentId) || [];

    if (existing.some((item) => item.version === dto.version)) {
      throw new ConflictException(
        `Version '${dto.version}' already exists for '${documentId}'.`,
      );
    }

    const record: DocumentationVersionRecord = {
      id: `adf-version:${documentId}:${Date.now()}:${existing.length + 1}`,
      documentId,
      version: dto.version.trim(),
      previousVersion: currentVersion,
      changeSummary: dto.changeSummary.trim(),
      changeType: dto.changeType,
      createdBy: dto.createdBy.trim(),
      createdAt: new Date().toISOString(),
      metadata: dto.metadata || {},
    };

    this.versions.set(documentId, [...existing, record]);
    return record;
  }

  list(documentId: string): DocumentationVersionRecord[] {
    return [...(this.versions.get(documentId) || [])];
  }

  latest(documentId: string): DocumentationVersionRecord {
    const records = this.list(documentId);
    const latest = records[records.length - 1];

    if (!latest) {
      throw new NotFoundException(
        `No version history exists for '${documentId}'.`,
      );
    }

    return latest;
  }

  count(): number {
    return Array.from(this.versions.values()).reduce(
      (total, records) => total + records.length,
      0,
    );
  }
}
