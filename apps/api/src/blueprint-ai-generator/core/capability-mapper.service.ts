import { Injectable } from "@nestjs/common";

@Injectable()
export class CapabilityMapperService{
  map(input?:any){
    return {
      success:true,
      service:"CapabilityMapperService",
      timestamp:new Date().toISOString(),
      input
    };
  }
}
