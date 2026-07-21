import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RuntimeSnapshot } from './hypervisor-distributed-runtime.types';

@Injectable()
export class HypervisorRuntimeRepository {
  private readonly root = join(
    process.cwd(),
    '.avos-data',
    'hypervisor-distributed-runtime',
  );

  private readonly stateFile = join(this.root, 'runtime-state.json');

  load(): RuntimeSnapshot | null {
    if (!existsSync(this.stateFile)) {
      return null;
    }

    try {
      return JSON.parse(readFileSync(this.stateFile, 'utf8')) as RuntimeSnapshot;
    } catch {
      return null;
    }
  }

  save(snapshot: RuntimeSnapshot): void {
    mkdirSync(this.root, { recursive: true });
    writeFileSync(this.stateFile, JSON.stringify(snapshot, null, 2), 'utf8');
  }

  getStorageInfo() {
    return {
      root: this.root,
      stateFile: this.stateFile,
      durable: true,
      format: 'json',
    };
  }
}