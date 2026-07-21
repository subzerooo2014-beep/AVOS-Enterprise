import { Injectable, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

interface MobilityDataStore {
  vehicles: unknown[];
  dealers: unknown[];
  listings: unknown[];
  audit: unknown[];
}

@Injectable()
export class MobilityPersistenceService implements OnModuleInit {
  private readonly dataRoot = path.resolve(
    process.cwd(),
    '.avos-data',
    'mobility',
    'ultimate-mega-pack-1',
  );

  private readonly dataFile = path.join(this.dataRoot, 'mobility-store.json');

  async onModuleInit(): Promise<void> {
    await fs.mkdir(this.dataRoot, { recursive: true });
    try {
      await fs.access(this.dataFile);
    } catch {
      await this.write({
        vehicles: [],
        dealers: [],
        listings: [],
        audit: [],
      });
    }
  }

  async read(): Promise<MobilityDataStore> {
    const raw = await fs.readFile(this.dataFile, 'utf8');
    return JSON.parse(raw) as MobilityDataStore;
  }

  async write(store: MobilityDataStore): Promise<void> {
    await fs.mkdir(this.dataRoot, { recursive: true });
    const temporary = `${this.dataFile}.tmp`;
    await fs.writeFile(temporary, JSON.stringify(store, null, 2), 'utf8');
    await fs.rename(temporary, this.dataFile);
  }

  getStorageInfo() {
    return {
      dataRoot: this.dataRoot,
      dataFile: this.dataFile,
      durablePersistence: true,
      atomicWrites: true,
    };
  }
}