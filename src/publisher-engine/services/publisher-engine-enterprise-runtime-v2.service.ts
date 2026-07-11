import { Injectable } from "@nestjs/common";
import { PublisherEngineTaskRuntimeService } from "./publisher-engine-task-runtime.service";
import { PublisherEngineProductionFinalService } from "./publisher-engine-production-final.service";

@Injectable()
export class PublisherEngineEnterpriseRuntimeV2Service{

  constructor(
    private readonly tasks:PublisherEngineTaskRuntimeService,
    private readonly production:PublisherEngineProductionFinalService,
  ){}

  runtime(){

    return{

      production:this.production.production(),
      tasks:this.tasks.runtime(),
      generatedAt:new Date(),

    };

  }

}
