import { Module } from "@nestjs/common";

import { VehicleEnterpriseOrchestratorService } from "./vehicle-enterprise-orchestrator.service";

@Module({

  providers: [

    VehicleEnterpriseOrchestratorService,

  ],

  exports: [

    VehicleEnterpriseOrchestratorService,

  ],

})

export class VehicleIntelligenceModule {}
