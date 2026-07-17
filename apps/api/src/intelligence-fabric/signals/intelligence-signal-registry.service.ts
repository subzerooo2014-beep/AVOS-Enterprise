import { Injectable } from "@nestjs/common";
import { IntelligenceSignal } from "../contracts/intelligence-fabric.contracts";

@Injectable()
export class IntelligenceSignalRegistryService {
  private readonly signals = new Map<string, IntelligenceSignal>();

  register(signal: IntelligenceSignal): IntelligenceSignal {
    const normalized: IntelligenceSignal = {
      ...signal,
      confidence: Math.min(Math.max(signal.confidence, 0), 1),
    };
    this.signals.set(normalized.id, normalized);
    return normalized;
  }

  list(type?: string): readonly IntelligenceSignal[] {
    const values = [...this.signals.values()];
    return type ? values.filter((signal) => signal.type === type) : values;
  }

  get(id: string): IntelligenceSignal | undefined {
    return this.signals.get(id);
  }

  count(): number {
    return this.signals.size;
  }

  clear(): void {
    this.signals.clear();
  }
}