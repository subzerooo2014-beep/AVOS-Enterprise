import { Module } from "@nestjs/common";
import { UniversalIndustryCoreModule } from "../universal-industry-core/universal-industry-core.module";
import { IndustryFactoryController } from "./industry-factory.controller";
import { IndustryFactoryService } from "./industry-factory.service";

@Module({
  imports: [UniversalIndustryCoreModule],
  controllers: [IndustryFactoryController],
  providers: [IndustryFactoryService],
  exports: [IndustryFactoryService],
})
export class IndustryFactoryModule {}