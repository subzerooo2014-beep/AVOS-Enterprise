import { Injectable } from "@nestjs/common";
import type { FoundationRuntimeStateV1 } from "./foundation-core-platform-v1.types";

@Injectable()
export class FoundationKernelLifecycleV1Service {
  private state: FoundationRuntimeStateV1 = {
    systemId: "avos-foundation-core",
    status: "CREATED",
    lastTransitionAt: new Date().toISOString(),
    version: "1.0.0",
    metadata: {},
  };

  start(metadata: Record<string, unknown> = {}): FoundationRuntimeStateV1 {
    const now = new Date().toISOString();

    this.state = {
      ...this.state,
      status: "RUNNING",
      startedAt: this.state.startedAt ?? now,
      lastTransitionAt: now,
      metadata: {
        ...this.state.metadata,
        ...metadata,
      },
    };

    return this.snapshot();
  }

  degrade(reason: string): FoundationRuntimeStateV1 {
    const now = new Date().toISOString();

    this.state = {
      ...this.state,
      status: "DEGRADED",
      lastTransitionAt: now,
      metadata: {
        ...this.state.metadata,
        degradationReason: reason,
      },
    };

    return this.snapshot();
  }

  stop(): FoundationRuntimeStateV1 {
    const now = new Date().toISOString();

    this.state = {
      ...this.state,
      status: "STOPPED",
      stoppedAt: now,
      lastTransitionAt: now,
    };

    return this.snapshot();
  }

  snapshot(): FoundationRuntimeStateV1 {
    return {
      ...this.state,
      metadata: { ...this.state.metadata },
    };
  }
}
