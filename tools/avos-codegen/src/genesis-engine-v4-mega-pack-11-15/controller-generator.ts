import {
  V4BackendArtifact,
  V4BackendDomain,
} from "./contracts";
import { backendKebab, backendPascal } from "./name-utils";

export class V4ControllerGenerator {
  generate(
    domain: V4BackendDomain,
    options: {
      enableRbac: boolean;
      enableOpenApi: boolean;
    },
  ): V4BackendArtifact {
    const key = backendKebab(domain.key);
    const entity = backendPascal(domain.entityName);

    const swaggerImports = options.enableOpenApi
      ? `import {
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
`
      : "";

    const roleImport = options.enableRbac
      ? `import { Roles } from "../../auth/decorators/roles.decorator";
`
      : "";

    const tags = options.enableOpenApi
      ? `@ApiTags("${key}")\n`
      : "";

    const operation = (summary: string) =>
      options.enableOpenApi
        ? `  @ApiOperation({ summary: "${summary}" })\n`
        : "";

    const role = (value: string) =>
      options.enableRbac
        ? `  @Roles("${value}")\n`
        : "";

    return {
      relativePath: `apps/api/src/${key}/${key}.controller.ts`,
      kind: "controller",
      content: `import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
${swaggerImports}${roleImport}import {
  Create${entity}Dto,
} from "./dto/create-${key}.dto";
import {
  Update${entity}Dto,
} from "./dto/update-${key}.dto";
import { ${entity}Service } from "./${key}.service";

${tags}@Controller("${key}")
export class ${entity}Controller {
  constructor(
    private readonly service: ${entity}Service,
  ) {}

${operation(`Create ${entity}`)}${role(`${key}:create`)}  @Post()
  create(@Body() input: Create${entity}Dto) {
    return this.service.create(input);
  }

${operation(`List ${entity}`)}${role(`${key}:read`)}  @Get()
  findAll() {
    return this.service.findAll();
  }

${operation(`Get ${entity}`)}${role(`${key}:read`)}  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

${operation(`Update ${entity}`)}${role(`${key}:update`)}  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() input: Update${entity}Dto,
  ) {
    return this.service.update(id, input);
  }

${operation(`Delete ${entity}`)}${role(`${key}:delete`)}  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
`,
      metadata: {
        domain: domain.key,
        rbac: options.enableRbac,
        openApi: options.enableOpenApi,
      },
    };
  }
}
