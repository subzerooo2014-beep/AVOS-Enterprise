import { Injectable } from "@nestjs/common";

@Injectable()
export class EventSlaMonitorService {
  evaluate(input: {
    durationMs: number;
    thresholdMs: number;
  }) {
    return {
      withinSla: input.durationMs <= input.thresholdMs,
      breachMs: Math.max(0, input.durationMs - input.thresholdMs),
    };
  }
}
