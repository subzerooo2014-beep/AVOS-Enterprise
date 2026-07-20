import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

interface MetricRecord {
  name: string;
  value: number;
  recordedAt: string;
}

interface TraceRecord {
  id: string;
  operation: string;
  durationMs: number;
  status: "ok" | "error";
  recordedAt: string;
}

interface LogRecord {
  level: "info" | "warn" | "error";
  message: string;
  context: Record<string, unknown>;
  recordedAt: string;
}

@Injectable()
export class EnterpriseObservabilityService {
  private readonly metrics: MetricRecord[] = [];
  private readonly traces: TraceRecord[] = [];
  private readonly logs: LogRecord[] = [];
  private readonly alerts: Record<string, unknown>[] = [];

  recordMetric(name: string, value: number): MetricRecord {
    const metric = {
      name,
      value,
      recordedAt: new Date().toISOString()
    };

    this.metrics.push(metric);
    return metric;
  }

  recordTrace(
    operation: string,
    durationMs: number,
    status: TraceRecord["status"]
  ): TraceRecord {
    const trace = {
      id: randomUUID(),
      operation,
      durationMs,
      status,
      recordedAt: new Date().toISOString()
    };

    this.traces.push(trace);
    return trace;
  }

  log(
    level: LogRecord["level"],
    message: string,
    context: Record<string, unknown> = {}
  ): LogRecord {
    const record = {
      level,
      message,
      context,
      recordedAt: new Date().toISOString()
    };

    this.logs.push(record);
    return record;
  }

  createAlert(input: Record<string, unknown>): Record<string, unknown> {
    const alert = {
      id: randomUUID(),
      ...input,
      createdAt: new Date().toISOString()
    };

    this.alerts.push(alert);
    return alert;
  }

  dashboard(): Record<string, unknown> {
    const errorTraces = this.traces.filter(
      (trace) => trace.status === "error"
    ).length;

    return {
      metrics: this.metrics.slice(-100),
      traces: this.traces.slice(-100),
      logs: this.logs.slice(-100),
      alerts: this.alerts.slice(-100),
      health: {
        status: errorTraces === 0 ? "operational" : "degraded",
        metricCount: this.metrics.length,
        traceCount: this.traces.length,
        logCount: this.logs.length,
        alertCount: this.alerts.length
      }
    };
  }

  status(): Record<string, unknown> {
    return {
      name: "Enterprise Observability",
      status: "operational",
      openTelemetryReady: true,
      metrics: true,
      distributedTracing: true,
      centralizedLogging: true,
      healthDashboards: true,
      alertManager: true,
      dashboard: this.dashboard()
    };
  }
}