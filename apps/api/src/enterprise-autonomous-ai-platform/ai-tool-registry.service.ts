import { Injectable } from "@nestjs/common";
import type { AiToolRecord } from "./enterprise-autonomous-ai.types";

@Injectable()
export class AiToolRegistryService {
  private readonly tools = new Map<string, AiToolRecord>();

  register(tool: AiToolRecord): AiToolRecord {
    this.tools.set(tool.id, { ...tool });
    return { ...tool };
  }

  get(id: string): AiToolRecord | undefined {
    const tool = this.tools.get(id);
    return tool ? { ...tool } : undefined;
  }

  list(): AiToolRecord[] {
    return Array.from(this.tools.values()).map((tool) => ({ ...tool }));
  }

  count(): number {
    return this.tools.size;
  }
}
