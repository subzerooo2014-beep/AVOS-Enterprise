import { Module } from "@nestjs/common";
import { AutonomousEnterpriseExecutionController } from "./autonomous-enterprise-execution.controller";
import { AutonomousEnterpriseExecutionService } from "./autonomous-enterprise-execution.service";

@Module({
  controllers: [AutonomousEnterpriseExecutionController],
  providers: [AutonomousEnterpriseExecutionService],
  exports: [AutonomousEnterpriseExecutionService],
})
export class AutonomousEnterpriseExecutionModule {}