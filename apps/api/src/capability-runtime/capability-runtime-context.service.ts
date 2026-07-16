import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  DEFAULT_RUNTIME_RESOURCE_POLICY,
} from "./capability-runtime.registry";
import {
  CapabilityRuntimeContext,
  CapabilityRuntimeLoadRequest,
} from "./capability-runtime.types";

@Injectable()
export class CapabilityRuntimeContextService {
  create(
    runtimeId: string,
    request: CapabilityRuntimeLoadRequest,
  ): CapabilityRuntimeContext {
    return {
      runtimeId,
      capabilityKey: request.capabilityKey.toLowerCase(),
      tenantId: request.tenantId?.trim() || "default",
      environment: request.environment?.trim() || "production",
      correlationId: randomUUID(),
      isolation: request.isolation ?? "ISOLATED_CONTEXT",
      configuration: structuredClone(request.configuration ?? {}),
      resourcePolicy: {
        ...DEFAULT_RUNTIME_RESOURCE_POLICY,
        ...(request.resourcePolicy ?? {}),
      },
      createdAt: new Date().toISOString(),
    };
  }
}