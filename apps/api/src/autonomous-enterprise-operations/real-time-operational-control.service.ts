import { Injectable } from '@nestjs/common';
import { MissionStatus } from './autonomous-enterprise-operations.types';

@Injectable()
export class RealTimeOperationalControlService {
  transition(
    current: MissionStatus,
    blockers: string[],
  ): MissionStatus {
    if (blockers.length > 0) {
      return 'blocked';
    }

    if (current === 'planned' || current === 'ready') {
      return 'running';
    }

    if (current === 'running') {
      return 'completed';
    }

    return current;
  }
}