import { Injectable } from "@nestjs/common";
import type { RetrievalResult, VectorMemoryRecord } from "./enterprise-knowledge-intelligence.types";

@Injectable()
export class VectorMemoryService {
  private readonly records = new Map<string, VectorMemoryRecord>();
  private retrievalCountValue = 0;

  store(namespace: string, text: string, metadata: Record<string, unknown> = {}): VectorMemoryRecord {
    const record: VectorMemoryRecord = {
      id: `vector-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      namespace,
      text,
      vector: this.embed(text),
      metadata: { ...metadata },
      createdAt: new Date().toISOString(),
    };
    this.records.set(record.id, record);
    return this.clone(record);
  }

  search(namespace: string, query: string, limit = 5): RetrievalResult[] {
    this.retrievalCountValue += 1;
    const vector = this.embed(query);
    return Array.from(this.records.values())
      .filter((record) => record.namespace === namespace)
      .map((record) => ({
        id: record.id,
        score: this.cosine(vector, record.vector),
        text: record.text,
        metadata: { ...record.metadata },
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(1, limit));
  }

  count(): number { return this.records.size; }
  retrievalCount(): number { return this.retrievalCountValue; }

  private embed(text: string): number[] {
    const values = new Array<number>(16).fill(0);
    for (let index = 0; index < text.length; index += 1) {
      values[index % values.length] += text.charCodeAt(index) / 255;
    }
    return values;
  }

  private cosine(left: number[], right: number[]): number {
    const dot = left.reduce((sum, value, index) => sum + value * (right[index] ?? 0), 0);
    const leftNorm = Math.sqrt(left.reduce((sum, value) => sum + value * value, 0));
    const rightNorm = Math.sqrt(right.reduce((sum, value) => sum + value * value, 0));
    return leftNorm && rightNorm ? dot / (leftNorm * rightNorm) : 0;
  }

  private clone(record: VectorMemoryRecord): VectorMemoryRecord {
    return { ...record, vector: [...record.vector], metadata: { ...record.metadata } };
  }
}
