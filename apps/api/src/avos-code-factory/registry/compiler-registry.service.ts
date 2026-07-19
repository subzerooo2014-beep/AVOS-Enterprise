import { Injectable } from "@nestjs/common";
import { FactoryCompilerDescriptor } from "../contracts/workspace.contracts";

@Injectable()
export class FactoryCompilerRegistryService {
  private readonly compilers = new Map<string, FactoryCompilerDescriptor>();

  register(descriptor: FactoryCompilerDescriptor): FactoryCompilerDescriptor {
    const normalized = {
      ...descriptor,
      inputFormats: [...new Set(descriptor.inputFormats)],
      outputFormats: [...new Set(descriptor.outputFormats)],
      metadata: descriptor.metadata ?? {},
    };

    this.compilers.set(normalized.id, normalized);
    return normalized;
  }

  get(id: string) {
    return this.compilers.get(id);
  }

  list() {
    return [...this.compilers.values()].sort((a, b) => a.id.localeCompare(b.id));
  }

  unregister(id: string) {
    return this.compilers.delete(id);
  }
}
