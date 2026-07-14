import { Injectable } from '@nestjs/common';
import { MissionExecutionResult } from './autonomous-enterprise-operations.types';

@Injectable()
export class EnterpriseCommandCenterService {
  private readonly executions: MissionExecutionResult[] = [];

  register(result: MissionExecutionResult): MissionExecutionResult {
    this.executions.push(result);
    return { ...result };
  }

  summary() {
    return {
      total: this.executions.length,
      active: this.executions.filter((item) => item.status === 'running').length,
      blocked: this.executions.filter((item) => item.status === 'blocked').length,
      completed: this.executions.filter((item) => item.status === 'completed')
        .length,
    };
  }
}