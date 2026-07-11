import { Module } from "@nestjs/common";
import { ExportAdvisorController } from "./export-advisor.controller";
import { ExportAdvisorService } from "./export-advisor.service";

@Module({
  controllers: [ExportAdvisorController],
  providers: [ExportAdvisorService],
  exports: [ExportAdvisorService],
})
export class ExportAdvisorModule {}
