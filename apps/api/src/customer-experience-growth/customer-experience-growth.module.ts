import { Module } from "@nestjs/common";
import { CustomerExperienceGrowthController } from "./customer-experience-growth.controller";
import { CustomerExperienceGrowthService } from "./customer-experience-growth.service";

@Module({
  controllers: [CustomerExperienceGrowthController],
  providers: [CustomerExperienceGrowthService],
  exports: [CustomerExperienceGrowthService],
})
export class CustomerExperienceGrowthModule {}