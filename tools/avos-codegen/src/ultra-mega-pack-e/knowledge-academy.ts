import { randomUUID } from "node:crypto";
import { UltraEEvidence, UltraEValue } from "./contracts";

export interface KnowledgeAsset {
  id: string;
  key: string;
  title: string;
  domain: string;
  version: number;
  confidence: number;
  tags: string[];
  content: Record<string, UltraEValue>;
  sourceSystems: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeLesson {
  key: string;
  assetKey: string;
  objective: string;
  prerequisites: string[];
  assessmentQuestions: number;
}

export interface KnowledgeAcademySnapshot {
  assetCount: number;
  lessonCount: number;
  domains: string[];
  averageConfidence: number;
  generatedAt: string;
}

export class EnterpriseKnowledgeAcademy {
  private readonly assets = new Map<string, KnowledgeAsset>();
  private readonly lessons = new Map<string, KnowledgeLesson>();

  upsertAsset(
    input: Omit<KnowledgeAsset, "id" | "version" | "createdAt" | "updatedAt">,
  ): KnowledgeAsset {
    const current = this.assets.get(input.key);
    const now = new Date().toISOString();

    const stored: KnowledgeAsset = {
      ...structuredClone(input),
      id: current?.id ?? randomUUID(),
      version: (current?.version ?? 0) + 1,
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
    };

    this.assets.set(stored.key, stored);
    return structuredClone(stored);
  }

  registerLesson(lesson: KnowledgeLesson): KnowledgeLesson {
    if (!this.assets.has(lesson.assetKey)) {
      throw new Error(`Knowledge asset was not found: ${lesson.assetKey}`);
    }

    this.lessons.set(lesson.key, structuredClone(lesson));
    return structuredClone(lesson);
  }

  synchronize(
    systemKey: string,
    targetSystems: readonly string[],
  ): UltraEEvidence[] {
    const assetKeys = Array.from(this.assets.keys());

    return targetSystems.map((targetSystem) => ({
      id: randomUUID(),
      systemKey,
      category: "knowledge-synchronization",
      action: "knowledge.synchronized",
      message: `Synchronized ${assetKeys.length} knowledge assets to ${targetSystem}.`,
      metadata: { targetSystem, assetKeys },
      createdAt: new Date().toISOString(),
    }));
  }

  snapshot(): KnowledgeAcademySnapshot {
    const assets = Array.from(this.assets.values());
    const averageConfidence =
      assets.length === 0
        ? 100
        : Math.round(
            assets.reduce((sum, asset) => sum + asset.confidence, 0) /
              assets.length,
          );

    return {
      assetCount: assets.length,
      lessonCount: this.lessons.size,
      domains: Array.from(new Set(assets.map((asset) => asset.domain))).sort(),
      averageConfidence,
      generatedAt: new Date().toISOString(),
    };
  }
}
