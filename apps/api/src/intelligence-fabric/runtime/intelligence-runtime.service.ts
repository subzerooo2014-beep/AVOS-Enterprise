import { Injectable } from "@nestjs/common";
import {
  IntelligenceRuntimeSnapshot,
  IntelligenceStatus,
} from "../contracts/intelligence-fabric.contracts";

@Injectable()
export class IntelligenceRuntimeService {
  private status: IntelligenceStatus = "idle";
  private activeAnalyses = 0;
  private completedAnalyses = 0;
  private failedAnalyses = 0;
  private lastActivityAt = new Date().toISOString();

  readonly version = "1.0.0";

  begin(): () => void {
    this.activeAnalyses += 1;
    this.status = "analyzing";
    this.touch();

    let settled = false;
    return () => {
      if (settled) return;
      settled = true;
      this.activeAnalyses = Math.max(0, this.activeAnalyses - 1);
      this.completedAnalyses += 1;
      this.status = this.activeAnalyses > 0 ? "analyzing" : "completed";
      this.touch();
    };
  }

  fail(): void {
    this.failedAnalyses += 1;
    this.status = "failed";
    this.touch();
  }

  snapshot(): IntelligenceRuntimeSnapshot {
    return {
      status: this.status,
      activeAnalyses: this.activeAnalyses,
      completedAnalyses: this.completedAnalyses,
      failedAnalyses: this.failedAnalyses,
      version: this.version,
      lastActivityAt: this.lastActivityAt,
    };
  }

  private touch(): void {
    this.lastActivityAt = new Date().toISOString();
  }
}