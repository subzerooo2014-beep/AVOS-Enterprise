import { Injectable } from "@nestjs/common";
import { PublisherEngineDiagnosticsService } from "./publisher-engine-diagnostics.service";

@Injectable()
export class PublisherEnterpriseReportService{

  constructor(
    private readonly diagnostics:PublisherEngineDiagnosticsService,
  ){}

  report(){
    return{
      edition:"Enterprise",
      diagnostics:this.diagnostics.diagnostics(),
      generatedAt:new Date(),
    };
  }

}
