import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigurationInspectionEngineService {
  inspect() {
    return {
      requiredConfigurations: [
        "package.json",
        "tsconfig.json",
        "nest-cli.json",
        "prisma/schema.prisma",
      ],
      mode: "non-destructive",
      status: "ready",
    };
  }
}
