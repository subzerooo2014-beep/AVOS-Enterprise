import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  FactoryPattern,
  LearningSignal,
  LearningSignalType,
} from "./factory-knowledge.contracts";

@Injectable()
export class ContinuousFactoryLearningService {
  private readonly signals: LearningSignal[] = [];

  recordSignal(input: {
    workItemId?: string;
    type: LearningSignalType;
    value: number;
    weight?: number;
    context?: Record<string, unknown>;
  }): LearningSignal {
    const signal: LearningSignal = {
      id: randomUUID(),
      workItemId: input.workItemId,
      type: input.type,
      value: input.value,
      weight: input.weight ?? 1,
      context: input.context ?? {},
      timestamp: new Date().toISOString(),
    };

    this.signals.push(signal);
    return structuredClone(signal);
  }

  allSignals(): LearningSignal[] {
    return structuredClone(this.signals);
  }

  detectPatterns(): FactoryPattern[] {
    const groups = new Map<LearningSignalType, LearningSignal[]>();

    for (const signal of this.signals) {
      const current = groups.get(signal.type) ?? [];
      current.push(signal);
      groups.set(signal.type, current);
    }

    return [...groups.entries()].map(([type, signals]) => {
      const average =
        signals.reduce((sum, signal) => sum + signal.value, 0) /
        Math.max(1, signals.length);

      const category: FactoryPattern["category"] =
        type === "failure"
          ? "failure"
          : type === "latency" || type === "resource"
            ? "bottleneck"
            : "success";

      return {
        id: randomUUID(),
        name: `${type}-pattern`,
        category,
        confidence: Math.min(100, 60 + signals.length * 5),
        evidenceCount: signals.length,
        recommendation:
          average >= 80
            ? `Preserve and reuse the ${type} operating pattern.`
            : `Optimize the ${type} operating pattern before scaling.`,
        createdAt: new Date().toISOString(),
      };
    });
  }

  signalCount(): number {
    return this.signals.length;
  }
}
