import { BadRequestException, Injectable } from "@nestjs/common";
import {
  ProjectGeneratorRequest,
  ProjectValidationIssue,
  ProjectValidationResult
} from "./project-generator.contracts";
import { ProjectKindRegistryService } from "./project-kind-registry.service";

@Injectable()
export class ProjectGeneratorValidationService {
  constructor(private readonly kinds: ProjectKindRegistryService) {}

  validate(request: ProjectGeneratorRequest): ProjectValidationResult {
    const errors: ProjectValidationIssue[] = [];
    const warnings: ProjectValidationIssue[] = [];

    if (!request.name?.trim()) {
      errors.push({ code: "PROJECT_NAME_REQUIRED", message: "name is required.", path: "name", severity: "error" });
    } else if (!/^[A-Za-z][A-Za-z0-9 _.-]{1,79}$/.test(request.name)) {
      errors.push({ code: "PROJECT_NAME_INVALID", message: "Project name contains unsafe characters.", path: "name", severity: "error" });
    }

    if (!request.requestedBy?.trim()) {
      errors.push({ code: "PROJECT_REQUESTER_REQUIRED", message: "requestedBy is required.", path: "requestedBy", severity: "error" });
    }

    if (!this.kinds.has(request.kind)) {
      errors.push({ code: "PROJECT_KIND_NOT_REGISTERED", message: `Project kind "${request.kind}" is not registered.`, path: "kind", severity: "error" });
    }

    if (request.outputPath && this.isUnsafePath(request.outputPath)) {
      errors.push({ code: "PROJECT_OUTPUT_PATH_UNSAFE", message: "outputPath cannot escape the project root.", path: "outputPath", severity: "error" });
    }

    if (request.overwrite === true && request.humanApproved !== true) {
      errors.push({ code: "PROJECT_OVERWRITE_REQUIRES_APPROVAL", message: "Overwrite requires Human Final Authority approval.", path: "humanApproved", severity: "error" });
    }

    if (request.humanApproved === true && !request.approvedBy?.trim()) {
      errors.push({ code: "PROJECT_APPROVER_REQUIRED", message: "approvedBy is required.", path: "approvedBy", severity: "error" });
    }

    if (request.dryRun === true) {
      warnings.push({ code: "PROJECT_DRY_RUN", message: "Dry-run mode is enabled.", path: "dryRun", severity: "warning" });
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  assertValid(result: ProjectValidationResult): void {
    if (!result.valid) {
      throw new BadRequestException({
        message: "AVOS Project Generator validation failed.",
        errors: result.errors,
        warnings: result.warnings
      });
    }
  }

  private isUnsafePath(value: string): boolean {
    const normalized = value.replace(/\\/g, "/");
    return normalized.startsWith("/") ||
      /^[A-Za-z]:\//.test(normalized) ||
      normalized.split("/").some((segment) => segment === "..");
  }
}
