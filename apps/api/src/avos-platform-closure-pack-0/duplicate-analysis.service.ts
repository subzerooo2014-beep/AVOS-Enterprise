import { Injectable } from '@nestjs/common';
import {
  ArchitectureInventory,
  DuplicateGroup,
} from './platform-closure-pack-0.types';

@Injectable()
export class DuplicateAnalysisService {
  analyze(inventory: ArchitectureInventory): DuplicateGroup[] {
    const groups = new Map<string, typeof inventory.components>();

    for (const component of inventory.components) {
      const key = this.normalize(component.name);
      if (key.length < 4) continue;

      const values = groups.get(key) ?? [];
      values.push(component);
      groups.set(key, values);
    }

    return [...groups.entries()]
      .filter(([, components]) => components.length > 1)
      .map(([key, components]) => ({
        key,
        confidence: this.confidence(components.map((item) => item.name)),
        reason: 'Normalized component names are identical or materially equivalent.',
        components: components.map(({ id, name, kind, relativePath }) => ({
          id,
          name,
          kind,
          relativePath,
        })),
      }))
      .sort((left, right) => right.confidence - left.confidence);
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .replace(/\.(service|controller|module|engine|registry|runtime|provider)$/g, '')
      .replace(/(?:mega[-_. ]?pack|pack)[-_. ]?\d+/g, '')
      .replace(/[-_.\s]/g, '')
      .replace(/\d+$/g, '');
  }

  private confidence(names: string[]): number {
    const exact = new Set(names.map((name) => name.toLowerCase())).size === 1;
    return exact ? 100 : 82;
  }
}