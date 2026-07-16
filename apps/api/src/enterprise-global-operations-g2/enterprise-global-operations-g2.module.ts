import { Module } from "@nestjs/common";
import { EnterpriseGlobalOperationsG2Controller } from "./enterprise-global-operations-g2.controller";
import { EnterpriseGlobalOperationsG2Service } from "./enterprise-global-operations-g2.service";

@Module({
  controllers: [EnterpriseGlobalOperationsG2Controller],
  providers: [EnterpriseGlobalOperationsG2Service],
  exports: [EnterpriseGlobalOperationsG2Service],
})
export class EnterpriseGlobalOperationsG2Module {}