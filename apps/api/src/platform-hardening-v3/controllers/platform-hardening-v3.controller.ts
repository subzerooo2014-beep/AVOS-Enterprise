import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { DiagnosticsTokenGuard } from "../guards/diagnostics-token.guard";
import { AlertRuleService } from "../services/alert-rule.service";
import { IncidentRegistryService } from "../services/incident-registry.service";
import { PlatformHardeningV3Service } from "../services/platform-hardening-v3.service";
import { RequestMetricsService } from "../services/request-metrics.service";

@Controller("platform-hardening/v3")
export class PlatformHardeningV3Controller {
  constructor(
    private readonly hardening:
      PlatformHardeningV3Service,
    private readonly metrics:
      RequestMetricsService,
    private readonly incidents:
      IncidentRegistryService,
    private readonly alerts:
      AlertRuleService,
  ) {}

  @Get("status")
  getStatus() {
    return this.hardening.getStatus();
  }

  @Get("snapshot")
  @UseGuards(DiagnosticsTokenGuard)
  getSnapshot() {
    return this.hardening.getOperationalSnapshot();
  }

  @Get("metrics")
  @UseGuards(DiagnosticsTokenGuard)
  getMetrics() {
    return {
      success: true,
      metrics: this.metrics.getSnapshot(),
    };
  }

  @Get("metrics/recent")
  @UseGuards(DiagnosticsTokenGuard)
  getRecentMetrics(
    @Query("limit", new ParseIntPipe({
      optional: true,
    }))
    limit = 100,
  ) {
    return {
      success: true,
      metrics:
        this.metrics.getRecent(limit),
    };
  }

  @Get("incidents")
  @UseGuards(DiagnosticsTokenGuard)
  getIncidents() {
    return {
      success: true,
      summary:
        this.incidents.getSummary(),
      incidents:
        this.incidents.findAll(),
    };
  }

  @Get("incidents/:id")
  @UseGuards(DiagnosticsTokenGuard)
  getIncident(
    @Param("id") id: string,
  ) {
    const incident =
      this.incidents.findOne(id);

    if (!incident) {
      throw new NotFoundException({
        success: false,
        message:
          `Incident ${id} was not found`,
      });
    }

    return {
      success: true,
      incident,
    };
  }

  @Post("incidents/:id/acknowledge")
  @UseGuards(DiagnosticsTokenGuard)
  acknowledgeIncident(
    @Param("id") id: string,
  ) {
    const incident =
      this.incidents.acknowledge(id);

    if (!incident) {
      throw new NotFoundException({
        success: false,
        message:
          `Incident ${id} was not found`,
      });
    }

    return {
      success: true,
      incident,
    };
  }

  @Post("incidents/:id/resolve")
  @UseGuards(DiagnosticsTokenGuard)
  resolveIncident(
    @Param("id") id: string,
  ) {
    const incident =
      this.incidents.resolve(id);

    if (!incident) {
      throw new NotFoundException({
        success: false,
        message:
          `Incident ${id} was not found`,
      });
    }

    return {
      success: true,
      incident,
    };
  }

  @Get("alerts")
  @UseGuards(DiagnosticsTokenGuard)
  getAlerts() {
    return {
      success: true,
      rules:
        this.alerts.evaluateAll(),
    };
  }

  @Post("alerts/:id/enable")
  @UseGuards(DiagnosticsTokenGuard)
  enableAlert(
    @Param("id") id: string,
  ) {
    const rule =
      this.alerts.setEnabled(id, true);

    if (!rule) {
      throw new NotFoundException({
        success: false,
        message:
          `Alert rule ${id} was not found`,
      });
    }

    return {
      success: true,
      rule,
    };
  }

  @Post("alerts/:id/disable")
  @UseGuards(DiagnosticsTokenGuard)
  disableAlert(
    @Param("id") id: string,
  ) {
    const rule =
      this.alerts.setEnabled(id, false);

    if (!rule) {
      throw new NotFoundException({
        success: false,
        message:
          `Alert rule ${id} was not found`,
      });
    }

    return {
      success: true,
      rule,
    };
  }
}
