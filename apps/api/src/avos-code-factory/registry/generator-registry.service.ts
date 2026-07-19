import { Injectable } from "@nestjs/common";
import { FactoryGeneratorDescriptor } from "../contracts/workspace.contracts";

@Injectable()
export class FactoryGeneratorRegistryService {
  private readonly generators = new Map<string, FactoryGeneratorDescriptor>();

  register(descriptor: FactoryGeneratorDescriptor): FactoryGeneratorDescriptor {
    const normalized = {
      ...descriptor,
      artifactTypes: [...new Set(descriptor.artifactTypes)],
      languages: [...new Set(descriptor.languages)],
      metadata: descriptor.metadata ?? {},
    };

    this.generators.set(normalized.id, normalized);
    return normalized;
  }

  get(id: string) {
    return this.generators.get(id);
  }

  list() {
    return [...this.generators.values()].sort((a, b) => a.id.localeCompare(b.id));
  }

  unregister(id: string) {
    return this.generators.delete(id);
  }
}
