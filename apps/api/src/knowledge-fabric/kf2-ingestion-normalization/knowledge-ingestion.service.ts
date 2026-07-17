import { Injectable, OnModuleInit } from "@nestjs/common";
import { KnowledgeRegistryService } from "../kf1-foundation";
import { KnowledgeIngestionRepository } from "./knowledge-ingestion.repository";
import { KnowledgeNormalizationService } from "./knowledge-normalization.service";
import {
  IngestKnowledgeInput,
  IngestionBatchResult,
  KnowledgeIngestionStatus,
  NormalizedKnowledgeDocument,
} from "./knowledge-ingestion.types";

@Injectable()
export class KnowledgeIngestionService implements OnModuleInit {
  private bootstrapCompleted = false;

  constructor(
    private readonly repository: KnowledgeIngestionRepository,
    private readonly normalizer: KnowledgeNormalizationService,
    private readonly registry: KnowledgeRegistryService,
  ) {}

  onModuleInit(): void {
    this.bootstrap();
  }

  bootstrap(): KnowledgeIngestionStatus {
    this.registry.register({
      key: "avos.knowledge.ingestion",
      title: "Knowledge Ingestion Pipeline",
      summary: "Controlled intake pipeline for enterprise knowledge sources.",
      metadata: { source: "system", owner: "AVOS Enterprise", pack: "KF-2" },
    });

    this.registry.register({
      key: "avos.knowledge.normalization",
      title: "Knowledge Normalization Engine",
      summary: "Canonical normalization and metadata preparation for knowledge documents.",
      metadata: { source: "system", owner: "AVOS Enterprise", pack: "KF-2" },
    });

    this.bootstrapCompleted = true;
    return this.status();
  }

  ingest(input: IngestKnowledgeInput): {
    accepted: boolean;
    duplicate: boolean;
    document: NormalizedKnowledgeDocument;
  } {
    this.validateInput(input);
    const normalized = this.normalizer.normalize(input);
    const saved = this.repository.save(normalized);

    return {
      accepted: true,
      duplicate: saved.duplicate,
      document: saved.document,
    };
  }

  ingestBatch(inputs: IngestKnowledgeInput[]): IngestionBatchResult {
    const documents: NormalizedKnowledgeDocument[] = [];
    let accepted = 0;
    let duplicates = 0;
    let rejected = 0;

    for (const input of inputs) {
      try {
        const result = this.ingest(input);
        documents.push(result.document);
        if (result.duplicate) {
          duplicates += 1;
        } else {
          accepted += 1;
        }
      } catch {
        rejected += 1;
      }
    }

    return { accepted, duplicates, rejected, documents };
  }

  listDocuments(): NormalizedKnowledgeDocument[] {
    return this.repository.findAll();
  }

  findDocument(id: string): NormalizedKnowledgeDocument | undefined {
    return this.repository.findById(id);
  }

  status(): KnowledgeIngestionStatus {
    return {
      system: "AVOS Knowledge Fabric",
      pack: "KF-2",
      name: "Ingestion & Normalization",
      status: "ready",
      pipelineReady: this.bootstrapCompleted,
      normalizationReady: true,
      deduplicationReady: true,
      metadataExtractionReady: true,
      storedDocuments: this.repository.count(),
      capabilities: [
        "knowledge-ingestion",
        "text-import",
        "markdown-import",
        "json-import",
        "content-normalization",
        "metadata-extraction",
        "checksum-deduplication",
        "embedding-preparation",
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  health() {
    const status = this.status();
    return {
      healthy:
        status.pipelineReady &&
        status.normalizationReady &&
        status.deduplicationReady &&
        status.metadataExtractionReady,
      status,
    };
  }

  verification() {
    const probe = this.ingest({
      sourceId: "kf2-verification-probe",
      source: "system",
      format: "markdown",
      title: "KF-2 Verification Probe",
      content: "# KF-2 Verification Probe\n\nKnowledge ingestion is operational.",
      metadata: { verification: true },
    });

    const duplicateProbe = this.ingest({
      sourceId: "kf2-verification-probe-duplicate",
      source: "system",
      format: "markdown",
      title: "KF-2 Verification Probe",
      content: "# KF-2 Verification Probe\n\nKnowledge ingestion is operational.",
      metadata: { verification: true },
    });

    const checks = {
      bootstrapCompleted: this.bootstrapCompleted,
      pipelineReady: this.status().pipelineReady,
      normalizationProducedText: probe.document.normalizedText.length > 0,
      metadataExtracted: probe.document.wordCount > 0,
      checksumGenerated: probe.document.checksum.length >= 8,
      duplicateDetected: duplicateProbe.duplicate,
      registryIntegrated:
        this.registry.resolve("avos.knowledge.ingestion") !== undefined &&
        this.registry.resolve("avos.knowledge.normalization") !== undefined,
    };

    const passed = Object.values(checks).every(Boolean);
    return {
      passed,
      score: passed ? 100 : 0,
      pack: "KF-2",
      checks,
      status: this.status(),
    };
  }

  smoke() {
    const batch = this.ingestBatch([
      {
        sourceId: "kf2-smoke-text",
        source: "smoke",
        format: "text",
        content: "AVOS knowledge ingestion smoke test.",
      },
      {
        sourceId: "kf2-smoke-json",
        source: "smoke",
        format: "json",
        content: '{"system":"AVOS","pack":"KF-2"}',
      },
    ]);

    const verification = this.verification();
    const passed =
      verification.passed &&
      batch.rejected === 0 &&
      batch.documents.length === 2;

    return {
      passed,
      pack: "KF-2",
      accepted: batch.accepted,
      duplicates: batch.duplicates,
      rejected: batch.rejected,
      storedDocuments: this.repository.count(),
      verificationScore: verification.score,
      timestamp: new Date().toISOString(),
    };
  }

  private validateInput(input: IngestKnowledgeInput): void {
    if (!input || typeof input !== "object") {
      throw new Error("Ingestion input is required.");
    }
    if (!input.source?.trim()) {
      throw new Error("Knowledge source is required.");
    }
    if (!(["text", "markdown", "json"] as const).includes(input.format)) {
      throw new Error(`Unsupported knowledge format: ${String(input.format)}`);
    }
    if (!input.content?.trim()) {
      throw new Error("Knowledge content is required.");
    }
  }
}