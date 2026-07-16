import { Injectable } from "@nestjs/common";
import { EventPlatformCatalogService } from "./event-platform-catalog.service";

@Injectable()
export class EventPlatformGovernanceService {
  constructor(
    private readonly catalog: EventPlatformCatalogService,
  ) {}

  validate() {
    const components = this.catalog.list();
    const violations: {
      code: string;
      component: string;
      message: string;
    }[] = [];

    const duplicatePaths = new Map<string, number>();

    for (const component of components) {
      duplicatePaths.set(
        component.filePath,
        (duplicatePaths.get(component.filePath) ?? 0) + 1,
      );

      if (component.version.trim().length === 0) {
        violations.push({
          code: "EVENT_COMPONENT_VERSION_MISSING",
          component: component.id,
          message: "Event component version is missing.",
        });
      }

      if (component.type === "UNKNOWN") {
        violations.push({
          code: "EVENT_COMPONENT_TYPE_UNKNOWN",
          component: component.id,
          message: "Event component type could not be classified.",
        });
      }
    }

    for (const [filePath, count] of duplicatePaths.entries()) {
      if (count > 1) {
        violations.push({
          code: "EVENT_COMPONENT_DUPLICATE",
          component: filePath,
          message: `Event component was discovered ${count} times.`,
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
