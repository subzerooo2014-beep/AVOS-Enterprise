import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { PackageGeneratorFileSpec } from '../contracts/package-generator.contracts';

@Injectable()
export class PackageGeneratorFilesystemService {
  async ensureDirectory(directory: string): Promise<void> {
    await fs.mkdir(directory, { recursive: true });
  }

  async exists(target: string): Promise<boolean> {
    try {
      await fs.access(target);
      return true;
    } catch {
      return false;
    }
  }

  async writeFiles(targetRoot: string, files: PackageGeneratorFileSpec[]): Promise<string[]> {
    const written: string[] = [];

    for (const file of files) {
      const destination = path.resolve(targetRoot, file.relativePath);
      const resolvedRoot = path.resolve(targetRoot);

      if (!destination.startsWith(resolvedRoot + path.sep) && destination !== resolvedRoot) {
        throw new Error(`Generated path escaped target root: ${file.relativePath}`);
      }

      await this.ensureDirectory(path.dirname(destination));

      if (!file.overwrite && (await this.exists(destination))) {
        throw new Error(`Generated file already exists and overwrite is disabled: ${destination}`);
      }

      await fs.writeFile(destination, file.content, { encoding: 'utf8' });
      written.push(destination);
    }

    return written;
  }

  async copyDirectory(source: string, destination: string): Promise<void> {
    await fs.cp(source, destination, { recursive: true, force: true });
  }

  async readText(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf8');
  }

  async writeText(filePath: string, content: string): Promise<void> {
    await this.ensureDirectory(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
  }
}
