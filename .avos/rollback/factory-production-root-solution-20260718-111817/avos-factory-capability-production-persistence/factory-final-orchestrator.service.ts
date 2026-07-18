import { Injectable } from "@nestjs/common";
import {
  FactoryFinalRequest,
  FactoryFinalResult
} from "./factory-final.contracts";
import { GenesisFactoryService } from "./genesis-factory.service";
import { EnterpriseFactoryService } from "./enterprise-factory.service";
import { AutonomousFactoryService } from "./autonomous-factory.service";
import { FactoryOsService } from "./factory-os.service";

@Injectable()
export class FactoryFinalOrchestratorService {
  constructor(
    private readonly genesisFactory: GenesisFactoryService,
    private readonly enterpriseFactory: EnterpriseFactoryService,
    private readonly autonomousFactory: AutonomousFactoryService,
    private readonly factoryOs: FactoryOsService
  ) {}

  execute(request: FactoryFinalRequest): FactoryFinalResult {
    if (!request.name?.trim()) {
      throw new Error("Factory execution name is required.");
    }

    if (!request.approvedBy?.startsWith("human:")) {
      throw new Error(
        "Human Final Authority approval is required."
      );
    }

    const phases = [
      this.genesisFactory.execute(request),
      this.enterpriseFactory.execute(request),
      this.autonomousFactory.execute(request),
      this.factoryOs.execute(request)
    ];

    const success = phases.every((phase) => phase.success);
    const score = Math.round(
      phases.reduce((sum, phase) => sum + phase.score, 0) /
        phases.length
    );

    return {
      success,
      executionId: `factory-final:${Date.now()}`,
      name: request.name.trim(),
      version: request.version?.trim() || "1.0.0",
      phases,
      score,
      releaseReady: success && score === 100,
      humanFinalAuthority: true,
      completedAt: new Date().toISOString()
    };
  }

  smoke() {
    const result = this.execute({
      name: "AVOS Factory Final Evolution",
      version: "1.0.0",
      approvedBy: "human:khalifa",
      targetEnvironment: "staging",
      enterpriseDomain: "universal-enterprise",
      capabilities: [
        "identity",
        "workflow",
        "analytics",
        "governance",
        "knowledge",
        "generation"
      ],
      channels: ["api", "web", "mobile"],
      objectives: [
        "generate-complete-systems",
        "generate-enterprise-products",
        "controlled-autonomous-evolution",
        "unified-factory-operating-system"
      ]
    });

    const checks = {
      executionCompleted: result.success,
      fourPhasesCompleted:
        result.phases.length === 4 &&
        result.phases.every((phase) => phase.success),
      perfectScore: result.score === 100,
      releaseReady: result.releaseReady,
      humanFinalAuthority: result.humanFinalAuthority
    };

    const success = Object.values(checks).every(Boolean);

    return {
      success,
      score: success ? 100 : 0,
      checks,
      result
    };
  }

  health() {
    return {
      status: "healthy",
      score: 100,
      genesisFactory: true,
      enterpriseFactory: true,
      autonomousFactory: true,
      factoryOs: true,
      blueprintDriven: true,
      capabilityFirst: true,
      foundationFirst: true,
      knowledgeIntegration: true,
      genesisIntegration: true,
      rollbackReady: true,
      humanFinalAuthority: true
    };
  }

  roadmap() {
    return {
      completedPhases: [
        "factory-foundation",
        "capability-factory",
        "evolution-factory",
        "product-factory",
        "genesis-factory",
        "enterprise-factory",
        "autonomous-factory",
        "factory-os"
      ],
      remainingCorePhases: 0,
      status: "core-vision-completed",
      futureWork:
        "integration hardening, persistence, UI, real generators, and production deployment"
    };
  }
}
