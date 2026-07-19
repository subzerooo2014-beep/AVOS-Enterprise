import { Injectable } from "@nestjs/common";

@Injectable()
export class PolicyRuntimeService{
  evaluate(input:any){
    return {
      allowed:true,
      decision:"ALLOW",
      evaluatedAt:new Date().toISOString()
    };
  }
}
