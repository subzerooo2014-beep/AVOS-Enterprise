import { Injectable } from "@nestjs/common";
import type { KnowledgeDocument } from "./enterprise-knowledge-intelligence.types";

@Injectable()
export class KnowledgeCatalogService {
  private readonly documents = new Map<string, KnowledgeDocument>();

  upsert(input: Omit<KnowledgeDocument, "version" | "createdAt" | "updatedAt">): KnowledgeDocument {
    const existing = this.documents.get(input.id);
    const now = new Date().toISOString();
    const document: KnowledgeDocument = {
      ...input,
      tags: [...input.tags],
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    this.documents.set(document.id, document);
    return this.clone(document);
  }

  get(id: string): KnowledgeDocument | undefined {
    const document = this.documents.get(id);
    return document ? this.clone(document) : undefined;
  }

  list(): KnowledgeDocument[] {
    return Array.from(this.documents.values()).map((document) => this.clone(document));
  }

  count(): number { return this.documents.size; }

  private clone(document: KnowledgeDocument): KnowledgeDocument {
    return { ...document, tags: [...document.tags] };
  }
}
