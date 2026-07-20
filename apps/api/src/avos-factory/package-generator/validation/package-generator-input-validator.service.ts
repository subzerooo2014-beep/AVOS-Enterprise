import { Injectable } from '@nestjs/common';
import {
  PackageGeneratorRequest,
  PackageGeneratorValidationIssue,
  PackageGeneratorValidationReport,
} from '../contracts/package-generator.contracts';

@Injectable()
export class PackageGeneratorInputValidatorService {
  validate(request: PackageGeneratorRequest): PackageGeneratorValidationReport {
    const issues: PackageGeneratorValidationIssue[] = [];

    if (!request.packageId?.trim()) {
      issues.push({ code: 'PACKAGE_ID_REQUIRED', severity: 'error', message: 'packageId is required.' });
    }

    if (!request.packageName?.trim()) {
      issues.push({ code: 'PACKAGE_NAME_REQUIRED', severity: 'error', message: 'packageName is required.' });
    }

    if (!request.packageVersion?.trim()) {
      issues.push({ code: 'PACKAGE_VERSION_REQUIRED', severity: 'error', message: 'packageVersion is required.' });
    }

    if (!request.targetRoot?.trim()) {
      issues.push({ code: 'TARGET_ROOT_REQUIRED', severity: 'error', message: 'targetRoot is required.' });
    }

    if (!Array.isArray(request.files) || request.files.length === 0) {
      issues.push({ code: 'FILES_REQUIRED', severity: 'error', message: 'At least one generated file is required.' });
    }

    const seen = new Set<string>();
    for (const file of request.files ?? []) {
      const normalized = file.relativePath.replace(/\\/g, '/').toLowerCase();
      if (!file.relativePath?.trim()) {
        issues.push({ code: 'FILE_PATH_REQUIRED', severity: 'error', message: 'A generated file has no path.' });
      }
      if (normalized.includes('..')) {
        issues.push({
          code: 'PATH_TRAVERSAL',
          severity: 'error',
          message: `Path traversal is not allowed: ${file.relativePath}`,
          file: file.relativePath,
        });
      }
      if (seen.has(normalized)) {
        issues.push({
          code: 'DUPLICATE_FILE',
          severity: 'error',
          message: `Duplicate file path: ${file.relativePath}`,
          file: file.relativePath,
        });
      }
      seen.add(normalized);

      if (!file.content?.trim()) {
        issues.push({
          code: 'EMPTY_CONTENT',
          severity: 'error',
          message: `Generated content is empty: ${file.relativePath}`,
          file: file.relativePath,
        });
      }
    }

    const errors = issues.filter((issue) => issue.severity === 'error').length;
    return {
      valid: errors === 0,
      score: Math.max(0, 100 - errors * 20),
      issues,
      checkedAt: new Date().toISOString(),
    };
  }
}
