import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KernelEnvironmentProfile
} from "../enterprise-kernel-mega-pack-2.types";
import { KernelDependencyConfigurationAuditService } from "../observability/kernel-dependency-configuration-audit.service";

@Injectable()
export class KernelEnvironmentProfileService {
  private readonly profiles =
    new Map<string, KernelEnvironmentProfile>();

  constructor(
    private readonly audit: KernelDependencyConfigurationAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.profiles.values());
  }

  get(id: string) {
    const profile = this.profiles.get(id);

    if (!profile) {
      throw new NotFoundException(
        `Kernel environment profile not found: ${id}`
      );
    }

    return profile;
  }

  register(
    input: Omit<
      KernelEnvironmentProfile,
      "createdAt" | "updatedAt"
    >,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.profiles.has(input.id)) {
      throw new ConflictException(
        `Kernel environment profile already exists: ${input.id}`
      );
    }

    if (input.parentProfileId) {
      this.get(input.parentProfileId);
    }

    const now = new Date().toISOString();

    const profile: KernelEnvironmentProfile = {
      ...input,
      configurationKeys:
        Array.from(
          new Set(input.configurationKeys)
        ),
      createdAt: now,
      updatedAt: now
    };

    this.profiles.set(profile.id, profile);

    this.audit.record({
      correlationId: context.correlationId,
      category: "profile",
      action: "kernel-environment-profile-registered",
      subjectId: profile.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        environment: profile.environment,
        parentProfileId:
          profile.parentProfileId
      }
    });

    return profile;
  }

  update(
    id: string,
    patch: {
      description?: string;
      configurationKeys?: string[];
      locked?: boolean;
      active?: boolean;
      metadata?: Record<string, unknown>;
    },
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    if (current.locked) {
      throw new ConflictException(
        `Kernel environment profile is locked: ${id}`
      );
    }

    const updated: KernelEnvironmentProfile = {
      ...current,
      ...patch,
      configurationKeys:
        patch.configurationKeys === undefined
          ? current.configurationKeys
          : Array.from(
              new Set(
                patch.configurationKeys
              )
            ),
      metadata: {
        ...current.metadata,
        ...(patch.metadata ?? {})
      },
      updatedAt: new Date().toISOString()
    };

    this.profiles.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "profile",
      action: "kernel-environment-profile-updated",
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: updated.active
        ? "success"
        : "warning",
      metadata: {
        locked: updated.locked,
        active: updated.active
      }
    });

    return updated;
  }

  resolve(id: string) {
    const chain: KernelEnvironmentProfile[] = [];
    const visited = new Set<string>();

    let current:
      | KernelEnvironmentProfile
      | undefined = this.get(id);

    while (current) {
      if (visited.has(current.id)) {
        throw new ConflictException(
          `Kernel environment profile inheritance cycle detected: ${current.id}`
        );
      }

      visited.add(current.id);
      chain.unshift(current);

      current = current.parentProfileId
        ? this.get(current.parentProfileId)
        : undefined;
    }

    return {
      profileId: id,
      chain: chain.map(
        (profile) => profile.id
      ),
      configurationKeys:
        Array.from(
          new Set(
            chain.flatMap(
              (profile) =>
                profile.configurationKeys
            )
          )
        ),
      locked:
        chain.some(
          (profile) => profile.locked
        )
    };
  }

  summary() {
    const profiles = this.list();

    return {
      total: profiles.length,
      active: profiles.filter(
        (profile) => profile.active
      ).length,
      locked: profiles.filter(
        (profile) => profile.locked
      ).length,
      environments: new Set(
        profiles.map(
          (profile) =>
            profile.environment
        )
      ).size
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const profiles: KernelEnvironmentProfile[] = [
      {
        id: "kernel-profile:base",
        name: "Kernel Base Profile",
        environment: "base",
        description:
          "Base kernel configuration inherited by all environments.",
        configurationKeys: [
          "kernel.runtime.mode",
          "kernel.runtime.region",
          "kernel.lifecycle.autoActivate",
          "kernel.dependency.strictMode"
        ],
        locked: true,
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-profile:development",
        name:
          "Kernel Development Profile",
        environment: "development",
        description:
          "Development kernel configuration.",
        parentProfileId:
          "kernel-profile:base",
        configurationKeys: [
          "kernel.logging.level",
          "kernel.validation.strict"
        ],
        locked: false,
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-profile:production",
        name:
          "Kernel Production Profile",
        environment: "production",
        description:
          "Production kernel configuration.",
        parentProfileId:
          "kernel-profile:base",
        configurationKeys: [
          "kernel.logging.level",
          "kernel.validation.strict",
          "kernel.security.secretsProvider"
        ],
        locked: false,
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const profile of profiles) {
      this.profiles.set(profile.id, profile);
    }
  }
}
