import { Injectable } from "@nestjs/common";
import { PublisherEngineEnterpriseDashboardV2Service } from "./publisher-engine-enterprise-dashboard-v2.service";

@Injectable()
export class PublisherEngineProductionFinalService{

  constructor(
    private readonly dashboard:PublisherEngineEnterpriseDashboardV2Service,
  ){}

  production(){

    return{

      success:true,
      publisher:this.dashboard.dashboard(),
      generatedAt:new Date(),

    };

  }

}
