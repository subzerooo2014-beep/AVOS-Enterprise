import { Injectable } from "@nestjs/common";
import type { IntelligenceModelRecord } from "./enterprise-intelligence-control-plane.types";

@Injectable()
export class ModelRegistryService {
  private readonly models = new Map<string, IntelligenceModelRecord>();

  register(model: IntelligenceModelRecord): IntelligenceModelRecord {
    this.models.set(model.id, { ...model, capabilities: [...model.capabilities] });
    return { ...model, capabilities: [...model.capabilities] };
  }

  list(): IntelligenceModelRecord[] {
    return Array.from(this.models.values()).map((model) => ({
      ...model,
      capabilities: [...model.capabilities],
    }));
  }

  activeFor(capability: string): IntelligenceModelRecord | undefined {
    return this.list().find(
      (model) =>
        model.status === "ACTIVE" &&
        model.capabilities.includes(capability),
    );
  }

  count(): number {
    return this.models.size;
  }
}
