import { Injectable } from "@nestjs/common";
@Injectable()
export class EnterpriseMemoryGraphService {
  private readonly graph = new Map<string, Set<string>>();
  connect(source: string, target: string) {
    if (!this.graph.has(source)) this.graph.set(source, new Set<string>());
    this.graph.get(source)!.add(target);
    return { source, target, connected: true, connectedAt: new Date().toISOString() };
  }
  neighbors(source: string): string[] { return [...(this.graph.get(source) || new Set<string>())]; }
  count(): number { return this.graph.size; }
}