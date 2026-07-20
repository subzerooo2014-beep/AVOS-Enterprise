import { Injectable } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import {
  ArchitectureComponent,
  ArchitectureComponentKind,
  ArchitectureInventory,
} from './platform-closure-pack-0.types';

@Injectable()
export class ArchitectureInventoryService {
  private readonly ignoredDirectories = new Set([
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    'coverage',
    '.avos',
  ]);

  async scan(root?: string): Promise<ArchitectureInventory> {
    const scanRoot = path.resolve(root ?? path.join(process.cwd(), 'src'));
    const files = await this.walk(scanRoot);
    const components: ArchitectureComponent[] = [];

    for (const filePath of files) {
      if (!/\.(ts|tsx|js|jsx|json|prisma|md)$/i.test(filePath)) {
        continue;
      }

      const stats = await fs.stat(filePath);
      const content = await fs.readFile(filePath, 'utf8');
      const relativePath = path.relative(scanRoot, filePath).replace(/\\/g, '/');
      const baseName = path.basename(filePath);
      const name = baseName.replace(/\.(ts|tsx|js|jsx|json|prisma|md)$/i, '');

      components.push({
        id: this.toId(relativePath),
        name,
        kind: this.classify(relativePath, name, content),
        relativePath,
        extension: path.extname(filePath).toLowerCase(),
        sizeBytes: stats.size,
        modifiedAt: stats.mtime.toISOString(),
        imports: this.extractImports(content),
        exportedSymbols: this.extractExports(content),
      });
    }

    const byKind = components.reduce<Record<string, number>>((accumulator, component) => {
      accumulator[component.kind] = (accumulator[component.kind] ?? 0) + 1;
      return accumulator;
    }, {});

    return {
      generatedAt: new Date().toISOString(),
      root: scanRoot,
      totalFiles: files.length,
      totalComponents: components.length,
      byKind,
      components,
    };
  }

  private async walk(directory: string): Promise<string[]> {
    const output: string[] = [];
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      if (this.ignoredDirectories.has(entry.name)) {
        continue;
      }

      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        output.push(...(await this.walk(fullPath)));
      } else if (entry.isFile()) {
        output.push(fullPath);
      }
    }

    return output;
  }

  private classify(
    relativePath: string,
    name: string,
    content: string,
  ): ArchitectureComponentKind {
    const value = `${relativePath} ${name} ${content.slice(0, 1200)}`.toLowerCase();

    if (name.endsWith('.module') || value.includes('@module(')) return 'module';
    if (name.endsWith('.controller') || value.includes('@controller(')) return 'controller';
    if (name.endsWith('.entity') || value.includes('@entity(')) return 'entity';
    if (name.endsWith('.dto') || /(^|[\/.-])dto([\/.-]|$)/.test(value)) return 'dto';
    if (name.endsWith('.interface') || /\binterface\s+[a-z0-9_]+/i.test(content)) return 'interface';
    if (name.endsWith('.repository') || value.includes('repository')) return 'repository';
    if (value.includes('foundation')) return 'foundation';
    if (value.includes('fabric')) return 'fabric';
    if (/(^|[\/.-])pack[-_. ]?\d+/i.test(value)) return 'pack';
    if (value.includes('registry')) return 'registry';
    if (value.includes('runtime')) return 'runtime';
    if (value.includes('engine')) return 'engine';
    if (name.endsWith('.service') || value.includes('@injectable(')) return 'service';
    if (value.includes('provider')) return 'provider';
    return 'other';
  }

  private extractImports(content: string): string[] {
    const matches = new Set<string>();
    const importRegex = /(?:from\s+|require\()['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(content)) !== null) {
      matches.add(match[1]);
    }

    return [...matches];
  }

  private extractExports(content: string): string[] {
    const symbols = new Set<string>();
    const exportRegex =
      /export\s+(?:default\s+)?(?:abstract\s+)?(?:class|interface|type|enum|const|function)\s+([A-Za-z0-9_]+)/g;
    let match: RegExpExecArray | null;

    while ((match = exportRegex.exec(content)) !== null) {
      symbols.add(match[1]);
    }

    return [...symbols];
  }

  private toId(relativePath: string): string {
    return relativePath
      .replace(/\\/g, '/')
      .replace(/[^a-zA-Z0-9/_-]/g, '-')
      .replace(/\//g, ':')
      .toLowerCase();
  }
}