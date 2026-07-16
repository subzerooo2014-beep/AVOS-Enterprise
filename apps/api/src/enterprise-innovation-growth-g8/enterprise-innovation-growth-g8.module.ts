import { Module } from "@nestjs/common";
import { EnterpriseInnovationGrowthG8Controller } from "./enterprise-innovation-growth-g8.controller";
import { EnterpriseInnovationGrowthG8Service } from "./enterprise-innovation-growth-g8.service";

@Module({
  controllers: [EnterpriseInnovationGrowthG8Controller],
  providers: [EnterpriseInnovationGrowthG8Service],
  exports: [EnterpriseInnovationGrowthG8Service],
})
export class EnterpriseInnovationGrowthG8Module {}