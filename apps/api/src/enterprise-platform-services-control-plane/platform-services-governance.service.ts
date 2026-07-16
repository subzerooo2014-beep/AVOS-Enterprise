import { Injectable } from "@nestjs/common";
import { PlatformServicesCatalogService } from "./platform-services-catalog.service";
import { SchedulerControlService } from "./scheduler-control.service";

@Injectable()
export class PlatformServicesGovernanceService {
  constructor(
    private readonly catalog: PlatformServicesCatalogService,
    private readonly scheduler: SchedulerControlService,
  ) {}

  validate() {
    const violations: {
      code: string;
      component: string;
      message: string;
    }[] = [];

    for (const component of this.catalog.list()) {
      if (component.type === "UNKNOWN") {
        violations.push({
          code: "PLATFORM_SERVICE_UNKNOWN",
          component: component.id,
          message: "Platform service type could not be classified.",
        });
      }
    }

    for (const task of this.scheduler.list()) {
      if (!task.schedule) {
        violations.push({
          code: "SCHEDULE_MISSING",
          component: task.id,
          message: "Scheduled task is missing a schedule expression.",
        });
      }
    }

    return {
      compliant: violations.length === 0,
      score: Math.max(0, 100 - violations.length * 5),
      checkedAt: new Date().toISOString(),
      violations,
    };
  }
}
