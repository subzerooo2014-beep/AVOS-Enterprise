import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  ServiceUnavailableException,
} from "@nestjs/common";
import {
  KnowledgeFabricRuntimeSnapshot,
  KnowledgeFabricRuntimeStatus,
} from "../contracts/knowledge-fabric-production.contracts";

@Injectable()
export class KnowledgeFabricRuntimeService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(KnowledgeFabricRuntimeService.name);
  private status: KnowledgeFabricRuntimeStatus = "stopped";
  private startedAt?: string;
  private stoppedAt?: string;
  private lastTransitionAt = new Date().toISOString();
  private activeRequests = 0;
  private completedRequests = 0;
  private failedRequests = 0;

  readonly version = "1.0.0";

  async onApplicationBootstrap(): Promise<void> {
    await this.start();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.stop();
  }

  async start(): Promise<KnowledgeFabricRuntimeSnapshot> {
    if (this.status === "running") {
      return this.snapshot();
    }

    this.transition("starting");
    try {
      this.startedAt = new Date().toISOString();
      this.stoppedAt = undefined;
      this.transition("running");
      this.logger.log("Knowledge Fabric production runtime started.");
      return this.snapshot();
    } catch (error) {
      this.transition("failed");
      throw error;
    }
  }

  async stop(): Promise<KnowledgeFabricRuntimeSnapshot> {
    if (this.status === "stopped") {
      return this.snapshot();
    }

    this.transition("stopping");
    this.stoppedAt = new Date().toISOString();
    this.transition("stopped");
    this.logger.log("Knowledge Fabric production runtime stopped.");
    return this.snapshot();
  }

  assertAvailable(): void {
    if (this.status !== "running" && this.status !== "degraded") {
      throw new ServiceUnavailableException(
        `Knowledge Fabric runtime is ${this.status}.`,
      );
    }
  }

  beginRequest(): () => void {
    this.assertAvailable();
    this.activeRequests += 1;
    let settled = false;

    return () => {
      if (!settled) {
        settled = true;
        this.activeRequests = Math.max(0, this.activeRequests - 1);
        this.completedRequests += 1;
      }
    };
  }

  recordFailure(): void {
    this.failedRequests += 1;
  }

  markDegraded(reason: string): void {
    this.logger.warn(`Knowledge Fabric runtime degraded: ${reason}`);
    this.transition("degraded");
  }

  markHealthy(): void {
    if (this.status === "degraded") {
      this.transition("running");
    }
  }

  snapshot(): KnowledgeFabricRuntimeSnapshot {
    return {
      status: this.status,
      startedAt: this.startedAt,
      stoppedAt: this.stoppedAt,
      lastTransitionAt: this.lastTransitionAt,
      activeRequests: this.activeRequests,
      completedRequests: this.completedRequests,
      failedRequests: this.failedRequests,
      version: this.version,
    };
  }

  private transition(status: KnowledgeFabricRuntimeStatus): void {
    this.status = status;
    this.lastTransitionAt = new Date().toISOString();
  }
}