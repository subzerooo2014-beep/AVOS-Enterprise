import { Injectable } from "@nestjs/common";

@Injectable()
export class LeadConversionService {

  convert(
    leadId:string,
    customerId:string
  ){

    return {

      leadId,

      customerId,

      status:"CONVERTED",

      convertedAt:new Date(),

    };

  }

}
