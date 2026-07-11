import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { CreateWorkflowDefinitionDto } from "./dto/create-workflow-definition.dto";
import { StartWorkflowDto } from "./dto/start-workflow.dto";
import { WorkflowExecutionService } from "./workflow-execution.service";

@Controller(
  "production-hardening-v7/mega-pack-6/workflows",
)
export class WorkflowExecutionController {
  constructor(
    private readonly workflows:
      WorkflowExecutionService,
  ) {}

  @Post("definitions")
  createDefinition(
    @Body()
    dto: CreateWorkflowDefinitionDto,
  ) {
    return this.workflows
      .createDefinition(dto);
  }

  @Get("definitions")
  listDefinitions() {
    return this.workflows
      .listDefinitions();
  }

  @Get("definitions/:id")
  getDefinition(
    @Param("id")
    id: string,
  ) {
    return this.workflows
      .getDefinition(id);
  }

  @Post("definitions/:id/start")
  start(
    @Param("id")
    id: string,
    @Body()
    dto: StartWorkflowDto,
  ) {
    return this.workflows.start(
      id,
      dto,
    );
  }

  @Post("executions/:id/run")
  execute(
    @Param("id")
    id: string,
  ) {
    return this.workflows.execute(id);
  }

  @Get("executions")
  listExecutions() {
    return this.workflows
      .listExecutions();
  }

  @Get("executions/:id")
  getExecution(
    @Param("id")
    id: string,
  ) {
    return this.workflows
      .getExecution(id);
  }
}
