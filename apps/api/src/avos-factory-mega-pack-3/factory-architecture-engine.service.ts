import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  ArchitectureBlueprintInput,
  ArchitectureEngineStatus,
  ArchitectureFinding,
  ArchitectureNode,
  ArchitectureNodeType,
  ArchitectureQuality,
  EnterpriseArchitectureModel
} from "./architecture-engine.contracts";
import { ArchitectureRegistryService } from "./architecture-registry.service";

@Injectable()
export class FactoryArchitectureEngineService {
  private readonly supportedDesigners = [
    "domain-designer",
    "module-designer",
    "capability-mapper",
    "service-designer",
    "api-designer",
    "data-designer",
    "event-designer",
    "workflow-designer",
    "integration-designer",
    "security-designer",
    "ai-designer",
    "ui-designer",
    "deployment-designer",
    "quality-analyzer",
    "architecture-validator"
  ];

  constructor(private readonly registry: ArchitectureRegistryService) {}

  getStatus(): ArchitectureEngineStatus {
    return {
      system: "AVOS Factory",
      megaPack: 3,
      component: "Factory Architecture Engine",
      status: "healthy",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      registeredArchitectures: this.registry.count(),
      supportedDesigners: [...this.supportedDesigners]
    };
  }

  design(input: ArchitectureBlueprintInput): EnterpriseArchitectureModel {
    this.validateInput(input);

    const architectureId = `factory-architecture:${randomUUID()}`;
    const blueprintId = input.id?.trim() || `blueprint:${randomUUID()}`;
    const nodes: ArchitectureNode[] = [];

    for (const domain of input.domains ?? []) {
      const domainId = this.toId("domain", domain.name);
      nodes.push(this.node(domainId, "domain", domain.name, domain.description));

      for (const module of domain.modules ?? []) {
        const moduleId = this.toId(`module:${domain.name}`, module.name);
        nodes.push(
          this.node(moduleId, "module", module.name, module.description, [domainId])
        );

        this.addNamedNodes(nodes, "capability", module.capabilities, moduleId);
        this.addNamedNodes(nodes, "service", module.services, moduleId);
        this.addNamedNodes(nodes, "api", module.apis, moduleId);
        this.addNamedNodes(nodes, "data", module.entities, moduleId);
        this.addNamedNodes(nodes, "event", module.events, moduleId);
        this.addNamedNodes(nodes, "workflow", module.workflows, moduleId);
      }
    }

    this.addNamedNodes(nodes, "integration", input.integrations);
    this.addNamedNodes(nodes, "security", input.securityRoles);
    this.addNamedNodes(nodes, "ai", input.aiCapabilities);
    this.addNamedNodes(nodes, "ui", input.uiSurfaces);
    this.addNamedNodes(nodes, "deployment", input.deploymentUnits);

    const findings = this.validateArchitecture(nodes);
    const quality = this.calculateQuality(nodes, findings);

    const model: EnterpriseArchitectureModel = {
      id: architectureId,
      blueprintId,
      name: input.name.trim(),
      version: input.version?.trim() || "1.0.0",
      status: findings.some((finding) => finding.severity === "error")
        ? "draft"
        : "validated",
      nodes,
      findings,
      quality,
      generatedAt: new Date().toISOString(),
      humanApprovalRequired: true
    };

    return this.registry.save(model);
  }

  certify(id: string, approvedBy: string): EnterpriseArchitectureModel {
    const existing = this.registry.findById(id);

    if (!existing) {
      throw new NotFoundException(`Architecture not found: ${id}`);
    }

    if (!approvedBy?.trim()) {
      throw new BadRequestException("approvedBy is required for Human Final Authority.");
    }

    if (existing.findings.some((finding) => finding.severity === "error")) {
      throw new BadRequestException(
        "Architecture cannot be certified while blocking findings exist."
      );
    }

    const certified: EnterpriseArchitectureModel = {
      ...existing,
      status: "certified",
      certifiedAt: new Date().toISOString(),
      findings: [
        ...existing.findings,
        {
          code: "HUMAN_FINAL_AUTHORITY",
          severity: "info",
          message: `Architecture approved by ${approvedBy.trim()}.`
        }
      ]
    };

    return this.registry.save(certified);
  }

  getById(id: string): EnterpriseArchitectureModel {
    const model = this.registry.findById(id);

    if (!model) {
      throw new NotFoundException(`Architecture not found: ${id}`);
    }

    return model;
  }

  list(): EnterpriseArchitectureModel[] {
    return this.registry.list();
  }

  runSmoke(): Record<string, unknown> {
    const model = this.design({
      id: "factory-blueprint:smoke",
      name: "AVOS Factory Architecture Smoke",
      version: "1.0.0",
      domains: [
        {
          name: "Factory",
          modules: [
            {
              name: "Architecture",
              capabilities: ["Architecture Design"],
              services: ["Architecture Engine"],
              apis: ["Architecture API"],
              entities: ["Architecture Model"],
              events: ["Architecture Designed"],
              workflows: ["Design Architecture"]
            }
          ]
        }
      ],
      integrations: ["Capability Fabric"],
      securityRoles: ["Factory Architect"],
      aiCapabilities: ["Architecture Recommendation"],
      uiSurfaces: ["Factory Architecture Console"],
      deploymentUnits: ["Factory API"]
    });

    return {
      success: model.status === "validated",
      architectureId: model.id,
      nodeCount: model.nodes.length,
      qualityScore: model.quality.score,
      checks: {
        domainDesigner: model.nodes.some((node) => node.type === "domain"),
        moduleDesigner: model.nodes.some((node) => node.type === "module"),
        capabilityMapper: model.nodes.some((node) => node.type === "capability"),
        serviceDesigner: model.nodes.some((node) => node.type === "service"),
        apiDesigner: model.nodes.some((node) => node.type === "api"),
        dataDesigner: model.nodes.some((node) => node.type === "data"),
        eventDesigner: model.nodes.some((node) => node.type === "event"),
        workflowDesigner: model.nodes.some((node) => node.type === "workflow"),
        integrationDesigner: model.nodes.some((node) => node.type === "integration"),
        securityDesigner: model.nodes.some((node) => node.type === "security"),
        aiDesigner: model.nodes.some((node) => node.type === "ai"),
        uiDesigner: model.nodes.some((node) => node.type === "ui"),
        deploymentDesigner: model.nodes.some((node) => node.type === "deployment"),
        humanFinalAuthority: model.humanApprovalRequired
      }
    };
  }

  private validateInput(input: ArchitectureBlueprintInput): void {
    if (!input || !input.name?.trim()) {
      throw new BadRequestException("Blueprint name is required.");
    }

    if (!input.domains?.length) {
      throw new BadRequestException(
        "Foundation First requires at least one domain before architecture generation."
      );
    }
  }

  private addNamedNodes(
    nodes: ArchitectureNode[],
    type: ArchitectureNodeType,
    values: string[] | undefined,
    parentId?: string
  ): void {
    for (const value of values ?? []) {
      if (!value?.trim()) {
        continue;
      }

      const id = this.toId(parentId ? `${type}:${parentId}` : type, value);
      nodes.push(this.node(id, type, value, undefined, parentId ? [parentId] : []));
    }
  }

  private node(
    id: string,
    type: ArchitectureNodeType,
    name: string,
    description?: string,
    dependsOn: string[] = []
  ): ArchitectureNode {
    return {
      id,
      type,
      name: name.trim(),
      description: description?.trim(),
      dependsOn,
      metadata: {
        generatedBy: "AVOS Factory Architecture Engine",
        blueprintDriven: true
      }
    };
  }

  private validateArchitecture(nodes: ArchitectureNode[]): ArchitectureFinding[] {
    const findings: ArchitectureFinding[] = [];
    const ids = new Set<string>();

    for (const node of nodes) {
      if (ids.has(node.id)) {
        findings.push({
          code: "DUPLICATE_NODE",
          severity: "error",
          message: `Duplicate architecture node: ${node.id}`,
          nodeId: node.id
        });
      }

      ids.add(node.id);
    }

    for (const node of nodes) {
      for (const dependency of node.dependsOn) {
        if (!ids.has(dependency)) {
          findings.push({
            code: "MISSING_DEPENDENCY",
            severity: "error",
            message: `Missing dependency ${dependency} for ${node.id}.`,
            nodeId: node.id
          });
        }
      }
    }

    const hasCapabilities = nodes.some((node) => node.type === "capability");
    if (!hasCapabilities) {
      findings.push({
        code: "CAPABILITY_FIRST_WARNING",
        severity: "warning",
        message: "No capability nodes were declared in the blueprint."
      });
    }

    const hasSecurity = nodes.some((node) => node.type === "security");
    if (!hasSecurity) {
      findings.push({
        code: "SECURITY_MODEL_WARNING",
        severity: "warning",
        message: "No security roles or policies were declared."
      });
    }

    if (findings.length === 0) {
      findings.push({
        code: "ARCHITECTURE_VALID",
        severity: "info",
        message: "Architecture passed structural validation."
      });
    }

    return findings;
  }

  private calculateQuality(
    nodes: ArchitectureNode[],
    findings: ArchitectureFinding[]
  ): ArchitectureQuality {
    const errors = findings.filter((item) => item.severity === "error").length;
    const warnings = findings.filter((item) => item.severity === "warning").length;
    const typeCoverage = new Set(nodes.map((node) => node.type)).size;
    const coverageScore = Math.min(100, Math.round((typeCoverage / 13) * 100));
    const penalty = errors * 25 + warnings * 5;

    const score = Math.max(0, Math.min(100, coverageScore - penalty + 20));

    return {
      score,
      cohesionScore: Math.max(0, Math.min(100, score + 3)),
      couplingScore: Math.max(0, Math.min(100, score - 2)),
      reusabilityScore: Math.max(0, Math.min(100, score + 2)),
      maintainabilityScore: score,
      governanceScore: errors === 0 ? 100 : Math.max(0, 100 - errors * 30)
    };
  }

  private toId(prefix: string, value: string): string {
    const normalized = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return `${prefix.toLowerCase().replace(/[^a-z0-9:]+/g, "-")}:${normalized}`;
  }
}
