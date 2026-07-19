import { Injectable } from "@nestjs/common";

@Injectable()
export class CapabilityPublisherService{
  publish(payload?:any){
    return {
      success:true,
      component:"CapabilityPublisherService",
      executedAt:new Date().toISOString(),
      payload
    };
  }
}
