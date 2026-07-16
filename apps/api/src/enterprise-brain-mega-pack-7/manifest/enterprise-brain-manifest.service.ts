import { Injectable } from "@nestjs/common";
import { EnterpriseBrainManifest } from "../enterprise-brain-mega-pack-7.types";
import { EnterpriseBrainPackRegistryService } from "../registry/enterprise-brain-pack-registry.service";
import { EnterpriseBrainCrossValidationService } from "../validation/enterprise-brain-cross-validation.service";
import { EnterpriseBrainFinalAuditService } from "../observability/enterprise-brain-final-audit.service";

@Injectable()
export class EnterpriseBrainManifestService {
  private readonly manifests =
    new Map<string, EnterpriseBrainManifest>();

  constructor(
    private readonly packs: EnterpriseBrainPackRegistryService,
    private readonly validation: EnterpriseBrainCrossValidationService,
    private readonly audit: EnterpriseBrainFinalAuditService
  ) {}

  list() {
    return Array.from(this.manifests.values());
  }

  get(id: string) {
    const manifest = this.manifests.get(id);

    if (!manifest) {
      throw new Error(`Enterprise Brain manifest not found: ${id}`);
    }

    return manifest;
  }

  latest() {
    const items = this.list();

    return items.length === 0
      ? undefined
      : items[items.length - 1];
  }

  create(input: {
    validationReportId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const report = this.validation.get(input.validationReportId);

    const capabilities = [
      "brain.runtime",
      "brain.sessions",
      "brain.context",
      "brain.intent",
      "brain.goals",
      "brain.decisions",
      "brain.knowledge-graph",
      "brain.semantic-index",
      "brain.memory",
      "brain.reasoning",
      "brain.planning",
      "brain.learning",
      "brain.prediction",
      "brain.recommendation",
      "brain.multi-agent",
      "brain.consensus",
      "brain.supervisor",
      "brain.explainability",
      "brain.trust",
      "brain.traceability",
      "brain.diagnostics"
    ];

    const now = new Date().toISOString();

    const manifest: EnterpriseBrainManifest = {
      id: `enterprise-brain-manifest:${Date.now()}:${this.manifests.size + 1}`,
      name: "AVOS Enterprise Brain",
      version: "1.0.0",
      classification:
        "enterprise-brain-certified-intelligence-platform-core",
      packIds: this.packs.list().map((pack) => pack.id),
      capabilities,
      dependencies: [
        "avos-foundation",
        "avos-enterprise-kernel"
      ],
      principles: {
        foundationFirst: true,
        contextBeforeDecision: true,
        knowledgeAsAsset: true,
        reasoningByEvidence: true,
        learningByGovernance: true,
        explainabilityByDesign: true,
        traceabilityByDesign: true,
        humanFinalAuthority: true
      },
      validationReportId: report.id,
      status: report.success ? "ready" : "draft",
      createdAt: now,
      updatedAt: now
    };

    this.manifests.set(manifest.id, manifest);

    this.audit.record({
      correlationId: input.correlationId,
      category: "manifest",
      action: "enterprise-brain-manifest-created",
      subjectId: manifest.id,
      actorIdentityId: input.actorIdentityId,
      outcome: manifest.status === "ready" ? "success" : "warning",
      metadata: {
        capabilities: manifest.capabilities.length,
        packs: manifest.packIds.length
      }
    });

    return manifest;
  }

  certify(id: string) {
    const current = this.get(id);

    const updated: EnterpriseBrainManifest = {
      ...current,
      status: "certified",
      updatedAt: new Date().toISOString()
    };

    this.manifests.set(updated.id, updated);
    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      ready: items.filter((x) => x.status === "ready").length,
      certified: items.filter((x) => x.status === "certified").length
    };
  }
}
