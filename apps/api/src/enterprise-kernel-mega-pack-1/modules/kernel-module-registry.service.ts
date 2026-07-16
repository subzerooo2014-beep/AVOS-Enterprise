import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KernelModuleManifest,
  KernelModuleRecord
} from "../enterprise-kernel-mega-pack-1.types";
import { KernelAuditService } from "../observability/kernel-audit.service";

@Injectable()
export class KernelModuleRegistryService {
  private readonly modules =
    new Map<string, KernelModuleRecord>();

  constructor(
    private readonly audit: KernelAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.modules.values());
  }

  get(id: string) {
    const module = this.modules.get(id);

    if (!module) {
      throw new NotFoundException(
        `Kernel module not found: ${id}`
      );
    }

    return module;
  }

  register(
    manifest: KernelModuleManifest,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.modules.has(manifest.id)) {
      throw new ConflictException(
        `Kernel module is already registered: ${manifest.id}`
      );
    }

    if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
      throw new ConflictException(
        `Kernel module version is invalid: ${manifest.version}`
      );
    }

    const record: KernelModuleRecord = {
      id: manifest.id,
      manifest: {
        ...manifest,
        capabilityIds: Array.from(
          new Set(manifest.capabilityIds)
        ),
        dependencies: Array.from(
          new Set(manifest.dependencies)
        ),
        optionalDependencies: Array.from(
          new Set(manifest.optionalDependencies)
        ),
        lifecycleHooks: Array.from(
          new Set(manifest.lifecycleHooks)
        )
      },
      stage: "registered",
      lastTransitionAt: new Date().toISOString(),
      transitionCount: 0,
      metadata: {}
    };

    this.modules.set(record.id, record);

    this.audit.record({
      correlationId: context.correlationId,
      category: "module",
      action: "kernel-module-registered",
      subjectId: record.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        version: record.manifest.version,
        criticality: record.manifest.criticality
      }
    });

    return record;
  }

  save(record: KernelModuleRecord) {
    this.modules.set(record.id, record);
    return record;
  }

  remove(id: string) {
    const current = this.get(id);
    this.modules.delete(id);
    return current;
  }

  byStage(stage: KernelModuleRecord["stage"]) {
    return this.list().filter(
      (module) => module.stage === stage
    );
  }

  required() {
    return this.list().filter(
      (module) =>
        module.manifest.criticality === "critical" ||
        module.manifest.criticality === "important"
    );
  }

  summary() {
    const modules = this.list();

    return {
      total: modules.length,
      registered: modules.filter(
        (module) => module.stage === "registered"
      ).length,
      installed: modules.filter(
        (module) => module.stage === "installed"
      ).length,
      initialized: modules.filter(
        (module) => module.stage === "initialized"
      ).length,
      active: modules.filter(
        (module) => module.stage === "active"
      ).length,
      suspended: modules.filter(
        (module) => module.stage === "suspended"
      ).length,
      failed: modules.filter(
        (module) => module.stage === "failed"
      ).length,
      critical: modules.filter(
        (module) =>
          module.manifest.criticality === "critical"
      ).length
    };
  }

  private seed() {
    const manifests: KernelModuleManifest[] = [
      {
        id: "kernel-module:runtime",
        name: "Kernel Runtime",
        description:
          "Core runtime, state, context, startup, and shutdown services.",
        version: "1.0.0",
        providerModule: "EnterpriseKernelMegaPack1Module",
        capabilityIds: [
          "kernel.runtime",
          "kernel.state",
          "kernel.context"
        ],
        criticality: "critical",
        dependencies: [],
        optionalDependencies: [],
        lifecycleHooks: [
          "install",
          "initialize",
          "activate",
          "deactivate"
        ],
        autoActivate: true,
        removable: false,
        metadata: {
          seeded: true
        }
      },
      {
        id: "kernel-module:lifecycle",
        name: "Kernel Lifecycle",
        description:
          "Module lifecycle state machine and transition services.",
        version: "1.0.0",
        providerModule: "EnterpriseKernelMegaPack1Module",
        capabilityIds: [
          "kernel.module-registry",
          "kernel.lifecycle"
        ],
        criticality: "critical",
        dependencies: ["kernel-module:runtime"],
        optionalDependencies: [],
        lifecycleHooks: [
          "install",
          "initialize",
          "activate",
          "suspend",
          "resume",
          "deactivate"
        ],
        autoActivate: true,
        removable: false,
        metadata: {
          seeded: true
        }
      }
    ];

    for (const manifest of manifests) {
      const record: KernelModuleRecord = {
        id: manifest.id,
        manifest,
        stage: "registered",
        lastTransitionAt: new Date().toISOString(),
        transitionCount: 0,
        metadata: {
          seeded: true
        }
      };

      this.modules.set(record.id, record);
    }
  }
}
