import {
  GenesisV3Artifact,
  GenesisV3ArtifactKind,
  GenesisV3Domain,
} from "./contracts";
import { GenesisV3ArtifactFactory } from "./artifact-factory";
import { camel, kebab, pascal } from "./name-utils";

export class GenesisV3BackendGenerator {
  constructor(readonly factory = new GenesisV3ArtifactFactory()) {}

  generate(domain: GenesisV3Domain): GenesisV3Artifact[] {
    const domainKebab = kebab(domain.key);
    const entityPascal = pascal(domain.entityName);
    const entityCamel = camel(domain.entityName);

    const dtoFields = domain.fields
      .map((field) => {
        const optional = field.required ? "" : "?";
        const type =
          field.type === "number"
            ? "number"
            : field.type === "boolean"
              ? "boolean"
              : field.type === "date"
                ? "string"
                : "string";

        return `  ${field.name}${optional}: ${type};`;
      })
      .join("\n");

    const dto = this.factory.create(
      `apps/api/src/${domainKebab}/dto/create-${domainKebab}.dto.ts`,
      GenesisV3ArtifactKind.BACKEND,
      `export interface Create${entityPascal}Dto {
${dtoFields}
}`,
      { domain: domain.key, artifact: "dto" },
    );

    const service = this.factory.create(
      `apps/api/src/${domainKebab}/${domainKebab}.service.ts`,
      GenesisV3ArtifactKind.BACKEND,
      `import { Create${entityPascal}Dto } from "./dto/create-${domainKebab}.dto";

export interface ${entityPascal}Record extends Create${entityPascal}Dto {
  id: string;
  createdAt: string;
}

export class ${entityPascal}Service {
  private readonly records = new Map<string, ${entityPascal}Record>();

  create(input: Create${entityPascal}Dto): ${entityPascal}Record {
    const id = \`${domainKebab}-\${this.records.size + 1}\`;

    const record: ${entityPascal}Record = {
      ...input,
      id,
      createdAt: new Date().toISOString(),
    };

    this.records.set(id, record);
    return structuredClone(record);
  }

  findAll(): ${entityPascal}Record[] {
    return Array.from(this.records.values()).map((record) =>
      structuredClone(record),
    );
  }

  findOne(id: string): ${entityPascal}Record | null {
    const record = this.records.get(id);
    return record ? structuredClone(record) : null;
  }
}

export const ${entityCamel}Service = new ${entityPascal}Service();`,
      { domain: domain.key, artifact: "service" },
    );

    const controller = this.factory.create(
      `apps/api/src/${domainKebab}/${domainKebab}.controller.ts`,
      GenesisV3ArtifactKind.BACKEND,
      `import { Create${entityPascal}Dto } from "./dto/create-${domainKebab}.dto";
import { ${entityPascal}Service } from "./${domainKebab}.service";

export class ${entityPascal}Controller {
  constructor(
    private readonly service = new ${entityPascal}Service(),
  ) {}

  create(input: Create${entityPascal}Dto) {
    return this.service.create(input);
  }

  findAll() {
    return this.service.findAll();
  }

  findOne(id: string) {
    return this.service.findOne(id);
  }
}`,
      { domain: domain.key, artifact: "controller" },
    );

    const module = this.factory.create(
      `apps/api/src/${domainKebab}/${domainKebab}.module.ts`,
      GenesisV3ArtifactKind.BACKEND,
      `import { ${entityPascal}Controller } from "./${domainKebab}.controller";
import { ${entityPascal}Service } from "./${domainKebab}.service";

export const ${entityPascal}Module = {
  key: "${domainKebab}",
  controller: ${entityPascal}Controller,
  service: ${entityPascal}Service,
};`,
      { domain: domain.key, artifact: "module" },
    );

    const test = this.factory.create(
      `apps/api/src/${domainKebab}/${domainKebab}.service.spec.ts`,
      GenesisV3ArtifactKind.TEST,
      `import { ${entityPascal}Service } from "./${domainKebab}.service";

describe("${entityPascal}Service", () => {
  it("creates a record", () => {
    const service = new ${entityPascal}Service();
    const created = service.create({} as never);

    expect(created.id).toBeDefined();
    expect(service.findAll()).toHaveLength(1);
  });
});`,
      { domain: domain.key, artifact: "test" },
    );

    const index = this.factory.create(
      `apps/api/src/${domainKebab}/index.ts`,
      GenesisV3ArtifactKind.BACKEND,
      `export * from "./dto/create-${domainKebab}.dto";
export * from "./${domainKebab}.service";
export * from "./${domainKebab}.controller";
export * from "./${domainKebab}.module";`,
      { domain: domain.key, artifact: "index" },
    );

    return [dto, service, controller, module, test, index];
  }
}
