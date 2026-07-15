import { Module } from "@nestjs/common";
import { ApplicationsSuiteController } from "./applications-suite.controller";
import { ApplicationsSuiteService } from "./applications-suite.service";

@Module({
  controllers: [ApplicationsSuiteController],
  providers: [ApplicationsSuiteService],
  exports: [ApplicationsSuiteService],
})
export class ApplicationsSuiteModule {}