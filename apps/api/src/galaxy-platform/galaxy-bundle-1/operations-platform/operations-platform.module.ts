import { Module } from "@nestjs/common";
import { OperationsPlatformController } from "./operations-platform.controller";
import { OperationsPlatformService } from "./operations-platform.service";

@Module({
  controllers: [OperationsPlatformController],
  providers: [OperationsPlatformService],
  exports: [OperationsPlatformService],
})
export class OperationsPlatformModule {}