import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KernelPluginManifest,
  KernelPluginRecord
} from "../enterprise-kernel-mega-pack-6.types";
import { KernelPluginAuditService } from "../observability/kernel-plugin-audit.service";

@Injectable()
export class KernelPluginRegistryService {
  private readonly plugins = new Map<string, KernelPluginRecord>();

  constructor(
    private readonly audit: KernelPluginAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.plugins.values());
  }

  get(id: string) {
    const plugin = this.plugins.get(id);

    if (!plugin) {
      throw new NotFoundException(`Kernel plugin not found: ${id}`);
    }

    return plugin;
  }

  register(
    manifest: KernelPluginManifest,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.plugins.has(manifest.id)) {
      throw new ConflictException(`Kernel plugin already exists: ${manifest.id}`);
    }

    if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
      throw new ConflictException(`Invalid kernel plugin version: ${manifest.version}`);
    }

    const now = new Date().toISOString();

    const record: KernelPluginRecord = {
      id: manifest.id,
      manifest: {
        ...manifest,
        dependencies: Array.from(new Set(manifest.dependencies)),
        optionalDependencies: Array.from(new Set(manifest.optionalDependencies)),
        permissions: Array.from(new Set(manifest.permissions)),
        capabilities: Array.from(new Set(manifest.capabilities)),
        extensionPoints: Array.from(new Set(manifest.extensionPoints))
      },
      status: "registered",
      metadata: {},
      createdAt: now,
      updatedAt: now
    };

    this.plugins.set(record.id, record);

    this.audit.record({
      correlationId: context.correlationId,
      category: "plugin",
      action: "kernel-plugin-registered",
      subjectId: record.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        version: record.manifest.version,
        trustLevel: record.manifest.trustLevel
      }
    });

    return record;
  }

  save(record: KernelPluginRecord) {
    this.plugins.set(record.id, record);
    return record;
  }

  remove(id: string) {
    const current = this.get(id);
    this.plugins.delete(id);
    return current;
  }

  summary() {
    const plugins = this.list();

    return {
      total: plugins.length,
      registered: plugins.filter((x) => x.status === "registered").length,
      validated: plugins.filter((x) => x.status === "validated").length,
      installed: plugins.filter((x) => x.status === "installed").length,
      enabled: plugins.filter((x) => x.status === "enabled").length,
      disabled: plugins.filter((x) => x.status === "disabled").length,
      failed: plugins.filter((x) => x.status === "failed").length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const record: KernelPluginRecord = {
      id: "kernel-plugin:official-sample",
      manifest: {
        id: "kernel-plugin:official-sample",
        name: "AVOS Official Sample Plugin",
        description: "Official trusted kernel extension sample.",
        version: "1.0.0",
        publisher: "AVOS",
        entryModule: "AvosOfficialSamplePluginModule",
        kernelVersionRange: "^1.0.0",
        dependencies: [],
        optionalDependencies: [],
        permissions: [
          "kernel.service.discover",
          "kernel.extension.bind"
        ],
        capabilities: [
          "kernel.plugin.sample"
        ],
        extensionPoints: [
          "kernel-extension:runtime-hook"
        ],
        trustLevel: "trusted",
        sandboxRequired: true,
        autoEnable: false,
        removable: true,
        metadata: {
          seeded: true
        }
      },
      status: "registered",
      metadata: {
        seeded: true
      },
      createdAt: now,
      updatedAt: now
    };

    this.plugins.set(record.id, record);
  }
}
