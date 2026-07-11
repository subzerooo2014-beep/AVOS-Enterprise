import { Injectable } from "@nestjs/common";
import { PublisherEngineRuntimeManagerService } from "./publisher-engine-runtime-manager.service";
import { PublisherEnterpriseFinalService } from "./publisher-enterprise-final.service";

@Injectable()
export class PublisherEngineEnterpriseRuntimeService{

  constructor(
    private readonly runtime:PublisherEngineRuntimeManagerService,
    private readonly enterprise:PublisherEnterpriseFinalService,
  ){}

  report(){

    return{

      runtime:this.runtime.runtime(),
      enterprise:this.enterprise.final(),
      generatedAt:new Date(),

    };

  }

}
