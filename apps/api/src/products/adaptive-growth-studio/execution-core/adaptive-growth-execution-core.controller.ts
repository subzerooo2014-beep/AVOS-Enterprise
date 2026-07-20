import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { AgsCreateActionInput } from "./adaptive-growth-execution.contracts";
import { AdaptiveGrowthExecutionCoreService } from "./adaptive-growth-execution-core.service";

@Controller(
  "avos/products/adaptive-growth-studio/execution",
)
export class AdaptiveGrowthExecutionCoreController {
  constructor(
    private readonly core:
      AdaptiveGrowthExecutionCoreService,
  ) {}

  @Get("status")
  status() {
    return this.core.status();
  }

  @Get("registry")
  registry() {
    return this.core.listDefinitions();
  }

  @Post("actions/create")
  createAction(
    @Body() input: AgsCreateActionInput,
  ) {
    return this.core.createAction(input);
  }

  @Post("actions/validate")
  validateAction(
    @Body() input: AgsCreateActionInput,
  ) {
    return this.core.validateAction(input);
  }

  @Get("actions")
  actions() {
    return this.core.listActions();
  }

  @Get("actions/:id")
  action(@Param("id") id: string) {
    return this.core.getAction(id);
  }

  @Post("executions/start")
  start(
    @Body()
    input: {
      actionId: string;
      actor?: string;
    },
  ) {
    return this.core.start(
      input.actionId,
      input.actor,
    );
  }

  @Post("executions/cancel")
  cancel(
    @Body()
    input: {
      actionId: string;
      actor?: string;
      reason?: string;
    },
  ) {
    return this.core.cancel(
      input.actionId,
      input.actor,
      input.reason,
    );
  }

  @Post("executions/retry")
  retry(
    @Body()
    input: {
      actionId: string;
      actor?: string;
    },
  ) {
    return this.core.retry(
      input.actionId,
      input.actor,
    );
  }

  @Post("executions/rollback")
  rollback(
    @Body()
    input: {
      actionId: string;
      actor?: string;
      reason?: string;
    },
  ) {
    return this.core.rollbackAction(
      input.actionId,
      input.actor,
      input.reason,
    );
  }

  @Get("executions")
  executions() {
    return this.core.listExecutions();
  }

  @Get("executions/:id")
  execution(@Param("id") id: string) {
    return this.core.getExecution(id);
  }

  @Get("history")
  history(
    @Query("actionId") actionId?: string,
  ) {
    return this.core.listHistory(actionId);
  }
}