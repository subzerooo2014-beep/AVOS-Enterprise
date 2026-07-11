import { Injectable } from "@nestjs/common";
import { PublisherEngineEnterpriseMonitorService } from "./publisher-engine-enterprise-monitor.service";
import { PublisherEngineEventMonitorService } from "./publisher-engine-event-monitor.service";

@Injectable()
export class PublisherEngineRuntimeDashboardV2Service{

  constructor(
    private readonly monitor:PublisherEngineEnterpriseMonitorService,
    private readonly events:PublisherEngineEventMonitorService,
  ){}

  dashboard(){

    return{

      enterprise:this.monitor.monitor(),
      events:this.events.monitor(),
      generatedAt:new Date(),

    };

  }

}
