import { Injectable } from "@nestjs/common";

@Injectable()
export class PipelineTemplateRegistryService {
  list() {
    return [
      {
        id: "capability-production",
        stages: [
          "blueprint",
          "source-generation",
          "validation",
          "testing",
          "documentation",
          "release"
        ]
      },
      {
        id: "safe-production-release",
        stages: [
          "policy",
          "architecture",
          "quality",
          "approval",
          "deployment",
          "rollback"
        ]
      }
    ];
  }

  resolve(id = "capability-production") {
    return (
      this.list().find((template) => template.id === id) ??
      this.list()[0]
    );
  }
}
