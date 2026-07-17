import { Module } from "@nestjs/common";
import { KnowledgeComplianceController } from "./compliance.controller";
import { KnowledgeControlComplianceService } from "./compliance.service";

@Module({ controllers: [KnowledgeComplianceController], providers: [KnowledgeControlComplianceService], exports: [KnowledgeControlComplianceService] })
export class KnowledgeComplianceModule {}