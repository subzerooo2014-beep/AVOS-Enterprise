import { Injectable } from '@nestjs/common';
import { GlobalOperation } from './global-autonomous-operations.types';

@Injectable()
export class GlobalEnterpriseOperationsCenterService {
  private readonly operations: GlobalOperation[] = [];

  register(operation: GlobalOperation): GlobalOperation {
    const stored = { ...operation };
    this.operations.push(stored);
    return { ...stored };
  }

  summary() {
    return {
      total: this.operations.length,
      running: this.operations.filter(
        (operation) => operation.status === 'running',
      ).length,
      blocked: this.operations.filter(
        (operation) => operation.status === 'blocked',
      ).length,
      completed: this.operations.filter(
        (operation) => operation.status === 'completed',
      ).length,
      regions: [...new Set(this.operations.map((operation) => operation.region))],
    };
  }
}