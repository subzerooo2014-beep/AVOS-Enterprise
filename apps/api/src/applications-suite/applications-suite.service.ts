import { Injectable } from "@nestjs/common";
import { AVOS_APPLICATIONS } from "./applications-suite.registry";
import {
  AvosApplicationExecutionRequest,
  AvosApplicationExecutionResult,
} from "./applications-suite.types";

@Injectable()
export class ApplicationsSuiteService {
  applications() {
    return AVOS_APPLICATIONS.map((app) => ({
      ...app,
      capabilities: [...app.capabilities],
      status: "READY",
    }));
  }

  application(key: string) {
    const app = AVOS_APPLICATIONS.find((item) => item.key === key);

    if (!app) {
      throw new Error(`Application not found: ${key}`);
    }

    return {
      ...app,
      capabilities: [...app.capabilities],
      status: "READY",
    };
  }

  execute(
    key: string,
    request: AvosApplicationExecutionRequest,
  ): AvosApplicationExecutionResult {
    const app = AVOS_APPLICATIONS.find((item) => item.key === key);

    if (!app) {
      throw new Error(`Application not found: ${key}`);
    }

    if (!request.action?.trim()) {
      throw new Error("action is required");
    }

    if (!request.tenantId?.trim()) {
      throw new Error("tenantId is required");
    }

    if (!request.userId?.trim()) {
      throw new Error("userId is required");
    }

    return {
      application: app.key,
      action: request.action,
      tenantId: request.tenantId,
      userId: request.userId,
      success: true,
      status: "COMPLETED",
      timestamp: new Date().toISOString(),
      output: {
        payload: request.payload ?? {},
        capabilities: [...app.capabilities],
        governed: true,
        observable: true,
        auditable: true,
      },
    };
  }

  health() {
    return {
      system: "AVOS Applications Suite",
      status: "HEALTHY",
      applications: AVOS_APPLICATIONS.length,
      routes: AVOS_APPLICATIONS.length * 3,
      generatedAt: new Date().toISOString(),
    };
  }
}