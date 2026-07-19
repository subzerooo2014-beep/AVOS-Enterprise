import { Injectable } from "@nestjs/common";
import { PlatformRuntimeContext } from "./platform-production-mega-pack-1.types";
import { PlatformProductionFileStoreService } from "./platform-production-file-store.service";

@Injectable()
export class PlatformRuntimeContextService {
  constructor(
    private readonly store: PlatformProductionFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  create(
    input: Omit<PlatformRuntimeContext, "id" | "createdAt" | "correlationId"> & {
      correlationId?: string;
    },
  ): PlatformRuntimeContext {
    const context: PlatformRuntimeContext = {
      ...input,
      id: this.id("runtime-context"),
      correlationId:
        input.correlationId ?? this.id("correlation"),
      createdAt: this.now(),
    };

    this.store.writeJson(`contexts/${context.id}.json`, context);
    return context;
  }

  list(): PlatformRuntimeContext[] {
    return this.store.listJson<PlatformRuntimeContext>("contexts");
  }
}