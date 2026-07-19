import { Injectable } from "@nestjs/common";
import { PlatformRuntimeSession } from "./platform-production-mega-pack-1.types";
import { PlatformProductionFileStoreService } from "./platform-production-file-store.service";

@Injectable()
export class PlatformRuntimeSessionService {
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
    input: Omit<PlatformRuntimeSession, "id" | "status" | "startedAt">,
  ): PlatformRuntimeSession {
    const session: PlatformRuntimeSession = {
      ...input,
      id: this.id("runtime-session"),
      status: "created",
      startedAt: this.now(),
    };

    this.store.writeJson(`sessions/${session.id}.json`, session);
    return session;
  }

  activate(id: string): PlatformRuntimeSession {
    return this.update(id, {
      status: "active",
    });
  }

  complete(id: string): PlatformRuntimeSession {
    return this.update(id, {
      status: "completed",
      endedAt: this.now(),
    });
  }

  fail(id: string): PlatformRuntimeSession {
    return this.update(id, {
      status: "failed",
      endedAt: this.now(),
    });
  }

  private update(
    id: string,
    patch: Partial<PlatformRuntimeSession>,
  ): PlatformRuntimeSession {
    const session = this.list().find((item) => item.id === id);

    if (!session) {
      throw new Error(`Runtime session not found: ${id}`);
    }

    const updated: PlatformRuntimeSession = {
      ...session,
      ...patch,
    };

    this.store.writeJson(`sessions/${updated.id}.json`, updated);
    return updated;
  }

  list(): PlatformRuntimeSession[] {
    return this.store.listJson<PlatformRuntimeSession>("sessions");
  }
}