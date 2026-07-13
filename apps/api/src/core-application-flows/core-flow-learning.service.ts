import { Injectable } from "@nestjs/common";

type LearningSignal = {
  id: string;
  flow: string;
  signal: string;
  value: number;
  metadata: Record<string, unknown>;
  recordedAt: string;
};

@Injectable()
export class CoreFlowLearningService {
  private readonly signals: LearningSignal[] = [];

  record(
    flow: string,
    signal: string,
    value: number,
    metadata: Record<string, unknown> = {},
  ) {
    const item: LearningSignal = {
      id: `signal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow,
      signal,
      value: Number(value || 0),
      metadata,
      recordedAt: new Date().toISOString(),
    };

    this.signals.push(item);
    return item;
  }

  profile(flow: string) {
    const items = this.signals.filter((item) => item.flow === flow);
    const grouped = items.reduce<Record<string, number[]>>((acc, item) => {
      (acc[item.signal] ??= []).push(item.value);
      return acc;
    }, {});

    return {
      flow,
      signals: Object.fromEntries(
        Object.entries(grouped).map(([signal, values]) => [
          signal,
          {
            count: values.length,
            average: values.length
              ? Number(
                  (
                    values.reduce((sum, value) => sum + value, 0) /
                    values.length
                  ).toFixed(4),
                )
              : 0,
            min: values.length ? Math.min(...values) : 0,
            max: values.length ? Math.max(...values) : 0,
          },
        ]),
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  all() {
    return this.signals.slice().reverse();
  }
}
