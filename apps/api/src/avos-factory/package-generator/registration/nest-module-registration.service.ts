import { Injectable } from '@nestjs/common';
import {
  PackageGeneratorModuleRegistration,
} from '../contracts/package-generator.contracts';
import { PackageGeneratorFilesystemService } from '../filesystem/package-generator-filesystem.service';

@Injectable()
export class NestModuleRegistrationService {
  constructor(private readonly filesystem: PackageGeneratorFilesystemService) {}

  async register(registrations: PackageGeneratorModuleRegistration[] = []): Promise<string[]> {
    const updated: string[] = [];

    for (const registration of registrations) {
      if (!(await this.filesystem.exists(registration.parentModulePath))) {
        throw new Error(`Parent module not found: ${registration.parentModulePath}`);
      }

      let source = await this.filesystem.readText(registration.parentModulePath);
      const importLine =
        `import { ${registration.moduleClassName} } from '${registration.moduleImportPath}';`;

      if (!source.includes(importLine)) {
        source = `${importLine}\n${source}`;
      }

      if (!new RegExp(`\\b${registration.moduleClassName}\\b`).test(this.extractImportsArray(source))) {
        if (/imports\s*:\s*\[/.test(source)) {
          source = source.replace(
            /imports\s*:\s*\[/,
            `imports: [\n    ${registration.moduleClassName},`,
          );
        } else if (/@Module\s*\(\s*\{/.test(source)) {
          source = source.replace(
            /@Module\s*\(\s*\{/,
            `@Module({\n  imports: [${registration.moduleClassName}],`,
          );
        } else {
          throw new Error(`Could not locate @Module metadata in: ${registration.parentModulePath}`);
        }
      }

      await this.filesystem.writeText(registration.parentModulePath, source);
      updated.push(registration.parentModulePath);
    }

    return updated;
  }

  private extractImportsArray(source: string): string {
    return source.match(/imports\s*:\s*\[[\s\S]*?\]/)?.[0] ?? '';
  }
}
