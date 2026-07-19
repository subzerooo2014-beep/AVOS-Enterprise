import { Injectable } from "@nestjs/common";
import { FactoryBlueprintIR } from "../contracts/generation.contracts";
import { GenerateProjectDto } from "../dto/generate-project.dto";
import { createFactoryId } from "../utils/factory-id.util";
import { FactoryProjectService } from "../workspace/project.service";

@Injectable()
export class FactoryBlueprintIrService {
  constructor(private readonly projects: FactoryProjectService) {}

  compile(dto: GenerateProjectDto): FactoryBlueprintIR {
    const project = this.projects.get(dto.projectId);
    if (!project) {
      throw new Error(`Factory project '${dto.projectId}' was not found.`);
    }

    if (!dto.files.length) {
      throw new Error("At least one blueprint file is required.");
    }

    const duplicatePaths = dto.files
      .map((file) => file.path.replace(/\\/g, "/").toLowerCase())
      .filter((path, index, values) => values.indexOf(path) !== index);

    if (duplicatePaths.length) {
      throw new Error(`Duplicate blueprint paths: ${[...new Set(duplicatePaths)].join(", ")}`);
    }

    return {
      id: createFactoryId("factory-blueprint"),
      projectId: dto.projectId,
      name: dto.name.trim(),
      objective: dto.objective.trim(),
      language: dto.language.trim().toLowerCase(),
      framework: dto.framework?.trim().toLowerCase(),
      files: dto.files.map((file) => ({
        path: file.path.replace(/\\/g, "/").replace(/^\/+/, ""),
        type: file.type,
        templateId: file.templateId,
        content: file.content,
        variables: file.variables ?? {},
        metadata: file.metadata ?? {},
      })),
      metadata: dto.metadata ?? {},
      createdAt: new Date().toISOString(),
    };
  }
}
