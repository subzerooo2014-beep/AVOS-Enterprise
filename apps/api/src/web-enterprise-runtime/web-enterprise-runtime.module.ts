import { Module } from "@nestjs/common";
import { WebEnterpriseRuntimeController } from "./web-enterprise-runtime.controller";
import { WebEnterpriseRuntimeService } from "./web-enterprise-runtime.service";

@Module({
  controllers: [WebEnterpriseRuntimeController],
  providers: [WebEnterpriseRuntimeService],
  exports: [WebEnterpriseRuntimeService],
})
export class WebEnterpriseRuntimeModule {}
