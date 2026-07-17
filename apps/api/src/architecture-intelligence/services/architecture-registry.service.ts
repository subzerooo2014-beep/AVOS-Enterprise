import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ArchitectureComponent } from "../contracts/architecture-intelligence.contracts";
import { RegisterArchitectureComponentDto } from "../dto/architecture-intelligence.dto";

@Injectable()
export class ArchitectureRegistryService {
  private readonly components = new Map<string, ArchitectureComponent>();
  private sequence = 0;

  constructor() {
    const enterprise = this.register({
      key: "avos-enterprise",
      name: "AVOS Enterprise",
      type: "platform",
      layer: "foundation",
      version: "1.0.0",
      owner: "AVOS Enterprise",
      capabilities: ["platform-governance", "enterprise-orchestration"],
      contracts: ["platform-contract"],
      policies: ["human-final-authority"],
    });

    const kernel = this.register({
      key: "enterprise-kernel",
      name: "AVOS Enterprise Kernel",
      type: "kernel",
      layer: "foundation",
      version: "1.0.0",
      owner: "AVOS Enterprise",
      dependencies: [enterprise.id],
      capabilities: ["lifecycle", "diagnostics", "health", "orchestration"],
      contracts: ["kernel-contract"],
      policies: ["audit-by-design"],
    });

    this.register({
      key: "digital-identity-os",
      name: "AVOS Digital Identity OS",
      type: "capability",
      layer: "identity",
      version: "1.0.0",
      owner: "AVOS Enterprise",
      dependencies: [kernel.id],
      capabilities: ["universal-identity", "digital-dna", "identity-governance"],
      contracts: ["identity-contract"],
      policies: ["human-final-authority", "identity-traceability"],
    });

    this.register({
      key: "enterprise-metadata",
      name: "AVOS Enterprise Metadata & Dependency Graph",
      type: "fabric",
      layer: "metadata",
      version: "1.0.0",
      owner: "AVOS Enterprise",
      dependencies: [kernel.id],
      capabilities: ["metadata-registry", "dependency-graph", "lineage", "impact-analysis"],
      contracts: ["metadata-contract"],
      policies: ["metadata-governance"],
    });
  }

  register(input: RegisterArchitectureComponentDto): ArchitectureComponent {
    const key = input.key.trim().toLowerCase();
    if (!key || !input.name?.trim() || !input.layer?.trim()) {
      throw new BadRequestException("key, name, and layer are required");
    }

    if ([...this.components.values()].some((component) => component.key === key)) {
      throw new BadRequestException(`Architecture component key already exists: ${key}`);
    }

    const now = new Date().toISOString();
    const component: ArchitectureComponent = {
      id: `architecture-component:${Date.now()}:${++this.sequence}`,
      key,
      name: input.name.trim(),
      type: input.type,
      layer: input.layer.trim(),
      version: input.version ?? "1.0.0",
      status: input.status ?? "active",
      owner: input.owner ?? "AVOS Enterprise",
      dependencies: [...(input.dependencies ?? [])],
      capabilities: [...(input.capabilities ?? [])],
      contracts: [...(input.contracts ?? [])],
      policies: [...(input.policies ?? [])],
      metadata: { ...(input.metadata ?? {}) },
      createdAt: now,
      updatedAt: now,
    };

    this.components.set(component.id, component);
    return component;
  }

  list(): readonly ArchitectureComponent[] {
    return [...this.components.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  get(id: string): ArchitectureComponent {
    const component = this.components.get(id);
    if (!component) {
      throw new NotFoundException(`Architecture component not found: ${id}`);
    }
    return component;
  }

  findByKey(key: string): ArchitectureComponent | undefined {
    return [...this.components.values()].find(
      (component) => component.key === key.trim().toLowerCase(),
    );
  }

  dependencyCount(): number {
    return this.list().reduce((total, component) => total + component.dependencies.length, 0);
  }

  dependentsOf(componentId: string): readonly ArchitectureComponent[] {
    return this.list().filter((component) => component.dependencies.includes(componentId));
  }

  transitiveDependentsOf(componentId: string): readonly ArchitectureComponent[] {
    const visited = new Set<string>();
    const queue = [componentId];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;

      for (const dependent of this.dependentsOf(current)) {
        if (!visited.has(dependent.id)) {
          visited.add(dependent.id);
          queue.push(dependent.id);
        }
      }
    }

    return [...visited].map((id) => this.get(id));
  }
}