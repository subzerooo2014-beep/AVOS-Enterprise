import { Injectable } from "@nestjs/common";

@Injectable()
export class DomainClassifierService{
  classify(input?:any){
    return {
      success:true,
      service:"DomainClassifierService",
      timestamp:new Date().toISOString(),
      input
    };
  }
}
