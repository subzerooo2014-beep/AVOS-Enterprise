import { Injectable } from "@nestjs/common";

@Injectable()
export class ContextMemoryEngineService {
  private readonly contexts = new Map<string, Record<string, unknown>>();

  remember(scope: string, context: Record<string, unknown>) {
    this.contexts.set(scope, context);
    return {
      scope,
      remembered: true,
      keys: Object.keys(context).length,
      rememberedAt: new Date().toISOString(),
    };
  }

  recall(scope: string): Record<string, unknown> | null {
    return this.contexts.get(scope) || null;
  }

  count(): number {
    return this.contexts.size;
  }
}