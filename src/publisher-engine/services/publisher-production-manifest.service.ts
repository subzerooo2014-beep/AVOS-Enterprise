import { Injectable } from "@nestjs/common";
import { PublisherProductionBannerService } from "./publisher-production-banner.service";

@Injectable()
export class PublisherProductionManifestService{

  constructor(
    private readonly banner:PublisherProductionBannerService,
  ){}

  manifest(){
    return{
      banner:this.banner.banner(),
      state:"READY",
      generatedAt:new Date(),
    };
  }

}
