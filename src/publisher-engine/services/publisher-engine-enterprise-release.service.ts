import { Injectable } from "@nestjs/common";
import { PublisherEngineEnterpriseFinalV2Service } from "./publisher-engine-enterprise-final-v2.service";

@Injectable()
export class PublisherEngineEnterpriseReleaseService{

  constructor(
    private readonly report:PublisherEngineEnterpriseFinalV2Service,
  ){}

  release(){

    return{

      version:"2.0.0",
      state:"RELEASE",
      report:this.report.report(),
      releasedAt:new Date(),

    };

  }

}
