import { Injectable } from "@nestjs/common";
import { FactoryLifecycleState } from "../contracts/factory.contracts";

@Injectable()
export class FactoryLifecycleService {
  private state: FactoryLifecycleState = "created";
  private readonly history: Array<{ state: FactoryLifecycleState; at: string; reason?: string }> = [
    { state: "created", at: new Date().toISOString() },
  ];

  transition(next: FactoryLifecycleState, reason?: string): FactoryLifecycleState {
    if (!this.isAllowed(this.state, next)) {
      throw new Error(`Invalid factory lifecycle transition: ${this.state} -> ${next}`);
    }

    this.state = next;
    this.history.push({ state: next, at: new Date().toISOString(), reason });
    return this.state;
  }

  current(): FactoryLifecycleState {
    return this.state;
  }

  timeline() {
    return [...this.history];
  }

  private isAllowed(current: FactoryLifecycleState, next: FactoryLifecycleState): boolean {
    const allowed: Record<FactoryLifecycleState, FactoryLifecycleState[]> = {
      created: ["bootstrapping", "failed"],
      bootstrapping: ["ready", "degraded", "failed"],
      ready: ["running", "stopping", "degraded", "failed"],
      running: ["ready", "degraded", "stopping", "failed"],
      degraded: ["ready", "running", "stopping", "failed"],
      stopping: ["stopped", "failed"],
      stopped: ["bootstrapping"],
      failed: ["bootstrapping", "stopped"],
    };

    return current === next || allowed[current].includes(next);
  }
}
