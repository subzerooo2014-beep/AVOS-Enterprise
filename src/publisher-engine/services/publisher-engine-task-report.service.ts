import { Injectable } from "@nestjs/common";
import { PublisherEngineTaskMonitorService } from "./publisher-engine-task-monitor.service";

@Injectable()
export class PublisherEngineTaskReportService{

  constructor(
    private readonly monitor:PublisherEngineTaskMonitorService,
  ){}

  report(){

    return{

      success:true,
      queue:this.monitor.monitor(),
      generatedAt:new Date(),

    };

  }

}
