import { Injectable } from '@nestjs/common';
import { RuntimeQueueService } from './runtime-queue.service';

export interface RuntimeSchedule {
  id: string;
  type: string;
  payload: unknown;
  intervalMs: number;
  enabled: boolean;
}

@Injectable()
export class RuntimeSchedulerService {
  private readonly schedules = new Map<string, RuntimeSchedule>();
  private readonly timers = new Map<string, NodeJS.Timeout>();

  constructor(private readonly queue: RuntimeQueueService) {}

  register(schedule: RuntimeSchedule): void {
    this.stop(schedule.id);
    this.schedules.set(schedule.id, structuredClone(schedule));

    if (schedule.enabled) {
      const timer = setInterval(() => {
        this.queue.enqueue(schedule.type, schedule.payload);
      }, schedule.intervalMs);

      timer.unref();
      this.timers.set(schedule.id, timer);
    }
  }

  stop(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(id);
    }
  }

  list(): RuntimeSchedule[] {
    return [...this.schedules.values()].map((item) =>
      structuredClone(item),
    );
  }
}