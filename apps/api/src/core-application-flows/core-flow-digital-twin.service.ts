import { Injectable, NotFoundException } from "@nestjs/common";

type FlowDigitalTwin = {
  id: string;
  flow: string;
  state: Record<string, unknown>;
  version: number;
  updatedAt: string;
};

@Injectable()
export class CoreFlowDigitalTwinService {
  private readonly twins = new Map<string, FlowDigitalTwin>();

  create(flow: string, state: Record<string, unknown> = {}) {
    const twin: FlowDigitalTwin = {
      id: `twin_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow,
      state,
      version: 1,
      updatedAt: new Date().toISOString(),
    };
    this.twins.set(twin.id, twin);
    return twin;
  }

  findAll() {
    return Array.from(this.twins.values()).slice().reverse();
  }

  findOne(id: string) {
    const twin = this.twins.get(id);
    if (!twin) throw new NotFoundException("Flow digital twin not found");
    return twin;
  }

  synchronize(id: string, state: Record<string, unknown>) {
    const twin = this.findOne(id);
    twin.state = { ...twin.state, ...state };
    twin.version += 1;
    twin.updatedAt = new Date().toISOString();
    return twin;
  }

  project(id: string, changes: Record<string, unknown>) {
    const twin = this.findOne(id);
    return {
      twinId: id,
      currentVersion: twin.version,
      currentState: twin.state,
      projectedState: { ...twin.state, ...changes },
      projectedAt: new Date().toISOString(),
    };
  }
}
