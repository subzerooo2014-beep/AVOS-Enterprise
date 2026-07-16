import { createHash } from "crypto";
import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  FoundationManifest
} from "../foundation-pack-20.types";
import { FoundationPackRegistryService } from "../registry/foundation-pack-registry.service";
import { CrossFoundationValidationService } from "../validation/cross-foundation-validation.service";
import { FoundationFinalAuditService } from "../observability/foundation-final-audit.service";

@Injectable()
export class FoundationManifestService {
  private readonly manifests =
    new Map<string, FoundationManifest>();

  constructor(
    private readonly registry: FoundationPackRegistryService,
    private readonly validation: CrossFoundationValidationService,
    private readonly audit: FoundationFinalAuditService
  ) {}

  list() {
    return Array.from(this.manifests.values());
  }

  get(id: string) {
    const manifest = this.manifests.get(id);

    if (!manifest) {
      throw new NotFoundException(
        `Foundation manifest not found: ${id}`
      );
    }

    return manifest;
  }

  generate(input: {
    releaseVersion: string;
    generatedByIdentityId: string;
    correlationId: string;
  }) {
    const packs = this.registry.list();
    const validationReports = this.validation.list();
    const latestValidation =
      validationReports.length === 0
        ? undefined
        : validationReports[validationReports.length - 1];

    if (!latestValidation) {
      throw new Error(
        "Cross-foundation validation must run before manifest generation."
      );
    }

    const draft: Omit<FoundationManifest, "checksum"> = {
      id: `foundation-manifest:${input.releaseVersion}:${Date.now()}`,
      name: "AVOS Foundation Final Manifest",
      releaseVersion: input.releaseVersion,
      foundationVersion: "20.0.0",
      packIds: packs.map((pack) => pack.id),
      capabilities: packs.map(
        (pack) => pack.capability
      ),
      routes: packs.map((pack) => pack.route),
      modules: packs.map(
        (pack) => pack.moduleName
      ),
      principles: {
        foundationFirst: true,
        humanFinalAuthority: true,
        traceabilityByDesign: true,
        rollbackByDesign: true,
        trustByDesign: true,
        governanceByDesign: true,
        knowledgeByDesign: true,
        semanticConsistency: true,
        digitalDna: true,
        digitalGenome: true,
        continuousValidation: true
      },
      readiness: {
        score: latestValidation.score,
        ready: latestValidation.success,
        blockers:
          latestValidation.criticalFailures
      },
      generatedByIdentityId:
        input.generatedByIdentityId,
      generatedAt: new Date().toISOString()
    };

    const manifest: FoundationManifest = {
      ...draft,
      checksum: createHash("sha256")
        .update(JSON.stringify(draft))
        .digest("hex")
    };

    this.manifests.set(
      manifest.id,
      manifest
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "manifest",
      action: "foundation-manifest-generated",
      subjectId: manifest.id,
      actorIdentityId:
        input.generatedByIdentityId,
      outcome: manifest.readiness.ready
        ? "success"
        : "blocked",
      metadata: {
        releaseVersion:
          manifest.releaseVersion,
        checksum: manifest.checksum,
        ready: manifest.readiness.ready
      }
    });

    return manifest;
  }

  summary() {
    const manifests = this.list();

    return {
      total: manifests.length,
      ready: manifests.filter(
        (manifest) => manifest.readiness.ready
      ).length,
      latestReleaseVersion:
        manifests.length === 0
          ? undefined
          : manifests[manifests.length - 1]
              ?.releaseVersion
    };
  }
}
