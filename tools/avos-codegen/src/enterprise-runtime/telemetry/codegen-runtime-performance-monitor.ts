export interface CodeGenPerformanceMeasurement {
  name: string;
  count: number;
  totalMs: number;
  averageMs: number;
  minimumMs: number;
  maximumMs: number;
}

export class CodeGenRuntimePerformanceMonitor {
  private readonly measurements =
    new Map<
      string,
      number[]
    >();

  record(
    name: string,
    durationMs: number,
  ): void {
    const current =
      this.measurements.get(
        name,
      ) ??
      [];

    current.push(
      Math.max(
        0,
        durationMs,
      ),
    );

    this.measurements.set(
      name,
      current,
    );
  }

  async measure<T>(
    name: string,
    operation:
      () => Promise<T>,
  ): Promise<T> {
    const started =
      performance.now();

    try {
      return await operation();
    } finally {
      this.record(
        name,
        performance.now() -
        started,
      );
    }
  }

  report():
    CodeGenPerformanceMeasurement[] {
    return Array.from(
      this.measurements.entries(),
    )
      .map(
        ([name, values]) => {
          const totalMs =
            values.reduce(
              (total, value) =>
                total + value,
              0,
            );

          return {
            name,
            count:
              values.length,
            totalMs,
            averageMs:
              values.length === 0
                ? 0
                : totalMs /
                  values.length,
            minimumMs:
              values.length === 0
                ? 0
                : Math.min(
                    ...values,
                  ),
            maximumMs:
              values.length === 0
                ? 0
                : Math.max(
                    ...values,
                  ),
          };
        },
      )
      .sort(
        (left, right) =>
          right.totalMs -
          left.totalMs,
      );
  }

  clear(): void {
    this.measurements.clear();
  }
}
