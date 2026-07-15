import { Module } from "@nestjs/common";
import { IndustryGovernancePartnersController } from "./industry-governance-partners.controller";
import { IndustryGovernancePartnersService } from "./industry-governance-partners.service";

@Module({
  controllers: [IndustryGovernancePartnersController],
  providers: [IndustryGovernancePartnersService],
  exports: [IndustryGovernancePartnersService],
})
export class IndustryGovernancePartnersModule {}