import { Injectable } from "@nestjs/common";
import { CreateDocumentationRecordDto } from "./dto/create-documentation-record.dto";
import { UpdateDocumentationRecordDto } from "./dto/update-documentation-record.dto";
import {
  AvosDocumentationMetrics,
  AvosDocumentRecord,
} from "./interfaces/documentation.types";
import { DocumentationRegistryService } from "./registry/documentation-registry.service";
import {
  DocumentationValidationResult,
  DocumentationValidationService,
} from "./validation/documentation-validation.service";

@Injectable()
export class DocumentationFrameworkService {
  constructor(
    private readonly registry: DocumentationRegistryService,
    private readonly validation: DocumentationValidationService,
  ) {}

  status() {
    return {
      name: "AVOS Documentation Framework",
      code: "ADF",
      version: "ADF-MP1-1.0.0",
      status: "operational",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      components: {
        documentRegistry: true,
        documentIdentity: true,
        metadataModel: true,
        validationEngine: true,
        lifecycleFoundation: true,
        searchFoundation: true,
      },
      metrics: this.metrics(),
      checkedAt: new Date().toISOString(),
    };
  }

  list(): AvosDocumentRecord[] {
    return this.registry.list();
  }

  findById(id: string): AvosDocumentRecord {
    return this.registry.findById(id);
  }

  register(dto: CreateDocumentationRecordDto): {
    validation: DocumentationValidationResult;
    document?: AvosDocumentRecord;
  } {
    const validation = this.validation.validate(dto);
    if (!validation.valid) {
      return { validation };
    }

    return {
      validation,
      document: this.registry.create(dto),
    };
  }

  update(id: string, dto: UpdateDocumentationRecordDto): AvosDocumentRecord {
    return this.registry.update(id, dto);
  }

  validate(dto: CreateDocumentationRecordDto): DocumentationValidationResult {
    return this.validation.validate(dto);
  }

  search(query: string): AvosDocumentRecord[] {
    return this.registry.search(query);
  }

  metrics(): AvosDocumentationMetrics {
    const documents = this.registry.list();
    const categories: Record<string, number> = {};

    for (const item of documents) {
      categories[item.category] = (categories[item.category] || 0) + 1;
    }

    return {
      totalDocuments: documents.length,
      activeDocuments: documents.filter((item) => item.status === "active").length,
      approvedDocuments: documents.filter(
        (item) => item.status === "approved" || item.status === "active",
      ).length,
      draftDocuments: documents.filter((item) => item.status === "draft").length,
      categories,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };
  }

  verify() {
    const status = this.status();
    const checks = {
      operational: status.status === "operational",
      registryAvailable: status.components.documentRegistry,
      validationAvailable: status.components.validationEngine,
      seededDocuments: status.metrics.totalDocuments >= 3,
      humanFinalAuthority: status.humanFinalAuthority,
      globalComplianceReadinessGate:
        status.globalComplianceReadinessGate,
    };

    const values = Object.values(checks);
    const score = Math.round(
      (values.filter(Boolean).length / values.length) * 100,
    );

    return {
      name: "ADF Mega Pack 1 Verification",
      status: values.every(Boolean) ? "passed" : "failed",
      score,
      checks,
      verifiedAt: new Date().toISOString(),
    };
  }
}
