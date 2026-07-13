import { Injectable } from "@nestjs/common";

type TimeoutEntry = {
  id: string;
  executionId: string;
  nodeId: string;
  deadline: number;
  status: "active" | "expired" | "cancelled";
};

@Injectable()
export class CoreFlowTimeoutService {
  private readonly entries = new Map<string, TimeoutEntry>();

  register(executionId: string, nodeId: string, timeoutMs: number) {
    const entry: TimeoutEntry = {
      id: `timeout_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId,
      nodeId,
      deadline: Date.now() + Math.max(Number(timeoutMs || 0), 1),
      status: "active",
    };
    this.entries.set(entry.id, entry);
    return entry;
  }

  cancel(executionId: string, nodeId: string) {
    for (const entry of this.entries.values()) {
      if (
        entry.executionId === executionId &&
        entry.nodeId === nodeId &&
        entry.status === "active"
      ) {
        entry.status = "cancelled";
      }
    }
  }

  collectExpired() {
    const now = Date.now();
    const expired = Array.from(this.entries.values()).filter(
      (entry) => entry.status === "active" && entry.deadline <= now,
    );
    for (const entry of expired) {
      entry.status = "expired";
    }
    return expired;
  }

  dashboard() {
    const entries = Array.from(this.entries.values());
    return {
      active: entries.filter((entry) => entry.status === "active").length,
      expired: entries.filter((entry) => entry.status === "expired").length,
      cancelled: entries.filter((entry) => entry.status === "cancelled").length,
      generatedAt: new Date().toISOString(),
    };
  }
}
