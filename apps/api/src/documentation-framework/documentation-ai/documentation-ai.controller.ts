import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import {
  ApproveDocumentationDto,
  GenerateDocumentationDto,
} from "./documentation-ai.dto";
import { DocumentationAiOrchestratorService } from "./documentation-ai-orchestrator.service";

@Controller("avos/documentation-framework/documentation-ai")
export class DocumentationAiController {
  constructor(
    private readonly orchestrator: DocumentationAiOrchestratorService,
  ) {}

  @Get("status")
  getStatus() {
    return this.orchestrator.getStatus();
  }

  @Get("jobs")
  listJobs() {
    return this.orchestrator.listJobs();
  }

  @Get("jobs/:id")
  getJob(@Param("id") id: string) {
    return this.orchestrator.getJob(id);
  }

  @Post("generate")
  generate(@Body() input: GenerateDocumentationDto) {
    return this.orchestrator.generate(input);
  }

  @Post("jobs/:id/approve")
  approve(
    @Param("id") id: string,
    @Body() input: ApproveDocumentationDto,
  ) {
    return this.orchestrator.approve(id, input);
  }

  @Delete("jobs/:id")
  remove(@Param("id") id: string) {
    return this.orchestrator.remove(id);
  }
}