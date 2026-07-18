import { Injectable } from "@nestjs/common";

export interface ControllerGenerationResult {
  fileName: string;
  className: string;
  content: string;
}

@Injectable()
export class CapabilityControllerGeneratorService {
  generate(className: string, slug: string): ControllerGenerationResult {
    const serviceClassName = `${className}Service`;
    const controllerClassName = `${className}Controller`;

    const content = [
      'import { Body, Controller, Get, Post } from "@nestjs/common";',
      `import { ${serviceClassName} } from "./${slug}.service";`,
      `import { Create${className}Dto } from "./dto/create-${slug}.dto";`,
      "",
      `@Controller("${slug}")`,
      `export class ${controllerClassName} {`,
      `  constructor(private readonly service: ${serviceClassName}) {}`,
      "",
      '  @Get("health")',
      "  health() {",
      "    return this.service.health();",
      "  }",
      "",
      "  @Post()",
      `  execute(@Body() dto: Create${className}Dto) {`,
      "    return this.service.execute(dto);",
      "  }",
      "}"
    ].join("\n");

    return {
      fileName: `${slug}.controller.ts`,
      className: controllerClassName,
      content
    };
  }
}
