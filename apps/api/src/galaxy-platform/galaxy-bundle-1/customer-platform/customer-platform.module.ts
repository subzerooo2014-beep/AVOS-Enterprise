import { Module } from "@nestjs/common";
import { CustomerPlatformController } from "./customer-platform.controller";
import { CustomerPlatformService } from "./customer-platform.service";

@Module({
  controllers: [CustomerPlatformController],
  providers: [CustomerPlatformService],
  exports: [CustomerPlatformService],
})
export class CustomerPlatformModule {}