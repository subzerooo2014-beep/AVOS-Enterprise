import { Injectable } from "@nestjs/common";

@Injectable()
export class GeneratorRegistry {
  private readonly generators = new Set<string>();

  register(name: string): void {
    this.generators.add(name);
  }

  list(): string[] {
    return [...this.generators].sort();
  }

  count(): number {
    return this.generators.size;
  }
}
