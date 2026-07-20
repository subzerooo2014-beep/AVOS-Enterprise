import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { PackageGeneratorFilesystemService } from '../filesystem/package-generator-filesystem.service';

@Injectable()
export class PackageGeneratorRollbackService {
  constructor(private readonly filesystem: PackageGeneratorFilesystemService) {}

  async create(targetRoot: string, packageId: string): Promise<string | undefined> {
    if (!(await this.filesystem.exists(targetRoot))) {
      return undefined;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const repoRoot = this.findRepositoryRoot(targetRoot);
    const rollbackPath = path.join(repoRoot, '.avos', 'rollback', `${packageId}-${timestamp}`);

    await this.filesystem.copyDirectory(targetRoot, rollbackPath);
    return rollbackPath;
  }

  private findRepositoryRoot(targetRoot: string): string {
    const normalized = path.resolve(targetRoot);
    const marker = `${path.sep}apps${path.sep}api${path.sep}`;
    const index = normalized.indexOf(marker);
    return index >= 0 ? normalized.substring(0, index) : process.cwd();
  }
}
