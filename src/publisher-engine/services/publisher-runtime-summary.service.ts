import { Injectable } from "@nestjs/common";
import { PublisherEngineRuntimeInfoService } from "./publisher-engine-runtime-info.service";
import { PublisherHealthReportService } from "./publisher-health-report.service";

@Injectable()
export class PublisherRuntimeSummaryService{

  constructor(
    private readonly runtime:PublisherEngineRuntimeInfoService,
    private readonly health:PublisherHealthReportService,
  ){}

  summary(){
    return{
      runtime:this.runtime.info(),
      health:this.health.report(),
      generatedAt:new Date(),
    };
  }

}
