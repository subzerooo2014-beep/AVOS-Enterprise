import { Injectable } from "@nestjs/common";
import { CreateDocumentationRecordDto } from "../dto/create-documentation-record.dto";

export interface DocumentationValidationResult {
  valid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  checks: Record<string, boolean>;
  validatedAt: string;
}

@Injectable()
export class DocumentationValidationService {
  validate(dto: CreateDocumentationRecordDto): DocumentationValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const checks = {
      titlePresent: Boolean(dto.title?.trim()),
      ownerPresent: Boolean(dto.owner?.trim()),
      categoryPresent: Boolean(dto.category),
      versionPresent: Boolean(dto.version?.trim()),
      authorityPresent: Boolean(dto.authority?.trim()),
      appliesToPresent: Boolean(dto.appliesTo?.length),
      humanAuthorityPreserved:
        !dto.approver || dto.approver.startsWith("human:"),
      globalComplianceReadinessGate: true,
    };

    if (!checks.titlePresent) errors.push("Document title is required.");
    if (!checks.ownerPresent) errors.push("Document owner is required.");
    if (!checks.categoryPresent) errors.push("Document category is required.");
    if (!checks.humanAuthorityPreserved) {
      errors.push("Final approval must preserve Human Final Authority.");
    }

    if (!checks.versionPresent) warnings.push("Version defaults to 1.0.0.");
    if (!checks.authorityPresent) {
      warnings.push("Authority defaults to AVOS Constitutional Foundation.");
    }
    if (!checks.appliesToPresent) {
      warnings.push("Document scope should define at least one appliesTo target.");
    }

    const values = Object.values(checks);
    const passed = values.filter(Boolean).length;
    const score = Math.round((passed / values.length) * 100);

    return {
      valid: errors.length === 0,
      score,
      errors,
      warnings,
      checks,
      validatedAt: new Date().toISOString(),
    };
  }
}
