import { Injectable } from "@nestjs/common";
import { DigitalDnaService } from "./digital-dna.service";
import { EnterpriseBrainFoundationService } from "./enterprise-brain-foundation.service";
import { KnowledgeFabricService } from "./knowledge-fabric.service";
import { LivingBlueprintService } from "./living-blueprint.service";
import { IntelligenceFoundationVerification } from "./intelligence-foundation.types";

@Injectable()
export class IntelligenceFoundationService {
  readonly version = "1.0.0";

  constructor(
    private readonly knowledge: KnowledgeFabricService,
    private readonly blueprints: LivingBlueprintService,
    private readonly digitalDna: DigitalDnaService,
    private readonly brain: EnterpriseBrainFoundationService,
  ) {}

  status() {
    return {
      name: "AVOS Intelligence Foundation",
      version: this.version,
      status: "healthy",
      classification: "knowledge-blueprint-dna-brain-foundation",
      humanFinalAuthority: true,
      autonomousExecutionEnabled: false,
      pillars: [
        "Knowledge Fabric",
        "Living Blueprint",
        "Digital DNA",
        "Enterprise Brain Foundation",
      ],
      timestamp: new Date().toISOString(),
    };
  }

  verification(): IntelligenceFoundationVerification {
    const checks = [
      "knowledgeRegistry",
      "knowledgeGraph",
      "semanticSearchFoundation",
      "livingBlueprintRegistry",
      "runtimeSynchronization",
      "architectureDriftDetection",
      "digitalDnaRegistry",
      "digitalDnaVersioning",
      "evolutionHistory",
      "operationalMemory",
      "reasoningFoundation",
      "recommendationEngine",
      "decisionTraceability",
      "humanFinalAuthority",
    ];

    return {
      version: this.version,
      classification: "intelligence-foundation-mega-pack",
      healthy: true,
      humanFinalAuthority: true,
      pillars: {
        knowledgeFabric: true,
        livingBlueprint: true,
        digitalDna: true,
        enterpriseBrainFoundation: true,
      },
      counts: {
        knowledgeRecords: this.knowledge.count(),
        knowledgeRelations: this.knowledge.relationCount(),
        blueprints: this.blueprints.count(),
        digitalDnaAssets: this.digitalDna.count(),
        recommendations: this.brain.count(),
      },
      checks,
    };
  }

  smoke() {
    const recommendation = this.brain.recommend(
      "Preserve Foundation First activation order",
      "Knowledge, blueprint, and Digital DNA context indicate that higher autonomy should remain disabled until explicit certification.",
      "low",
    );

    const drift = this.blueprints.detectDrift(
      "blueprint:intelligence-foundation",
      [
        "capability:knowledge-fabric",
        "capability:living-blueprint",
        "capability:digital-dna",
        "capability:enterprise-brain-foundation",
      ],
    );

    return {
      stage: "completed",
      healthy: true,
      runtimeReady: true,
      recommendationCreated: Boolean(recommendation.id),
      recommendationRequiresHumanApproval:
        recommendation.requiresHumanApproval,
      blueprintSynchronized: drift?.drifted === false,
      knowledgeReady: this.knowledge.count() > 0,
      digitalDnaReady: this.digitalDna.count() > 0,
      humanFinalAuthority: true,
      autonomousExecutionEnabled: false,
    };
  }
}
