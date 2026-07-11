import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ResilienceMode } from "../enums/resilience-mode.enum";
import { ResilienceEvent } from "../interfaces/resilience-event.interface";

@Injectable()
export class ResilienceStateService {
  private mode = ResilienceMode.NORMAL;
  private maintenanceReason: string | null = null;
  private readonly events: ResilienceEvent[] = [];

  getMode(): ResilienceMode {
    return this.mode;
  }

  isMaintenance(): boolean {
    return this.mode === ResilienceMode.MAINTENANCE;
  }

  isBrownout(): boolean {
    return this.mode === ResilienceMode.BROWNOUT;
  }

  isEmergency(): boolean {
    return this.mode === ResilienceMode.EMERGENCY;
  }

  getMaintenanceReason(): string | null {
    return this.maintenanceReason;
  }

  setMode(
    mode: ResilienceMode,
    reason?: string,
  ) {
    const previousMode = this.mode;

    this.mode = mode;

    if (mode === ResilienceMode.MAINTENANCE) {
      this.maintenanceReason =
        reason?.trim() ||
        "Scheduled AVOS platform maintenance";
    } else {
      this.maintenanceReason = null;
    }

    this.recordEvent({
      type: "resilience.mode.changed",
      message:
        `Resilience mode changed from ${previousMode} to ${mode}`,
      previousMode,
      currentMode: mode,
      metadata: {
        reason: reason ?? null,
      },
    });

    return this.getSnapshot();
  }

  getSnapshot() {
    return {
      mode: this.mode,
      maintenanceReason:
        this.maintenanceReason,
      brownoutActive: this.isBrownout(),
      maintenanceActive:
        this.isMaintenance(),
      emergencyActive: this.isEmergency(),
      updatedAt:
        this.events[0]?.createdAt ?? null,
    };
  }

  getRecentEvents(limit = 50): ResilienceEvent[] {
    const normalizedLimit = Math.min(
      Math.max(limit, 1),
      500,
    );

    return this.events
      .slice(0, normalizedLimit)
      .map((item) => ({
        ...item,
        metadata: item.metadata
          ? { ...item.metadata }
          : undefined,
      }));
  }

  private recordEvent(
    input: Omit<ResilienceEvent, "id" | "createdAt">,
  ): void {
    this.events.unshift({
      id: randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
    });

    if (this.events.length > 1000) {
      this.events.length = 1000;
    }
  }
}
