import {
  Injectable,
  OnModuleInit
} from "@nestjs/common";
import {
  TemplateEngineService
} from "./template-engine.service";
import {
  TemplateRegistryService
} from "./template-registry.service";

@Injectable()
export class BuiltInTemplateBootstrapService
  implements OnModuleInit {
  constructor(
    private readonly registry:
      TemplateRegistryService,
    private readonly engine:
      TemplateEngineService
  ) {}

  onModuleInit(): void {
    const templateId =
      "avos.nestjs-service-template";

    if (
      this.registry.has(
        templateId,
        "1.0.0"
      )
    ) {
      return;
    }

    this.engine.register({
      id: templateId,
      name:
        "AVOS NestJS Service Template",
      version: "1.0.0",
      format: "typescript",
      status: "active",
      content: [
        'import { Injectable } from "@nestjs/common";',
        "",
        "@Injectable()",
        "export class {{className}}Service {",
        "  getStatus() {",
        "    return {",
        "      healthy: true,",
        '      service: "{{className}}Service"',
        "    };",
        "  }",
        "}",
        ""
      ].join("\n"),
      variables: [{
        name: "className",
        required: true,
        description:
          "Generated NestJS service class name."
      }],
      metadata: {
        createdBy:
          "avos.factory",
        createdAt:
          new Date().toISOString(),
        humanFinalAuthority: true,
        tags: [
          "nestjs",
          "service",
          "typescript"
        ]
      }
    });
  }
}
