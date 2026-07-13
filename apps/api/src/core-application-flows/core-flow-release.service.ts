import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowRelease } from "./core-flow-autonomy.types";

@Injectable()
export class CoreFlowReleaseService {
  private readonly releases = new Map<string, FlowRelease>();

  create(dto: any) {
    const release: FlowRelease = {
      id: `release_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow: String(dto?.flow ?? "unknown"),
      version: String(dto?.version ?? "1.0.0"),
      status: "draft",
      trafficPercent: 0,
      createdAt: new Date().toISOString(),
    };
    this.releases.set(release.id, release);
    return release;
  }

  findAll(flow?: string) {
    return Array.from(this.releases.values())
      .filter((item) => !flow || item.flow === flow)
      .slice().reverse();
  }

  findOne(id: string) {
    const release = this.releases.get(id);
    if (!release) throw new NotFoundException("Flow release not found");
    return release;
  }

  canary(id: string, trafficPercent = 10) {
    const release = this.findOne(id);
    release.status = "canary";
    release.trafficPercent = Math.min(Math.max(Number(trafficPercent), 1), 50);
    return release;
  }

  activate(id: string) {
    const release = this.findOne(id);
    release.status = "active";
    release.trafficPercent = 100;
    release.activatedAt = new Date().toISOString();
    return release;
  }

  rollback(id: string) {
    const release = this.findOne(id);
    release.status = "rolled-back";
    release.trafficPercent = 0;
    return release;
  }
}
