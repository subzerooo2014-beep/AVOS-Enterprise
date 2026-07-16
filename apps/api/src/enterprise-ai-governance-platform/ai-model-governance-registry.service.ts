import { Injectable, NotFoundException } from "@nestjs/common";
import type { AiGovernedModelRecord } from "./enterprise-ai-governance.types";

@Injectable()
export class AiModelGovernanceRegistryService {
  private readonly models = new Map<string, AiGovernedModelRecord>();

  register(
    input: Omit<AiGovernedModelRecord, "createdAt" | "updatedAt">,
  ): AiGovernedModelRecord {
    const existing = this.models.get(input.id);
    const now = new Date().toISOString();

    const model: AiGovernedModelRecord = {
      ...input,
      capabilities: [...input.capabilities],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.models.set(model.id, model);
    return this.clone(model);
  }

  approve(id: string): AiGovernedModelRecord {
    const model = this.requireModel(id);
    model.approved = true;
    model.status = "ACTIVE";
    model.updatedAt = new Date().toISOString();
    return this.clone(model);
  }

  retire(id: string): AiGovernedModelRecord {
    const model = this.requireModel(id);
    model.status = "RETIRED";
    model.approved = false;
    model.updatedAt = new Date().toISOString();
    return this.clone(model);
  }

  get(id: string): AiGovernedModelRecord {
    return this.clone(this.requireModel(id));
  }

  list(): AiGovernedModelRecord[] {
    return Array.from(this.models.values()).map((model) => this.clone(model));
  }

  count(): number {
    return this.models.size;
  }

  approvedCount(): number {
    return this.list().filter((model) => model.approved).length;
  }

  private requireModel(id: string): AiGovernedModelRecord {
    const model = this.models.get(id);

    if (!model) {
      throw new NotFoundException(`Governed AI model '${id}' was not found.`);
    }

    return model;
  }

  private clone(model: AiGovernedModelRecord): AiGovernedModelRecord {
    return {
      ...model,
      capabilities: [...model.capabilities],
    };
  }
}
