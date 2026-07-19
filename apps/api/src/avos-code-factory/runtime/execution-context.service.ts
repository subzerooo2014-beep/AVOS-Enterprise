import { Injectable } from "@nestjs/common";
import { createFactoryId } from "../utils/factory-id.util";

export interface FactoryExecutionContext {
  executionId: string;
  planId: string;
  objective: string;
  variables: Record<string, unknown>;
  createdAt: string;
}

@Injectable()
export class ExecutionContextService {
  create(planId: string, objective: string, variables: Record<string, unknown> = {}): FactoryExecutionContext {
    return {
      executionId: createFactoryId("factory-execution"),
      planId,
      objective,
      variables: { ...variables },
      createdAt: new Date().toISOString(),
    };
  }
}
