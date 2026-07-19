import { Injectable } from "@nestjs/common";
import { EventEnvelope, WorkflowBinding } from "./platform-production-mega-pack-4.types";
import { EventMeshFileStoreService } from "./event-mesh-file-store.service";

@Injectable()
export class WorkflowIntegrationService {
  constructor(
    private readonly store: EventMeshFileStoreService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.listBindings().length > 0) {
      return;
    }

    this.registerBinding({
      workflowKey: "runtime-health-response",
      triggerEventType: "platform.runtime.health.updated",
      active: true,
      action: "evaluate-runtime-health",
    });

    this.registerBinding({
      workflowKey: "incident-response",
      triggerEventType: "platform.operations.incident.opened",
      active: true,
      action: "start-incident-coordination",
    });
  }

  registerBinding(
    input: Omit<WorkflowBinding, "id" | "createdAt">,
  ): WorkflowBinding {
    const existing = this.listBindings().find(
      (binding) =>
        binding.workflowKey === input.workflowKey &&
        binding.triggerEventType === input.triggerEventType,
    );

    if (existing) {
      return existing;
    }

    const binding: WorkflowBinding = {
      ...input,
      id: this.id("workflow-binding"),
      createdAt: this.now(),
    };

    this.store.writeJson(`workflow-bindings/${binding.id}.json`, binding);
    return binding;
  }

  listBindings(): WorkflowBinding[] {
    return this.store.listJson<WorkflowBinding>("workflow-bindings");
  }

  trigger(envelope: EventEnvelope): Array<{
    workflowKey: string;
    action: string;
    status: "triggered";
  }> {
    return this.listBindings()
      .filter(
        (binding) =>
          binding.active &&
          binding.triggerEventType === envelope.eventType,
      )
      .map((binding) => ({
        workflowKey: binding.workflowKey,
        action: binding.action,
        status: "triggered" as const,
      }));
  }
}