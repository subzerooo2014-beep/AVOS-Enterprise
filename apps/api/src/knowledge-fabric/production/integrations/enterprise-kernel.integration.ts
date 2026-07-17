import { Injectable, Logger, Optional } from "@nestjs/common";

interface KernelBridge {
  registerModule?: (module: Readonly<Record<string, unknown>>) => unknown;
  reportHealth?: (health: Readonly<Record<string, unknown>>) => unknown;
}

@Injectable()
export class EnterpriseKernelIntegration {
  private readonly logger = new Logger(EnterpriseKernelIntegration.name);

  constructor(@Optional() private readonly kernel?: KernelBridge) {}

  async register(): Promise<boolean> {
    if (!this.kernel?.registerModule) {
      this.logger.warn(
        "Enterprise Kernel bridge was not injected; KF-6 remains operational in compatibility mode.",
      );
      return false;
    }

    await this.kernel.registerModule({
      id: "knowledge-fabric-production",
      name: "AVOS Knowledge Fabric Production Runtime",
      version: "1.0.0",
      type: "platform-runtime",
      capabilities: [
        "knowledge.search",
        "knowledge.retrieve",
        "knowledge.registry",
        "knowledge.governance",
        "knowledge.monitoring",
      ],
    });
    return true;
  }

  async reportHealth(
    health: Readonly<Record<string, unknown>>,
  ): Promise<boolean> {
    if (!this.kernel?.reportHealth) {
      return false;
    }
    await this.kernel.reportHealth(health);
    return true;
  }
}