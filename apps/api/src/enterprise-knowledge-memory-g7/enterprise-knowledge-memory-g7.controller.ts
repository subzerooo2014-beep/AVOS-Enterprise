import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseKnowledgeMemoryG7Service } from "./enterprise-knowledge-memory-g7.service";
import { EnterpriseKnowledgeMemoryG7Capability } from "./enterprise-knowledge-memory-g7.types";

@Controller("enterprise-knowledge-memory-g7")
export class EnterpriseKnowledgeMemoryG7Controller {
  constructor(private readonly service: EnterpriseKnowledgeMemoryG7Service) {}

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get("records")
  list() {
    return this.service.list();
  }

  @Post("execute/:capability")
  execute(
    @Param("capability") capability: EnterpriseKnowledgeMemoryG7Capability,
    @Body() metadata: Record<string, unknown>,
  ) {
    return this.service.execute(capability, metadata);
  }
}