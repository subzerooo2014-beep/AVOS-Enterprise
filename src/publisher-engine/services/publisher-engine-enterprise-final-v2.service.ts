import { Injectable } from "@nestjs/common";
import { PublisherEngineEnterpriseRuntimeV2Service } from "./publisher-engine-enterprise-runtime-v2.service";

@Injectable()
export class PublisherEngineEnterpriseFinalV2Service{

  constructor(
    private readonly runtime:PublisherEngineEnterpriseRuntimeV2Service,
  ){}

  report(){

    return{

      success:true,
      runtime:this.runtime.runtime(),
      completedAt:new Date(),

    };

  }

}
