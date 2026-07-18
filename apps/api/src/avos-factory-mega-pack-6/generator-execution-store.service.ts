import { Injectable, NotFoundException } from "@nestjs/common";
import { GeneratorExecutionRecord } from "./generator-runtime.contracts";

@Injectable()
export class GeneratorExecutionStoreService {
  private readonly executions = new Map<string, GeneratorExecutionRecord>();

  save(record: GeneratorExecutionRecord): GeneratorExecutionRecord {
    this.executions.set(record.id, structuredClone(record));
    return structuredClone(record);
  }

  get(id: string): GeneratorExecutionRecord {
    const record = this.executions.get(id);

    if (!record) {
      throw new NotFoundException(`Generator execution not found: ${id}`);
    }

    return structuredClone(record);
  }

  list(): GeneratorExecutionRecord[] {
    return [...this.executions.values()].map((item) => structuredClone(item));
  }

  count(): number {
    return this.executions.size;
  }
}
