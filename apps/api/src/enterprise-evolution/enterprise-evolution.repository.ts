import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { EvolutionSnapshot } from './enterprise-evolution.types';

@Injectable()
export class EnterpriseEvolutionRepository {
  private readonly root = join(
    process.cwd(),
    '.avos-data',
    'enterprise-evolution',
  );

  private readonly stateFile = join(this.root, 'enterprise-evolution-state.json');

  load(): EvolutionSnapshot | null {
    if (!existsSync(this.stateFile)) return null;

    try {
      return JSON.parse(readFileSync(this.stateFile, 'utf8')) as EvolutionSnapshot;
    } catch {
      return null;
    }
  }

  save(snapshot: EvolutionSnapshot): void {
    mkdirSync(this.root, { recursive: true });
    writeFileSync(this.stateFile, JSON.stringify(snapshot, null, 2), 'utf8');
  }

  info() {
    return {
      durable: true,
      root: this.root,
      stateFile: this.stateFile,
      format: 'json',
    };
  }
}