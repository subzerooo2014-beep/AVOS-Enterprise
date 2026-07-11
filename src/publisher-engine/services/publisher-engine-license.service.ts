import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineLicenseService {

  info(){
    return{
      product:"AVOS Enterprise",
      module:"Publisher Engine",
      license:"Commercial",
      generatedAt:new Date(),
    };
  }

}
