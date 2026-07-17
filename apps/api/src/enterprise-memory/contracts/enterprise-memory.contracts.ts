
export type MemoryKind =
  | "operational"
  | "working"
  | "semantic"
  | "episodic"
  | "decision"
  | "experience"
  | "long-term";

export interface MemoryRecord {
  readonly id: string;
  readonly kind: MemoryKind;
  readonly key: string;
  readonly title: string;
  readonly content: Readonly<Record<string, unknown>>;
  readonly source: string;
  readonly trustScore: number;
  readonly retention: "session" | "short" | "long" | "permanent";
  readonly tags: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MemoryHealth {
  readonly status: "healthy" | "degraded" | "critical";
  readonly score: number;
  readonly total: number;
  readonly byKind: Readonly<Record<string, number>>;
  readonly lowTrust: number;
  readonly duplicates: number;
  readonly generatedAt: string;
}