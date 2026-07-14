import { Injectable } from "@nestjs/common";
@Injectable()
export class AiModelRegistryService {
  private readonly models: Array<Record<string, unknown>> = [];
  register(input: Record<string, unknown>) {
    const record = { id: `model_${Date.now()}`, ...input, active: true, createdAt: new Date().toISOString() };
    this.models.push(record);
    return record;
  }
  list() { return [...this.models]; }
}
