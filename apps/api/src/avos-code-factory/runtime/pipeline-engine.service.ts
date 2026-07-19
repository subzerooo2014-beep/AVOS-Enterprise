import { Injectable } from "@nestjs/common";
import {
  FACTORY_DEFAULT_RETRY_LIMIT,
  FACTORY_DEFAULT_STAGE_TIMEOUT_MS,
} from "../constants/factory.constants";
import {
  FactoryExecutionPlan,
  FactoryExecutionStage,
} from "../contracts/factory.contracts";
import { CreateExecutionDto } from "../dto/create-execution.dto";
import { createFactoryId } from "../utils/factory-id.util";

@Injectable()
export class PipelineEngineService {
  createPlan(dto: CreateExecutionDto): FactoryExecutionPlan {
    const stages: FactoryExecutionStage[] = dto.stages.map((stage, index) => ({
      id: stage.id,
      name: stage.name,
      order: index + 1,
      handler: stage.handler,
      timeoutMs: FACTORY_DEFAULT_STAGE_TIMEOUT_MS,
      retryLimit: FACTORY_DEFAULT_RETRY_LIMIT,
      enabled: true,
    }));

    this.validateStages(stages);

    return {
      id: createFactoryId("factory-plan"),
      name: dto.name?.trim() || "Generated Factory Plan",
      objective: dto.objective.trim(),
      stages,
      metadata: dto.metadata ?? {},
      createdAt: new Date().toISOString(),
    };
  }

  private validateStages(stages: FactoryExecutionStage[]): void {
    if (stages.length === 0) {
      throw new Error("A factory execution plan must contain at least one stage.");
    }

    const ids = stages.map((stage) => stage.id);
    if (new Set(ids).size !== ids.length) {
      throw new Error("Factory execution stage IDs must be unique.");
    }
  }
}
