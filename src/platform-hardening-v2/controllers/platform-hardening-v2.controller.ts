import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { CircuitBreakerService } from "../services/circuit-breaker.service";
import { DependencyHealthRegistryService } from "../services/dependency-health-registry.service";
import { OperationalReadinessService } from "../services/operational-readiness.service";
import { PlatformHardeningV2Service } from "../services/platform-hardening-v2.service";
import { RuntimeMetricsService } from "../services/runtime-metrics.service";

@Controller("platform-hardening/v2")
export class PlatformHardeningV2Controller {
  constructor(
    private readonly hardening:
      PlatformHardeningV2Service,
    private readonly readiness:
      OperationalReadinessService,
    private readonly metrics:
      RuntimeMetricsService,
    private readonly dependencies:
      DependencyHealthRegistryService,
    private readonly circuits:
      CircuitBreakerService,
  ) {}

  @Get("status")
  getStatus() {
    return this.hardening.getStatus();
  }

  @Get("live")
  getLiveness() {
    return this.readiness.getLiveness();
  }

  @Get("ready")
  async getReadiness() {
    return this.readiness.getReadiness();
  }

  @Get("snapshot")
  async getOperationalSnapshot() {
    return this.hardening.getOperationalSnapshot();
  }

  @Get("metrics")
  async getRuntimeMetrics() {
    return {
      success: true,
      metrics: await this.metrics.getMetrics(),
    };
  }

  @Get("dependencies")
  async getDependencies() {
    return {
      success: true,
      checks: await this.dependencies.runAll(),
    };
  }

  @Get("dependencies/:name")
  async getDependency(@Param("name") name: string) {
    const result = await this.dependencies.runOne(name);

    if (!result) {
      throw new NotFoundException({
        success: false,
        message: `Dependency check ${name} was not found`,
      });
    }

    return {
      success: true,
      check: result,
    };
  }

  @Get("circuits")
  getCircuits() {
    return {
      success: true,
      circuits: this.circuits.getAllSnapshots(),
    };
  }

  @Post("circuits/:name/reset")
  @HttpCode(HttpStatus.OK)
  resetCircuit(@Param("name") name: string) {
    return {
      success: true,
      circuit: this.circuits.reset(name),
    };
  }
}
