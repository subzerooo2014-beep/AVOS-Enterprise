import { Injectable } from "@nestjs/common";

@Injectable()
export class GovernanceValidatorService{
  validate(input:any){
    return {
      valid:true,
      violations:[],
      evaluatedAt:new Date().toISOString()
    };
  }
}
