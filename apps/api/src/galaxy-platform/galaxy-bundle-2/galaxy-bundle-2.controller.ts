import { Controller, Get } from "@nestjs/common";

@Controller("galaxy-platform/bundle-2")
export class GalaxyBundle2Controller {
  @Get("health")
  health() {
    return {
      system: "AVOS Galaxy Platform",
      bundle: "Galaxy Bundle 2",
      status: "HEALTHY",
      domains: 100,
      capabilities: 10000,
      executableRuntime: true,
      generatedAt: new Date().toISOString(),
    };
  }
}