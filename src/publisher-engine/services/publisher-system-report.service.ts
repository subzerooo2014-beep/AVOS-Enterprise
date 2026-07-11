import { Injectable } from "@nestjs/common";
import { PublisherRuntimeSummaryService } from "./publisher-runtime-summary.service";
import { PublisherEngineManifestService } from "./publisher-engine-manifest.service";

@Injectable()
export class PublisherSystemReportService{

  constructor(
    private readonly runtime:PublisherRuntimeSummaryService,
    private readonly manifest:PublisherEngineManifestService,
  ){}

  report(){
    return{
      runtime:this.runtime.summary(),
      manifest:this.manifest.manifest(),
      generatedAt:new Date(),
    };
  }

}
