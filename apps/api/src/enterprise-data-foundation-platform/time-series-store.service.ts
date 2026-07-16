import { Injectable } from "@nestjs/common";
import type { TimeSeriesPointRecord } from "./enterprise-data-foundation.types";

@Injectable()
export class TimeSeriesStoreService {
  private readonly points: TimeSeriesPointRecord[] = [];

  write(
    metric: string,
    value: number,
    labels: Record<string, string> = {},
    timestamp = new Date().toISOString(),
  ): TimeSeriesPointRecord {
    const point: TimeSeriesPointRecord = {
      metric,
      timestamp,
      value,
      labels: { ...labels },
    };

    this.points.unshift(point);

    if (this.points.length > 10000) {
      this.points.length = 10000;
    }

    return this.clone(point);
  }

  query(
    metric: string,
    from?: string,
    to?: string,
  ): TimeSeriesPointRecord[] {
    const fromTime = from ? new Date(from).getTime() : Number.MIN_SAFE_INTEGER;
    const toTime = to ? new Date(to).getTime() : Number.MAX_SAFE_INTEGER;

    return this.points
      .filter((point) => point.metric === metric)
      .filter((point) => {
        const time = new Date(point.timestamp).getTime();
        return time >= fromTime && time <= toTime;
      })
      .map((point) => this.clone(point));
  }

  aggregate(metric: string) {
    const values = this.query(metric).map((point) => point.value);

    return {
      metric,
      count: values.length,
      sum: values.reduce((total, value) => total + value, 0),
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
      average:
        values.length === 0
          ? 0
          : values.reduce((total, value) => total + value, 0) / values.length,
    };
  }

  count(): number {
    return this.points.length;
  }

  private clone(point: TimeSeriesPointRecord): TimeSeriesPointRecord {
    return {
      ...point,
      labels: { ...point.labels },
    };
  }
}
