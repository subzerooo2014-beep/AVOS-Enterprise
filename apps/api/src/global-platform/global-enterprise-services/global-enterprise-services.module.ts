import { Module } from "@nestjs/common";
import { GlobalEnterpriseServicesController } from "./global-enterprise-services.controller";
import { GlobalEnterpriseServicesService } from "./global-enterprise-services.service";

@Module({
  controllers: [GlobalEnterpriseServicesController],
  providers: [GlobalEnterpriseServicesService],
  exports: [GlobalEnterpriseServicesService],
})
export class GlobalEnterpriseServicesModule {}