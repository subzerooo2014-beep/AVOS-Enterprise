import { Injectable } from "@nestjs/common";
import { PublisherEngineEnterpriseRuntimeService } from "./publisher-engine-enterprise-runtime.service";
import { PublisherEngineResourceMonitorService } from "./publisher-engine-resource-monitor.service";

@Injectable()
export class PublisherEngineEnterpriseMonitorService {

  constructor(
    private readonly runtime: PublisherEngineEnterpriseRuntimeService,
    private readonly resource: PublisherEngineResourceMonitorService,
  ) {}

  monitor() {
    return {
      runtime: this.runtime.report(),
      resources: this.resource.monitor(),
      generatedAt: new Date(),
    };
  }

}
