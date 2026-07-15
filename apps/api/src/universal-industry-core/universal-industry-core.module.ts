import { Module } from "@nestjs/common";
import { UniversalIndustryCoreController } from "./universal-industry-core.controller";
import { UniversalIndustryCoreService } from "./universal-industry-core.service";

@Module({
  controllers: [UniversalIndustryCoreController],
  providers: [UniversalIndustryCoreService],
  exports: [UniversalIndustryCoreService],
})
export class UniversalIndustryCoreModule {}