import { Injectable } from "@nestjs/common";
import { KnowledgeRecord, KnowledgeRelation } from "./intelligence-foundation.types";

@Injectable()
export class KnowledgeFabricService {
  private readonly records = new Map<string, KnowledgeRecord>();
  private readonly relations: KnowledgeRelation[] = [];

  constructor() {
    const now = new Date().toISOString();

    this.upsert({
      id: "knowledge:foundation-first",
      kind: "constitutional-principle",
      title: "Foundation First",
      content:
        "Complete and certify foundations before activating higher-order intelligence and autonomous behavior.",
      tags: ["foundation", "governance", "architecture"],
      source: "AVOS Digital Constitution",
      createdAt: now,
      updatedAt: now,
    });

    this.upsert({
      id: "knowledge:human-final-authority",
      kind: "governance-principle",
      title: "Human Final Authority",
      content:
        "Material architectural, operational, and autonomous changes require explicit human authorization.",
      tags: ["governance", "trust", "approval"],
      source: "AVOS Trust Framework",
      createdAt: now,
      updatedAt: now,
    });

    this.link({
      from: "knowledge:foundation-first",
      to: "knowledge:human-final-authority",
      type: "governed-by",
      weight: 1,
    });
  }

  upsert(input: KnowledgeRecord): KnowledgeRecord {
    const previous = this.records.get(input.id);
    const result: KnowledgeRecord = {
      ...input,
      createdAt: previous?.createdAt ?? input.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.records.set(result.id, result);
    return result;
  }

  findAll(): KnowledgeRecord[] {
    return [...this.records.values()];
  }

  findById(id: string): KnowledgeRecord | undefined {
    return this.records.get(id);
  }

  search(query: string): KnowledgeRecord[] {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return this.findAll();

    return this.findAll().filter((record) =>
      [
        record.id,
        record.kind,
        record.title,
        record.content,
        record.source,
        ...record.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }

  link(relation: KnowledgeRelation): KnowledgeRelation {
    const duplicate = this.relations.find(
      (item) =>
        item.from === relation.from &&
        item.to === relation.to &&
        item.type === relation.type,
    );

    if (!duplicate) {
      this.relations.push(relation);
      return relation;
    }

    duplicate.weight = relation.weight;
    return duplicate;
  }

  getRelations(): KnowledgeRelation[] {
    return [...this.relations];
  }

  count(): number {
    return this.records.size;
  }

  relationCount(): number {
    return this.relations.length;
  }
}
