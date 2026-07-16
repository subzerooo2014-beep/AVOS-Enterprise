import { Injectable, NotFoundException } from "@nestjs/common";
import type { WorkflowDefinition } from "./enterprise-workflow.types";

@Injectable()
export class WorkflowDefinitionRegistryService {
  private readonly definitions = new Map<string, WorkflowDefinition>();

  register(
    input: Omit<WorkflowDefinition, "createdAt" | "updatedAt">,
  ): WorkflowDefinition {
    const now = new Date().toISOString();
    const key = `${input.id}@${input.version}`;
    const existing = this.definitions.get(key);

    const definition: WorkflowDefinition = {
      ...input,
      steps: input.steps
        .map((step) => ({ ...step }))
        .sort((a, b) => a.order - b.order),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.definitions.set(key, definition);
    return this.clone(definition);
  }

  get(id: string, version?: string): WorkflowDefinition {
    if (version) {
      const definition = this.definitions.get(`${id}@${version}`);
      if (!definition) {
        throw new NotFoundException(`Workflow '${id}@${version}' was not found.`);
      }
      return this.clone(definition);
    }

    const matches = this.list().filter((item) => item.id === id);
    if (matches.length === 0) {
      throw new NotFoundException(`Workflow '${id}' was not found.`);
    }

    return matches.sort((a, b) => b.version.localeCompare(a.version))[0];
  }

  list(): WorkflowDefinition[] {
    return Array.from(this.definitions.values())
      .map((item) => this.clone(item))
      .sort((a, b) => `${a.id}@${a.version}`.localeCompare(`${b.id}@${b.version}`));
  }

  count(): number {
    return this.definitions.size;
  }

  private clone(item: WorkflowDefinition): WorkflowDefinition {
    return {
      ...item,
      steps: item.steps.map((step) => ({ ...step })),
    };
  }
}
