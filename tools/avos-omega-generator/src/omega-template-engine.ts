import { OmegaCapabilityBlueprint } from "./omega-generator.types";
import { toPascalCase } from "./omega-name.utilities";

export class OmegaTemplateEngine {
  service(blueprint: OmegaCapabilityBlueprint): string {
    const className = `${toPascalCase(blueprint.capability)}Service`;

    return `import { Injectable } from "@nestjs/common";

@Injectable()
export class ${className} {
  execute(action: string, payload: Record<string, unknown> = {}) {
    return {
      capability: "${blueprint.capability}",
      domain: "${blueprint.domain}",
      action,
      success: true,
      status: "COMPLETED",
      timestamp: new Date().toISOString(),
      output: {
        payload,
        executable: true,
        governed: true,
        observable: true,
      },
    };
  }

  health() {
    return {
      capability: "${blueprint.capability}",
      status: "HEALTHY",
      actions: ${JSON.stringify(blueprint.actions)},
    };
  }
}
`;
  }

  controller(blueprint: OmegaCapabilityBlueprint): string {
    const base = toPascalCase(blueprint.capability);
    const serviceName = `${base}Service`;
    const controllerName = `${base}Controller`;

    return `import { Body, Controller, Get, Post } from "@nestjs/common";
import { ${serviceName} } from "./${blueprint.capability}.service";

@Controller("${blueprint.route}")
export class ${controllerName} {
  constructor(private readonly service: ${serviceName}) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Post("execute")
  execute(
    @Body() body: { action: string; payload?: Record<string, unknown> },
  ) {
    return this.service.execute(body.action, body.payload);
  }
}
`;
  }

  module(blueprint: OmegaCapabilityBlueprint): string {
    const base = toPascalCase(blueprint.capability);
    const serviceName = `${base}Service`;
    const controllerName = `${base}Controller`;
    const moduleName = `${base}Module`;

    return `import { Module } from "@nestjs/common";
import { ${controllerName} } from "./${blueprint.capability}.controller";
import { ${serviceName} } from "./${blueprint.capability}.service";

@Module({
  controllers: [${controllerName}],
  providers: [${serviceName}],
  exports: [${serviceName}],
})
export class ${moduleName} {}
`;
  }

  test(blueprint: OmegaCapabilityBlueprint): string {
    const base = toPascalCase(blueprint.capability);
    const serviceName = `${base}Service`;

    return `import { ${serviceName} } from "./${blueprint.capability}.service";

describe("${serviceName}", () => {
  it("executes the capability", () => {
    const service = new ${serviceName}();
    const result = service.execute("smoke", { source: "omega-generator" });

    expect(result.success).toBe(true);
    expect(result.capability).toBe("${blueprint.capability}");
  });
});
`;
  }
}