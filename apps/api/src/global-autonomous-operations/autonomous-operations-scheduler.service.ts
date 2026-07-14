import { Injectable } from '@nestjs/common';
import {
  GlobalOperation,
  ScheduledOperation,
} from './global-autonomous-operations.types';

@Injectable()
export class AutonomousOperationsSchedulerService {
  schedule(operations: GlobalOperation[]): ScheduledOperation[] {
    return [...operations]
      .sort(
        (left, right) =>
          right.priority - left.priority ||
          left.dependencies.length - right.dependencies.length,
      )
      .map((operation, index) => ({
        operationId: operation.id,
        scheduledAt: new Date(Date.now() + index * 60_000).toISOString(),
        sequence: index + 1,
        region: operation.region,
      }));
  }
}