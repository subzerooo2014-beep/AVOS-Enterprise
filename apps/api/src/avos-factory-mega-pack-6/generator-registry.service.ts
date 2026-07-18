import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { GeneratorDescriptor } from "./generator-runtime.contracts";

@Injectable()
export class GeneratorRegistryService {
  private readonly generators = new Map<string, GeneratorDescriptor>();

  register(generator: GeneratorDescriptor): GeneratorDescriptor {
    if (this.generators.has(generator.id)) {
      throw new BadRequestException(`Generator already registered: ${generator.id}`);
    }

    const normalized: GeneratorDescriptor = {
      ...generator,
      name: generator.name.trim(),
      version: generator.version.trim(),
      status: generator.status ?? "registered",
      certified: generator.certified ?? false,
      maxRetries: Math.max(0, generator.maxRetries ?? 2),
      metadata: {
        ...generator.metadata,
        registeredAt: new Date().toISOString()
      }
    };

    this.generators.set(normalized.id, structuredClone(normalized));
    return structuredClone(normalized);
  }

  save(generator: GeneratorDescriptor): GeneratorDescriptor {
    this.generators.set(generator.id, structuredClone(generator));
    return structuredClone(generator);
  }

  get(id: string): GeneratorDescriptor {
    const generator = this.generators.get(id);

    if (!generator) {
      throw new NotFoundException(`Generator not found: ${id}`);
    }

    return structuredClone(generator);
  }

  list(): GeneratorDescriptor[] {
    return [...this.generators.values()].map((item) => structuredClone(item));
  }

  count(): number {
    return this.generators.size;
  }
}
