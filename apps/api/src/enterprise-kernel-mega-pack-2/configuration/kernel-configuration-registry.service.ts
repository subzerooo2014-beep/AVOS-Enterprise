import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KernelConfigurationEntry
} from "../enterprise-kernel-mega-pack-2.types";
import { KernelEnvironmentProfileService } from "../profiles/kernel-environment-profile.service";
import { KernelConfigurationVersionService } from "../versions/kernel-configuration-version.service";
import { KernelDependencyConfigurationAuditService } from "../observability/kernel-dependency-configuration-audit.service";

@Injectable()
export class KernelConfigurationRegistryService {
  private readonly entries =
    new Map<string, KernelConfigurationEntry>();

  constructor(
    private readonly profiles: KernelEnvironmentProfileService,
    private readonly versions: KernelConfigurationVersionService,
    private readonly audit: KernelDependencyConfigurationAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.entries.values());
  }

  get(id: string) {
    const entry = this.entries.get(id);

    if (!entry) {
      throw new NotFoundException(
        `Kernel configuration entry not found: ${id}`
      );
    }

    return entry;
  }

  getByKey(
    key: string,
    profileId?: string
  ) {
    const matches = this.list().filter(
      (entry) =>
        entry.key === key &&
        (!profileId ||
          entry.profileId === profileId)
    );

    return matches;
  }

  register(
    input: Omit<
      KernelConfigurationEntry,
      "version" | "createdAt" | "updatedAt"
    >,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    this.profiles.get(input.profileId);

    const duplicate = this.list().find(
      (entry) =>
        entry.key === input.key &&
        entry.profileId ===
          input.profileId &&
        entry.environment ===
          input.environment
    );

    if (duplicate) {
      throw new ConflictException(
        `Kernel configuration key already exists in profile: ${input.key}`
      );
    }

    const now = new Date().toISOString();

    const entry: KernelConfigurationEntry = {
      ...input,
      validationRules:
        input.validationRules.map(
          (rule) => ({ ...rule })
        ),
      version: 1,
      createdAt: now,
      updatedAt: now
    };

    this.entries.set(entry.id, entry);

    this.audit.record({
      correlationId: context.correlationId,
      category: "configuration",
      action: "kernel-configuration-registered",
      subjectId: entry.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        key: entry.key,
        environment:
          entry.environment,
        profileId: entry.profileId
      }
    });

    return entry;
  }

  updateValue(
    id: string,
    input: {
      value: unknown;
      actorIdentityId: string;
      correlationId: string;
      reason: string;
    }
  ) {
    const current = this.get(id);

    if (!current.mutableAtRuntime) {
      throw new ConflictException(
        `Kernel configuration entry is not mutable at runtime: ${current.key}`
      );
    }

    const nextVersion =
      current.version + 1;

    this.versions.record({
      entryId: current.id,
      version: nextVersion,
      previousValue: current.value,
      nextValue: input.value,
      changedByIdentityId:
        input.actorIdentityId,
      correlationId:
        input.correlationId,
      reason: input.reason
    });

    const updated: KernelConfigurationEntry = {
      ...current,
      value: input.value,
      version: nextVersion,
      updatedAt: new Date().toISOString()
    };

    this.entries.set(id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "configuration",
      action: "kernel-configuration-value-updated",
      subjectId: id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        key: updated.key,
        version: updated.version
      }
    });

    return updated;
  }

  restoreValue(
    id: string,
    value: unknown,
    actor: {
      actorIdentityId: string;
      correlationId: string;
      reason: string;
    }
  ) {
    const current = this.get(id);

    const restored: KernelConfigurationEntry = {
      ...current,
      value,
      version: current.version + 1,
      updatedAt: new Date().toISOString()
    };

    this.entries.set(id, restored);

    this.audit.record({
      correlationId: actor.correlationId,
      category: "configuration",
      action: "kernel-configuration-restored",
      subjectId: id,
      actorIdentityId: actor.actorIdentityId,
      outcome: "success",
      metadata: {
        key: restored.key,
        version: restored.version,
        reason: actor.reason
      }
    });

    return restored;
  }

  resolveProfile(profileId: string) {
    const profile =
      this.profiles.resolve(profileId);

    const entries = this.list().filter(
      (entry) =>
        profile.chain.includes(
          entry.profileId
        ) &&
        entry.status === "active"
    );

    const resolved = new Map<
      string,
      KernelConfigurationEntry
    >();

    for (const profileIdInChain of profile.chain) {
      for (const entry of entries.filter(
        (item) =>
          item.profileId ===
          profileIdInChain
      )) {
        resolved.set(entry.key, entry);
      }
    }

    return {
      profile,
      entries: Array.from(
        resolved.values()
      ),
      values: Object.fromEntries(
        Array.from(
          resolved.values()
        ).map((entry) => [
          entry.key,
          entry.secret
            ? {
                secretReference:
                  entry.value
              }
            : entry.value
        ])
      )
    };
  }

  summary() {
    const entries = this.list();

    return {
      total: entries.length,
      active: entries.filter(
        (entry) =>
          entry.status === "active"
      ).length,
      required: entries.filter(
        (entry) => entry.required
      ).length,
      mutableAtRuntime: entries.filter(
        (entry) =>
          entry.mutableAtRuntime
      ).length,
      secrets: entries.filter(
        (entry) => entry.secret
      ).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const entries: KernelConfigurationEntry[] = [
      {
        id: "kernel-config:runtime-mode:base",
        key: "kernel.runtime.mode",
        valueType: "string",
        value: "standard",
        defaultValue: "standard",
        environment: "base",
        profileId: "kernel-profile:base",
        required: true,
        mutableAtRuntime: false,
        secret: false,
        status: "active",
        validationRules: [
          {
            type: "one-of",
            value: [
              "standard",
              "safe",
              "degraded"
            ],
            message:
              "Kernel runtime mode is invalid."
          }
        ],
        metadata: {
          seeded: true
        },
        version: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-config:runtime-region:base",
        key: "kernel.runtime.region",
        valueType: "string",
        value: "uae",
        defaultValue: "uae",
        environment: "base",
        profileId: "kernel-profile:base",
        required: true,
        mutableAtRuntime: true,
        secret: false,
        status: "active",
        validationRules: [
          {
            type: "required",
            message:
              "Kernel runtime region is required."
          }
        ],
        metadata: {
          seeded: true
        },
        version: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-config:auto-activate:base",
        key:
          "kernel.lifecycle.autoActivate",
        valueType: "boolean",
        value: true,
        defaultValue: true,
        environment: "base",
        profileId: "kernel-profile:base",
        required: true,
        mutableAtRuntime: true,
        secret: false,
        status: "active",
        validationRules: [],
        metadata: {
          seeded: true
        },
        version: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-config:dependency-strict:base",
        key:
          "kernel.dependency.strictMode",
        valueType: "boolean",
        value: true,
        defaultValue: true,
        environment: "base",
        profileId: "kernel-profile:base",
        required: true,
        mutableAtRuntime: true,
        secret: false,
        status: "active",
        validationRules: [],
        metadata: {
          seeded: true
        },
        version: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-config:logging:development",
        key: "kernel.logging.level",
        valueType: "string",
        value: "debug",
        defaultValue: "info",
        environment: "development",
        profileId:
          "kernel-profile:development",
        required: true,
        mutableAtRuntime: true,
        secret: false,
        status: "active",
        validationRules: [
          {
            type: "one-of",
            value: [
              "trace",
              "debug",
              "info",
              "warn",
              "error"
            ],
            message:
              "Kernel logging level is invalid."
          }
        ],
        metadata: {
          seeded: true
        },
        version: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-config:validation:development",
        key:
          "kernel.validation.strict",
        valueType: "boolean",
        value: false,
        defaultValue: false,
        environment: "development",
        profileId:
          "kernel-profile:development",
        required: true,
        mutableAtRuntime: true,
        secret: false,
        status: "active",
        validationRules: [],
        metadata: {
          seeded: true
        },
        version: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-config:logging:production",
        key: "kernel.logging.level",
        valueType: "string",
        value: "info",
        defaultValue: "info",
        environment: "production",
        profileId:
          "kernel-profile:production",
        required: true,
        mutableAtRuntime: true,
        secret: false,
        status: "active",
        validationRules: [
          {
            type: "one-of",
            value: [
              "info",
              "warn",
              "error"
            ],
            message:
              "Production logging level is invalid."
          }
        ],
        metadata: {
          seeded: true
        },
        version: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-config:validation:production",
        key:
          "kernel.validation.strict",
        valueType: "boolean",
        value: true,
        defaultValue: true,
        environment: "production",
        profileId:
          "kernel-profile:production",
        required: true,
        mutableAtRuntime: false,
        secret: false,
        status: "active",
        validationRules: [],
        metadata: {
          seeded: true
        },
        version: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-config:secrets-provider:production",
        key:
          "kernel.security.secretsProvider",
        valueType:
          "secret-reference",
        value:
          "secret://kernel/secrets-provider",
        environment: "production",
        profileId:
          "kernel-profile:production",
        required: true,
        mutableAtRuntime: false,
        secret: true,
        status: "active",
        validationRules: [
          {
            type: "pattern",
            value: "^secret://",
            message:
              "Kernel secret reference must use the secret:// scheme."
          }
        ],
        metadata: {
          seeded: true
        },
        version: 1,
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const entry of entries) {
      this.entries.set(entry.id, entry);
    }
  }
}
