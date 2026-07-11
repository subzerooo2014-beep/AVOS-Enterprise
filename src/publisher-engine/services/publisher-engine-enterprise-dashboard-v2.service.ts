import { Injectable } from "@nestjs/common";
import { PublisherEngineRuntimeDashboardV2Service } from "./publisher-engine-runtime-dashboard-v2.service";
import { PublisherEngineVersionManagerService } from "./publisher-engine-version-manager.service";

@Injectable()
export class PublisherEngineEnterpriseDashboardV2Service{

  constructor(
    private readonly dashboard:PublisherEngineRuntimeDashboardV2Service,
    private readonly version:PublisherEngineVersionManagerService,
  ){}

  dashboard(){

    return{

      dashboard:this.dashboard.dashboard(),
      version:this.version.current(),
      generatedAt:new Date(),

    };

  }

}
