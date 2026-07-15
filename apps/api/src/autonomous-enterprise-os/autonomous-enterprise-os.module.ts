import { Module } from "@nestjs/common";
import { AutonomousEnterpriseOsController } from "./autonomous-enterprise-os.controller";
import { AutonomousEnterpriseOsService } from "./autonomous-enterprise-os.service";

@Module({
  controllers: [AutonomousEnterpriseOsController],
  providers: [AutonomousEnterpriseOsService],
  exports: [AutonomousEnterpriseOsService],
})
export class AutonomousEnterpriseOsModule {}