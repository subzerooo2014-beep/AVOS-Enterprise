import { Module } from "@nestjs/common";
import { AutomotiveIndustryController } from "./automotive-industry.controller";
import { AutomotiveIndustryService } from "./automotive-industry.service";

@Module({
  controllers: [AutomotiveIndustryController],
  providers: [AutomotiveIndustryService],
  exports: [AutomotiveIndustryService],
})
export class AutomotiveIndustryModule {}