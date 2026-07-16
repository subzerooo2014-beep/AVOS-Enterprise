import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AdvancedTwinRegistryService } from "./advanced-twin-registry.service";
import { EnterpriseAdvancedDigitalTwinPlatformService } from "./enterprise-advanced-digital-twin-platform.service";
import { TwinInsightEngineService } from "./twin-insight-engine.service";
import { TwinScenarioLaboratoryService } from "./twin-scenario-laboratory.service";
import { TwinStateSynchronizationService } from "./twin-state-synchronization.service";
import type { AdvancedTwinRecord } from "./enterprise-advanced-digital-twin.types";

@Controller("enterprise-advanced-digital-twin-platform")
export class EnterpriseAdvancedDigitalTwinPlatformController {
  constructor(
    private readonly platform: EnterpriseAdvancedDigitalTwinPlatformService,
    private readonly twins: AdvancedTwinRegistryService,
    private readonly synchronization: TwinStateSynchronizationService,
    private readonly scenarios: TwinScenarioLaboratoryService,
    private readonly insights: TwinInsightEngineService,
  ) {}

  @Get("status")
  status() {
    return this.platform.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("twins")
  upsertTwin(
    @Body()
    body: Omit<AdvancedTwinRecord, "version" | "createdAt" | "updatedAt">,
  ) {
    return {
      success: true,
      twin: this.twins.upsert(body),
    };
  }

  @Post("twins/:id/synchronize")
  synchronizeTwin(
    @Param("id") id: string,
    @Body()
    body: {
      source: string;
      state: Record<string, unknown>;
      error?: string;
    },
  ) {
    return {
      success: true,
      synchronization: this.synchronization.synchronize(
        id,
        body.source,
        body.state,
        body.error,
      ),
    };
  }

  @Post("twins/:id/scenarios")
  createScenario(
    @Param("id") id: string,
    @Body()
    body: {
      name: string;
      assumptions: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      scenario: this.scenarios.createScenario(
        id,
        body.name,
        body.assumptions,
      ),
    };
  }

  @Post("scenarios/:id/simulate")
  simulate(
    @Param("id") id: string,
    @Body() body: { runtimeInputs?: Record<string, unknown> },
  ) {
    return {
      success: true,
      simulation: this.scenarios.simulate(
        id,
        body.runtimeInputs ?? {},
      ),
    };
  }

  @Post("twins/:id/analyze")
  analyze(@Param("id") id: string) {
    return {
      success: true,
      insights: this.insights.analyze(id),
    };
  }

  @Post("twins/:id/status")
  updateStatus(
    @Param("id") id: string,
    @Body()
    body: {
      status: "ACTIVE" | "PAUSED" | "DEGRADED" | "RETIRED";
    },
  ) {
    return {
      success: true,
      twin: this.twins.setStatus(id, body.status),
    };
  }
}
