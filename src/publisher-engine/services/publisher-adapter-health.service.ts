import { Injectable } from "@nestjs/common";
import { PublisherAdapterMetricsService } from "./publisher-adapter-metrics.service";

@Injectable()
export class PublisherAdapterHealthService {

  constructor(
    private readonly metrics:PublisherAdapterMetricsService,
  ){}

  health(){
    return {
      adapters:this.metrics.report(),
      generatedAt:new Date(),
    };
  }
}
