import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherProductionBannerService{

  banner(){
    return{
      product:"AVOS",
      module:"Publisher Engine",
      edition:"Enterprise",
      version:"2.0.0",
      generatedAt:new Date(),
    };
  }

}
