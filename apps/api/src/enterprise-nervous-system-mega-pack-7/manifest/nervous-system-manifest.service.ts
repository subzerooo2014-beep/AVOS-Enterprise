import { Injectable } from "@nestjs/common";
import { NervousSystemManifest } from "../enterprise-nervous-system-mega-pack-7.types";
import { NervousSystemPackRegistryService } from "../registry/nervous-system-pack-registry.service";
import { NervousSystemCrossValidationService } from "../validation/nervous-system-cross-validation.service";
import { NervousSystemFinalAuditService } from "../observability/nervous-system-final-audit.service";

@Injectable()
export class NervousSystemManifestService {
  private readonly manifests =
    new Map<string, NervousSystemManifest>();

  constructor(
    private readonly packs: NervousSystemPackRegistryService,
    private readonly validation: NervousSystemCrossValidationService,
    private readonly audit: NervousSystemFinalAuditService
  ) {}

  list() {
    return Array.from(this.manifests.values());
  }

  get(id: string) {
    const manifest = this.manifests.get(id);

    if (!manifest) {
      throw new Error(
        `Enterprise Nervous System manifest not found: ${id}`
      );
    }

    return manifest;
  }

  latest() {
    const items = this.list();
    return items.length === 0 ? undefined : items[items.length - 1];
  }

  create(input: {
    validationReportId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const report = this.validation.get(input.validationReportId);

    const capabilities = [
      "nervous.event-bus",
      "nervous.messaging",
      "nervous.signals",
      "nervous.topic-taxonomy",
      "nervous.subscriptions",
      "nervous.intelligent-routing",
      "nervous.workflow-orchestration",
      "nervous.saga",
      "nervous.compensation",
      "nervous.streaming",
      "nervous.replay",
      "nervous.checkpoints",
      "nervous.snapshots",
      "nervous.service-mesh",
      "nervous.capability-communication",
      "nervous.circuit-breaker",
      "nervous.bulkhead",
      "nervous.live-state",
      "nervous.state-sync",
      "nervous.presence",
      "nervous.telemetry",
      "nervous.conflict-reconciliation"
    ];

    const now = new Date().toISOString();

    const manifest: NervousSystemManifest = {
      id: `nervous-system-manifest:${Date.now()}:${this.manifests.size + 1}`,
      name: "AVOS Enterprise Nervous System",
      version: "1.0.0",
      classification:
        "enterprise-nervous-system-certified-connectivity-coordination-core",
      packIds: this.packs.list().map((pack) => pack.id),
      capabilities,
      dependencies: [
        "avos-foundation",
        "avos-enterprise-kernel",
        "avos-enterprise-brain"
      ],
      principles: {
        eventDrivenByDesign: true,
        contractFirstMessaging: true,
        durableStreaming: true,
        orchestrationByDesign: true,
        capabilityFirstCommunication: true,
        realTimeStateByDesign: true,
        telemetryByDesign: true,
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
      action: "nervous-system-manifest-created",
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

    const updated: NervousSystemManifest = {
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
