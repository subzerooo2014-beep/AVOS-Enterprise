import { Injectable } from "@nestjs/common";
import {
  FactoryBlueprintIR,
  FactoryFilePlan,
} from "../contracts/generation.contracts";
import { createFactoryId } from "../utils/factory-id.util";

@Injectable()
export class FactoryFilePlannerService {
  createPlan(blueprint: FactoryBlueprintIR): FactoryFilePlan {
    return {
      id: createFactoryId("factory-file-plan"),
      blueprintId: blueprint.id,
      projectId: blueprint.projectId,
      items: blueprint.files.map((file, index) => ({
        id: createFactoryId("factory-plan-item"),
        projectId: blueprint.projectId,
        relativePath: file.path,
        artifactType: file.type,
        templateId: file.templateId,
        inlineContent: file.content,
        variables: file.variables ?? {},
        metadata: {
          ...(file.metadata ?? {}),
          blueprintId: blueprint.id,
          language: blueprint.language,
          framework: blueprint.framework,
        },
        order: index + 1,
      })),
      createdAt: new Date().toISOString(),
    };
  }
}
