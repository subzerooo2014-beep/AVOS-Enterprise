import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import {
  CAPABILITY_ORCHESTRATION_POLICY,
} from "./capability-orchestration.registry";
import { CapabilityCompositionGraphService } from "./capability-composition-graph.service";
import {
  CapabilityOrchestrationDefinition,
  CapabilityOrchestrationNode,
} from "./capability-orchestration.types";

@Injectable()
export class CapabilityOrchestrationRegistryService {
  private readonly definitions = new Map<
    string,
    CapabilityOrchestrationDefinition
  >();

  constructor(
    private readonly capabilityRegistry: CapabilityRegistryService,
    private readonly graph: CapabilityCompositionGraphService,
  ) {}

  register(input: {
    key: string;
    name: string;
    version?: string;
    description: string;
    owner: string;
    nodes: CapabilityOrchestrationNode[];
    tags?: string[];
  }) {
    const key = input.key.trim().toLowerCase();

    if (this.definitions.has(key)) {
      return { success: false, reason: "ORCHESTRATION_ALREADY_EXISTS" };
    }

    if (input.nodes.length === 0) {
      return { success: false, reason: "ORCHESTRATION_REQUIRES_NODES" };
    }

    if (input.nodes.length > CAPABILITY_ORCHESTRATION_POLICY.maxNodesPerDefinition) {
      return { success: false, reason: "ORCHESTRATION_NODE_LIMIT_EXCEEDED" };
    }

    const missingCapabilities = input.nodes
      .filter((node) => !this.capabilityRegistry.get(node.capabilityKey))
      .map((node) => node.capabilityKey);

    if (missingCapabilities.length > 0) {
      return {
        success: false,
        reason: "ORCHESTRATION_CONTAINS_UNREGISTERED_CAPABILITIES",
        missingCapabilities: [...new Set(missingCapabilities)],
      };
    }

    const now = new Date().toISOString();
    const definition: CapabilityOrchestrationDefinition = {
      id: randomUUID(),
      key,
      name: input.name.trim(),
      version: input.version ?? "1.0.0",
      description: input.description.trim(),
      owner: input.owner.trim(),
      status: "DRAFT",
      nodes: structuredClone(input.nodes),
      tags: [
        ...new Set(
          (input.tags ?? [])
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean),
        ),
      ],
      createdAt: now,
      updatedAt: now,
    };

    const validation = this.graph.validate(definition);
    if (!validation.valid) {
      return {
        success: false,
        reason: "ORCHESTRATION_VALIDATION_FAILED",
        validation,
      };
    }

    definition.status = "VALIDATED";
    this.definitions.set(key, definition);

    return {
      success: true,
      definition: structuredClone(definition),
      plan: this.graph.plan(definition),
    };
  }

  activate(key: string) {
    const definition = this.require(key);
    if (definition.status !== "VALIDATED" && definition.status !== "PAUSED") {
      return {
        success: false,
        reason: "ORCHESTRATION_NOT_ACTIVATABLE",
        currentStatus: definition.status,
      };
    }

    definition.status = "ACTIVE";
    definition.updatedAt = new Date().toISOString();

    return { success: true, definition: structuredClone(definition) };
  }

  pause(key: string) {
    const definition = this.require(key);
    if (definition.status !== "ACTIVE") {
      return {
        success: false,
        reason: "ORCHESTRATION_NOT_ACTIVE",
        currentStatus: definition.status,
      };
    }

    definition.status = "PAUSED";
    definition.updatedAt = new Date().toISOString();

    return { success: true, definition: structuredClone(definition) };
  }

  get(key: string) {
    const definition = this.definitions.get(key.toLowerCase());
    return definition ? structuredClone(definition) : null;
  }

  list() {
    return [...this.definitions.values()].map((definition) =>
      structuredClone(definition),
    );
  }

  plan(key: string) {
    return this.graph.plan(this.require(key));
  }

  private require(key: string) {
    const definition = this.definitions.get(key.toLowerCase());
    if (!definition) {
      throw new Error(`Orchestration not found: ${key}`);
    }

    return definition;
  }
}