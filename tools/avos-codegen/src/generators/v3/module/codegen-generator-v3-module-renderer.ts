import {
  CodeGenArtifactDescriptor,
  CodeGenArtifactType,
} from "../../../artifacts/codegen-artifact.contracts";
import {
  CodeGenGeneratorV3RendererContext,
} from "../contracts/codegen-generator-v3.contracts";
import {
  CodeGenGeneratorV3ArtifactFactory,
} from "../runtime/codegen-generator-v3-artifact-factory";

export class CodeGenGeneratorV3ModuleRenderer {
  constructor(
    readonly artifacts =
      new CodeGenGeneratorV3ArtifactFactory(),
  ) {}

  render(
    context:
      CodeGenGeneratorV3RendererContext,
  ): CodeGenArtifactDescriptor[] {
    const {
      request,
      names,
    } = context;

    const basePath =
      `src/${names.kebabModule}`;

    const results:
      CodeGenArtifactDescriptor[] =
      [];

    const moduleImports: string[] = [];
    const controllers: string[] = [];
    const providers: string[] = [];
    const exportsList: string[] = [];

    if (
      request.includeController
    ) {
      moduleImports.push(
        `import { ${names.pascalModule}Controller } from "./${names.kebabModule}.controller";`,
      );

      controllers.push(
        `${names.pascalModule}Controller`,
      );
    }

    if (
      request.includeService
    ) {
      moduleImports.push(
        `import { ${names.pascalModule}Service } from "./${names.kebabModule}.service";`,
      );

      providers.push(
        `${names.pascalModule}Service`,
      );

      exportsList.push(
        `${names.pascalModule}Service`,
      );
    }

    const moduleContent = `import { Module } from "@nestjs/common";
${moduleImports.join("\n")}

@Module({
  controllers: [${controllers.join(", ")}],
  providers: [${providers.join(", ")}],
  exports: [${exportsList.join(", ")}],
})
export class ${names.pascalModule}Module {}
`;

    results.push(
      this.artifacts.create({
        id:
          `${names.kebabModule}:module`,
        key:
          `${names.kebabModule}.module`,
        type:
          CodeGenArtifactType.SOURCE,
        relativePath:
          `${basePath}/${names.kebabModule}.module.ts`,
        content:
          moduleContent,
        tags: [
          "nestjs",
          "module",
          "generator-v3",
        ],
      }),
    );

    if (
      request.includeService
    ) {
      const serviceContent = `import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";

export interface ${names.pascalEntity}Record {
  id: string;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ${names.pascalModule}Service {
  private readonly records =
    new Map<string, ${names.pascalEntity}Record>();

  list(): ${names.pascalEntity}Record[] {
    return Array.from(
      this.records.values(),
    ).sort(
      (left, right) =>
        right.createdAt.localeCompare(
          left.createdAt,
        ),
    );
  }

  get(id: string): ${names.pascalEntity}Record {
    const record =
      this.records.get(id);

    if (!record) {
      throw new NotFoundException(
        "${names.pascalEntity} record was not found",
      );
    }

    return record;
  }

  create(
    payload: Record<string, unknown>,
  ): ${names.pascalEntity}Record {
    const now =
      new Date().toISOString();

    const record:
      ${names.pascalEntity}Record = {
      id:
        randomUUID(),
      payload,
      createdAt:
        now,
      updatedAt:
        now,
    };

    this.records.set(
      record.id,
      record,
    );

    return record;
  }

  update(
    id: string,
    payload: Record<string, unknown>,
  ): ${names.pascalEntity}Record {
    const current =
      this.get(id);

    const updated:
      ${names.pascalEntity}Record = {
      ...current,
      payload: {
        ...current.payload,
        ...payload,
      },
      updatedAt:
        new Date().toISOString(),
    };

    this.records.set(
      id,
      updated,
    );

    return updated;
  }

  remove(id: string): ${names.pascalEntity}Record {
    const record =
      this.get(id);

    this.records.delete(id);

    return record;
  }

  status() {
    return {
      success: true,
      module:
        "${names.kebabModule}",
      records:
        this.records.size,
      checkedAt:
        new Date().toISOString(),
    };
  }
}
`;

      results.push(
        this.artifacts.create({
          id:
            `${names.kebabModule}:service`,
          key:
            `${names.kebabModule}.service`,
          type:
            CodeGenArtifactType.SOURCE,
          relativePath:
            `${basePath}/${names.kebabModule}.service.ts`,
          content:
            serviceContent,
          dependencies: [
            `${names.kebabModule}.module`,
          ],
          tags: [
            "nestjs",
            "service",
            "generator-v3",
          ],
        }),
      );
    }

    if (
      request.includeController
    ) {
      const dtoImport =
        request.includeDtos
          ? `import { Create${names.pascalEntity}Dto } from "./dto/create-${names.kebabEntity}.dto";
import { Update${names.pascalEntity}Dto } from "./dto/update-${names.kebabEntity}.dto";`
          : "";

      const createType =
        request.includeDtos
          ? `Create${names.pascalEntity}Dto`
          : "Record<string, unknown>";

      const updateType =
        request.includeDtos
          ? `Update${names.pascalEntity}Dto`
          : "Record<string, unknown>";

      const controllerContent = `import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ${names.pascalModule}Service } from "./${names.kebabModule}.service";
${dtoImport}

@Controller("${names.routeName}")
export class ${names.pascalModule}Controller {
  constructor(
    private readonly service:
      ${names.pascalModule}Service,
  ) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get(":id")
  get(
    @Param("id") id: string,
  ) {
    return this.service.get(id);
  }

  @Post()
  create(
    @Body() body: ${createType},
  ) {
    return this.service.create(
      body as unknown as
        Record<string, unknown>,
    );
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() body: ${updateType},
  ) {
    return this.service.update(
      id,
      body as unknown as
        Record<string, unknown>,
    );
  }

  @Delete(":id")
  remove(
    @Param("id") id: string,
  ) {
    return this.service.remove(id);
  }
}
`;

      results.push(
        this.artifacts.create({
          id:
            `${names.kebabModule}:controller`,
          key:
            `${names.kebabModule}.controller`,
          type:
            CodeGenArtifactType.SOURCE,
          relativePath:
            `${basePath}/${names.kebabModule}.controller.ts`,
          content:
            controllerContent,
          dependencies: [
            `${names.kebabModule}.service`,
          ],
          tags: [
            "nestjs",
            "controller",
            "generator-v3",
          ],
        }),
      );
    }

    return results;
  }
}
