import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ResilienceMode } from "../enums/resilience-mode.enum";
import { V4DiagnosticsTokenGuard } from "../guards/v4-diagnostics-token.guard";
import { PlatformHardeningV4Service } from "../services/platform-hardening-v4.service";
import { ResilienceStateService } from "../services/resilience-state.service";
import { SloManagementService } from "../services/slo-management.service";
import { TrafficProtectionService } from "../services/traffic-protection.service";

@Controller("platform-hardening/v4")
export class PlatformHardeningV4Controller {
  constructor(
    private readonly hardening:
      PlatformHardeningV4Service,
    private readonly resilience:
      ResilienceStateService,
    private readonly traffic:
      TrafficProtectionService,
    private readonly slo:
      SloManagementService,
  ) {}

  @Get("status")
  getStatus() {
    return this.hardening.getStatus();
  }

  @Get("snapshot")
  @UseGuards(V4DiagnosticsTokenGuard)
  getSnapshot() {
    return this.hardening.getSnapshot();
  }

  @Get("mode")
  @UseGuards(V4DiagnosticsTokenGuard)
  getMode() {
    return {
      success: true,
      resilience:
        this.resilience.getSnapshot(),
    };
  }

  @Get("traffic")
  @UseGuards(V4DiagnosticsTokenGuard)
  getTraffic() {
    return {
      success: true,
      policy: this.traffic.getPolicy(),
      state: this.traffic.getState(),
    };
  }

  @Get("slo")
  @UseGuards(V4DiagnosticsTokenGuard)
  getSlo() {
    return {
      success: true,
      slo: this.slo.getSummary(),
    };
  }

  @Get("events")
  @UseGuards(V4DiagnosticsTokenGuard)
  getEvents() {
    return {
      success: true,
      events:
        this.resilience.getRecentEvents(),
    };
  }

  @Post("mode/:mode")
  @UseGuards(V4DiagnosticsTokenGuard)
  setMode(
    @Param("mode") mode: string,
  ) {
    const normalized =
      mode.toLowerCase();

    const allowed = Object.values(
      ResilienceMode,
    );

    if (
      !allowed.includes(
        normalized as ResilienceMode,
      )
    ) {
      return {
        success: false,
        message:
          `Unsupported resilience mode: ${mode}`,
        allowedModes: allowed,
      };
    }

    return {
      success: true,
      resilience:
        this.resilience.setMode(
          normalized as ResilienceMode,
        ),
    };
  }

  @Post("maintenance/enable")
  @UseGuards(V4DiagnosticsTokenGuard)
  enableMaintenance() {
    return {
      success: true,
      resilience:
        this.resilience.setMode(
          ResilienceMode.MAINTENANCE,
          "Manual maintenance enabled through V4 diagnostics",
        ),
    };
  }

  @Post("maintenance/disable")
  @UseGuards(V4DiagnosticsTokenGuard)
  disableMaintenance() {
    return {
      success: true,
      resilience:
        this.resilience.setMode(
          ResilienceMode.NORMAL,
          "Maintenance completed",
        ),
    };
  }

  @Post("brownout/enable")
  @UseGuards(V4DiagnosticsTokenGuard)
  enableBrownout() {
    return {
      success: true,
      resilience:
        this.resilience.setMode(
          ResilienceMode.BROWNOUT,
          "Brownout mode enabled",
        ),
    };
  }

  @Post("brownout/disable")
  @UseGuards(V4DiagnosticsTokenGuard)
  disableBrownout() {
    return {
      success: true,
      resilience:
        this.resilience.setMode(
          ResilienceMode.NORMAL,
          "Brownout mode disabled",
        ),
    };
  }

  @Post("emergency/enable")
  @UseGuards(V4DiagnosticsTokenGuard)
  enableEmergency() {
    return {
      success: true,
      resilience:
        this.resilience.setMode(
          ResilienceMode.EMERGENCY,
          "Emergency protection enabled",
        ),
    };
  }

  @Post("emergency/disable")
  @UseGuards(V4DiagnosticsTokenGuard)
  disableEmergency() {
    return {
      success: true,
      resilience:
        this.resilience.setMode(
          ResilienceMode.NORMAL,
          "Emergency protection disabled",
        ),
    };
  }
}
