import { Controller, Get } from "@nestjs/common";

@Controller("galaxy-platform/bundle-1")
export class GalaxyBundle1Controller {
  @Get("health")
  health() {
    return {
      system: "AVOS Galaxy Platform",
      bundle: "Galaxy Bundle 1",
      status: "HEALTHY",
      domains: 50,
      capabilities: 5000,
      executableRuntime: true,
      generatedAt: new Date().toISOString(),
    };
  }
}