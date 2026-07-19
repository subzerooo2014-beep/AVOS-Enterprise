import { Injectable } from "@nestjs/common";
import {
  MaintenanceWindow,
  OperationsEnvironment,
} from "./platform-production-mega-pack-3.types";
import { OperationsFileStoreService } from "./operations-file-store.service";
import { RuntimeFleetManagementService } from "./runtime-fleet-management.service";

@Injectable()
export class MaintenanceWindowService {
  constructor(
    private readonly store: OperationsFileStoreService,
    private readonly fleet: RuntimeFleetManagementService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  schedule(input: {
    environment: OperationsEnvironment["key"];
    title: string;
    description: string;
    startsAt: string;
    endsAt: string;
    affectedServices: string[];
    approvedBy: string;
  }): MaintenanceWindow {
    if (!input.approvedBy.startsWith("human:")) {
      throw new Error(
        "Maintenance window requires Human Final Authority.",
      );
    }

    if (
      new Date(input.endsAt).getTime() <=
      new Date(input.startsAt).getTime()
    ) {
      throw new Error("Maintenance window end must be after start.");
    }

    const window: MaintenanceWindow = {
      ...input,
      id: this.id("maintenance"),
      status: "scheduled",
      createdAt: this.now(),
    };

    this.store.writeJson(`maintenance/${window.id}.json`, window);
    return window;
  }

  start(id: string): MaintenanceWindow {
    const window = this.get(id);

    for (const node of this.fleet
      .list()
      .filter(
        (item) =>
          item.environment === window.environment &&
          window.affectedServices.includes(item.runtimeKey),
      )) {
      this.fleet.update(node.id, {
        status: "maintenance",
      });
    }

    return this.update(window, "active");
  }

  complete(id: string): MaintenanceWindow {
    const window = this.get(id);

    for (const node of this.fleet
      .list()
      .filter(
        (item) =>
          item.environment === window.environment &&
          window.affectedServices.includes(item.runtimeKey),
      )) {
      this.fleet.update(node.id, {
        status: "online",
        healthScore: 100,
      });
    }

    return this.update(window, "completed");
  }

  list(): MaintenanceWindow[] {
    return this.store.listJson<MaintenanceWindow>("maintenance");
  }

  get(id: string): MaintenanceWindow {
    const window = this.list().find((item) => item.id === id);

    if (!window) {
      throw new Error(`Maintenance window not found: ${id}`);
    }

    return window;
  }

  private update(
    window: MaintenanceWindow,
    status: MaintenanceWindow["status"],
  ): MaintenanceWindow {
    const updated: MaintenanceWindow = {
      ...window,
      status,
    };

    this.store.writeJson(`maintenance/${updated.id}.json`, updated);
    return updated;
  }
}