import { Injectable, NotFoundException } from "@nestjs/common";
import type { SovereignZone } from "./core-flow-sovereignty.types";

@Injectable()
export class CoreFlowSovereignZoneService {
  private readonly zones = new Map<string, SovereignZone>();

  create(dto: any) {
    const zone: SovereignZone = {
      id: `zone_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(dto?.name ?? "sovereign-zone"),
      country: String(dto?.country ?? "AE"),
      region: String(dto?.region ?? "uae"),
      residencyPolicy: String(dto?.residencyPolicy ?? "in-country"),
      encryptionProfile: String(dto?.encryptionProfile ?? "enterprise-default"),
      status: "provisioning",
      createdAt: new Date().toISOString(),
    };

    zone.status = "active";
    this.zones.set(zone.id, zone);
    return zone;
  }

  findAll(query: any = {}) {
    return Array.from(this.zones.values())
      .filter((zone) => !query.status || zone.status === query.status)
      .filter((zone) => !query.country || zone.country === query.country)
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const zone = this.zones.get(id);
    if (!zone) throw new NotFoundException("Sovereign zone not found");
    return zone;
  }

  restrict(id: string) {
    const zone = this.findOne(id);
    zone.status = "restricted";
    return zone;
  }

  suspend(id: string) {
    const zone = this.findOne(id);
    zone.status = "suspended";
    return zone;
  }

  retire(id: string) {
    const zone = this.findOne(id);
    zone.status = "retired";
    return zone;
  }

  dashboard() {
    const zones = Array.from(this.zones.values());
    return {
      total: zones.length,
      active: zones.filter((zone) => zone.status === "active").length,
      restricted: zones.filter((zone) => zone.status === "restricted").length,
      suspended: zones.filter((zone) => zone.status === "suspended").length,
      retired: zones.filter((zone) => zone.status === "retired").length,
      generatedAt: new Date().toISOString(),
    };
  }
}
