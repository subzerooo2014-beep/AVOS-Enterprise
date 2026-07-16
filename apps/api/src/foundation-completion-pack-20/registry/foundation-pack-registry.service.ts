import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  FoundationPackDescriptor,
  FoundationPackStatus
} from "../foundation-pack-20.types";
import { FoundationFinalAuditService } from "../observability/foundation-final-audit.service";

@Injectable()
export class FoundationPackRegistryService {
  private readonly packs =
    new Map<string, FoundationPackDescriptor>();

  constructor(
    private readonly audit: FoundationFinalAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.packs.values())
      .sort((left, right) =>
        left.packNumber - right.packNumber
      );
  }

  get(id: string) {
    const pack = this.packs.get(id);

    if (!pack) {
      throw new NotFoundException(
        `Foundation pack not found: ${id}`
      );
    }

    return pack;
  }

  update(
    id: string,
    patch: {
      status?: FoundationPackStatus;
      verificationPassed?: boolean;
      buildPassed?: boolean;
      healthStatus?:
        | "healthy"
        | "degraded"
        | "critical"
        | "unknown";
      metadata?: Record<string, unknown>;
    },
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    const updated: FoundationPackDescriptor = {
      ...current,
      ...patch,
      metadata: {
        ...current.metadata,
        ...(patch.metadata ?? {})
      },
      updatedAt: new Date().toISOString()
    };

    this.packs.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "registry",
      action: "foundation-pack-updated",
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome:
        updated.status === "failed"
          ? "failure"
          : updated.status === "degraded"
            ? "warning"
            : "success",
      metadata: {
        status: updated.status,
        verificationPassed:
          updated.verificationPassed,
        buildPassed: updated.buildPassed
      }
    });

    return updated;
  }

  required() {
    return this.list().filter(
      (pack) => pack.required
    );
  }

  summary() {
    const packs = this.list();

    return {
      total: packs.length,
      required: packs.filter(
        (pack) => pack.required
      ).length,
      verified: packs.filter(
        (pack) => pack.verificationPassed
      ).length,
      buildPassed: packs.filter(
        (pack) => pack.buildPassed
      ).length,
      healthy: packs.filter(
        (pack) => pack.healthStatus === "healthy"
      ).length,
      failed: packs.filter(
        (pack) => pack.status === "failed"
      ).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const definitions: Array<{
      packNumber: number;
      name: string;
      capability: string;
      version: string;
      route: string;
      moduleName: string;
      dependencies: string[];
    }> = [
      { packNumber: 1, name: "Foundation Control Plane", capability: "Foundation Control Plane", version: "1.0.0", route: "/foundation-control-plane", moduleName: "FoundationControlPlaneModule", dependencies: [] },
      { packNumber: 2, name: "Foundation Completion Pack 2", capability: "Foundation Completion Core 2", version: "2.0.0", route: "/foundation-completion-v2", moduleName: "FoundationCompletionPack2Module", dependencies: ["foundation-pack:1"] },
      { packNumber: 3, name: "Foundation Completion Pack 3", capability: "Foundation Completion Core 3", version: "3.0.0", route: "/foundation-completion-v3", moduleName: "FoundationCompletionPack3Module", dependencies: ["foundation-pack:2"] },
      { packNumber: 4, name: "Foundation Completion Pack 4", capability: "Foundation Completion Core 4", version: "4.0.0", route: "/foundation-completion-v4", moduleName: "FoundationCompletionPack4Module", dependencies: ["foundation-pack:3"] },
      { packNumber: 5, name: "Foundation Completion Pack 5", capability: "Foundation Completion Core 5", version: "5.0.0", route: "/foundation-completion-v5", moduleName: "FoundationCompletionPack5Module", dependencies: ["foundation-pack:4"] },
      { packNumber: 6, name: "Enterprise Nervous System", capability: "Enterprise Nervous System & Autonomous Orchestration Core", version: "6.0.0", route: "/foundation-completion-v6", moduleName: "FoundationCompletionPack6Module", dependencies: ["foundation-pack:5"] },
      { packNumber: 7, name: "Trust Framework", capability: "Trust Framework Core", version: "7.0.0", route: "/foundation-completion-v7", moduleName: "FoundationCompletionPack7Module", dependencies: ["foundation-pack:6"] },
      { packNumber: 8, name: "Governance OS", capability: "Governance OS & Policy Core", version: "8.0.0", route: "/foundation-completion-v8", moduleName: "FoundationCompletionPack8Module", dependencies: ["foundation-pack:7"] },
      { packNumber: 9, name: "Identity Metadata Dependency Graph", capability: "Digital Identity, Metadata & Dependency Graph Core", version: "9.0.0", route: "/foundation-completion-v9", moduleName: "FoundationCompletionPack9Module", dependencies: ["foundation-pack:8"] },
      { packNumber: 10, name: "Architecture Intelligence", capability: "Architecture Intelligence & Living Blueprint Core", version: "10.0.0", route: "/foundation-completion-v10", moduleName: "FoundationCompletionPack10Module", dependencies: ["foundation-pack:9"] },
      { packNumber: 11, name: "Architecture Evolution", capability: "Architecture Evolution & Controlled Change Core", version: "11.0.0", route: "/foundation-completion-v11", moduleName: "FoundationCompletionPack11Module", dependencies: ["foundation-pack:10"] },
      { packNumber: 12, name: "Enterprise Memory", capability: "Enterprise Memory Architecture & Knowledge Continuity Core", version: "12.0.0", route: "/foundation-completion-v12", moduleName: "FoundationCompletionPack12Module", dependencies: ["foundation-pack:11"] },
      { packNumber: 13, name: "Enterprise Knowledge Graph", capability: "Enterprise Knowledge Graph & Semantic Intelligence Core", version: "13.0.0", route: "/foundation-completion-v13", moduleName: "FoundationCompletionPack13Module", dependencies: ["foundation-pack:12"] },
      { packNumber: 14, name: "Metadata Intelligence", capability: "Enterprise Metadata Intelligence & Unified Catalog Core", version: "14.0.0", route: "/foundation-completion-v14", moduleName: "FoundationCompletionPack14Module", dependencies: ["foundation-pack:13"] },
      { packNumber: 15, name: "Digital DNA", capability: "AVOS Digital DNA Framework Core", version: "15.0.0", route: "/foundation-completion-v15", moduleName: "FoundationCompletionPack15Module", dependencies: ["foundation-pack:14"] },
      { packNumber: 16, name: "Digital Genome", capability: "Enterprise Digital Genome Core", version: "16.0.0", route: "/foundation-completion-v16", moduleName: "FoundationCompletionPack16Module", dependencies: ["foundation-pack:15"] },
      { packNumber: 17, name: "Foundation SDK", capability: "Foundation SDK & Unified Foundation APIs Core", version: "17.0.0", route: "/foundation-completion-v17", moduleName: "FoundationCompletionPack17Module", dependencies: ["foundation-pack:16"] },
      { packNumber: 18, name: "Foundation Self-Validation", capability: "Foundation Self-Validation, Health & Readiness Core", version: "18.0.0", route: "/foundation-completion-v18", moduleName: "FoundationCompletionPack18Module", dependencies: ["foundation-pack:17"] },
      { packNumber: 19, name: "Enterprise Ontology", capability: "Enterprise Ontology & Semantic Standards Core", version: "19.0.0", route: "/foundation-completion-v19", moduleName: "FoundationCompletionPack19Module", dependencies: ["foundation-pack:18"] },
      { packNumber: 20, name: "Foundation Final Certification", capability: "Foundation Final Certification & Cross-Foundation Validation", version: "20.0.0", route: "/foundation-completion-v20", moduleName: "FoundationCompletionPack20Module", dependencies: ["foundation-pack:19"] }
    ];

    for (const definition of definitions) {
      const id = `foundation-pack:${definition.packNumber}`;

      this.packs.set(id, {
        id,
        packNumber: definition.packNumber,
        name: definition.name,
        capability: definition.capability,
        version: definition.version,
        route: definition.route,
        moduleName: definition.moduleName,
        required: true,
        dependencies: definition.dependencies,
        status: "verified",
        verificationPassed: true,
        buildPassed: true,
        healthStatus: "healthy",
        metadata: {
          foundationFirst: true
        },
        updatedAt: now
      });
    }
  }
}
