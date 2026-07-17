import { Injectable } from "@nestjs/common";
import { NormalizedKnowledgeDocument } from "./knowledge-ingestion.types";

@Injectable()
export class KnowledgeIngestionRepository {
  private readonly documents = new Map<string, NormalizedKnowledgeDocument>();
  private readonly checksumIndex = new Map<string, string>();

  save(document: NormalizedKnowledgeDocument): {
    document: NormalizedKnowledgeDocument;
    duplicate: boolean;
  } {
    const existingId = this.checksumIndex.get(document.checksum);
    if (existingId) {
      const existing = this.documents.get(existingId);
      if (existing) {
        return { document: existing, duplicate: true };
      }
    }

    this.documents.set(document.id, document);
    this.checksumIndex.set(document.checksum, document.id);
    return { document, duplicate: false };
  }

  findAll(): NormalizedKnowledgeDocument[] {
    return Array.from(this.documents.values()).sort((a, b) =>
      b.ingestedAt.localeCompare(a.ingestedAt),
    );
  }

  findById(id: string): NormalizedKnowledgeDocument | undefined {
    return this.documents.get(id);
  }

  findByChecksum(checksum: string): NormalizedKnowledgeDocument | undefined {
    const id = this.checksumIndex.get(checksum);
    return id ? this.documents.get(id) : undefined;
  }

  count(): number {
    return this.documents.size;
  }
}