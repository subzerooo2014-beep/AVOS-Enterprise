import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { InspectionExecutionContext } from "./inspection-plugin.types";

@Injectable()
export class InspectionContextFactory {
  create(): InspectionExecutionContext {
    const repositoryRoot = process.cwd().replace(/[\\/]apps[\\/]api$/, "");

    return {
      repositoryRoot,
      apiRoot: `${repositoryRoot}/apps/api`,
      webRoot: `${repositoryRoot}/apps/web`,
      environment: process.env.NODE_ENV ?? "development",
      correlationId: randomUUID(),
      startedAt: new Date().toISOString(),
      metadata: {
        humanFinalAuthority: true,
        nonDestructive: true,
        inspectionCleanupSeparated: true,
      },
    };
  }
}
