import { Module } from "@nestjs/common";
import { BusinessExpansionController } from "./business-expansion.controller";
import { BusinessExpansionService } from "./business-expansion.service";

@Module({
  controllers: [BusinessExpansionController],
  providers: [BusinessExpansionService],
  exports: [BusinessExpansionService],
})
export class BusinessExpansionModule {}