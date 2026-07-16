import { Module } from "@nestjs/common";
import { EnterpriseKnowledgeMemoryG7Controller } from "./enterprise-knowledge-memory-g7.controller";
import { EnterpriseKnowledgeMemoryG7Service } from "./enterprise-knowledge-memory-g7.service";

@Module({
  controllers: [EnterpriseKnowledgeMemoryG7Controller],
  providers: [EnterpriseKnowledgeMemoryG7Service],
  exports: [EnterpriseKnowledgeMemoryG7Service],
})
export class EnterpriseKnowledgeMemoryG7Module {}