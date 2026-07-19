import { Injectable } from "@nestjs/common";

@Injectable()
export class DigitalDNAGeneratorService{
  generate(input?:any){
    return {
      success:true,
      service:"DigitalDNAGeneratorService",
      generatedAt:new Date().toISOString(),
      input
    };
  }
}
