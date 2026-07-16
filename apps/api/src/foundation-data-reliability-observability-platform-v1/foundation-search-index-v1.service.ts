import { Injectable } from "@nestjs/common";
import type { FoundationSearchDocumentV1 } from "./foundation-data-reliability-observability-v1.types";

@Injectable()
export class FoundationSearchIndexV1Service {
  private readonly documents = new Map<string, FoundationSearchDocumentV1>();

  indexDocument(
    index: string,
    id: string,
    title: string,
    content: string,
    metadata: Record<string, unknown> = {},
  ): FoundationSearchDocumentV1 {
    const document: FoundationSearchDocumentV1 = {
      id,
      index,
      title,
      content,
      metadata: { ...metadata },
      updatedAt: new Date().toISOString(),
    };

    this.documents.set(`${index}:${id}`, document);
    return this.clone(document);
  }

  search(index: string, query: string): FoundationSearchDocumentV1[] {
    const normalized = query.toLowerCase();

    return Array.from(this.documents.values())
      .filter((document) => document.index === index)
      .filter(
        (document) =>
          document.title.toLowerCase().includes(normalized) ||
          document.content.toLowerCase().includes(normalized),
      )
      .map((document) => this.clone(document));
  }

  list(): FoundationSearchDocumentV1[] {
    return Array.from(this.documents.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.documents.size;
  }

  private clone(item: FoundationSearchDocumentV1): FoundationSearchDocumentV1 {
    return { ...item, metadata: { ...item.metadata } };
  }
}
