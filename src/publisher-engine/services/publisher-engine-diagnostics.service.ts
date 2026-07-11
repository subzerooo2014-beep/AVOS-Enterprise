import { Injectable } from "@nestjs/common";
import { PublisherSystemReportService } from "./publisher-system-report.service";

@Injectable()
export class PublisherEngineDiagnosticsService{

  constructor(
    private readonly report:PublisherSystemReportService,
  ){}

  diagnostics(){
    return{
      success:true,
      report:this.report.report(),
      generatedAt:new Date(),
    };
  }

}
