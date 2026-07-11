import { Injectable } from "@nestjs/common";
import { PublisherEnterpriseReportService } from "./publisher-enterprise-report.service";
import { PublisherProductionManifestService } from "./publisher-production-manifest.service";

@Injectable()
export class PublisherEnterpriseFinalService {

  constructor(
    private readonly report:PublisherEnterpriseReportService,
    private readonly manifest:PublisherProductionManifestService,
  ){}

  final(){
    return{
      report:this.report.report(),
      manifest:this.manifest.manifest(),
      completedAt:new Date(),
    };
  }

}
