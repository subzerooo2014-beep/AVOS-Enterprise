import { Injectable } from "@nestjs/common";

@Injectable()
export class KernelRegistrationService{
  register(payload?:any){
    return {
      success:true,
      component:"KernelRegistrationService",
      executedAt:new Date().toISOString(),
      payload
    };
  }
}
