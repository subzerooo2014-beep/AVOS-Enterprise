import { Injectable } from '@nestjs/common';
import {
  PackageGeneratorFileSpec,
  PackageGeneratorValidationIssue,
} from '../contracts/package-generator.contracts';

@Injectable()
export class TypescriptSourceValidatorService {
  validate(files: PackageGeneratorFileSpec[]): PackageGeneratorValidationIssue[] {
    const issues: PackageGeneratorValidationIssue[] = [];

    for (const file of files) {
      if (!file.relativePath.endsWith('.ts')) {
        continue;
      }

      if (file.content.includes('`@nestjs/common')) {
        issues.push({
          code: 'CORRUPTED_NEST_IMPORT',
          severity: 'error',
          message: 'Corrupted NestJS import detected.',
          file: file.relativePath,
        });
      }

      if (file.kind === 'module' && !file.content.includes('@Module(')) {
        issues.push({
          code: 'INVALID_NEST_MODULE',
          severity: 'error',
          message: 'Module artifact does not contain @Module.',
          file: file.relativePath,
        });
      }

      if (file.kind === 'controller' && !file.content.includes('@Controller(')) {
        issues.push({
          code: 'INVALID_NEST_CONTROLLER',
          severity: 'error',
          message: 'Controller artifact does not contain @Controller.',
          file: file.relativePath,
        });
      }

      if (
        ['service', 'orchestrator', 'registry', 'health', 'verification', 'certification'].includes(file.kind) &&
        !file.content.includes('@Injectable()')
      ) {
        issues.push({
          code: 'INVALID_NEST_PROVIDER',
          severity: 'error',
          message: 'Provider artifact does not contain @Injectable().',
          file: file.relativePath,
        });
      }
    }

    return issues;
  }
}
