import { Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryGeneratorService {
  generate(name: string): string {
    const className = this.toPascalCase(name);
    return `export interface ${className}Repository {
  findById(id: string): Promise<unknown | null>;
  save(entity: unknown): Promise<unknown>;
}
`;
  }

  private toPascalCase(value: string): string {
    return value.replace(/[^a-zA-Z0-9]+(.)/g, (_m, c: string) => c.toUpperCase())
      .replace(/^[a-z]/, (c) => c.toUpperCase());
  }
}
