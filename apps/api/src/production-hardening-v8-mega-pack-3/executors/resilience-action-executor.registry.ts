import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ResilienceActionType } from "../contracts/runtime-resilience.enums";
import { SafeResilienceActionExecutor } from "./safe-resilience-action.executor";
import { ResilienceActionExecutor } from "./resilience-action-executor.contract";

@Injectable()
export class ResilienceActionExecutorRegistry {
  private readonly executors: ResilienceActionExecutor[];

  constructor(
    safeExecutor: SafeResilienceActionExecutor,
  ) {
    this.executors = [safeExecutor];
  }

  resolve(type: ResilienceActionType): ResilienceActionExecutor {
    const executor = this.executors.find((candidate) =>
      candidate.supports(type),
    );

    if (!executor) {
      throw new NotFoundException(
        `No resilience action executor supports ${type}`,
      );
    }

    return executor;
  }
}
