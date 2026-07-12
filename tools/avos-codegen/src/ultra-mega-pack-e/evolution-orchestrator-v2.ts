import { randomUUID } from "node:crypto";
import {
  UltraEEvidence,
  UltraEFinding,
  UltraESeverity,
  UltraEStatus,
} from "./contracts";
import {
  EnterpriseKnowledgeAcademy,
  KnowledgeAsset,
  KnowledgeLesson,
} from "./knowledge-academy";
import {
  CertificationCandidate,
  CertificationCriterion,
  CertificationResult,
  EnterpriseCertificationFramework,
} from "./certification-framework";
import {
  AvosUniversalSdk,
  GeneratedSdk,
  SdkDefinition,
  SdkRegistry,
} from "./universal-sdk";
import {
  EnterpriseGenome,
  EnterpriseGenomeProfile,
  GenomeMutation,
  GenomeTrait,
} from "./enterprise-genome";
import {
  CompatibilityPlan,
  LegacyPreservationSystem,
  LegacySystem,
  TargetPlatform,
} from "./legacy-preservation";

export interface EvolutionOrchestrationInput {
  systemKey: string;
  knowledgeAssets: Array<
    Omit<KnowledgeAsset, "id" | "version" | "createdAt" | "updatedAt">
  >;
  knowledgeLessons: KnowledgeLesson[];
  synchronizationTargets: string[];
  certificationCandidate: CertificationCandidate;
  certificationCriteria: CertificationCriterion[];
  sdkDefinition: SdkDefinition;
  organizationKey: string;
  genomeTraits: GenomeTrait[];
  genomeMutations: GenomeMutation[];
  legacySystem: LegacySystem;
  targetPlatform: TargetPlatform;
}

export interface EvolutionOrchestrationResult {
  success: boolean;
  status: UltraEStatus;
  score: number;
  knowledge: ReturnType<EnterpriseKnowledgeAcademy["snapshot"]>;
  certification: CertificationResult;
  generatedSdks: GeneratedSdk[];
  genome: EnterpriseGenomeProfile;
  compatibility: CompatibilityPlan;
  findings: UltraEFinding[];
  evidence: UltraEEvidence[];
  completedAt: string;
}

export class EnterpriseEvolutionOrchestratorV2 {
  constructor(
    readonly academy = new EnterpriseKnowledgeAcademy(),
    readonly certification = new EnterpriseCertificationFramework(),
    readonly sdkGenerator = new AvosUniversalSdk(),
    readonly sdkRegistry = new SdkRegistry(),
    readonly genomeEngine = new EnterpriseGenome(),
    readonly legacyPreservation = new LegacyPreservationSystem(),
  ) {}

  execute(
    input: EvolutionOrchestrationInput,
  ): EvolutionOrchestrationResult {
    for (const asset of input.knowledgeAssets) {
      this.academy.upsertAsset(asset);
    }

    for (const lesson of input.knowledgeLessons) {
      this.academy.registerLesson(lesson);
    }

    const knowledge = this.academy.snapshot();
    const synchronizationEvidence = this.academy.synchronize(
      input.systemKey,
      input.synchronizationTargets,
    );

    const certification = this.certification.certify(
      input.certificationCandidate,
      input.certificationCriteria,
    );

    const generatedSdks = this.sdkGenerator.generate(input.sdkDefinition);
    generatedSdks.forEach((sdk) => this.sdkRegistry.register(sdk));

    const initialGenome = this.genomeEngine.create(
      input.organizationKey,
      input.genomeTraits,
    );

    const genome =
      input.genomeMutations.length > 0
        ? this.genomeEngine.evolve(initialGenome, input.genomeMutations)
        : initialGenome;

    const compatibility = this.legacyPreservation.plan(
      input.legacySystem,
      input.targetPlatform,
    );

    const findings: UltraEFinding[] = [
      ...certification.findings,
      ...compatibility.findings,
    ];

    if (knowledge.averageConfidence < 60) {
      findings.push({
        code: "KNOWLEDGE_CONFIDENCE_LOW",
        severity: UltraESeverity.WARNING,
        message: "Knowledge academy confidence is below the preferred threshold.",
        metadata: { averageConfidence: knowledge.averageConfidence },
      });
    }

    if (genome.compatibilityScore < 60) {
      findings.push({
        code: "ENTERPRISE_GENOME_COMPATIBILITY_LOW",
        severity: UltraESeverity.ERROR,
        message: "Enterprise genome compatibility requires remediation.",
        metadata: { compatibilityScore: genome.compatibilityScore },
      });
    }

    const score = Math.round(
      (
        knowledge.averageConfidence +
        certification.score +
        genome.compatibilityScore +
        compatibility.compatibilityScore +
        Math.min(100, generatedSdks.length * 20)
      ) / 5,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === UltraESeverity.CRITICAL,
    );
    const hasErrors = findings.some(
      (finding) => finding.severity === UltraESeverity.ERROR,
    );

    const status = hasCritical
      ? UltraEStatus.BLOCKED
      : hasErrors || score < 65
        ? UltraEStatus.DEGRADED
        : UltraEStatus.READY;

    const success = status === UltraEStatus.READY;

    const evidence: UltraEEvidence[] = [
      ...synchronizationEvidence,
      this.certification.createEvidence(certification),
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "enterprise-evolution-orchestrator-v2",
        action: "evolution.completed",
        message: `Enterprise evolution completed with status ${status}.`,
        metadata: {
          score,
          knowledgeAssets: knowledge.assetCount,
          lessons: knowledge.lessonCount,
          generatedSdks: generatedSdks.length,
          genomeGeneration: genome.generation,
          genomeCompatibility: genome.compatibilityScore,
          legacyCompatibility: compatibility.compatibilityScore,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success,
      status,
      score,
      knowledge,
      certification,
      generatedSdks,
      genome,
      compatibility,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}
