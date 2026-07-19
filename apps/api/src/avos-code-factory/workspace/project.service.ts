import { Injectable } from "@nestjs/common";
import { FactoryProject } from "../contracts/workspace.contracts";
import { CreateProjectDto } from "../dto/create-project.dto";
import { createFactoryId } from "../utils/factory-id.util";
import { createFactorySlug } from "../utils/factory-slug.util";
import { FactoryEventBusService } from "../events/event-bus.service";

@Injectable()
export class FactoryProjectService {
  private readonly projects = new Map<string, FactoryProject>();

  constructor(private readonly events: FactoryEventBusService) {}

  async create(dto: CreateProjectDto): Promise<FactoryProject> {
    const now = new Date().toISOString();
    const slug = createFactorySlug(dto.name);

    if (!slug) {
      throw new Error("Project name cannot produce an empty slug.");
    }

    const project: FactoryProject = {
      id: createFactoryId("factory-project"),
      name: dto.name.trim(),
      slug,
      objective: dto.objective.trim(),
      status: "active",
      rootPath: dto.rootPath?.trim() || `factory-workspaces/${slug}`,
      metadata: dto.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.projects.set(project.id, project);

    await this.events.publish(
      "factory.project.created",
      "factory-workspace",
      {
        projectId: project.id,
        name: project.name,
        slug: project.slug,
      },
      { subject: project.id },
    );

    return project;
  }

  get(id: string): FactoryProject | undefined {
    return this.projects.get(id);
  }

  list(): FactoryProject[] {
    return [...this.projects.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  async archive(id: string): Promise<FactoryProject | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    project.status = "archived";
    project.updatedAt = new Date().toISOString();

    await this.events.publish(
      "factory.project.archived",
      "factory-workspace",
      { projectId: project.id },
      { subject: project.id },
    );

    return project;
  }
}
