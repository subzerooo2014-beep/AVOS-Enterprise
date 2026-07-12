import {
  V4BackendArtifact,
  V4BackendDomain,
} from "./contracts";
import { backendKebab, backendPascal } from "./name-utils";

export class V4ServiceGenerator {
  generate(
    domain: V4BackendDomain,
    options: {
      enableAudit: boolean;
      enableEvents: boolean;
    },
  ): V4BackendArtifact {
    const key = backendKebab(domain.key);
    const entity = backendPascal(domain.entityName);

    const auditCreate = options.enableAudit
      ? `    await this.audit.record({
      action: "${key}.created",
      entityId: created.id,
      metadata: { domain: "${domain.key}" },
    });
`
      : "";

    const eventCreate = options.enableEvents
      ? `    this.events.emit("${key}.created", {
      id: created.id,
      domain: "${domain.key}",
    });
`
      : "";

    const dependencies = [
      `private readonly repository: ${entity}Repository`,
      ...(options.enableAudit
        ? ["private readonly audit: AuditService"]
        : []),
      ...(options.enableEvents
        ? ["private readonly events: EventEmitter2"]
        : []),
    ].join(",\n    ");

    const imports = [
      `import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";`,
      options.enableEvents
        ? `import { EventEmitter2 } from "@nestjs/event-emitter";`
        : "",
      options.enableAudit
        ? `import { AuditService } from "../../audit/audit.service";`
        : "",
      `import { Create${entity}Dto } from "./dto/create-${key}.dto";`,
      `import { Update${entity}Dto } from "./dto/update-${key}.dto";`,
      `import { ${entity}Repository } from "./repositories/${key}.repository";`,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      relativePath: `apps/api/src/${key}/${key}.service.ts`,
      kind: "service",
      content: `${imports}

@Injectable()
export class ${entity}Service {
  constructor(
    ${dependencies},
  ) {}

  async create(input: Create${entity}Dto) {
    const created = await this.repository.create(input);
${auditCreate}${eventCreate}    return created;
  }

  findAll() {
    return this.repository.findMany();
  }

  async findOne(id: string) {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new NotFoundException(
        "${entity} not found",
      );
    }

    return item;
  }

  async update(
    id: string,
    input: Update${entity}Dto,
  ) {
    await this.findOne(id);
    return this.repository.update(id, input);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repository.softDelete(id);

    return { success: true };
  }
}
`,
      metadata: {
        domain: domain.key,
        audit: options.enableAudit,
        events: options.enableEvents,
      },
    };
  }
}
