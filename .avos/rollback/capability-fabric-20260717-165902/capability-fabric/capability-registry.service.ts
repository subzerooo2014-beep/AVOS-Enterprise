import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  CAPABILITY_ALLOWED_STATUS_TRANSITIONS,
  CAPABILITY_FABRIC_PILLARS,
  CAPABILITY_FABRIC_VERSION,
  CAPABILITY_LIFECYCLE_ORDER,
} from "./capability-fabric.registry";
import {
  CapabilityDigitalDNA,
  CapabilityLifecycleStage,
  CapabilityOperationalStatus,
  CapabilityRegistrationInput,
  CapabilityRegistrySnapshot,
} from "./capability-fabric.types";
import { CapabilityDependencyGraphService } from "./capability-dependency-graph.service";
import { CapabilityFoundationValidatorService } from "./capability-foundation-validator.service";

@Injectable()
export class CapabilityRegistryService {
  private readonly capabilities = new Map<string, CapabilityDigitalDNA>();

  constructor(
    private readonly validator: CapabilityFoundationValidatorService,
    private readonly graph: CapabilityDependencyGraphService,
  ) {}

  framework() {
    return {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-1 Capability Foundation",
      version: CAPABILITY_FABRIC_VERSION,
      architecturalPrinciple: "Foundation First",
      status: "OPERATIONAL",
      capabilityPillars: [...CAPABILITY_FABRIC_PILLARS],
      lifecycle: [...CAPABILITY_LIFECYCLE_ORDER],
      registeredCapabilities: this.capabilities.size,
    };
  }

  register(input: CapabilityRegistrationInput) {
    const inputValidation = this.validator.validateInput(input);
    if (!inputValidation.valid) {
      return {
        success: false,
        reason: "CAPABILITY_INPUT_VALIDATION_FAILED",
        validation: inputValidation,
      };
    }

    const key = input.key.trim().toLowerCase();
    if (this.capabilities.has(key)) {
      return {
        success: false,
        reason: "CAPABILITY_KEY_ALREADY_REGISTERED",
        capabilityKey: key,
      };
    }

    const now = new Date().toISOString();
    const version = input.version ?? "1.0.0";

    const dna: CapabilityDigitalDNA = {
      identity: {
        id: randomUUID(),
        key,
        name: input.name.trim(),
        namespace: input.namespace?.trim() || "avos",
        kind: input.kind,
        owner: input.owner.trim(),
        organization: input.organization?.trim() || "AVOS Enterprise",
      },
      purpose: {
        summary: input.summary.trim(),
        businessValue: input.businessValue.trim(),
        outcomes: [...(input.outcomes ?? [])],
        nonGoals: [...(input.nonGoals ?? [])],
      },
      version,
      lifecycleStage: input.lifecycleStage ?? "CONCEPT",
      operationalStatus: "REGISTERED",
      visibility: input.visibility ?? "INTERNAL",
      criticality: input.criticality ?? "MEDIUM",
      tags: this.normalize(input.tags ?? []),
      categories: this.normalize(input.categories ?? []),
      contracts: structuredClone(input.contracts ?? []),
      dependencies: structuredClone(input.dependencies ?? []),
      policies: structuredClone(input.policies ?? []),
      permissions: structuredClone(input.permissions ?? []),
      events: structuredClone(input.events ?? []),
      metrics: structuredClone(input.metrics ?? []),
      health: {
        healthEndpoint: input.health?.healthEndpoint,
        readinessEndpoint: input.health?.readinessEndpoint,
        livenessEndpoint: input.health?.livenessEndpoint,
        expectedStatus: "HEALTHY",
        checkIntervalSeconds: input.health?.checkIntervalSeconds ?? 60,
        timeoutSeconds: input.health?.timeoutSeconds ?? 10,
      },
      runtime: {
        runtime: input.runtime?.runtime ?? "AGNOSTIC",
        entrypoint: input.runtime?.entrypoint,
        moduleRef: input.runtime?.moduleRef,
        serviceRef: input.runtime?.serviceRef,
        controllerRef: input.runtime?.controllerRef,
        stateless: input.runtime?.stateless ?? true,
        multiTenant: input.runtime?.multiTenant ?? true,
        supportsIsolation: input.runtime?.supportsIsolation ?? true,
      },
      security: {
        classification: input.security?.classification ?? "INTERNAL",
        authenticationRequired:
          input.security?.authenticationRequired ?? true,
        authorizationRequired:
          input.security?.authorizationRequired ?? true,
        dataSensitivity: [...(input.security?.dataSensitivity ?? [])],
        trustBoundary:
          input.security?.trustBoundary ?? "AVOS_ENTERPRISE_PLATFORM",
      },
      configurationSchemaRef: input.configurationSchemaRef,
      documentationRef: input.documentationRef,
      sourceRef: input.sourceRef,
      versionHistory: [
        {
          version,
          releasedAt: now,
          changeType: "MAJOR",
          changes: ["Initial capability registration"],
          compatibleWith: [],
        },
      ],
      evolutionHistory: [],
      createdAt: now,
      updatedAt: now,
    };

    const dnaValidation = this.validator.validateDNA(dna);
    if (!dnaValidation.valid) {
      return {
        success: false,
        reason: "CAPABILITY_DNA_VALIDATION_FAILED",
        validation: dnaValidation,
      };
    }

    this.capabilities.set(key, dna);
    return {
      success: true,
      capability: this.clone(dna),
      validation: dnaValidation,
    };
  }

  list(filters?: {
    kind?: string;
    lifecycleStage?: string;
    status?: string;
    tag?: string;
  }) {
    let values = [...this.capabilities.values()];

    if (filters?.kind) {
      values = values.filter(
        (capability) => capability.identity.kind === filters.kind,
      );
    }
    if (filters?.lifecycleStage) {
      values = values.filter(
        (capability) =>
          capability.lifecycleStage === filters.lifecycleStage,
      );
    }
    if (filters?.status) {
      values = values.filter(
        (capability) => capability.operationalStatus === filters.status,
      );
    }
    if (filters?.tag) {
      values = values.filter((capability) =>
        capability.tags.includes(filters.tag!.toLowerCase()),
      );
    }

    return values.map((capability) => this.clone(capability));
  }

  get(key: string) {
    const capability = this.capabilities.get(key.toLowerCase());
    return capability ? this.clone(capability) : null;
  }

  transitionStatus(key: string, target: CapabilityOperationalStatus) {
    const capability = this.require(key);
    const allowed =
      CAPABILITY_ALLOWED_STATUS_TRANSITIONS[capability.operationalStatus];

    if (!allowed.includes(target)) {
      return {
        success: false,
        reason: "INVALID_STATUS_TRANSITION",
        current: capability.operationalStatus,
        target,
        allowed,
      };
    }

    if (target === "ARCHIVED") {
      const archive = this.graph.canArchive(
        capability.identity.key,
        [...this.capabilities.values()],
      );
      if (!archive.allowed) {
        return {
          success: false,
          reason: "CAPABILITY_HAS_REQUIRED_DEPENDENTS",
          ...archive,
        };
      }
    }

    capability.operationalStatus = target;
    capability.updatedAt = new Date().toISOString();
    return { success: true, capability: this.clone(capability) };
  }

  evolve(
    key: string,
    target: CapabilityLifecycleStage,
    reason: string,
    approvedBy: string,
  ) {
    const capability = this.require(key);
    const currentIndex = CAPABILITY_LIFECYCLE_ORDER.indexOf(
      capability.lifecycleStage,
    );
    const targetIndex = CAPABILITY_LIFECYCLE_ORDER.indexOf(target);

    if (targetIndex < 0 || targetIndex === currentIndex) {
      return {
        success: false,
        reason: "INVALID_LIFECYCLE_TARGET",
      };
    }

    capability.evolutionHistory.push({
      id: randomUUID(),
      fromStage: capability.lifecycleStage,
      toStage: target,
      reason: reason.trim(),
      approvedBy: approvedBy.trim(),
      occurredAt: new Date().toISOString(),
    });
    capability.lifecycleStage = target;
    capability.updatedAt = new Date().toISOString();

    return { success: true, capability: this.clone(capability) };
  }

  releaseVersion(
    key: string,
    input: {
      version: string;
      changeType: "MAJOR" | "MINOR" | "PATCH";
      changes: string[];
      compatibleWith?: string[];
      migrationRef?: string;
    },
  ) {
    const capability = this.require(key);

    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(input.version)) {
      return { success: false, reason: "INVALID_SEMANTIC_VERSION" };
    }

    if (
      capability.versionHistory.some(
        (record) => record.version === input.version,
      )
    ) {
      return { success: false, reason: "VERSION_ALREADY_EXISTS" };
    }

    capability.version = input.version;
    capability.versionHistory.push({
      version: input.version,
      releasedAt: new Date().toISOString(),
      changeType: input.changeType,
      changes: [...input.changes],
      compatibleWith: [...(input.compatibleWith ?? [])],
      migrationRef: input.migrationRef,
    });
    capability.updatedAt = new Date().toISOString();

    return { success: true, capability: this.clone(capability) };
  }

  validate(key: string) {
    return this.validator.validateDNA(this.require(key));
  }

  dependencyGraph() {
    return this.graph.build([...this.capabilities.values()]);
  }

  snapshot(): CapabilityRegistrySnapshot {
    const values = [...this.capabilities.values()];
    const countBy = (selector: (item: CapabilityDigitalDNA) => string) =>
      values.reduce<Record<string, number>>((result, item) => {
        const key = selector(item);
        result[key] = (result[key] ?? 0) + 1;
        return result;
      }, {});

    return {
      total: values.length,
      active: values.filter((item) => item.operationalStatus === "ACTIVE").length,
      degraded: values.filter((item) => item.operationalStatus === "DEGRADED").length,
      suspended: values.filter((item) => item.operationalStatus === "SUSPENDED").length,
      deprecated: values.filter((item) => item.operationalStatus === "DEPRECATED").length,
      archived: values.filter((item) => item.operationalStatus === "ARCHIVED").length,
      byKind: countBy((item) => item.identity.kind),
      byLifecycleStage: countBy((item) => item.lifecycleStage),
      dependencyEdges: values.reduce(
        (total, item) => total + item.dependencies.length,
        0,
      ),
      contractCount: values.reduce(
        (total, item) => total + item.contracts.length,
        0,
      ),
      eventDefinitions: values.reduce(
        (total, item) => total + item.events.length,
        0,
      ),
      metricDefinitions: values.reduce(
        (total, item) => total + item.metrics.length,
        0,
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  private require(key: string): CapabilityDigitalDNA {
    const capability = this.capabilities.get(key.toLowerCase());
    if (!capability) {
      throw new Error(`Capability not found: ${key}`);
    }
    return capability;
  }

  private normalize(values: string[]) {
    return [...new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean))];
  }

  private clone(capability: CapabilityDigitalDNA): CapabilityDigitalDNA {
    return structuredClone(capability);
  }
}