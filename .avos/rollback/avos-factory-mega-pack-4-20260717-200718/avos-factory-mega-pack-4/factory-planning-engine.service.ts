import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  FactoryManufacturingPlan,
  FactoryPlanStage,
  FactoryPlanningEngineStatus,
  FactoryPlanningMetrics,
  FactoryPlanningRisk,
  PlanningArchitectureInput,
  PlanningArchitectureNode
} from "./factory-planning.contracts";
import { FactoryPlanningRegistryService } from "./factory-planning-registry.service";

@Injectable()
export class FactoryPlanningEngineService {
  private readonly supportedFunctions = [
    "architecture-intake",
    "foundation-first-planning",
    "capability-resolution-planning",
    "dependency-analysis",
    "reuse-analysis",
    "stage-prioritization",
    "parallel-execution-planning",
    "risk-analysis",
    "execution-wave-generation",
    "effort-estimation",
    "plan-validation",
    "human-approval"
  ];

  constructor(
    private readonly registry: FactoryPlanningRegistryService
  ) {}

  getStatus(): FactoryPlanningEngineStatus {
    return {
      system: "AVOS Factory",
      megaPack: 4,
      component: "Factory Planning Engine",
      status: "healthy",
      registeredPlans: this.registry.count(),
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      supportedFunctions: [...this.supportedFunctions]
    };
  }

  createPlan(input: PlanningArchitectureInput): FactoryManufacturingPlan {
    this.validateInput(input);

    const planId = `factory-plan:${randomUUID()}`;
    const stages = this.createStages(input);
    const risks = this.detectRisks(input, stages);
    const executionWaves = this.createExecutionWaves(stages);
    const metrics = this.calculateMetrics(stages, risks);

    const plan: FactoryManufacturingPlan = {
      id: planId,
      architectureId: input.architectureId.trim(),
      architectureName: input.architectureName.trim(),
      architectureVersion: input.architectureVersion?.trim() || "1.0.0",
      status: risks.some((risk) => risk.severity === "error")
        ? "draft"
        : "validated",
      stages,
      executionWaves,
      risks,
      metrics,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString(),
      validatedAt: risks.some((risk) => risk.severity === "error")
        ? undefined
        : new Date().toISOString()
    };

    return this.registry.save(plan);
  }

  approvePlan(id: string, approvedBy: string): FactoryManufacturingPlan {
    const plan = this.registry.findById(id);

    if (!plan) {
      throw new NotFoundException(`Factory plan not found: ${id}`);
    }

    if (!approvedBy?.trim()) {
      throw new BadRequestException(
        "approvedBy is required by Human Final Authority."
      );
    }

    if (plan.risks.some((risk) => risk.severity === "error")) {
      throw new BadRequestException(
        "Factory plan cannot be approved while blocking risks exist."
      );
    }

    const approved: FactoryManufacturingPlan = {
      ...plan,
      status: "approved",
      approvedAt: new Date().toISOString(),
      approvedBy: approvedBy.trim()
    };

    return this.registry.save(approved);
  }

  getPlan(id: string): FactoryManufacturingPlan {
    const plan = this.registry.findById(id);

    if (!plan) {
      throw new NotFoundException(`Factory plan not found: ${id}`);
    }

    return plan;
  }

  listPlans(): FactoryManufacturingPlan[] {
    return this.registry.list();
  }

  runSmoke(): Record<string, unknown> {
    const plan = this.createPlan({
      architectureId: "factory-architecture:smoke",
      architectureName: "AVOS Factory Planning Smoke",
      architectureVersion: "1.0.0",
      constraints: {
        maxParallelStages: 4,
        requireHumanApproval: true,
        reuseExistingCapabilities: true,
        preferredRuntime: "NestJS"
      },
      nodes: [
        {
          id: "domain:factory",
          type: "domain",
          name: "Factory"
        },
        {
          id: "module:factory:planning",
          type: "module",
          name: "Planning",
          dependsOn: ["domain:factory"]
        },
        {
          id: "capability:factory-planning",
          type: "capability",
          name: "Factory Planning",
          dependsOn: ["module:factory:planning"],
          metadata: {
            reusableAssetId: "capability:fabric:factory-planning"
          }
        },
        {
          id: "service:planning-engine",
          type: "service",
          name: "Planning Engine",
          dependsOn: ["capability:factory-planning"]
        },
        {
          id: "api:planning-api",
          type: "api",
          name: "Planning API",
          dependsOn: ["service:planning-engine"]
        },
        {
          id: "security:factory-architect",
          type: "security",
          name: "Factory Architect"
        },
        {
          id: "deployment:factory-api",
          type: "deployment",
          name: "Factory API"
        }
      ]
    });

    return {
      success: plan.status === "validated",
      planId: plan.id,
      totalStages: plan.metrics.totalStages,
      executionWaves: plan.executionWaves.length,
      planningQualityScore: plan.metrics.planningQualityScore,
      checks: {
        foundationFirst:
          plan.stages[0]?.kind === "foundation",
        capabilityFirst:
          plan.stages.some(
            (stage) => stage.kind === "capability-resolution"
          ),
        dependencyAnalysis:
          plan.metrics.dependencyHealthScore > 0,
        reuseAnalysis:
          plan.metrics.reuseScore > 0,
        executionWaves:
          plan.executionWaves.length > 0,
        riskAnalysis:
          Array.isArray(plan.risks),
        humanFinalAuthority:
          plan.humanFinalAuthority === true
      }
    };
  }

  private validateInput(input: PlanningArchitectureInput): void {
    if (!input?.architectureId?.trim()) {
      throw new BadRequestException("architectureId is required.");
    }

    if (!input.architectureName?.trim()) {
      throw new BadRequestException("architectureName is required.");
    }

    if (!Array.isArray(input.nodes) || input.nodes.length === 0) {
      throw new BadRequestException(
        "Architecture nodes are required to create a manufacturing plan."
      );
    }
  }

  private createStages(
    input: PlanningArchitectureInput
  ): FactoryPlanStage[] {
    const stages: FactoryPlanStage[] = [];

    stages.push({
      id: "stage:foundation",
      name: "Foundation Readiness",
      kind: "foundation",
      priority: "critical",
      status: "ready",
      dependsOn: [],
      architectureNodeIds: input.nodes
        .filter((node) =>
          ["domain", "module"].includes(node.type.toLowerCase())
        )
        .map((node) => node.id),
      reusableAssetIds: [],
      estimatedEffortPoints: 3,
      riskScore: 5,
      canRunInParallel: false,
      requiresHumanApproval: false,
      metadata: {
        principle: "Foundation First"
      }
    });

    stages.push({
      id: "stage:capability-resolution",
      name: "Capability Resolution and Reuse",
      kind: "capability-resolution",
      priority: "critical",
      status: "pending",
      dependsOn: ["stage:foundation"],
      architectureNodeIds: input.nodes
        .filter((node) => node.type.toLowerCase() === "capability")
        .map((node) => node.id),
      reusableAssetIds: this.collectReusableAssets(input.nodes),
      estimatedEffortPoints: 5,
      riskScore: 10,
      canRunInParallel: false,
      requiresHumanApproval: false,
      metadata: {
        principle: "Capability First",
        reuseEnabled:
          input.constraints?.reuseExistingCapabilities !== false
      }
    });

    const stageDefinitions: Array<{
      id: string;
      name: string;
      kind: FactoryPlanStage["kind"];
      nodeTypes: string[];
      priority: FactoryPlanStage["priority"];
      effort: number;
      risk: number;
      parallel: boolean;
      approval: boolean;
    }> = [
      {
        id: "stage:architecture",
        name: "Architecture Materialization",
        kind: "architecture",
        nodeTypes: ["domain", "module"],
        priority: "high",
        effort: 5,
        risk: 10,
        parallel: false,
        approval: false
      },
      {
        id: "stage:data",
        name: "Data Model Production",
        kind: "data",
        nodeTypes: ["data", "entity", "database"],
        priority: "high",
        effort: 8,
        risk: 25,
        parallel: true,
        approval: false
      },
      {
        id: "stage:backend",
        name: "Backend Production",
        kind: "backend",
        nodeTypes: ["service", "api"],
        priority: "high",
        effort: 13,
        risk: 20,
        parallel: true,
        approval: false
      },
      {
        id: "stage:frontend",
        name: "Frontend Production",
        kind: "frontend",
        nodeTypes: ["ui", "frontend"],
        priority: "medium",
        effort: 8,
        risk: 15,
        parallel: true,
        approval: false
      },
      {
        id: "stage:mobile",
        name: "Mobile Production",
        kind: "mobile",
        nodeTypes: ["mobile"],
        priority: "medium",
        effort: 8,
        risk: 15,
        parallel: true,
        approval: false
      },
      {
        id: "stage:ai",
        name: "AI Capability Production",
        kind: "ai",
        nodeTypes: ["ai", "agent", "model"],
        priority: "medium",
        effort: 13,
        risk: 30,
        parallel: true,
        approval: true
      },
      {
        id: "stage:integration",
        name: "Integration Production",
        kind: "integration",
        nodeTypes: ["integration", "event", "workflow"],
        priority: "high",
        effort: 8,
        risk: 25,
        parallel: true,
        approval: false
      },
      {
        id: "stage:security",
        name: "Security and Governance Production",
        kind: "security",
        nodeTypes: ["security", "policy", "role"],
        priority: "critical",
        effort: 8,
        risk: 35,
        parallel: true,
        approval: true
      },
      {
        id: "stage:deployment",
        name: "Deployment Production",
        kind: "deployment",
        nodeTypes: ["deployment", "infrastructure"],
        priority: "high",
        effort: 8,
        risk: 30,
        parallel: true,
        approval: false
      }
    ];

    for (const definition of stageDefinitions) {
      const matchingNodes = input.nodes.filter((node) =>
        definition.nodeTypes.includes(node.type.toLowerCase())
      );

      if (matchingNodes.length === 0) {
        continue;
      }

      stages.push({
        id: definition.id,
        name: definition.name,
        kind: definition.kind,
        priority: definition.priority,
        status: "pending",
        dependsOn: [
          "stage:foundation",
          "stage:capability-resolution",
          "stage:architecture"
        ].filter((dependency, index, array) =>
          dependency !== definition.id &&
          array.indexOf(dependency) === index
        ),
        architectureNodeIds: matchingNodes.map((node) => node.id),
        reusableAssetIds: this.collectReusableAssets(matchingNodes),
        estimatedEffortPoints:
          definition.effort + Math.max(0, matchingNodes.length - 1),
        riskScore: Math.min(
          100,
          definition.risk + Math.max(0, matchingNodes.length - 3) * 2
        ),
        canRunInParallel: definition.parallel,
        requiresHumanApproval:
          definition.approval ||
          input.constraints?.requireHumanApproval === true,
        metadata: {
          nodeTypes: definition.nodeTypes,
          preferredRuntime:
            input.constraints?.preferredRuntime ?? "platform-default"
        }
      });
    }

    stages.push({
      id: "stage:testing",
      name: "Integrated Testing",
      kind: "testing",
      priority: "critical",
      status: "pending",
      dependsOn: stages
        .filter((stage) =>
          ![
            "foundation",
            "capability-resolution",
            "testing",
            "certification",
            "packaging",
            "deployment"
          ].includes(stage.kind)
        )
        .map((stage) => stage.id),
      architectureNodeIds: input.nodes.map((node) => node.id),
      reusableAssetIds: [],
      estimatedEffortPoints: 13,
      riskScore: 25,
      canRunInParallel: false,
      requiresHumanApproval: false,
      metadata: {
        includes: [
          "type-check",
          "build",
          "unit-tests",
          "integration-tests",
          "smoke-tests"
        ]
      }
    });

    stages.push({
      id: "stage:certification",
      name: "Factory Certification",
      kind: "certification",
      priority: "critical",
      status: "pending",
      dependsOn: ["stage:testing"],
      architectureNodeIds: input.nodes.map((node) => node.id),
      reusableAssetIds: [],
      estimatedEffortPoints: 5,
      riskScore: 15,
      canRunInParallel: false,
      requiresHumanApproval: true,
      metadata: {
        authority: "Human Final Authority"
      }
    });

    stages.push({
      id: "stage:packaging",
      name: "Product Packaging",
      kind: "packaging",
      priority: "high",
      status: "pending",
      dependsOn: ["stage:certification"],
      architectureNodeIds: input.nodes.map((node) => node.id),
      reusableAssetIds: [],
      estimatedEffortPoints: 5,
      riskScore: 10,
      canRunInParallel: false,
      requiresHumanApproval: false,
      metadata: {
        artifactPolicy: "Everything Generated Becomes an Asset"
      }
    });

    const deploymentStage = stages.find(
      (stage) => stage.id === "stage:deployment"
    );

    if (deploymentStage) {
      deploymentStage.dependsOn = ["stage:packaging"];
      deploymentStage.canRunInParallel = false;
    }

    return stages;
  }

  private detectRisks(
    input: PlanningArchitectureInput,
    stages: FactoryPlanStage[]
  ): FactoryPlanningRisk[] {
    const risks: FactoryPlanningRisk[] = [];
    const nodeIds = new Set(input.nodes.map((node) => node.id));

    for (const node of input.nodes) {
      for (const dependency of node.dependsOn ?? []) {
        if (!nodeIds.has(dependency)) {
          risks.push({
            code: "MISSING_ARCHITECTURE_DEPENDENCY",
            severity: "error",
            message: `Node ${node.id} depends on missing node ${dependency}.`
          });
        }
      }
    }

    if (
      !input.nodes.some(
        (node) => node.type.toLowerCase() === "capability"
      )
    ) {
      risks.push({
        code: "NO_CAPABILITY_NODES",
        severity: "warning",
        message:
          "Capability First warning: no capability nodes were supplied."
      });
    }

    if (
      !input.nodes.some(
        (node) => node.type.toLowerCase() === "security"
      )
    ) {
      risks.push({
        code: "NO_SECURITY_MODEL",
        severity: "warning",
        message:
          "No explicit security model was found in the architecture."
      });
    }

    const highRiskStages = stages.filter(
      (stage) => stage.riskScore >= 35
    );

    for (const stage of highRiskStages) {
      risks.push({
        code: "HIGH_RISK_STAGE",
        severity: "warning",
        message:
          `Stage ${stage.name} has risk score ${stage.riskScore}.`,
        stageId: stage.id
      });
    }

    if (risks.length === 0) {
      risks.push({
        code: "PLAN_RISK_ACCEPTABLE",
        severity: "info",
        message: "No blocking manufacturing risks were detected."
      });
    }

    return risks;
  }

  private createExecutionWaves(
    stages: FactoryPlanStage[]
  ): string[][] {
    const stageMap = new Map(
      stages.map((stage) => [stage.id, stage])
    );
    const completed = new Set<string>();
    const remaining = new Set(stages.map((stage) => stage.id));
    const waves: string[][] = [];

    while (remaining.size > 0) {
      const ready = [...remaining].filter((stageId) => {
        const stage = stageMap.get(stageId);

        if (!stage) {
          return false;
        }

        return stage.dependsOn.every((dependency) =>
          completed.has(dependency)
        );
      });

      if (ready.length === 0) {
        waves.push([...remaining]);
        break;
      }

      const serialStage = ready.find((stageId) => {
        const stage = stageMap.get(stageId);
        return stage ? !stage.canRunInParallel : false;
      });

      const wave = serialStage
        ? [serialStage]
        : ready;

      waves.push(wave);

      for (const stageId of wave) {
        completed.add(stageId);
        remaining.delete(stageId);
      }
    }

    return waves;
  }

  private calculateMetrics(
    stages: FactoryPlanStage[],
    risks: FactoryPlanningRisk[]
  ): FactoryPlanningMetrics {
    const totalStages = stages.length;
    const parallelizableStages = stages.filter(
      (stage) => stage.canRunInParallel
    ).length;
    const blockedStages = stages.filter(
      (stage) => stage.status === "blocked"
    ).length;
    const criticalStages = stages.filter(
      (stage) => stage.priority === "critical"
    ).length;
    const totalEstimatedEffortPoints = stages.reduce(
      (total, stage) => total + stage.estimatedEffortPoints,
      0
    );

    const reusableAssets = new Set(
      stages.flatMap((stage) => stage.reusableAssetIds)
    );

    const reuseScore = Math.min(100, reusableAssets.size * 20);
    const blockingRisks = risks.filter(
      (risk) => risk.severity === "error"
    ).length;
    const warnings = risks.filter(
      (risk) => risk.severity === "warning"
    ).length;

    const dependencyHealthScore = Math.max(
      0,
      100 - blockingRisks * 35
    );

    const planningQualityScore = Math.max(
      0,
      Math.min(
        100,
        100 -
          blockingRisks * 30 -
          warnings * 5 +
          Math.min(10, parallelizableStages * 2)
      )
    );

    return {
      totalStages,
      parallelizableStages,
      blockedStages,
      criticalStages,
      totalEstimatedEffortPoints,
      reuseScore,
      dependencyHealthScore,
      planningQualityScore
    };
  }

  private collectReusableAssets(
    nodes: PlanningArchitectureNode[]
  ): string[] {
    const assets = nodes
      .map((node) => node.metadata?.["reusableAssetId"])
      .filter((value): value is string =>
        typeof value === "string" && value.trim().length > 0
      );

    return [...new Set(assets)];
  }
}
