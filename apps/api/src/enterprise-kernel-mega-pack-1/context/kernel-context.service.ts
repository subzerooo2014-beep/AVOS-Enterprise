import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { KernelRuntimeContext } from "../enterprise-kernel-mega-pack-1.types";
import { KernelIdentityService } from "../identity/kernel-identity.service";
import { KernelAuditService } from "../observability/kernel-audit.service";

@Injectable()
export class KernelContextService {
  private readonly contexts =
    new Map<string, KernelRuntimeContext>();

  constructor(
    private readonly identity: KernelIdentityService,
    private readonly audit: KernelAuditService
  ) {}

  list() {
    return Array.from(this.contexts.values());
  }

  get(id: string) {
    const context = this.contexts.get(id);

    if (!context) {
      throw new NotFoundException(
        `Kernel runtime context not found: ${id}`
      );
    }

    return context;
  }

  create(input: {
    environment?: string;
    region?: string;
    nodeName?: string;
    startedByIdentityId: string;
    correlationId: string;
    metadata?: Record<string, unknown>;
  }) {
    const now = new Date().toISOString();
    const kernelIdentity = this.identity.get();

    const context: KernelRuntimeContext = {
      id: `kernel-context:${Date.now()}:${
        this.contexts.size + 1
      }`,
      kernelIdentityId: kernelIdentity.id,
      environment:
        input.environment ??
        process.env.NODE_ENV ??
        "development",
      region: input.region ?? "local",
      nodeName:
        input.nodeName ??
        process.env.COMPUTERNAME ??
        process.env.HOSTNAME ??
        "unknown-node",
      processId: process.pid,
      startedByIdentityId:
        input.startedByIdentityId,
      correlationId: input.correlationId,
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now
    };

    this.contexts.set(context.id, context);

    this.audit.record({
      correlationId: input.correlationId,
      category: "context",
      action: "kernel-context-created",
      subjectId: context.id,
      actorIdentityId:
        input.startedByIdentityId,
      outcome: "success",
      metadata: {
        environment: context.environment,
        region: context.region,
        nodeName: context.nodeName
      }
    });

    return context;
  }

  update(
    id: string,
    patch: {
      region?: string;
      nodeName?: string;
      metadata?: Record<string, unknown>;
    },
    actor: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    const updated: KernelRuntimeContext = {
      ...current,
      ...patch,
      metadata: {
        ...current.metadata,
        ...(patch.metadata ?? {})
      },
      updatedAt: new Date().toISOString()
    };

    this.contexts.set(id, updated);

    this.audit.record({
      correlationId: actor.correlationId,
      category: "context",
      action: "kernel-context-updated",
      subjectId: id,
      actorIdentityId: actor.actorIdentityId,
      outcome: "success",
      metadata: {
        region: updated.region,
        nodeName: updated.nodeName
      }
    });

    return updated;
  }

  latest() {
    const items = this.list();

    return items.length === 0
      ? undefined
      : items[items.length - 1];
  }

  summary() {
    return {
      total: this.contexts.size,
      latestContextId: this.latest()?.id,
      environments: new Set(
        this.list().map((context) => context.environment)
      ).size
    };
  }
}
