import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowEncryptionKey } from "./core-flow-sovereignty.types";
import { CoreFlowSovereignZoneService } from "./core-flow-sovereign-zone.service";

@Injectable()
export class CoreFlowKeyManagementService {
  private readonly keys = new Map<string, FlowEncryptionKey>();

  constructor(private readonly zones: CoreFlowSovereignZoneService) {}

  create(zoneId: string, alias: string) {
    this.zones.findOne(zoneId);

    const key: FlowEncryptionKey = {
      id: `key_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      zoneId,
      alias,
      version: 1,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    this.keys.set(key.id, key);
    return key;
  }

  findAll(zoneId?: string) {
    return Array.from(this.keys.values())
      .filter((key) => !zoneId || key.zoneId === zoneId)
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const key = this.keys.get(id);
    if (!key) throw new NotFoundException("Flow encryption key not found");
    return key;
  }

  rotate(id: string) {
    const key = this.findOne(id);
    key.status = "rotating";
    key.version += 1;
    key.rotatedAt = new Date().toISOString();
    key.status = "active";
    return key;
  }

  retire(id: string) {
    const key = this.findOne(id);
    key.status = "retired";
    return key;
  }
}
