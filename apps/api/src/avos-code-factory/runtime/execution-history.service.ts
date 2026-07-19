import { Injectable } from "@nestjs/common";
import { FACTORY_MAX_EXECUTION_HISTORY } from "../constants/factory.constants";
import { FactoryExecutionResult } from "../contracts/factory.contracts";

@Injectable()
export class ExecutionHistoryService {
  private readonly records: FactoryExecutionResult[] = [];

  add(result: FactoryExecutionResult): FactoryExecutionResult {
    this.records.unshift(result);
    if (this.records.length > FACTORY_MAX_EXECUTION_HISTORY) {
      this.records.length = FACTORY_MAX_EXECUTION_HISTORY;
    }
    return result;
  }

  update(executionId: string, patch: Partial<FactoryExecutionResult>): FactoryExecutionResult | undefined {
    const index = this.records.findIndex((item) => item.executionId === executionId);
    if (index < 0) return undefined;
    this.records[index] = { ...this.records[index], ...patch };
    return this.records[index];
  }

  get(executionId: string): FactoryExecutionResult | undefined {
    return this.records.find((item) => item.executionId === executionId);
  }

  list(limit = 50): FactoryExecutionResult[] {
    return this.records.slice(0, Math.max(1, Math.min(limit, 500)));
  }
}
