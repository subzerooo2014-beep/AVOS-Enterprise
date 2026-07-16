import { Module } from "@nestjs/common";
import { EnterpriseAutonomousExecutiveG10Controller } from "./enterprise-autonomous-executive-g10.controller";
import { EnterpriseAutonomousExecutiveG10Service } from "./enterprise-autonomous-executive-g10.service";

@Module({
  controllers: [EnterpriseAutonomousExecutiveG10Controller],
  providers: [EnterpriseAutonomousExecutiveG10Service],
  exports: [EnterpriseAutonomousExecutiveG10Service],
})
export class EnterpriseAutonomousExecutiveG10Module {}