import { ArtifactFactory } from "./artifact-factory";
import {
  ExecutionArtifactKind,
  GeneratedArtifact,
} from "./contracts";
import {
  toCamelCase,
  toKebabCase,
  toPascalCase,
} from "./name-utils";

export interface ExecutableDomainModule {
  key: string;
  responsibilities: string[];
  dependencies: string[];
}

export class ModuleSourceGenerator {
  constructor(readonly factory = new ArtifactFactory()) {}

  generate(module: ExecutableDomainModule): GeneratedArtifact[] {
    const kebab = toKebabCase(module.key);
    const pascal = toPascalCase(module.key);
    const camel = toCamelCase(module.key);

    const dto = this.factory.create(
      ExecutionArtifactKind.DTO,
      `src/${kebab}/dto/create-${kebab}.dto.ts`,
      `export interface Create${pascal}Dto {
  name: string;
  metadata?: Record<string, unknown>;
}`,
      {
        generator: "genesis-engine-v2-execution",
        responsibilities: module.responsibilities,
      },
      module.key,
    );

    const service = this.factory.create(
      ExecutionArtifactKind.SERVICE,
      `src/${kebab}/${kebab}.service.ts`,
      `import { Create${pascal}Dto } from "./dto/create-${kebab}.dto";

export interface ${pascal}Record extends Create${pascal}Dto {
  id: string;
  createdAt: string;
}

export class ${pascal}Service {
  private readonly records = new Map<string, ${pascal}Record>();

  create(input: Create${pascal}Dto): ${pascal}Record {
    const id = \`${kebab}-\${this.records.size + 1}\`;
    const record: ${pascal}Record = {
      ...input,
      id,
      createdAt: new Date().toISOString(),
    };

    this.records.set(id, record);
    return structuredClone(record);
  }

  findAll(): ${pascal}Record[] {
    return Array.from(this.records.values()).map((item) =>
      structuredClone(item),
    );
  }

  findOne(id: string): ${pascal}Record | null {
    const item = this.records.get(id);
    return item ? structuredClone(item) : null;
  }
}

export const ${camel}Service = new ${pascal}Service();`,
      {
        generator: "genesis-engine-v2-execution",
        dependencies: module.dependencies,
      },
      module.key,
    );

    const controller = this.factory.create(
      ExecutionArtifactKind.CONTROLLER,
      `src/${kebab}/${kebab}.controller.ts`,
      `import { Create${pascal}Dto } from "./dto/create-${kebab}.dto";
import { ${pascal}Service } from "./${kebab}.service";

export class ${pascal}Controller {
  constructor(
    private readonly service = new ${pascal}Service(),
  ) {}

  create(input: Create${pascal}Dto) {
    return this.service.create(input);
  }

  findAll() {
    return this.service.findAll();
  }

  findOne(id: string) {
    return this.service.findOne(id);
  }
}`,
      {
        generator: "genesis-engine-v2-execution",
      },
      module.key,
    );

    const moduleSource = this.factory.create(
      ExecutionArtifactKind.MODULE,
      `src/${kebab}/${kebab}.module.ts`,
      `import { ${pascal}Controller } from "./${kebab}.controller";
import { ${pascal}Service } from "./${kebab}.service";

export interface ${pascal}ModuleDefinition {
  key: string;
  controller: typeof ${pascal}Controller;
  service: typeof ${pascal}Service;
  dependencies: string[];
}

export const ${pascal}Module: ${pascal}ModuleDefinition = {
  key: "${kebab}",
  controller: ${pascal}Controller,
  service: ${pascal}Service,
  dependencies: ${JSON.stringify(module.dependencies)},
};`,
      {
        generator: "genesis-engine-v2-execution",
      },
      module.key,
    );

    const test = this.factory.create(
      ExecutionArtifactKind.TEST,
      `src/${kebab}/${kebab}.service.spec.ts`,
      `import { ${pascal}Service } from "./${kebab}.service";

describe("${pascal}Service", () => {
  it("creates and reads a record", () => {
    const service = new ${pascal}Service();
    const created = service.create({ name: "sample" });

    expect(created.id).toBeDefined();
    expect(service.findOne(created.id)?.name).toBe("sample");
    expect(service.findAll()).toHaveLength(1);
  });
});`,
      {
        generator: "genesis-engine-v2-execution",
      },
      module.key,
    );

    const index = this.factory.create(
      ExecutionArtifactKind.MODULE,
      `src/${kebab}/index.ts`,
      `export * from "./dto/create-${kebab}.dto";
export * from "./${kebab}.service";
export * from "./${kebab}.controller";
export * from "./${kebab}.module";`,
      {
        generator: "genesis-engine-v2-execution",
      },
      module.key,
    );

    return [dto, service, controller, moduleSource, test, index];
  }
}
