import { Injectable } from "@nestjs/common";
import type { MeshTrace } from "../contracts/enterprise-intelligence-mesh.contracts";
import { MeshIdService } from "./mesh-id.service";

@Injectable()
export class MeshTraceService {
  private readonly traces = new Map<string, MeshTrace[]>();

  constructor(private readonly ids: MeshIdService) {}

  add(
    requestId: string,
    step: string,
    message: string,
    node?: string,
    data?: Readonly<Record<string, unknown>>
  ): MeshTrace {
    const trace: MeshTrace = {
      id: this.ids.create(),
      requestId,
      step,
      node,
      message,
      data,
      createdAt: this.ids.now()
    };

    const current = this.traces.get(requestId) ?? [];
    current.push(trace);
    this.traces.set(requestId, current);
    return trace;
  }

  list(requestId: string): MeshTrace[] {
    return [...(this.traces.get(requestId) ?? [])];
  }

  count(): number {
    return [...this.traces.values()].reduce((sum, items) => sum + items.length, 0);
  }
}