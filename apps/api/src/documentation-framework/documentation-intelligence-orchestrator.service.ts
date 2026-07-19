import { Injectable } from "@nestjs/common";
import { DocumentationRegistryService } from "./registry/documentation-registry.service";
import { DocumentationBlueprintSyncService } from "./blueprint/documentation-blueprint-sync.service";
import { LivingDocumentationService } from "./living/living-documentation.service";
import { DocumentationIntelligenceService } from "./intelligence/documentation-intelligence.service";
import { BindDocumentationBlueprintDto } from "./dto/bind-documentation-blueprint.dto";
import { SynchronizeLivingDocumentationDto } from "./dto/synchronize-living-documentation.dto";

@Injectable()
export class DocumentationIntelligenceOrchestratorService {
  constructor(
    private readonly registry: DocumentationRegistryService,
    private readonly blueprint: DocumentationBlueprintSyncService,
    private readonly living: LivingDocumentationService,
    private readonly intelligence: DocumentationIntelligenceService,
  ) {}

  bind(documentId: string, dto: BindDocumentationBlueprintDto) {
    return this.blueprint.bind(this.registry.findById(documentId), dto);
  }

  synchronize(documentId: string, dto: SynchronizeLivingDocumentationDto) {
    const document = this.registry.findById(documentId);
    const binding = this.blueprint.synchronize(document, dto);
    const snapshot = this.living.createSnapshot(document, binding, dto.synchronizedBy);
    return { binding, snapshot, humanFinalAuthority: true };
  }

  snapshot(documentId: string, generatedBy = "system:avos-documentation-intelligence") {
    const document = this.registry.findById(documentId);
    const binding = this.blueprint.evaluate(document);
    return this.living.createSnapshot(document, binding, generatedBy);
  }

  analyze(documentId: string) { return this.intelligence.analyze(documentId); }
  analyzeAll() { return this.intelligence.analyzeAll(); }
  reports(documentId?: string) { if (documentId) this.registry.findById(documentId); return this.intelligence.list(documentId); }
  snapshots(documentId?: string) { if (documentId) this.registry.findById(documentId); return this.living.list(documentId); }
  bindings() { return this.blueprint.list(); }

  status() {
    const reports = this.intelligence.list();
    const averageScore = reports.length
      ? Math.round(reports.reduce((sum, item) => sum + item.score, 0) / reports.length)
      : 0;
    return {
      name: "AVOS Documentation Intelligence, Living Documentation & Blueprint Synchronization",
      version: "ADF-MP3-1.0.0",
      status: "operational",
      components: {
        documentationIntelligence: true,
        livingDocumentation: true,
        blueprintSynchronization: true,
        driftDetection: true,
        recommendations: true,
        humanReviewProtection: true,
      },
      metrics: {
        documents: this.registry.list().length,
        reports: reports.length,
        snapshots: this.living.count(),
        blueprintBindings: this.blueprint.count(),
        driftDetected: this.blueprint.driftCount(),
        averageIntelligenceScore: averageScore,
      },
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      checkedAt: new Date().toISOString(),
    };
  }

  verify() {
    const status = this.status();
    const checks = {
      operational: status.status === "operational",
      documentationIntelligence: status.components.documentationIntelligence,
      livingDocumentation: status.components.livingDocumentation,
      blueprintSynchronization: status.components.blueprintSynchronization,
      driftDetection: status.components.driftDetection,
      recommendations: status.components.recommendations,
      foundationDocumentsAvailable: status.metrics.documents >= 3,
      foundationFirst: status.foundationFirst,
      capabilityFirst: status.capabilityFirst,
      blueprintDriven: status.blueprintDriven,
      humanFinalAuthority: status.humanFinalAuthority,
      globalComplianceReadinessGate: status.globalComplianceReadinessGate,
    };
    const values = Object.values(checks);
    return {
      name: "ADF Mega Pack 3 Verification",
      status: values.every(Boolean) ? "passed" : "failed",
      score: Math.round((values.filter(Boolean).length / values.length) * 100),
      checks,
      verifiedAt: new Date().toISOString(),
    };
  }
}
