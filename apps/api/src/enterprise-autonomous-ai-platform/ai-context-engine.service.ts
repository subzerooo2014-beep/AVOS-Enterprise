import { Injectable } from "@nestjs/common";
import { AiMemoryRouterService } from "./ai-memory-router.service";

@Injectable()
export class AiContextEngineService {
  constructor(private readonly memory: AiMemoryRouterService) {}

  compose(
    scope: string,
    input: Record<string, unknown>,
  ): Record<string, unknown> {
    const memories = this.memory.list(scope);

    return {
      ...input,
      memory: Object.fromEntries(
        memories.map((item) => [item.key, item.value]),
      ),
      composedAt: new Date().toISOString(),
    };
  }
}
