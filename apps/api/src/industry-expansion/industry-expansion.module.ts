import { Module } from "@nestjs/common";
import { IndustryExpansionController } from "./industry-expansion.controller";
import { IndustryExpansionService } from "./industry-expansion.service";

@Module({
  controllers: [IndustryExpansionController],
  providers: [IndustryExpansionService],
  exports: [IndustryExpansionService],
})
export class IndustryExpansionModule {}